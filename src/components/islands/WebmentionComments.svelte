<script lang="ts">
    import type { WebMention } from "../../lib/types"
    export let baseUrl: string;
    export let slug: string;

    async function getComments() {
        const targets = [new URL(`garden/${slug}`, baseUrl).href, new URL(`garden/${slug}`, baseUrl).href.concat("/")]
        const params = `?${targets.map((url) => "target[]=".concat(url)).join("&")}`
        const webMentionsRes = await fetch('https://webmention.io/api/mentions.jf2'.concat(params))
        const webMentionsComments: WebMention = await webMentionsRes.json()
        return webMentionsComments
    }

    const commentsPromise = getComments()
</script>

{#await commentsPromise}
<p>loading.....</p>
{:then comments}
<form class="mb-4" action="https://webmention.io/thrizzle.nekoweb.org/webmention" method="post">
    <div>
      <div>
        <label for="webmention-form-url">add response from link:</label>
        <input type="url" name="source" class="bg-transparent b-green b-2 px-1 inline" id="webmention-form-url">

        <label for="webmention-form-submit"> &nbsp;</label>
        <input type="submit" value="send webmention" class="inline bg-green-7 px-2 py-1" id="webmention-form-submit">
      </div>
    </div>
    <input type="hidden" name="target" value={new URL(`garden/${slug}`, baseUrl).href}>
  </form>
{#each comments.children as comment}
    <div class="b-2 p-4 b-green-8 b-dashed u-comment h-cite mb-4">
        <img src={comment.author.photo} alt={`${comment.author.name}'s profile image`} class="h-4 inline"/>
        <a href={comment.author.url} class="text-green font-bold text-sm italic u-author h-card">{comment.author.name}</a>
        <p class="prose text-2xl p-content p-name">{comment.content.text}</p>
        <div class="flex justify-between items-end w-full">
            <time class="text-sm dt-published lowercase italic" datetime={new Date(comment["wm-received"]).toISOString()}>{comment.published || new Date(comment["wm-received"]).toDateString()}</time>
        <a href={comment.url} class="u-url b-b-2 b-green-7 b-dotted hover:text-glow hover:b-green-5">view source</a>
    </div>
    </div>
{/each}
{/await}