import rss from '@astrojs/rss'
import { getCollection } from 'astro:content';

export async function GET({ site }: { site: string }) {
    const blogPosts = (await getCollection('blog')).filter(post => !post.data.draft)
    return rss({
        title: "thrizzle's garden",
        description: "my hopes, dreams, thoughts and my schemes",
        site: site,
        items: blogPosts.map((post) => ({ title: post.data.title, description: post.data.description, pubDate: post.data.date, link: `garden/${post.id}`, content: post.rendered?.html })),
    })
}