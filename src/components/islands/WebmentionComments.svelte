<script lang="ts">
    import type { WebMention } from "../../lib/types"
    async function getComments() {
        const webMentionsRes = await fetch("https://webmention.io/api/mentions.jf2?target[]=https://thrizzle.nekoweb.org/garden/90s_00s_design&target[]=https://thrizzle.nekoweb.org/garden/90s_00s_design/")
        const webMentionsComments: WebMention = await webMentionsRes.json()
        console.log(webMentionsComments)
        return webMentionsComments
    }

    const commentsPromise = getComments()
</script>

{#await commentsPromise}
<p>loading.....</p>
{:then comments}
{#each comments.children as comment}
    <div class="b-2 p-4 b-green-8 b-dashed">
        <p class="prose"><span class="text-green font-bold">{comment.author.name}</span> {comment.content.text}</p>
        <p class="text-base">written by {comment.author.name}</p>
    </div>
{/each}
<a href="https://commentpara.de/" class="b-green-7 b-dotted b-b-2 hover:text-shadow-[0_0_0.125rem_white] hover:b-green-5">add your own comment at commentpara.de (or send a webmention!)</a>
{/await}