<script lang="ts">
type ListenBrainzRes = {
	listens: Array<{
		inserted_at: number;
		listened_at: number | null;
		recording_msid: string;
		track_metadata: {
			additional_info: {
				duration_ms: number;
				media_player: string;
				music_service: string;
				recording_msid: string;
				submission_client: string;
			};
			artist_name: string;
			mbid_mapping: {
				artist_mbids: Array<string>;
				artists: Array<{
					artist_credit_name: string;
					artist_mbid: string;
					join_phrase: string;
				}>;
				caa_id: number;
				caa_release_mbid: string;
				recording_mbid: string;
				recording_name: string;
				release_mbid: string;
			};
			track_name: string;
		};
		user_name: string;
	}>;
	oldest_listen_ts: number;
	user_id: string;
};

type ListenBrainzMetadata = {
	artist_credit_name: string;
	artist_mbids: Array<string>;
	recording_mbid: string;
	recording_name: string;
	release_mbid: string;
	release_name: string;
};

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
			`https://api.listenbrainz.org/1/metadata/lookup/?recording_name=${track.track_name}&artist_name=${track.artist_name}`,
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
		const true_track_data: ListenBrainzMetadata = await true_res.json();
		res.listens[0].track_metadata.mbid_mapping = {
			artist_mbids: true_track_data.artist_mbids || [],
			artists: true_track_data.artist_credit_name
				? [
						{
							artist_credit_name: true_track_data.artist_credit_name,
							artist_mbid: "",
							join_phrase: "",
						},
					]
				: [],
			caa_id: 0,
			caa_release_mbid: true_track_data.release_mbid || "",
			recording_mbid: true_track_data.recording_mbid || "",
			recording_name: true_track_data.recording_name || "",
			release_mbid: true_track_data.release_mbid || "",
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
<div class="flex flex-col lg:flex-row items-center border-black b-2">
            <img class="border-black border-2 w-[6rem] h-full m-2"
                src="/skype/sign_of_the_horns.png"
                alt="placeholder cover art"
                style="width:5rem;padding:1rem;height: 100%"
            />
    <div
        style="margin-left: 0.5rem; margin-right: 0.75rem; overflow: scroll"
    >
        <p
            style="font-size: 1.25rem; font-weight: bold; margin:0; max-width: 400px"
        >
            now loading data...
        </p>
        <p style="margin:0">almost done!</p>
    </div>
</div>
{:then { track, now_playing }}
    <div class="flex flex-col lg:flex-row items-center border-black b-2">
        {#if track.mbid_mapping}
            <a
                href={`https://listenbrainz.org/release/${track.mbid_mapping.release_mbid}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <img class="border-black border-2 w-24 aspect-ratio-square m-2"
                    src={`http://wsrv.nl/?url=coverartarchive.org/release/${track.mbid_mapping?.release_mbid}/front-250/`}
					on:error="{(e) => e.target.src = '/music.avif'}"
                    alt="cover art"

                />
            </a>
        {:else}
            <img class="border-black border-2 w-[6rem] h-full m-2" src="/skype/musical_notes.png" alt="cover art placeholder" style="width:5rem;padding:1rem;height: 100%"/>
        {/if}
        <div
            style="margin-left: 0.5rem; margin-right: 0.75rem; overflow: scroll"
			class="text-center lg:text-left"
        >
            <a
				href="{track.mbid_mapping?.recording_mbid ? `//musicbrainz.org/recording/${track.mbid_mapping.recording_mbid}` : '#'}"
                bind:this={container}
                on:load={checkOverflow}
                class="{isOverflowing ? 'marquee' : ''} duration-100 hover:b-b-1 b-b-black b-b-dotted cursor-help line-height-none"
                data-speed="0.25"
                style="font-size: 1.25rem; font-weight: bold; margin:0; max-width: 400px"
            >
                {track.mbid_mapping?.recording_name
                    ? track.mbid_mapping.recording_name.toLowerCase()
                    : track.track_name.toLowerCase()}
            </a>
            <!-- ik its gross bro watch out -->
			 {console.log(track.mbid_mapping)}
            <p class="duration-100 hover:b-b-1 b-b-black b-b-dotted cursor-help lg:w-fit line-height-none mt-0.5" style="margin: 0">{track.mbid_mapping?.artists.length > 0 ? stitchArtistCredits(track.mbid_mapping.artists).toLowerCase() : track.artist_name.toLocaleLowerCase()}</p>
            {#if now_playing}
                <p style="color: green; margin: 0">now playing!</p>
            {/if}
        </div>
    </div>
{/await}

<style>
    .marquee {
        white-space: nowrap;
        overflow: hidden;
        display: inline-block;
        animation: marquee 7.5s linear infinite;
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

    p {
        margin: 0.5rem;
    }
</style>
