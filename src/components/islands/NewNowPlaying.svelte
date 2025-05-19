<script lang="ts">
import { getDominantColor } from "../../lib/colors";
import type { Track } from "../../env";
import "@gouch/to-title-case";
import { onMount } from "svelte";

let trackTitle: HTMLDivElement;
// let trackTitleOverflowing = false;

// biome-ignore lint/style/useConst: svelte needs this
let marqueeElement: HTMLElement | null = null;

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

$: if (marqueeElement) {
	window.Marquee3k.refreshAll();
}

function trackTitleOverflowing() {
	if (!trackTitle) {return false}
	console.log(trackTitle.scrollWidth, trackTitle.clientWidth);
	if (trackTitle && trackTitle.scrollWidth > trackTitle.clientWidth) {
		setTimeout(window.Marquee3k.init, 150);
		return true
	}
	return false
}

async function getRecentTrack(): Promise<Track> {
	const res = await fetch("https://lstnbrnz.thrzl.xyz/?user=thrizzle");
	return await res.json();
}
let recentTrack: Track | null = null;

async function updateRecentTrack() {
	recentTrack = await getRecentTrack();
}

onMount(() => {
	updateRecentTrack();

	const interval = setInterval(updateRecentTrack, 15000);
	return () => clearInterval(interval);
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
		const palette = JSON.parse(sessionStorage.getItem("palette") as string);
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
	<div
		class="relative overflow-hidden w-full grow group aspect-ratio-square p-2 hover:p-0 duration-300 cursor-help"
	>
		<img
			src="/music.avif"
			alt="placeholder cover art"
			class="w-full h-auto mb-2"
			loading="lazy"
		/>
		<!-- show title and artist in center on hover, and darken background -->
		<div
			class="absolute bg-[--accent-muted-dark] bottom-0 op-0 op-80 transition-delay-150 transition-200 w-full h-full z-1"
		></div>
		<div
			class="absolute bottom-0 op-0 op-100 transition-delay-150 transition-200 w-full h-full z-2 flex justify-center items-center flex-col"
		>
			<p class="text-sm text-neutral-300 text-center w-full italic">
				please wait
			</p>
			<p
				class="text-white text-4xl !line-height-none font-800 text-center w-4/5"
			>
				loading data...
			</p>
		</div>
	</div>
{:else}
	<div
		class="block w-full"
	>
	{#key recentTrack.mbid}
		<img
			src="https://wsrv.nl/?url=coverartarchive.org/release/{recentTrack.release
				.mbid}/front-250"
			alt="{recentTrack.release.name} cover art"
			on:error={(e) => {
				const img = e.target as HTMLImageElement;
				img.src = "/music.avif"}}
			bind:this={coverArt}
			on:load={(e) => {
				const img = e.target as HTMLImageElement;
				if (img.src.includes("/music.avif")) {
					return;
				}
				getAlbumArtColor();
			}}
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
			{#if recentTrack.matched}
				<div
					bind:this={trackTitle}
					class="block text-nowrap overflow-clip {trackTitleOverflowing() ? 'marquee3k': ''} text-white text-4xl font-800 text-right w-max max-w-full"
					data-speed="0.75"
				>
					<div>
						<a href="https://musicbrainz.org/recording/{recentTrack.mbid}" class="font-bold inline {trackTitleOverflowing() ? 'mr-16': ''}">
							{recentTrack.name
								.toRespectfulLowerCase()
								.replaceAll("’", "'")}
						</a>
					</div>
				</div>
				<p class="text-sm text-neutral-300 text-right w-4/5 italic">
					{#each recentTrack.artists as artist, i}
						<a href="https://listenbrainz.org/artist/{artist.mbid}"
							>{artist.name
								.toRespectfulLowerCase()
								.replaceAll("’", "'")}</a
						>
						{i !== recentTrack.artists.length - 1
							? artist.join_phrase
							: ""}
					{/each}
				</p>
			{:else}
				<div
					bind:this={trackTitle}
					class="block text-nowrap overflow-clip marquee3k text-white text-4xl !line-height-none font-800 text-right w-max max-w-full"
				>
					<span class="font-bold pr-16">
						{recentTrack.name
							.replace(/\s*\(feat\. [^)]+\)/i, "")
							.toRespectfulLowerCase()
							.replaceAll("’", "'")}
					</span>
				</div>
				<p class="text-sm text-neutral-300 text-right w-full italic">
					{recentTrack.artists[0].name
						.toRespectfulLowerCase()
						.replaceAll("’", "'")}
				</p>
			{/if}
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

<style>
	a {
		border-bottom: 1px dotted var(--accent-bg);
		/* b-b-dotted b-b-cover-accent */
	}
	a:hover {
		text-shadow: 0 0 0.125rem white;
	}
</style>
