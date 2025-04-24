import rss from '@astrojs/rss'
import { getCollection, render } from 'astro:content';
// const blogPosts = Object.values(
//     import.meta.glob("./**/*.md", {
//         eager: true,
//     }),
// ).sort((a, b) => a.date.localeCompare(b.date));

export async function GET(context) {
    const blogPosts = await getCollection('blog')
    console.log(context, context.site)
    return rss({
        title: "thrizzle's garden",
        description: "my hopes, dreams, thoughts and my schemes",
        site: context.site,
        items: blogPosts.map((post) => ({title: post.data.title, description: post.data.description, pubDate: post.data.date, link: `garden/${post.id}`, content: post.body}))
    })
}