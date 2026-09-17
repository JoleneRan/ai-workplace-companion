import { createFileRoute } from "@tanstack/react-router";

function extractText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export const Route = createFileRoute("/api/fetch-url")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { url } = (await request.json()) as { url?: string };
        if (!url || !/^https?:\/\//i.test(url)) {
          return Response.json({ ok: false, error: "That does not look like a valid URL." });
        }
        try {
          const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; AIWorkplaceAssistant/1.0)" },
            signal: request.signal,
          });
          if (!res.ok) {
            return Response.json({
              ok: false,
              error: `The page could not be retrieved (HTTP ${res.status}).`,
            });
          }
          const text = extractText(await res.text());
          if (text.length < 200) {
            return Response.json({
              ok: false,
              error: "The page was reached but no readable article text could be extracted.",
            });
          }
          return Response.json({ ok: true, text: text.slice(0, 24000) });
        } catch {
          return Response.json({
            ok: false,
            error: "The page could not be reached. It may be private, blocked, or offline.",
          });
        }
      },
    },
  },
});
