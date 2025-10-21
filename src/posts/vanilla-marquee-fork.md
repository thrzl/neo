---
title: vanilla-marquee fork
slug: vanilla-marquee-fork
description: shoutout to mattiacoll for the original
date: 2025-10-21
tags: ["site","projects"]
---

this will be a short one

in the [last post](/garden/even-more-music-widget-updates) i mentioned that i might want to try and slim down the size of vanilla-marquee or replace it altogether

i did end up doing that! my version is located [here (thrzl/vanilla-marquee)](https://github.com/thrzl/vanilla-marquee) and contains two major changes:
1. move away from `matt-utils` (the creator's snippet library that is not tree-shakeable) and instead just use normal JS functions (saved me about 1-2 KB)
2. export the minified version so that vite or wtv doesnt have to worry about minifying it (it does a worse job anyway; saved me about 12 KB)

the latter was much more impactful, to say the least

these small changes allowed its bundle size to go from ~20 KB to 6 KB. made me happy even though my bundle size was only 30 KB anyway (i'm not going to stop shrinking it.)

also im probably gonna make this smarter so that the next post isn't "yet another music widget update" or something i'll probably have it link to the commit somehow
