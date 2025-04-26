<script lang="ts">
  import type { WebMention } from "../../lib/types";
  export let baseUrl: string;
  export let slug: string;

  async function getComments() {
    const targets = [
      new URL(`garden/${slug}`, baseUrl).href,
      new URL(`garden/${slug}`, baseUrl).href.concat("/"),
    ];
    const params = `?${targets.map((url) => "target[]=".concat(url)).join("&")}`;
    const webMentionsRes = await fetch(
      "https://webmention.io/api/mentions.jf2".concat(params),
    );
    const webMentionsComments: WebMention = await webMentionsRes.json();
    return webMentionsComments;
  }

  const commentsPromise = getComments();
</script>

{#await commentsPromise}
  <p>loading.....</p>
{:then comments}
  {#if comments.children[0]}
  {#each comments.children as comment}
    <div class="b-2 p-4 b-green-8 b-dashed u-comment h-cite mb-4">
      <img
        src={comment.author.photo}
        alt={`${comment.author.name}'s profile image`}
        class="h-4 inline"
      />
      <a
        href={comment.author.url}
        class="text-green font-bold text-sm italic u-author h-card"
        >{comment.author.name}</a
      >
      <p class="prose text-2xl p-content p-name">{comment.content.text}</p>
      <div class="flex justify-between items-end w-full">
        <time
          class="text-sm dt-published lowercase italic"
          datetime={new Date(comment["wm-received"]).toISOString()}
          >{comment.published ||
            new Date(comment["wm-received"]).toDateString()}</time
        >
        <a
          href={comment.url}
          class="u-url b-b-2 b-green-7 b-dotted hover:text-glow hover:b-green-5"
          >view source</a
        >
      </div>
    </div>
    {/each}
    {:else}
    <div class="b-2 p-4 b-green-8 b-dashed mb-4 justify-center items-center">
      <h1 class="text-center text-xl italic op-50 pointer-events-none">no comments yet...</h1>

    </div>
    {/if}
{/await}
