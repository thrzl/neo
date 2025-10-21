import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { JSDOM } from "jsdom";

function makeAbsoluteUrls(html: string, baseUrl: URL) {
  const { document: doc }: { document: Document } = new JSDOM(html).window;

  const imgsRaw: HTMLCollectionOf<HTMLImageElement> =
    doc.getElementsByTagName("img");
  for (const img of imgsRaw) {
    if (img.src && !img.src.startsWith(baseUrl.href)) {
      img.src = new URL(img.src, baseUrl.href).href;
    }
  }

  const aRaw: HTMLCollectionOf<HTMLAnchorElement> =
    doc.getElementsByTagName("a");
  for (const a of aRaw) {
    if (a.href && !a.href.startsWith(baseUrl.href)) {
      a.href = new URL(a.href, baseUrl.href).href;
    }
  }

  return doc.body.innerHTML;
}

export async function GET({ site }: { site: string }) {
  const blogPosts = (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .reverse();
  return rss({
    title: "thrizzle's garden",
    description: "my hopes, dreams, thoughts and my schemes",
    site: site,
    trailingSlash: false,
    items: blogPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `garden/${post.id}`,
      content: makeAbsoluteUrls(post.rendered!.html, new URL(site)),
    })),
  });
}
