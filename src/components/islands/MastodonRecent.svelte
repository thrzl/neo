<script lang="ts">
    import dayjs from "dayjs";
    import relativeTime from "dayjs/plugin/relativeTime";

    dayjs.extend(relativeTime);

    type MastodonPost = {
        created_at: string;
        content: string;
        url: string;
    };

    function htmlDecode(input: string) {
        const doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }

    async function getStatus() {
        const res = await fetch(
            "https://wetdry.world/api/v1/accounts/114383870712581026/statuses?exclude_replies=true&exclude_reblogs=true&limit=1",
        );
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        // console.log(await res.json())
        const raw_data: MastodonPost[] = await res.json();
        return raw_data[0];
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
    function swapEmojis(text: string) {
        for (const [emoji, img] of Object.entries(emoji_map)) {
            text.replace(emoji, img);
        }
        return text;
    }
    // const timeAgo = new Intl.RelativeTimeFormat("en", { style: "short" });
</script>

{#await status}
    <span class="italic op-75 text-sm">right now &nbsp;</span>
    <p class="text-base line-height-tight">fetching latest post...</p>
{:then status}
    <span class="italic op-75 text-sm"
        >{dayjs(new Date(status.created_at)).fromNow()}&nbsp;</span
    >
    <p class="text-base line-height-tight">
        {swapEmojis(htmlDecode(status.content))}
    </p>
{:catch error}
    <div class="text-red-500">error: {error.message}</div>
{/await}
