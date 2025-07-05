<script lang="ts">
    import { getPalette } from "../../lib/colors";
    import type { Track } from "../../env";
    import { onMount } from "svelte";
    import marquee from "vanilla-marquee";

    let trackTitle: HTMLDivElement;
    let trackTitleMarquee: marquee;

    String.prototype.toRespectfulLowerCase = function () {
        if (this === this.toUpperCase() || this === this.toLowerCase()) {
            return this.toString();
        }
        // if text is titlecase or first letter of the entire string is uppercase,
        // convert it to lowercase
        return this.toLowerCase()
    };

    $: if (trackTitle) {
        console.log("track title update");
        trackTitleOverflowing();
    }

    function trackTitleOverflowing() {
        if (!trackTitle) {
            return false;
        }
        console.log(trackTitle.scrollWidth, trackTitle.clientWidth);
        if (trackTitle && trackTitle.scrollWidth > trackTitle.clientWidth) {
            if (trackTitleMarquee) {
                trackTitleMarquee.destroy();
            }
            trackTitleMarquee = new marquee(trackTitle, {
                duplicated: true,
                recalcResize: true,
                startVisible: true,
                gap: 50,
            });
            return true;
        }
        trackTitleMarquee?.destroy();
        return false;
    }

    let recentTrack: Track | null = null;

    async function updateRecentTrack(data: Track) {
        recentTrack = data;
    }

    document.addEventListener("DOMContentLoaded", async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        console.log(trackTitleMarquee);
        trackTitleMarquee?.refresh();
    });

    onMount(() => {
        const socket = new WebSocket("wss://spot-ws.thrzl.xyz/ws");
        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            await updateRecentTrack(data);
        };
    });

    // biome-ignore lint/style/useConst: needed by svelte
    let coverArt: HTMLImageElement | null = null;

    function getAlbumArtColor() {
      // console.log("getting colors")
        if (!coverArt || coverArt.src.includes("/music.avif")) {
            console.log("cancelling cover art");
            return; // make the linter happy
        }
        if (sessionStorage.getItem("previousImg") === coverArt.src) {
            return;
        }

        if (!coverArt.complete) {
          console.log("waiting for cover to load")
            coverArt.addEventListener("load", getAlbumArtColor);
        }
        const palette = getPalette(recentTrack?.release.image_palette);
      //   console.log(palette)
      //   console.log("palette ^")

        !coverArt.src.includes("/music.avif") &&
            sessionStorage.setItem("previousImg", coverArt.src);
        sessionStorage.setItem("palette", JSON.stringify(palette));
        sessionStorage.setItem(
            "textColor",
            palette.textColor,
        );
        document.documentElement.style.setProperty(
            "--dominant",
            palette.dominant || "#000000",
        );
        document.documentElement.style.setProperty(
            "--accent-bg",
            palette.palette[0] || "#fff",
        );
        document.documentElement.style.setProperty(
            "--accent-bg-light",
            palette.palette[1] || "#fff",
        );
        document.documentElement.style.setProperty(
            "--accent-muted-light",
            palette.palette[3] || "#fff",
        );
        document.documentElement.style.setProperty(
            "--accent-text",
            palette.textColor || "#ffffff",
        );
        // window.palette = palette;
        return;
    }
</script>

{#if recentTrack === null}
    <div class="block w-full">
            <img
                src="/music.avif"
                alt="placeholder cover art"
                class="w-full max-w-250px aspect-ratio-square mb-0.5 b-cover-accent bg-cover-accent b-4 b-solid"
                loading="lazy"
                crossorigin="anonymous"
            />
            <div
                class="bg-[--accent-muted-dark] bottom-0 op-0 op-80 transition-delay-150 transition-200 w-full h-full z-1"
            ></div>
            <div
                class="bottom-0 op-0 op-100 transition-delay-150 transition-200 w-full h-full z-2 flex justify-end items-end flex-col"
            >
                    <div
                        bind:this={trackTitle}
                        class="block text-nowrap overflow-x-clip my-0.5 text-4xl font-bold text-right w-max max-w-full"
                        data-speed="0.75"
                    >
                        <!-- <div> -->
                        <p
                            class="font-bold inline hover:underline decoration-2 decoration-dotted hover:text-glow hover:decoration-wavy hover:decoration-1 b-b-0"
                        >
                            loading...
                        </p>
                    </div>
                    <p class="text-sm text-right w-4/5 italic link">
                        please wait
                    </p>
            </div>
    </div>
{:else}
    <div class="block w-full">
        {#key recentTrack.url}
            <img
                src="https://wsrv.nl/?url={recentTrack.release.image_url}&output=webp"
                alt="{recentTrack.release.name} cover art"
                on:error={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = "/music.avif";
                }}
                bind:this={coverArt}
                on:load={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (img.src.includes("/music.avif")) {
                        return;
                    }
                    console.log("image loaded")
                    getAlbumArtColor();
                    console.log("set colors")
                }}
                class="w-full max-w-250px aspect-ratio-square mb-0.5 b-cover-accent bg-cover-accent b-4 b-solid"
                loading="lazy"
                crossorigin="anonymous"
            />
            <!-- show title and artist in center on hover, and darken background -->
            <div
                class="bg-[--accent-muted-dark] bottom-0 op-0 op-80 transition-delay-150 transition-200 w-full h-full z-1"
            ></div>
            <div
                class="bottom-0 op-0 op-100 transition-delay-150 transition-200 w-full h-full z-2 flex justify-end items-end flex-col"
            >
                    <div
                        bind:this={trackTitle}
                        class="block text-nowrap overflow-x-clip my-0.5 text-4xl font-bold text-right w-max max-w-full"
                        data-speed="0.75"
                    >
                        <!-- <div> -->
                        <a
                            href={recentTrack.url}
                            class="font-bold inline hover:underline decoration-2 decoration-dotted hover:text-glow hover:decoration-wavy hover:decoration-1 b-b-0"
                        >
                            {recentTrack.name
                                .toRespectfulLowerCase()
                                .replaceAll("’", "'")}
                        </a>
                        <!-- </div> -->
                    </div>
                    <p class="text-sm text-right w-4/5 italic">
                        {#each recentTrack.artists as artist, i}
                            <a
                                href={artist.url}
                                class="link"
                                >{artist.name
                                    .toRespectfulLowerCase()
                                    .replaceAll("’", "'")}</a
                            >
                            {i !== recentTrack.artists.length - 1
                                ? artist.join_phrase
                                : ""}
                        {/each}
                    </p>
                <!-- {#if now_playing}
			<p
			class="line-height-none w-max animate-pulse duration-100 text-lg lg:text-sm m-0 text-[--accent-bg-light]"
			>
			now playing!
			</p>
			{:else}
			<p
			class="line-height-none w-max duration-100 text-lg lg:text-sm m-0 text-[--accent-bg-light]"
			>
			recent track
			</p>
			{/if} -->
            </div>
        {/key}
    </div>
{/if}
