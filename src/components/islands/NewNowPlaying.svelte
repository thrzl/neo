<script lang="ts">
	import type { ListenBrainzRes } from "../../lib/types";
	import { getDominantColor } from "../../lib/colors";
	import "../../lib/helpers";
    import type { Track } from "../../lib/listenbrainz";

	let trackTitle: HTMLDivElement;
	let trackTitleOverflowing = false;
	let marqueeElement: HTMLElement;

	$: if (marqueeElement) {
		window.Marquee3k.refreshAll();
	}

	$: if (trackTitle) {
		console.log(trackTitle.scrollWidth, trackTitle.clientWidth)
		if (trackTitle && trackTitle.scrollWidth > trackTitle.clientWidth) {
			trackTitleOverflowing = true;
			setTimeout(window.Marquee3k.init, 150);
		}
	}

	async function getRecentTrack(): Promise<Track> {
		const res = await fetch("https://lstnbrnz.thrzl.xyz/?user=thrizzle")
		return await res.json()
	}
	const recentTrack = getRecentTrack();
	let coverArt: HTMLImageElement | null = null;

	async function getAlbumArtColor() {
		if (!coverArt || coverArt.src.includes("/music.avif")) {
			console.log("cancelling cover art");
			return; // make the linter happy
		}
		if (sessionStorage.getItem("previousImg") === coverArt.src) {
			console.info("hey, i know this one!");
			const textColors = sessionStorage.getItem("textColors");
			const palette = JSON.parse(sessionStorage.getItem("palette"));
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
			document.documentElement.style.setProperty(
				"--accent-text-dark",
				textColors.dark || "#ffffff",
			);
			document.documentElement.style.setProperty(
				"--accent-text-light",
				textColors.light || "#ffffff",
			);
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

	function stitchArtistCredits(
		artists: ListenBrainzRes["listens"][0]["track_metadata"]["mbid_mapping"]["artists"],
	) {
		return artists
			? artists
					.map(
						(artist) =>
							artist.artist_credit_name.toRespectfulLowerCase() +
							(artist.join_phrase || ""),
					)
					.join("")
			: null;
	}
</script>

{#await recentTrack}
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
{:then track}
	<div
		href={track.matched &&
			`https://listenbrainz.org/release/${track.release.mbid}`}
		class="block w-full"
	>
		<!-- <strong>{release.release_name}</strong> by {release.artist_name} 
	(Listens: {release.listen_count}) -->
		<img
			src="https://wsrv.nl/?url=coverartarchive.org/release/{track.release
				.mbid}/front-250"
			alt="{track.release.name} cover art"
			on:error={(e) => (e.target.src = "/music.avif")}
			bind:this={coverArt}
			on:load={(e) => {
				if (e.target.src.includes("/music.avif")) {
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
			{#if track.matched}
				<div
					bind:this={trackTitle}
					class="block text-nowrap overflow-clip marquee3k text-white text-4xl font-800 text-right w-max max-w-full"
					data-speed="0.75"
				>
					<div>
						<a href="https://musicbrainz.org/recording/{track.mbid}" class="font-bold inline" style={trackTitleOverflowing ? `margin-right: 4rem`: ""}>
							{track.name
								.toRespectfulLowerCase()
								.replaceAll("’", "'")}
						</a>
					</div>
				</div>
				<p class="text-sm text-neutral-300 text-right w-4/5 italic">
					{#each track.artists as artist, i}
						<a href="https://listenbrainz.org/artist/{artist.mbid}"
							>{artist.name
								.toRespectfulLowerCase()
								.replaceAll("’", "'")}</a
						>
						{i !== track.artists.length - 1
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
						{track.name
							.replace(/\s*\(feat\. [^)]+\)/i, "")
							.toRespectfulLowerCase()
							.replaceAll("’", "'")}
					</span>
				</div>
				<p class="text-sm text-neutral-300 text-right w-full italic">
					{track.artists[0].name
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
	</div>
{/await}

<style>
	a {
		border-bottom: 1px dotted var(--accent-bg);
		/* b-b-dotted b-b-cover-accent */
	}
	a:hover {
		text-shadow: 0 0 0.125rem white;
	}
</style>
