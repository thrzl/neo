<script lang="ts">
    type Status = {
        author: string;
        content: string;
        face: string;
        timeAgo: string;
    };

    function htmlDecode(input: string) {
        const doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }

    async function getStatus() {
        const res = await fetch(
            "https://status.cafe/users/thrizzle/status.json",
        );
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        // console.log(await res.json())
        const raw_data: Status = await res.json();
        return raw_data;
    }
    const status = getStatus();

    // map emoji to public/skype images
    const emoji_map = {
        "🙂": "slightly_smiling_face",
        "😐": "neutral_face",
        "😎": "smiling_face_with_sunglasses",
        "🥰": "smiling_face_with_hearts",
        "😛": "face_savoring_food",
        "😂": "rolling_on_the_floor_laughing",
        "❤️": "red_heart",
        "💔": "broken_heart",
        "😇": "smiling_face_with_halo",
        "☀️": "star",
        "🥱": "yawning_face",
    };
</script>

{#await status}
<span class="font-800 pr-1 mr-1 b-r-1 b-r-solid">loading &nbsp;</span>
<p class="inline">
    please wait...
    <img
            class="h-4 inline align-middle"
            height="16px"
            src="/skype/mantelpiece_clock.png"
            alt="clock emoji"
        />
</p>
{:then status}
    <span class="font-800 pr-1 mr-1 b-r-1 b-r-solid">{status.timeAgo}&nbsp;</span>
    <p class="inline">
        {htmlDecode(status.content)}
        {#if emoji_map.hasOwnProperty(status.face)}<img
                class="h-4 inline align-middle"
                height="16px"
                src={`/skype/${emoji_map[status.face]}.png`}
                alt={status.face.replace("_", " ")}
            />{/if}
    </p>
{:catch error}
    <div class="text-red-500">Error: {error.message}</div>
{/await}
