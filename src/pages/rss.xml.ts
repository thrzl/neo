import rss from '@astrojs/rss'
const blogPosts = Object.values(
    import.meta.glob("./**/*.md", {
        eager: true,
    }),
).sort((a, b) => a.date.localeCompare(b.date));

export function GET(context) {
    return rss({
        title: "thrizzle's garden",
        description: "my hopes, dreams, thoughts and my schemes",
        site: context.site,
        items: blogPosts.map((post) => ({title: post.frontmatter.title, description: post.frontmatter.description, pubDate: post.frontmatter.date, link: post.url, content: post.rawContent()}))
    })
}