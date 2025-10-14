---
title: more music widget updates
slug: more-music-widget-updates
description: i HATE oAuth and the spotify api
date: 2025-09-14
tags: ["site"]
---

this will be short, not too much has changed

calore still works largely the same, i just added support for [cover art archive](https://coverartarchive.org) and [iTunes](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html#//apple_ref/doc/uid/TP40017632-CH3-SW1) images (this is important!)

so pretty much right at the time of the last post (in like july) i was polling the spotify api and returning the track over websockets

however, it was way more convenient to use listenbrainz (lowk, i dont actually remember why i was so determined to switch back to listenbrainz...) so i js ended up:
- writing a rust service ([spot2lb](https://github.com/thrzl/spot2lb)) to send scrobble from spotify to listenbrainz in real time since listenbrainz scrobbling is suuuper slow. it only uses 6MB of memory (i was delighted to see this)
- writing a python service (i have not yet published it) to transform listenbrainz socket.io data and then serve it over websockets

part of the transformation that the python thingamajig does is fetching cover art and then getting the color palette. at first i was using [spotifycover.art](https://spotifycover.art) but they got sued or something(!?) and i did NOT feel like dealing with spotify creds and oauth and all that AGAIN, so i just started using musicbrainz/cover art archive stuff. issue with THAT is i mostly listen to niche artists and i myself added like all of their music to musicbrainz, so they're not very well covered on cover art archive

and then..... i found itunes search api which needs NO authentication or anything <3 i would not at all have expected apple to be more open w this stuff than spotify but here we are i guess

now i can just basically do this:

this chunk was updated to also escape stuff, because albums like #wings - ayowitty will just make it explode and die
```py
from urllib.parse import quote_plus

meta = track.track_metadata

async with ClientSession() as session:
    # fetch itunes search results
    res = await session.get(f"https://itunes.apple.com/search?term={quote_plus(meta.release_name)}+{quote_plus(meta.artist_name)}&country=US&entity=album")

    # no clue when it would be a 304 but wtv i just kept it
    if res.status in [304, 200]:
        response = decode(await res.text(), type=iTunesQueryResponse)

        # it will NOT return 404, the result_count will just be 0 and results will be empty
        if response.result_count > 0:

            # filter items by those where the titles match the one we already have.

            # i did not include artist matching because there are artists who go by diff
            # names on spotify and apple music, which is exactly what i'm bridging between
            matching_albums = [album for album in response.results if album.collection_name.replace(" - Single", "").replace(" - EP", "") == meta.release_name]

            if len(matching_albums) > 0:
                print("found match from itunes!")
                return matching_albums[0].artwork_url100.replace("100x100bb", "500x500bb")
```

and now i just have cover art like 100% of the time 🥹
