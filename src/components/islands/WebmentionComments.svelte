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
    <div class="b-2 p-4 b-green-8 b-dashed">
        <p class="prose"><span class="text-green font-bold">{comment.author.name}</span> {comment.content.text}</p>
        <p class="text-base">written by {comment.author.name}</p>
    </div>
{/each}
{/await}