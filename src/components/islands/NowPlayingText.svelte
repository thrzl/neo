<script lang="ts">
    import getRecentTrack from "../../lib/listenbrainz";
	import "../../lib/helpers"

	const recentTrack = getRecentTrack();

    function cleanTrackString(text: string) {
        return text
            .replace(/\s*-\s*[^-]+$/, "") // remove '- EP', '- Single', etc.
            .replace(/\s*\(feat\. [^)]+\)/i, ""); // remove '(feat. ...)'
    }
</script>

{#await recentTrack}
    <p>loading music data...</p>
{:then { track, now_playing }}
	<p class="text-lg">{now_playing ? "now playing: ": "recently played"} {cleanTrackString(track.track_name.toRespectfulLowerCase())} — {track.artist_name.toRespectfulLowerCase()}{track.artist_name.slice(-1) !== "." ? "." : ""}</p>
{/await}
