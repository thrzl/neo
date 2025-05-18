<script lang="ts">
    import TimeAgo from "javascript-time-ago";
    import en from "javascript-time-ago/locale/en";
    import { getDominantColor } from "../../lib/colors";
    TimeAgo.addDefaultLocale(en);
    const timeAgo = new TimeAgo("en-US");

    import getRecentTrack from "../../lib/listenbrainz";
    import "../../lib/helpers";
    import type { Palette } from "@vibrant/color";

    const recentTrack = getRecentTrack();
    let trackTitle: HTMLDivElement;
    let coverArt: HTMLImageElement;
    let coverPalette: Palette;
    
    $: if (trackTitle && trackTitle.scrollWidth > trackTitle.clientWidth) {
        trackTitleOverflowing = true;
        setTimeout(window.Marquee3k.init, 150);
    }

    $: if (coverArt) {
        getDominantColor(coverArt.src).then((palette) => {
            console.log(":P")
            coverPalette = palette
            console.log(coverPalette)
            sessionStorage.setItem("palette", JSON.stringify(palette));
            sessionStorage.setItem(
                "blackText",
                palette.Vibrant?.bodyTextColor === "#000000"
            );
            document.documentElement.style.setProperty(
                "--accent-bg-dark",
                `rgb(${palette?.DarkVibrant?.rgb.join(", ")})` || "#000000",
            );
            document.documentElement.style.setProperty(
                "--accent-bg",
                `rgb(${palette?.Vibrant?.rgb.join(", ")})` || "#fff",
            );
            document.documentElement.style.setProperty(
                "--accent-bg-light",
                `rgb(${palette?.LightVibrant?.rgb.join(", ")})` || "#fff",
            );
            document.documentElement.style.setProperty(
                "--accent-muted-light",
                `rgb(${palette?.LightMuted?.rgb.join(", ")})` || "#fff",
            );
            document.documentElement.style.setProperty(
                "--accent-muted-dark",
                `rgb(${palette?.DarkMuted?.rgb.join(", ")})` || "#fff",
            );
            document.documentElement.style.setProperty(
                "--accent-muted",
                `rgb(${palette?.Muted?.rgb.join(", ")})` || "#fff",
            );
            document.documentElement.style.setProperty(
                "--accent-text-dark",
                palette?.DarkVibrant?.bodyTextColor || "#ffffff",
            );
            document.documentElement.style.setProperty(
                "--accent-text-light",
                palette?.LightVibrant?.bodyTextColor || "#ffffff",
            );
            document.documentElement.style.setProperty(
                "--accent-text",
                palette?.LightMuted?.bodyTextColor || "#ffffff",
            );
        });
        // window.palette = palette;
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
    <span class="italic op-75 text-sm ml-1"
        >{timeAgo
            .format(
                recentTrackData.latest_listen_ts
                    ? new Date(recentTrackData.latest_listen_ts * 1000)
                    : new Date(),
            )
            .replace("just now", "right now")}&nbsp;</span
    >
    <div
        bind:this={trackTitle}
        class="marquee3k w-full overflow-clip text-nowrap"
        data-speed="0.75"
    >
        <span class="text-2xl font-bold pl-16 m-0"
            >{cleanTrackString(
                recentTrackData.listens[0].track_metadata.track_name.toRespectfulLowerCase(),
            )}</span
        >
    </div>
    <p class="text-base italic">
        {recentTrackData.listens[0].track_metadata.artist_name.toRespectfulLowerCase()}
    </p>
    <img
        bind:this={coverArt}
        src="https://wsrv.nl/?url=coverartarchive.org/release/{recentTrackData
            .listens[0].track_metadata.mbid_mapping.release_mbid}/front-250"
        width="0"
        height="0"
        alt="{trackTitle} cover art"
    />
    <!-- {#if coverPalette}
    <div class="flex flex-row">
        {#each Object.values(coverPalette) as color}
            <div class="w-8 h-full" style="background-color: {color.rgb}"></div>

        {/each}
    </div>
    {/if} -->
{/await}
