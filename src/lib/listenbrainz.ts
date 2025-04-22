import type { ListenBrainzRes, MusicBrainzRecordingSearch } from "./types";

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

export default async function getRecentTrack() {
    let recentTrackData = await getNowPlaying();

    if (recentTrackData.listens.length === 0) {
        recentTrackData = await getLastListen();
    } else if (!recentTrackData.listens[0].track_metadata.mbid_mapping) {
        const track = recentTrackData.listens[0].track_metadata;

        const cleaned_release_name = track.release_name
            .replace(/\s*-\s*[^-]+$/, "") // remove '- EP', '- Single', etc.
            .replace(/\s*\(feat\. [^)]+\)/i, ""); // remove '(feat. ...)'

        // musicbrainz api search for recording with the same isrc OR with the same track, release, and artist name
        const rawTrackMetadata = await fetch(
            `https://musicbrainz.org/ws/2/recording?fmt=json&query=isrc:${track.additional_info.isrc} OR (recording:"${track.track_name.replace(/\s*\(feat\. [^)]+\)/i, '')}" AND artist:"${track.artist_name}" AND release:"${cleaned_release_name}")`,
        );

        if (!rawTrackMetadata.ok) {
            console.error(
                "failed to fetch metadata lookup for now playing recording",
            );
            return {
                track: recentTrackData.listens[0].track_metadata,
                now_playing: recentTrackData.listens[0].listened_at === undefined,
            };
        }

        const trackMetadata: MusicBrainzRecordingSearch =
            await rawTrackMetadata.json();

        // console.debug("trackMetadata: ", trackMetadata);
        console.log("test")

        // recording should be the release with a matching isrc or the first release
        const matchedRecording =
            trackMetadata.recordings.find((recording) =>
                recording.isrcs?.includes(track.additional_info.isrc),
            ) || trackMetadata.recordings[0];

        console.debug("matchedRecording: ", matchedRecording)
        const preferredRelease = matchedRecording?.releases.find((release) => !release.disambiguation) || matchedRecording.releases[0]


        if (
            matchedRecording?.releases[0]?.title.toLowerCase() !== cleaned_release_name.toLowerCase() && // check for same title
            !matchedRecording?.isrcs?.includes(track.additional_info.isrc) // check if the isrc matches
        ) {

            console.error("no valid media found for the current track! :(");
            console.error("case check: ",  matchedRecording?.releases[0]?.title.toLowerCase() !== cleaned_release_name.toLowerCase())
            console.error("isrc check: ", !matchedRecording?.isrcs?.includes(track.additional_info.isrc))
            return {
                track: recentTrackData.listens[0].track_metadata,
                now_playing: recentTrackData.listens[0].listened_at === undefined,
            };
        }

        // first release where media.format[0] is Digital Media
        const matchedRelease = matchedRecording.releases.find(
            (rel) => rel.media && rel.media.length > 0 && rel.media[0].format === "Digital Media",
        ) || matchedRecording.releases[0];

        recentTrackData.listens[0].track_metadata.mbid_mapping = {
            release_mbid: matchedRelease.id,
            recording_mbid: matchedRecording.id,
            recording_name: matchedRecording.title,
            caa_id: 0,
            caa_release_mbid: matchedRelease.id,
            artist_mbids: matchedRecording["artist-credit"].map(
                (artist) => artist.artist.id,
            ),
            artists: matchedRecording["artist-credit"].map((artist) => ({
                artist_credit_name: artist.name,
                artist_mbid: artist.artist.id,
                join_phrase: artist.joinphrase || "",
            })),
        };
    }
    return {
        track: recentTrackData.listens[0].track_metadata,
        now_playing: recentTrackData.listens[0].listened_at === undefined,
    };
}