---
date: 2021-01-04
title: "Depth and Breadth"
num: 2407
alt: >-
  A death-first search is when you lose your keys and travel to the depths of hell to find them, and then if they're not there you start checking your coat pockets.
img: https://imgs.xkcd.com/comics/depth_and_breadth_2x.png
---
[Five panels, each containing identical copies of a rooted tree graph, grayed out in the background. The tree has a height of 3 and 15 nodes.]

[In all five panels, a black twisty arrow in the foreground indicates the order in which nodes are traversed. The arrow does not complete the entire traversal but cuts off at some point. Backtracking is indicated with a dotted line.]

[In the descriptions below, node 1 is the root, nodes 2 and 3 are its child nodes, nodes 4 and 5 are 2's child nodes, nodes 6 and 7 are 3's child nodes, nodes 8 and 9 are 4's child nodes, and so on up to node 15.]

[Backtracking is omitted from the descriptions below, as they increased confusion when read.]

Depth-first search

[The arrow visits nodes 1, 2, 4, 8, 9, 5, 10, 11.]

Breadth-first search

[The arrow visits nodes 1, 2, 3, 4, 5, 7{{asic}}, 6, 8.]

Brepth-first search

[The arrow visits nodes 1, 2, 4, 5, 8, 9, 3, 6, 10, 11.]

Deadth-first search

[The arrow visits nodes 1, 2, 4, 4, 2, 4, 3, 6, 12, 13, 12.]

Bread-first search

[The arrow starts at node 1, then immediately leaves the tree off to the right to point to a small loaf labeled "Bread".]