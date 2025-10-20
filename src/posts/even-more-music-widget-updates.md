---
title: even more music widget updates
slug: even-more-music-widget-updates
description: that's lowk becoming the main thing i work on for this lol
date: 2025-10-20
tags: ["site"]
---

# more cover art

first and most major update is that i finally figured out how to get spotify cover art without authentication (bless..)

the new approach involves using spotify's oEmbed endpoint to fetch info and then manually altering the thumbnail url

## making the request

its pretty simple actually it's just `https://open.spotify.com/oembed?url=https://open.spotify.com/track/...`

for example: `https://open.spotify.com/oembed?url=https://open.spotify.com/track/3iZxwEThwjqPFTlVMCIBbo`
```json
{
    "html": "...",
    "iframe_url": "https://open.spotify.com/embed/track/3iZxwEThwjqPFTlVMCIBbo?utm_source=oembed",
    "width": 456,
    "height": 152,
    "version": "1.0",
    "provider_name": "Spotify",
    "provider_url": "https://spotify.com",
    "type": "rich",
    "title": "carve",
    "thumbnail_url": "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025e956ca7fc73779edd2c3128",
    "thumbnail_width": 300,
    "thumbnail_height": 300
}
```

see we get a "thumbnail url" now! the glaringly obvious issue though is that it's only 300x300, which isn't even what i downsize it to for display on the website (and definitely isn't what i want to be using with calore)

## processing the data

spotify api is lowk just ragebait cus look

the weird image id thingamajig just contains the code for the image resolution .. here it's 1e02: `ab67616d0000[1e02]5e956ca7fc73779edd2c3128`

so what we can do now is just change that to `b273` for 640x640, which is much better

other thing though is that calore only processes spotify images from `i.scdn.co` which is also fine cus u can literally just replace the weird domain with that and it'll just work perfectly (what are they doing bro ??). i used this regex:

```regex
image-cdn-\w{2}\.spotifycdn\.com
```

so you replace `1e02` (it's important to only replace the first instance! image ids can still contain `1e02` later on), then replace the domain with that regex (or any other means), and then you have a perfectly usable 640x640 cover art!

# color resolution changes

this is imo the bigger change

basically, colorthief (and by extension cf-colorthief, the version used in calore) just filter out white for no reason

it annoyed me cus there's certain albums where the primary color is literally just white and it dodges and then makes up bs colors (see: tether – egobreak + lucy bedroque, UNTITLED.MP3 – mp3beige)

so i found why this was happening (it literally just didn't add the color if `r`, `g`, and `b` were greater than 250 so whatever i guess bro) and changed it to not do that if you specified an optional function parameter (so it still works identically to colorthief for the most part!)

this had the bonus side effect of making it not just fabricate colors anymore, so now colors are much much more accurate for basically every album ever, which is really nice

# under the hood changes

switched from `colord` to [culori](https://culorijs.org/) for color processing cus colord is deprecated and i wanted to use oklab colors which colord does not support

also! culori is much better at tree shaking, so the unzipped exports now make up only 2.43 KB uncompressed, while colord took like 16 or something i lowk forgot

but yea oklab is pretty cool cus it represents colors based on how we actually see them, so checking for things like color brightness and saturation are a lot more accurate based on how YOU will see them

quite nice

next thing on the chopping block is probably vanilla-marquee cus its just 20 whole KB and it isnt tree-shakeable

and the worst part is that most of it is just this guy importing his OWN LIBRARY (??) of shorthand functions which is all fine and great but he also didnt make that tree shakeable either so its just all of them

ima prolly just fork it and then replace the module imports with the normal function forms or something
