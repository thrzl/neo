<script lang="ts">
    export let range: string;
    import "../../lib/helpers"
    type Stats = {
        count: number;
        from_ts: number;
        last_updated: number;
        offset: number;
        range: string;
        releases: Array<{
            artist_mbids: Array<string>;
            artist_name: string;
            artists: Array<{
                artist_credit_name: string;
                artist_mbid: string;
                join_phrase: string;
            }>;
            caa_id: number;
            caa_release_mbid: string;
            listen_count: number;
            release_mbid: string;
            release_name: string;
        }>;
        to_ts: number;
        total_release_count: number;
        user_id: string;
    };

    async function getStats() {
        const res = await fetch(
            `https://api.listenbrainz.org/1/stats/user/thrizzle/releases?range=${range}`,
        );
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        const raw_data: { payload: Stats } = await res.json();
        return raw_data.payload;
    }
    const stats: Promise<Stats> = getStats();
</script>

{#await stats}
    <p>Loading music stats...</p>
{:then stats}
    <div class="music-stats">
        <ul class="flex flex-wrap-reverse flex-row gap-0 w-full justify-center">
            {#each [...stats.releases].reverse() as release, i}
                <a href="https://listenbrainz.org/release/{release.release_mbid}" class="order-{i} relative overflow-hidden inline-block min-w-48 grow basis-48 group aspect-ratio-square b-2 b-[--accent-bg-light] p-2 hover:p-0 duration-300 cursor-help">
                    <!-- <strong>{release.release_name}</strong> by {release.artist_name} 
                    (Listens: {release.listen_count}) -->
                    <img src="https://wsrv.nl/?url=coverartarchive.org/release/{release.release_mbid}/front-500" 
                         alt="{release.release_name} cover art"
                         on:error="{(e) => e.target.src = '/music.avif'}"
                         class="w-full h-auto mb-2 group-hover:scale-100 group-hover:brightness-30 group-hover:blur-none transition duration-300"
                         loading="lazy" />
                    <!-- show title and artist in center on hover, and darken background -->
                    <div class="absolute bottom-0 op-0 group-hover:op-100 transition-delay-150 transition-200 w-full h-full z-1 flex justify-center items-center flex-col">
                        <p class="text-sm text-neutral-300 text-center w-full italic">{release.artist_name.toRespectfulLowerCase()}</p>
                            <p class="text-white text-lg lg:text-4xl !line-height-none font-800 text-center w-4/5">{release.release_name.toRespectfulLowerCase()}</p>
                    </div>
                    <!-- <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                        <p>{release.release_name}</p>
                        <p>{release.artist_name}</p>
                    </div> -->
                </a>
            {/each}
        </ul>
    </div>
{:catch error}
    <p>Error loading music stats: {error.message}</p>
    
{/await}