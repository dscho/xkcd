---
date: 2024-12-18
title: "Linear Sort"
num: 3026
alt: >-
  The best case is O(n), and the worst case is that someone checks why.
img: https://imgs.xkcd.com/comics/linear_sort_2x.png
---
[The panel shows five lines of code:]

function LinearSort(list):

StartTime=Time()

MergeSort(list)

Sleep(1e6\*length(list)-(Time()-StartTime))

return

[Caption below the panel:]

How to sort a list in linear time