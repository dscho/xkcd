---
date: 2016-09-02
title: "Cron Mail"
num: 1728
alt: >-
  Take THAT, piece of 1980s-era infrastructure I've inexplicably maintained on my systems for 15 years despite never really learning how it works.
img: https://imgs.xkcd.com/comics/cron_mail.png
---
[Cueball is sitting at a table in an office chair working on his laptop. Ponytail walks up to him.]

Cueball: I've been getting these "You have new mail" UNIX notifications for like 15 years, but I've never bothered to figure out what it's talking about.

[Ponytail has stopped behind Cueball who is typing on his laptop. When Ponytail (and later Cueball) mentions code, the text uses both small and capital letters (as opposed to only capital letters in all other text).]

Ponytail: Look in /var/mail?

Cueball: OK...

Cueball: Oh, wow, there's like a gigabyte of stuff from Cron in here.

[In a frame-less panel Ponytail is facepalming. Cueball is replying from off-panel with a starburst indicating his position.]

Ponytail: \*Sigh\*

Ponytail: You should fix your Cron, then point "MAILTO=" somewhere you actually see-

Cueball (off-panel): Better idea:

[Same setting as panel 2 but Cueball is visibly typing on the laptop as shown with three small curved lines over his hands on the keyboard.]

Cueball: export MAILTO=/etc/crontab

Cueball: There. Your move, Cron.

Ponytail: Wow. Hardball.

Cueball: Let's see how important it thinks that mail really is.