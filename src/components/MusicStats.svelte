<script lang="ts">
    export let range: string;
    // console.log(range)
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
            "https://api.listenbrainz.org/1/stats/user/thrizzle/releases?range=this_week",
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
        <h2>Music Stats</h2>
        <p>Total Releases: {stats.total_release_count}</p>
        <ul class="grid auto-rows-max lg:grid-cols-3 gap-0">
            {#each stats.releases as release}
                <a href="https://wsrv.nl/?url=listenbrainz.org/release/{release.release_mbid}" class="relative overflow-hidden inline-block md:min-w-48 group aspect-ratio-square b-2 b-black p-2 hover:p-0 duration-300 cursor-help">
                    <!-- <strong>{release.release_name}</strong> by {release.artist_name} 
                    (Listens: {release.listen_count}) -->
                    <img src="//coverartarchive.org/release/{release.release_mbid}/front-500" 
                         alt="{release.release_name} cover art" 
                         on:error="{(e) => e.target.src = 'https://via.placeholder.com/250?text=No+Cover+Art'}"
                         class="w-full h-auto mb-2 group-hover:scale-100 group-hover:brightness-30 group-hover:blur-none transition duration-300" />
                    <!-- show title and artist in center on hover, and darken background -->
                    <div class="absolute bottom-0 op-0 group-hover:op-100 transition-delay-150 transition-200 w-full h-full z-1 flex justify-center items-center flex-col lowercase">
                        <p class="text-sm text-neutral-300 text-center w-full">{release.artist_name}</p>
                            <p class="text-white text-lg lg:text-2xl !line-height-none font-800 text-center w-4/5">{release.release_name}</p>
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