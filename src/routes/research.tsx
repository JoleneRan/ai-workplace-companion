import { createFileRoute } from "@tanstack/react-router";
import { Telescope } from "lucide-react";
import { useState } from "react";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAiGeneration } from "@/hooks/use-ai-generation";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Summarise topics, articles or links into insights and recommendations with AI.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "AI summaries, key insights and recommendations for work research.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

const SYSTEM =
  "You are a rigorous workplace research analyst. Always answer with three markdown sections: '## Summary', '## Key Insights' (bullets) and '## Recommendations' (numbered, actionable, workplace-oriented). Be specific and substantive; never produce filler or generic placeholder text. If the provided source material is missing or insufficient, say so plainly instead of inventing content. When working from a topic without source text, rely on your own knowledge and note where verification is needed.";

type Mode = "topic" | "content" | "url";

function ResearchPage() {
  const [mode, setMode] = useState<Mode>("topic");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const ai = useAiGeneration();

  const generate = async () => {
    setFetchError(null);

    if (mode === "url") {
      setFetching(true);
      try {
        const res = await fetch("/api/fetch-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = (await res.json()) as { ok: boolean; text?: string; error?: string };
        if (!data.ok || !data.text) {
          setFetchError(
            `${data.error ?? "The content could not be retrieved."} Nothing was summarised — paste the text directly instead.`,
          );
          return;
        }
        void ai.run(SYSTEM, [
          {
            role: "user",
            content: `Analyse the following content retrieved from ${url}:\n\n${data.text}`,
          },
        ]);
      } finally {
        setFetching(false);
      }
      return;
    }

    if (mode === "content") {
      void ai.run(SYSTEM, [
        { role: "user", content: `Analyse this pasted content:\n\n${content}` },
      ]);
      return;
    }

    void ai.run(SYSTEM, [
      { role: "user", content: `Research this workplace topic and analyse it: ${topic}` },
    ]);
  };

  const busy = ai.isLoading || fetching;
  const disabled =
    busy ||
    (mode === "topic" ? !topic.trim() : mode === "content" ? !content.trim() : !url.trim());

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form
        className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!disabled) void generate();
        }}
      >
        <h2 className="text-base font-semibold">Research input</h2>

        <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
          <TabsList className="w-full">
            <TabsTrigger value="topic" className="flex-1">
              Topic
            </TabsTrigger>
            <TabsTrigger value="content" className="flex-1">
              Paste content
            </TabsTrigger>
            <TabsTrigger value="url" className="flex-1">
              URL
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {mode === "topic" ? (
          <div className="grid gap-2">
            <Label htmlFor="topic">Topic or question</Label>
            <Textarea
              id="topic"
              rows={5}
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g. How are mid-sized firms structuring hybrid work policies in 2026?"
            />
          </div>
        ) : mode === "content" ? (
          <div className="grid gap-2">
            <Label htmlFor="content">Article or document text</Label>
            <Textarea
              id="content"
              rows={12}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Paste the content you want analysed"
            />
          </div>
        ) : (
          <div className="grid gap-2">
            <Label htmlFor="url">Link</Label>
            <Input
              id="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/article"
            />
            <p className="text-xs text-muted-foreground">
              If the page can't be read, you'll be told — no summary is invented.
            </p>
          </div>
        )}

        {fetchError ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {fetchError}
          </div>
        ) : null}

        <Button type="submit" disabled={disabled} className="mt-auto">
          <Telescope className="size-4" />
          {fetching ? "Fetching page…" : ai.isLoading ? "Analysing…" : "Analyse"}
        </Button>
      </form>

      <AiOutput
        title="Summary, insights & recommendations"
        emptyHint="Give the assistant a topic, some text, or a link to analyse."
        text={ai.text}
        onTextChange={ai.setText}
        status={ai.status}
        error={ai.error}
        onRegenerate={ai.canRegenerate ? ai.regenerate : () => void generate()}
        minRows={18}
      />
    </div>
  );
}
