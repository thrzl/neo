<script lang="ts">
  import type { WebMention } from "../../env";
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
    <div class="b-2 p-4 b-cover-muted b-dashed u-comment h-cite mb-4">
      <img
        src={comment.author.photo}
        alt={`${comment.author.name}'s profile image`}
        class="h-4 inline"
      />
      <a
        href={comment.author.url}
        class="text-cover-accent font-bold text-sm italic u-author h-card"
        >{comment.author.name}</a
      >
      <p class="prose lg:text-2xl text-4xl p-content p-name">{comment.content.text}</p>
      <div class="flex justify-between items-end w-full">
        <time
          class="text-sm dt-published lowercase italic"
          datetime={new Date(comment["wm-received"]).toISOString()}
          >{comment.published ||
            new Date(comment["wm-received"]).toDateString()}</time
        >
        <a
          href={comment.url}
          class="u-url b-b-2 b-cover-mutedlight b-dotted hover:text-glow hover:b-cover-bright"
          >view source</a
        >
      </div>
    </div>
    {/each}
    {:else}
    <div class="b-2 p-4 b-cover-muted b-dashed mb-4 justify-center items-center">
      <h1 class="text-center text-xl italic op-50 pointer-events-none">no comments yet...</h1>

    </div>
    {/if}
{/await}
