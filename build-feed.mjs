import { readFileSync, writeFileSync } from "node:fs";

const sources = JSON.parse(readFileSync("sources.json", "utf8"));
const esc = (s) => s.replace(/&(?!amp;|lt;|gt;|quot;|#)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const items = [];

for (const url of sources) {
  const repo = url.match(/github\.com\/([^/]+\/[^/]+)\//)?.[1] ?? url;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not fetch ${url}: HTTP ${response.status}`);
  const xml = await response.text();
  for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const e = m[1];
    const title = e.match(/<title>([\s\S]*?)<\/title>/)?.[1].trim() ?? "";
    const link = e.match(/<link[^>]*href="([^"]+)"/)?.[1] ?? "";
    const date = e.match(/<updated>([^<]+)/)?.[1] ?? "";
    if (Number.isNaN(Date.parse(date))) {
      console.warn(`skipping undated entry in ${repo}: ${title}`);
      continue;
    }
    items.push({ title, link, date, repo });
  }
}

items.sort((a, b) => b.date.localeCompare(a.date));
const out = items.slice(0, 50).map((i) =>
  `<item><title>${esc(i.title)} | ${i.repo}</title><link>${esc(i.link)}</link><guid>${esc(i.link)}</guid><pubDate>${new Date(i.date).toUTCString()}</pubDate></item>`);

writeFileSync("feed.xml", `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>skill-news</title><link>https://github.com/flisk-sh/skill-news</link><description>New Claude Code skills on GitHub</description>
${out.join("\n")}
</channel></rss>
`);
console.log(`wrote ${out.length} items`);
