import type { MusicBrainzRecordingSearch, ListenBrainzRes } from "./types";

export type Track = {
    release: {
        mbid: string,
        name: string,
    },
    artists: {
        name: string,
        join_phrase: string,
        mbid: string
    }[],
    name: string,
    mbid: string,
    matched: boolean
}

async function getNowPlaying() {
    const res = await fetch(
        "https://api.listenbrainz.org/1/user/thrizzle/playing-now",
    );
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    const nowPlaying: { payload: ListenBrainzRes } = await res.json();
    return nowPlaying.payload;
}

async function musicBrainzSearch(track: ListenBrainzRes["listens"][0]["track_metadata"]) {
        const cleaned_release_name = track.release_name
            .replace(/\s*-\s*[^-]+$/, "") // remove '- EP', '- Single', etc.
            .replace(/\s*\(feat\. [^)]+\)/i, ""); // remove '(feat. ...)'

        // musicbrainz api search for recording with the same isrc OR with the same track, release, and artist name
        const query = track.additional_info?.isrc ? `isrc:${track.additional_info.isrc} OR (recording:"${track.track_name.replace(/\s*\(feat\. [^)]+\)/i, '')}" AND artist:"${track.artist_name}" AND release:"${cleaned_release_name}")` : `recording:"${track.track_name.replace(/\s*\(feat\. [^)]+\)/i, '')}" AND artist:"${track.artist_name}" AND release:"${cleaned_release_name}"`
        const rawTrackMetadata = await fetch(
            `https://musicbrainz.org/ws/2/recording?fmt=json&query=${query}`,
        );

        const copOut = {
            name: track.track_name,
            mbid: "",
            artists: [
                {
                    name: track.artist_name,
                    mbid: "",
                    join_phrase: ""
                }
            ],
            release: {
                mbid: "",
                name: ""
            },
            matched: false
        }

        if (!rawTrackMetadata.ok) {
            console.error(
                "failed to fetch metadata lookup for now playing recording",
            );
            return copOut
        }
        const trackMetadata: MusicBrainzRecordingSearch =
            await rawTrackMetadata.json();

        const matchedRecording =
            trackMetadata.recordings.find((recording) =>
                recording.isrcs?.includes(track.additional_info.isrc),
            ) || trackMetadata.recordings[0];

        console.debug("matchedRecording: ", matchedRecording)
        const matchedRelease = matchedRecording?.releases.find((release) => release["artist-credit"]?.map(credit => credit.artist
            .id
        ).includes(matchedRecording["artist-credit"][0].artist.id) && release.media[0].format === "Digital Media") || matchedRecording?.releases[0]

        if (
            (matchedRelease?.title.toLowerCase() !== cleaned_release_name.toLowerCase() && // check for same title
                (!track.additional_info.isrc ? !matchedRecording?.isrcs?.includes(track.additional_info.isrc) : false))
        ) {
            console.error("no valid media found for the current track! :(");
            console.error("case check: ", matchedRelease?.title.toLowerCase() !== cleaned_release_name.toLowerCase())
            console.error("isrc check: ", (!track.additional_info.isrc ? !matchedRecording?.isrcs?.includes(track.additional_info.isrc) : true))
            return copOut;
        }
        return {
            release: {
                name: matchedRelease.title,
                mbid: matchedRelease.id,
            },
            artists: matchedRecording["artist-credit"].map((credit) => ({
                name: credit.name,
                mbid: credit.artist.id,
                join_phrase: credit.joinphrase || " · "
            })),
            name: matchedRecording.title,
            mbid: matchedRecording.id,
            matched: true
        }
}

async function getLastListen() {
    const res = await fetch(
        "https://api.listenbrainz.org/1/user/thrizzle/listens?count=1",
    );
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    const lastListen: { payload: ListenBrainzRes } = await res.json();
    return lastListen.payload;
}

export default async function getRecentTrack(): Promise<Track> {
    const nowPlaying = (await getNowPlaying()).listens[0];
    if (nowPlaying) {
        if (nowPlaying?.track_metadata.additional_info.recording_mbid) {
            // if the track has an mbid, meaning it was found in the database
            const data = nowPlaying.track_metadata
            const rawData = await fetch(`https://musicbrainz.org/ws/2/recording?fmt=json&query=rid:${data.additional_info.recording_mbid} AND release:(${data.release_name})`)
            const trackMetadata: MusicBrainzRecordingSearch = await rawData.json();
            const track = trackMetadata.recordings[0]
            // console.log(track.releases)
            const release = track.releases.filter((release) => {
                return release.title === data.release_name && release.media[0].format === "Digital Media"
            })[0] || track.releases.filter((release) => {
                return release.media[0].format === "Digital Media"
            })[0] || track.releases[0]
            return {
                name: track.title,
                mbid: track.id,
                release: {
                    mbid: release.id,
                    name: release.title,
                },
                artists: track["artist-credit"].map((credit, i) =>
                ({
                    name: credit.name,
                    mbid: credit.artist.id,
                    join_phrase: credit.joinphrase || " · "
                }
                )),
                matched: true
            }
        }
        return musicBrainzSearch(nowPlaying.track_metadata)
    }



    const recentTrackData = await getLastListen();
    console.log({ recentTrackData })
    const track = recentTrackData.listens[0].track_metadata;

    return musicBrainzSearch(track)
}