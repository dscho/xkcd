#!/usr/bin/env node

/*
 * The idea is to feed this script on `stdin` an XML dump obtained from
 * https://www.explainxkcd.com/wiki/index.php/Special:Export, using "All_comics"
 * as category, clicking "Add", then "Export".
 */

(async () => {
  const entities = {
    'nbsp': ' ',
    'amp' : '&',
    'quot': '"',
    'lt'  : '<',
    'gt'  : '>',
    'eacute' : 'é',
    'acirc'  : 'å',
    'euro'   : '€',
    'oelig'  : 'œ',
    'rdquo'  : '”',
    'trade'  : '™',
  };
  const entitiesRegexp = new RegExp(`&(${Object.keys(entities).join('|')});`, 'g')
  const decodeEntities = encoded =>
      encoded.replace(entitiesRegexp, (_, entity) => entities[entity])
        .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))

  const leftPad = (num, pad) => pad ? new String(num).padStart(2, '0') : num
  const dateStringToKey = (date, pad) => {
    const d = new Date(date)
    if (`${d.getFullYear()}` == 'NaN') throw new Error(`NaN for date ${date}, ${d}`)
    return `${d.getFullYear()}-${leftPad(1 + d.getMonth(), pad)}-${leftPad(d.getDate(), pad)}`
  }

  const fs = require('fs')
  const readline = require('readline')

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })

  const characters = {}

  let page = {}
  const chunks = []
  let text = false

  for await (const line of rl) {
    // Handle <text>: Its content is multi-line
    if (text) {
      const match = line.match(/^(.*)<\/text> *$/)
      if (!match) chunks.push(line)
      else {
        chunks.push(match[1])
        page.text =
          chunks
            .join('\n')
            .replace(/[]/g, '')
        chunks.splice(0)
        text = false
      }
      continue
    } else {
      const match = line.match(/^ *<text[^>]*>(.*)$/)
      if (match) {
        const match2 = match[1].match(/(.*)<\/text>/)
        if (match2) chunks.push(match2[1])
        else {
          chunks.push(match[1])
          text = true
        }
        continue
      }
    }

    // Handle all other tags
    const match = line.match(/^ *<(\/?)([^ >]+)([^>]*)> *((.*)<\/[^>]*>)? *$/)
    if (!match) continue
    const [, end, tag, attrs, c2, content] = match

    if (tag === 'page') {
      if (!end) page = {}
      // This is a duplicate of '590: Papyrus' and actually only contains `{{:590: Papyrus}}`
      else if (page.title === '590: Papyrus/Font') ; // do nothing
      else {

        page.infobox =
          (page.text.match(/(?:^|\n){{ *comic *\n([^]*?)(\n *)?}}/i)?.[1] || '')
            .split('\n').reduce((o, v) => {
              const match = v.match(/^ *\| *(\S+) *= *(.*)/)
              if (match) o[match[1]] = match[2].trim()
              return o
            }, {})

        // Fix unparseable dates
        page.infobox.date =
          (page.infobox.date || '')
            .replace(/(\d+)(st|nd|rd|th), */, '$1 ')
            .replace(/.*DO NOT ADD (2006-01-01).*/, '$1')
            .replace(/ *&lt;.*/, '')

        // Strip number prefix from title
        page.title = page.title.replace(new RegExp(`^${page.infobox.number}:? *`), '')

        // Add missing image
        if (!page.infobox.image) page.infobox.image = {
          '1331': 'frequency/heartbeat.gif',
          '2250': 'ok_okay_ok_2x.png',
        }[page.infobox.number]

        page.transcript =
          decodeEntities(
            (page.text.match(/== *Transcript *==\n+([^]*?)\n(?:==|{{ *comic +discussion)/i)?.[1] || '')
              .split('\n')
              .filter(line => line !== '')
              .map(line => line.replace(/^:+/, '').replace(/ +$/, ''))
              .join('\n\n')
              .replace(/[*_]/g, '\\$&')
              .replace(/https?:\/\/[^ ]*\\_[^ ]*/g, e => e.replace(/\\_/g, '_'))
              .replace(/'''/g, '**')
              .replace(/''/g, '*')
              .replace(/&lt;\/?nowiki&gt;/g, '')
              .replace(/http:\/\//g, 'https://')
              .replace(/\[(https:\/\/[^ ]+) ([^\]]+)\]/g, '[$2]($1)')
          )

        // See https://www.explainxkcd.com/wiki/index.php/36:_Scientists#Discussion
        if (page.infobox.date === '' && page.infobox.number === '36') page.infobox.date = 'April 28, 2006'

        page.filePath = [
          `content/comics/`,
          dateStringToKey(page.infobox.date, false),
          `-`,
          page.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/--+/g, '-'),
          `.md`,
        ].join('')
        page.fileContent = [
          `---`,
          `date: ${dateStringToKey(page.infobox.date, true)}`,
          `title: "${page.title.replace(/[\\"]/g, '\\$&')}"`,
          `num: ${page.infobox.number}`,
          `alt: >-`,
          `${decodeEntities(page.infobox.titletext || '')
            .replace(/<br>.*/, '')
            .split('\n')
            .map(line => `  ${line}`) // indent
            .join('\n')}`,
          page.infobox.number === '404'
          ? ''
          : `img: https://imgs.xkcd.com/comics/${page.infobox.image.replace(/ /g, '_')}`,
          `---`,
          `${page.transcript}`
        ].join('\n')

        fs.writeFileSync(page.filePath, page.fileContent)

	for (const character of page.text
	    .replace(/[‏‎]/g, '')
	    .split(/\[\[Category:Comics featuring +((?!Ado)[^\];'!]+?) *\]\]/gi)
	    .filter((_, i) => (i % 2) === 1)) {
	  const key = character.toLowerCase().replace(/ /g, '_')
          if (!characters[key]) characters[key] = {
	    character,
	    comics: []
	  }
	  characters[key].comics.push(Number.parseInt(page.infobox.number))
	}
      }
    } else if (!end && tag === 'title') page.title = content
  }

  for (const key of Object.keys(characters).sort()) {
    const value = characters[key]
    const q = value.character.match(/^[A-Za-z ]+$/) ? '' : '"'
    fs.writeFileSync(`data/characters/${key}.yml`, [
      `character: ${q}${value.character}${q}`,
      'comics:',
      ...value.comics.sort((a, b) => a - b).map(e => `  - ${e}`)
    ].join('\n'))
  }
})().catch(e => {
  process.stderr.write(`${e.stack}\n`)
  process.exit(1)
})
