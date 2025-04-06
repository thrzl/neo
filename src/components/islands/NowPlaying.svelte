<script lang="ts">
	import type {
		ListenBrainzRes,
	} from "../../lib/types";
	import {getDominantColor} from "../../lib/colors";
    import getRecentTrack from "../../lib/listenbrainz";

	let recentTrack = getRecentTrack();
	setInterval(async () =>{
		let t = await getRecentTrack();
		recentTrack = t;
	}, 15000); // Refresh every 30 seconds
	let coverArt: HTMLImageElement | null = null;

	async function getAlbumArtColor() {
		if (!coverArt) {
			return; // make the linter happy
		}
		const palette = await getDominantColor(coverArt);

		sessionStorage.setItem("palette", JSON.stringify(palette));
		document.documentElement.style.setProperty(
			"--accent-bg-dark",
			`rgb(${palette?.DarkVibrant?.rgb.join(", ")})` || "#000000"
		);
		document.documentElement.style.setProperty(
			"--accent-bg",
			`rgb(${palette?.Vibrant?.rgb.join(", ")})` || "#fff"
		);
		document.documentElement.style.setProperty(
			"--accent-text-light",
			palette?.DarkVibrant?.bodyTextColor || "#fff"
		);
		document.documentElement.style.setProperty(
			"--accent-text-dark",
			palette?.LightVibrant?.bodyTextColor || "#000"
		);
		document.documentElement.style.setProperty(
			"--accent-text",
			palette?.Vibrant?.bodyTextColor || "#ffffff"
		);
		return; 
	}

	function stitchArtistCredits(
		artists: ListenBrainzRes["listens"][0]["track_metadata"]["mbid_mapping"]["artists"],
	) {
		return artists
			.map(
				(artist) =>
					artist.artist_credit_name + (artist.join_phrase || ""),
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
				class="block text-sm w-max duration-100 hover:b-b-1 b-b-black b-b-dotted cursor-help line-height-none mt-0.5"
				style="margin: 0"
			>
				one moment
			</p>
			<p
				class="duration-100 hover:b-b-1 b-b-black b-b-dotted cursor-help line-height-none"
				data-speed="0.25"
				style="font-size: 1.25rem; font-weight: bold; margin:0; max-width: 400px"
			>
				loading...
			</p>
		</div>
	</div>
{:then { track, now_playing }}
	<div class="flex flex-col items-center border-[--accent-bg] b-2 lg:items-start ">
		
		{#if track.mbid_mapping}
			<a
				href={`https://listenbrainz.org/release/${track.mbid_mapping.release_mbid}`}
				target="_blank"
				rel="noopener noreferrer"
			>
				<img
					class="border-[--accent-bg] border-b-2 w-full aspect-ratio-square"
					src={`https://wsrv.nl/?url=coverartarchive.org/release/${track.mbid_mapping?.release_mbid}/front-500/`}
					on:error={(e) =>
						(e.target.src = "/skype/musical_notes.png" || getAlbumArtColor())}
					bind:this={coverArt}
					on:load={getAlbumArtColor}
					crossorigin="anonymous"
					alt="cover art"
				/>
			</a>
		{:else}
			<img
				class="border-black border-b-2 min-w-full aspect-ratio-square p-5"
				src="/skype/musical_notes.png"
				alt="cover art placeholder"
				style="width:5rem;padding:1rem;height: 100%"
			/>
		{/if}
		<div class="text-left my-5 h-auto lg:ml-5 max-w-3/4">
			<a
				href="//listenbrainz.org/artist/{track.mbid_mapping?.artists[0]
					.artist_mbid}"
				class="block text-sm m-0 w-max duration-100 hover:b-b-1 b-b-black b-b-dotted cursor-help line-height-none mt-0.5 text-wrap max-w-full"
				>{track.mbid_mapping?.artists.length > 0
					? stitchArtistCredits(
							track.mbid_mapping.artists,
						).toLowerCase()
					: track.artist_name.toLocaleLowerCase()}</a
			>
			<a
				href={track.mbid_mapping?.recording_mbid
					? `//musicbrainz.org/recording/${track.mbid_mapping.recording_mbid}`
					: "#"}
				class="duration-100 hover:b-b-1 b-b-black b-b-dotted cursor-help line-height-none"
				data-speed="0.25"
				style="font-size: 1.25rem; font-weight: bold; margin:0; max-width: 400px"
			>
				{track.mbid_mapping?.recording_name
					? track.mbid_mapping.recording_name.toLowerCase()
					: track.track_name.toLowerCase()}
			</a>
			<!-- <p class="duration-100 hover:b-b-1 b-b-black b-b-dotted cursor-help lg:w-fit line-height-none mt-0.5" style="margin: 0">{track.mbid_mapping?.artists.length > 0 ? stitchArtistCredits(track.mbid_mapping.artists).toLowerCase() : track.artist_name.toLocaleLowerCase()}</p> -->
			{#if now_playing}
				<p
					class="line-height-none w-max text-sm animate-pulse duration-100 m-0 text-[--accent-bg]"
				>
					now playing!
				</p>
			{:else}
				<p
					class="line-height-none w-max text-sm duration-100 m-0 text-neutral-500"
				>
					recent track
				</p>
			{/if}
		</div>
	</div>
{/await}
