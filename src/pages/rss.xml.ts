import rss from '@astrojs/rss'
import { getCollection } from 'astro:content';
import {JSDOM} from "jsdom";

function makeAbsoluteUrls(html: string, baseUrl: URL) {
    const {document: doc}: {document: Document} = (new JSDOM(html)).window

    const imgsRaw: HTMLCollection = doc.getElementsByTagName("img")
    for (const img of imgsRaw) {
      if (img.src && !img.src.startsWith(baseUrl)) {
        img.src = new URL(img.src, baseUrl.href).href
      }
    }
    return doc.documentElement.outerHTML
  }
  

export async function GET({ site }: { site: string }) {
    const blogPosts = (await getCollection('blog')).filter(post => !post.data.draft)
    return rss({
        title: "thrizzle's garden",
        description: "my hopes, dreams, thoughts and my schemes",
        site: site,
        trailingSlash: false,
        items: blogPosts.map((post) => ({ title: post.data.title, description: post.data.description, pubDate: post.data.date, link: `garden/${post.id}`, content: makeAbsoluteUrls(post.rendered.html, site) })),
    })
}