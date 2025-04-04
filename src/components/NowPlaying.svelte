<script lang="ts">
import type {ListenBrainzRes, MusicBrainzRecordingSearch} from "../lib/types";

async function getNowPlaying() {
	const res = await fetch(
		"https://api.listenbrainz.org/1/user/thrizzle/playing-now",
	);
	if (!res.ok) {
		throw new Error("Network response was not ok");
	}
	const raw_data: { payload: ListenBrainzRes } = await res.json();
	return raw_data.payload;
}

async function getLastListen() {
	const res = await fetch(
		"https://api.listenbrainz.org/1/user/thrizzle/listens?count=1",
	);
	if (!res.ok) {
		throw new Error("Network response was not ok");
	}
	const raw_data: { payload: ListenBrainzRes } = await res.json();
	return raw_data.payload;
}

async function getData() {
	let res = await getNowPlaying();
	if (res.listens.length === 0) {
		res = await getLastListen();
	} else if (!res.listens[0].track_metadata.mbid_mapping) {
		const track = res.listens[0].track_metadata; // started pissin me off
		const true_res = await fetch(
			`https://musicbrainz.org/ws/2/recording?fmt=json&query=isrc:${track.additional_info.isrc} OR (recording:${track.track_name} AND artist:${track.artist_name} AND release:${track.release_name.replace(/\s*-\s*[^-]+$/, '')})`,
		);
		if (!true_res.ok) {
			console.error(
				"failed to fetch metadata lookup for now playing recording",
			);
			return {
				track: res.listens[0].track_metadata,
				now_playing: res.listens[0].listened_at === undefined,
			};
		}
		const true_track_data: MusicBrainzRecordingSearch = await true_res.json();
		const recording = true_track_data.recordings[0];
		if (!recording) {
			console.error("No valid media found for the track");
			return {
				track: res.listens[0].track_metadata,
				now_playing: res.listens[0].listened_at === undefined,
			};
		}

		const release = recording.releases[0];
		res.listens[0].track_metadata.mbid_mapping = {
			release_mbid: release.id,
			recording_mbid: recording.id,
			recording_name: recording.title,
			caa_id: 0, // cover art archive id
			caa_release_mbid: release.id,
			artist_mbids: recording["artist-credit"].map((artist) => artist.artist.id),
			artists: recording["artist-credit"].map((artist) => ({
				artist_credit_name: artist.name,
				artist_mbid: artist.artist.id,
				join_phrase: artist.joinphrase || "",
			})),
		};
	}
	return {
		track: res.listens[0].track_metadata,
		now_playing: res.listens[0].listened_at === undefined,
	};
}

const res = getData();
let container: HTMLDivElement;
let isOverflowing = false;

function checkOverflow() {
	if (container) {
		isOverflowing = container.scrollWidth > container.clientWidth;
	}
}

function stitchArtistCredits(
	artists: ListenBrainzRes["listens"][0]["track_metadata"]["mbid_mapping"]["artists"],
) {
	return artists
		.map((artist) => artist.artist_credit_name + (artist.join_phrase || ""))
		.join("");
}
</script>

{#await res}
<div class="flex flex-col items-center border-black b-2 lg:items-start">
	<img class="border-black border-b-2 w-full aspect-ratio-square p-5"
		src="/skype/sign_of_the_horns.png"
		alt="cover art"

	/>
	<div
		class="text-left my-5 h-auto lg:ml-5 max-w-3/4"
	>
	<p class="block text-sm w-max duration-100 hover:b-b-1 b-b-black b-b-dotted cursor-help line-height-none mt-0.5" style="margin: 0">one moment</p>
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
    <div class="flex flex-col items-center border-black b-2 lg:items-start">
        {#if track.mbid_mapping}
            <a
                href={`https://listenbrainz.org/release/${track.mbid_mapping.release_mbid}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <img class="border-black border-b-2 w-full aspect-ratio-square"
                    src={`https://wsrv.nl/?url=coverartarchive.org/release/${track.mbid_mapping?.release_mbid}/front-500/`}
					on:error="{(e) => e.target.src = '/music.avif'}"
                    alt="cover art"

                />
            </a>
        {:else}
            <img class="border-black border-2 w-[6rem] h-full m-2" src="/skype/musical_notes.png" alt="cover art placeholder" style="width:5rem;padding:1rem;height: 100%"/>
        {/if}
        <div
			class="text-left my-5 h-auto lg:ml-5 max-w-3/4"
        >
		<a href="//listenbrainz.org/artist/{track.mbid_mapping?.artists[0].artist_mbid}" class="block text-sm w-max duration-100 hover:b-b-1 b-b-black b-b-dotted cursor-help line-height-none mt-0.5" style="margin: 0">{track.mbid_mapping?.artists.length > 0 ? stitchArtistCredits(track.mbid_mapping.artists).toLowerCase() : track.artist_name.toLocaleLowerCase()}</a>
            <a
				href="{track.mbid_mapping?.recording_mbid ? `//musicbrainz.org/recording/${track.mbid_mapping.recording_mbid}` : '#'}"
                bind:this={container}
                on:load={checkOverflow}
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
                <p class="line-height-none w-max text-sm animate-pulse duration-100 m-0 text-green-600">now playing!</p>
			{:else}
				<p class="line-height-none w-max text-sm duration-100 m-0 text-neutral-500">recent track</p>
            {/if}
        </div>
    </div>
{/await}

<style>
    .marquee {
        white-space: nowrap;
        overflow: hidden;
        display: inline-block;
        animation: marquee 2.5s linear infinite;
    }

    @keyframes marquee {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(-100%);
        }
    }

    .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        color: #000;
    }

    .container img {
        width: 6rem;
        height: 100%;
        margin: 0.5rem;
        border: 2px solid #000;
    }
</style>
