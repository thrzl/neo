<script lang="ts">
	import type { ListenBrainzRes } from "../../lib/types";
	import { getDominantColor } from "../../lib/colors";
	import getRecentTrack from "../../lib/listenbrainz";
	import "../../lib/helpers";
	import Marquee from "../Marquee.svelte";

	let trackTitle: HTMLAnchorElement | null = null;
	let trackTitleOverflowing = false;
	let marqueeElement: HTMLElement;

	$: if (marqueeElement) {
		window.Marquee3k.refreshAll();
	}

	$: if (trackTitle) {
		if (trackTitle && trackTitle.scrollWidth > trackTitle.clientWidth) {
			trackTitleOverflowing = true;
		}
	}

	let recentTrack = getRecentTrack();
	let coverArt: HTMLImageElement | null = null;

	async function getAlbumArtColor() {
		if (!coverArt) {
			return; // make the linter happy
		}
		const palette = await getDominantColor(coverArt.src);
		console.log(palette);

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

	function stitchArtistCredits(
		artists: ListenBrainzRes["listens"][0]["track_metadata"]["mbid_mapping"]["artists"],
	) {
		return artists
			.map(
				(artist) =>
					artist.artist_credit_name.toRespectfulLowerCase() +
					(artist.join_phrase || ""),
			)
			.join("");
	}
</script>

{#await recentTrack}
	<div class="flex flex-col items-center border-black b-2 lg:items-start">
		<img
			class="border-black border-b-2 w-full aspect-ratio-square p-5"
			src="/skype/sign_of_the_horns.png"
			alt="cover art"
		/>
		<div class="text-left my-5 h-auto lg:ml-5 max-w-3/4">
			<p
				class="block text-sm w-max link line-height-none mt-0.5"
				style="margin: 0"
			>
				one moment
			</p>
			<p
				class="link line-height-none"
				data-speed="0.25"
				style="font-size: 1.25rem; font-weight: bold; margin:0; max-width: 400px"
			>
				loading...
			</p>
		</div>
	</div>
{:then { track, now_playing }}
	{console.log(track)}
	<a
		href="https://listenbrainz.org/release/{track.mbid_mapping
			.release_mbid}"
		class="relative overflow-hidden block w-full grow group aspect-ratio-square p-2 hover:p-0 duration-300 cursor-help"
	>
		<!-- <strong>{release.release_name}</strong> by {release.artist_name} 
	(Listens: {release.listen_count}) -->
		<img
			src="https://wsrv.nl/?url=coverartarchive.org/release/{track
				.mbid_mapping.release_mbid}/front-500"
			alt="{track.release_name} cover art"
			on:error={(e) =>
				(e.target.src = "/music.avif" && getAlbumArtColor())}
			bind:this={coverArt}
			on:load={getAlbumArtColor}
			class="w-full h-auto mb-2 group-hover:scale-100 group-hover:blur-none transition duration-300"
			loading="lazy"
		/>
		<!-- show title and artist in center on hover, and darken background -->
		<div
			class="absolute bg-[--accent-muted-dark] bottom-0 op-0 group-hover:op-80 transition-delay-150 transition-200 w-full h-full z-1"
		></div>
		<div
			class="absolute bottom-0 op-0 group-hover:op-100 transition-delay-150 transition-200 w-full h-full z-2 flex justify-center items-center flex-col"
		>
			<p class="text-sm text-neutral-300 text-center w-full italic">
				{track.artist_name.toRespectfulLowerCase().replaceAll("’", "'")}
			</p>
			<p
				class="text-white text-4xl !line-height-none font-800 text-center w-4/5"
			>
				{track.track_name
					.toRespectfulLowerCase()
					.replaceAll("’", "'")}
			</p>
			{#if now_playing}
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
			{/if}
		</div>
		<!-- <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
		<p>{release.release_name}</p>
		<p>{release.artist_name}</p>
	</div> -->
	</a>
{/await}
