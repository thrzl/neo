export async function GET(context) {
    // shoutouts!
    const robots_txt = await fetch("https://github.com/ai-robots-txt/ai.robots.txt/raw/refs/heads/main/robots.txt")
    
    return new Response(await robots_txt.text())
}