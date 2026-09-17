import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AiDisclaimer, CopyButton, GeneratingIndicator } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { streamAi, type AiMessage } from "@/lib/ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Chat with an AI assistant for workplace writing, planning and brainstorming.",
      },
      { property: "og:title", content: "AI Workplace Chat" },
      {
        property: "og:description",
        content: "An interactive AI assistant for everyday professional work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

const SYSTEM =
  "You are an AI workplace productivity assistant. Help with professional writing, planning, prioritisation, brainstorming, research and general work questions. Be concise but concrete, use markdown structure where it helps, ask a clarifying question when the request is genuinely ambiguous, and never pretend to have accessed a link or system you cannot reach.";

const SUGGESTIONS = [
  "Help me say no to a meeting request politely",
  "Turn these notes into a status update for leadership",
  "Brainstorm 8 ideas to cut our onboarding time in half",
  "How should I prioritise five competing deadlines this week?",
];

function ChatPage() {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [streaming]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const runTurn = async (history: AiMessage[]) => {
    setStreaming(true);
    setError(null);
    setMessages([...history, { role: "assistant", content: "" }]);
    try {
      await streamAi({
        system: SYSTEM,
        messages: history,
        onDelta: (full) => setMessages([...history, { role: "assistant", content: full }]),
      });
    } catch (err) {
      setError((err as Error).message);
      setMessages(history);
    } finally {
      setStreaming(false);
    }
  };

  const send = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || streaming) return;
    setInput("");
    void runTurn([...messages, { role: "user", content: trimmed }]);
  };

  const regenerate = () => {
    const lastUser = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUser === -1) return;
    const cutIndex = messages.length - lastUser;
    void runTurn(messages.slice(0, cutIndex));
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8.5rem)] max-w-3xl flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold">Workplace assistant</h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={regenerate} disabled={streaming || !messages.length}>
            <RefreshCw className="size-4" />
            Regenerate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
            disabled={!messages.length}
          >
            <Trash2 className="size-4" />
            Clear chat
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border bg-card p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              Ask anything about your work — writing, planning, research or ideas.
            </p>
            <div className="grid w-full max-w-lg gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => send(suggestion)}
                  className="rounded-lg border bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={cn("flex flex-col gap-1", message.role === "user" && "items-end")}
            >
              <div
                className={cn(
                  "max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap",
                  message.role === "user"
                    ? "rounded-2xl bg-primary px-4 py-2 text-primary-foreground"
                    : "text-foreground",
                )}
              >
                {message.content ||
                  (streaming && index === messages.length - 1 ? <GeneratingIndicator /> : null)}
              </div>
              {message.role === "assistant" && message.content ? (
                <CopyButton value={message.content} />
              ) : null}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <form
        className="flex items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
      >
        <Textarea
          ref={inputRef}
          value={input}
          rows={2}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send(input);
            }
          }}
          placeholder="Message the assistant…"
          className="min-h-11 flex-1 resize-none"
        />
        <Button type="submit" size="icon" disabled={streaming || !input.trim()} aria-label="Send">
          <ArrowUp className="size-4" />
        </Button>
      </form>
      <AiDisclaimer />
    </div>
  );
}
