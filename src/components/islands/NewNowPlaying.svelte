<script lang="ts">
    import { io } from "socket.io-client";
    import { getDominantColor } from "../../lib/colors";
    import type { Track } from "../../env";
    import "@gouch/to-title-case";
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
        if (
            this.toTitleCase() === this ||
            this.charAt(0) === this.charAt(0).toUpperCase()
        ) {
            return this.toLowerCase();
        }
        return this.toString();
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

    async function getRecentTrack(): Promise<Track> {
        const res = await fetch("https://nowplaying.thrzl.xyz/now_playing");
        return await res.json();
    }
    let recentTrack: Track | null = null;

    async function updateRecentTrack(data: Track) {
        recentTrack = data;
    }

    document.addEventListener("astro:page-load", async () => {
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

    async function getAlbumArtColor() {
        if (!coverArt || coverArt.src.includes("/music.avif")) {
            console.log("cancelling cover art");
            return; // make the linter happy
        }
        if (sessionStorage.getItem("previousImg") === coverArt.src) {
            console.info("hey, i know this one!");
            const textColors = JSON.parse(
                sessionStorage.getItem("textColors") as string,
            );
            const palette = JSON.parse(
                sessionStorage.getItem("palette") as string,
            );
            if (!palette || !textColors) {
                console.log("whoops..");
            }
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
            if (textColors) {
                document.documentElement.style.setProperty(
                    "--accent-text-dark",
                    textColors.dark || "#ffffff",
                );
                document.documentElement.style.setProperty(
                    "--accent-text-light",
                    textColors.light || "#ffffff",
                );
            }
            document.documentElement.style.setProperty(
                "--accent-text",
                palette?.LightMuted?.bodyTextColor || "#ffffff",
            );
            return;
        }
        const palette = await getDominantColor(coverArt.src);

        !coverArt.src.includes("/music.avif") &&
            sessionStorage.setItem("previousImg", coverArt.src);
        sessionStorage.setItem("palette", JSON.stringify(palette));
        sessionStorage.setItem(
            "textColors",
            JSON.stringify({
                light: palette?.LightVibrant?.bodyTextColor,
                dark: palette?.DarkVibrant?.bodyTextColor,
            }),
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
        // window.palette = palette;
        return;
    }
</script>

{#if recentTrack === null}
    <div class="block w-full">
        <img
            src="music.avif"
            alt="placeholder cover art"
            class="w-full aspect-ratio-square mb-2 b-cover-accent bg-cover-accent b-4 b-solid"
            loading="lazy"
        />
        <!-- show title and artist in center on hover, and darken background -->
        <div
            class="bg-[--accent-muted-dark] bottom-0 op-0 op-80 transition-delay-150 transition-200 w-full h-full z-1"
        ></div>
        <div
            class="bottom-0 op-0 op-100 transition-delay-150 transition-200 w-full h-full z-2 flex justify-end items-end flex-col"
        >
            <div
                class="block font-bold text-nowrap overflow-clip text-white text-4xl !line-height-none font-bold text-right w-max max-w-full"
            >
                loading
            </div>
            <p class="text-sm text-neutral-300 text-right w-full italic">
                fetching data
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
                    getAlbumArtColor();
                }}
                class="w-full max-w-250px aspect-ratio-square mb-0.5 b-cover-accent bg-cover-accent b-4 b-solid"
                loading="lazy"
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
                        class="block text-nowrap overflow-x-clip my-0.5 text-white text-4xl font-bold text-right w-max max-w-full"
                        data-speed="0.75"
                    >
                        <!-- <div> -->
                        <a
                            href={recentTrack.url}
                            class="font-bold inline link b-b-0"
                        >
                            {recentTrack.name
                                .toRespectfulLowerCase()
                                .replaceAll("’", "'")}
                        </a>
                        <!-- </div> -->
                    </div>
                    <p class="text-sm text-neutral-300 text-right w-4/5 italic">
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
