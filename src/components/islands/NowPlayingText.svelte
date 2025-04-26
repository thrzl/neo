<script lang="ts">
    import TimeAgo from "javascript-time-ago";
    import en from "javascript-time-ago/locale/en"
    TimeAgo.addDefaultLocale(en)
    const timeAgo = new TimeAgo("en-US")

    import getRecentTrack from "../../lib/listenbrainz";
	import "../../lib/helpers"

	const recentTrack = getRecentTrack();
    let trackTitle: HTMLDivElement;
    let trackTitleOverflowing: boolean; 

    $: if (trackTitle && trackTitle.scrollWidth > trackTitle.clientWidth) {
            console.log(trackTitle.scrollWidth)
            trackTitleOverflowing = true;
            setTimeout(window.Marquee3k.init, 150)
        }

    function cleanTrackString(text: string) {
        return text
            .replace(/\s*-\s*[^-]+$/, "") // remove '- EP', '- Single', etc.
            .replace(/\s*\(feat\. [^)]+\)/i, ""); // remove '(feat. ...)'
    }
</script>

{#await recentTrack}
    <p>loading music data...</p>
{:then recentTrackData}
    <span class="italic op-75 text-sm ml-1">{timeAgo.format(recentTrackData.latest_listen_ts ? new Date(recentTrackData.latest_listen_ts) : new Date())}&nbsp;</span>
	<div bind:this={trackTitle} class="marquee3k w-full overflow-clip text-nowrap" data-speed="0.75"><span class="text-2xl font-bold pl-16 m-0">{cleanTrackString(recentTrackData.listens[0].track_metadata.track_name.toRespectfulLowerCase())}</span></div>
    <p class="text-base italic">{recentTrackData.listens[0].track_metadata.artist_name.toRespectfulLowerCase()}</p>
    <script>
        // setTimeout(() => {console.log(trackTitle)})
        // $: if (trackTitle && trackTitle.scrollWidth > trackTitle.clientWidth) {
        //     console.log(trackTitle.scrollWidth)
        //     trackTitleOverflowing = true;
        //     setTimeout(window.Marquee3k.init, 150)
        // }
        // window.Marquee3k.init()
    </script>
{/await}
