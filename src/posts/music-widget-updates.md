---
title: music widget updates
slug: music-widget-updates
description: colors galore, galore
date: 2025-07-07
tags: [""]
---

both widgets originally used svelte before i got to a point where the svelte runtime alone was making up 60% of the bundle size. i ended up ditching svelte and going with vanilla JS, which works fine since i'm just updating a few elements on the DOM for both of these.

the now playing widget in particular seems more complex than it probably should be

## how it works

the now playing widget connects to a websockets server (i haven't published it yet) that polls spotify, transforms the data, and adds the color palette. originally, it would calculate the color palette in the browser, but that required sending extra javascript to you, the user, which would slow down the site and force extra computation on you. it's just more efficient to generate the palette once on the server anyway.

after receiving a message from the websocket, it updates the widget's HTML and applies + saves the color palette to session storage.

### color palette generation

this was originally handled by the websockets server, but calculating the images required extra memory overhead which resulted in extra cost. the first attempt to fix this issue was saving the palettes to an LFU (least frequently used) cache, which, when filled, gets rid of items based on how often they're used. however, since it was only stored in memory, it was cleared whenver i updated the service.

the next (and current) approach uses cloudflare workers. i named it [calore](https://github.com/thrzl/calore), and it runs colorthief on the image and caches the value using cloudflare KV. the fact that it uses a worker makes it much cheaper to run, and the cache makes it significantly more performant. plus, the fact that the KV isn't attached to the worker means that entries persist for as long as i want them to.

<hr>

i may simplify the stack further in the future if i figure out how; i really love cloudflare's platform so i'd probably try to do something related to that

(or i could rewrite the websockets server in rust, which will cause me a lot of pain)
