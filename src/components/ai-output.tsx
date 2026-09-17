import { Check, Copy, RefreshCw, Sparkle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      AI-generated content may contain errors. Review and verify important information before using
      it.
    </p>
  );
}

export function GeneratingIndicator({ label = "Generating" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-2 animate-ping rounded-full bg-primary" />
        <span className="inline-flex size-2 rounded-full bg-primary" />
      </span>
      {label}
      <span className="animate-pulse">…</span>
    </div>
  );
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={!value.trim()}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

export function AiOutput({
  title,
  emptyHint,
  text,
  onTextChange,
  status,
  error,
  onRegenerate,
  minRows = 14,
}: {
  title: string;
  emptyHint: string;
  text: string;
  onTextChange: (value: string) => void;
  status: "idle" | "loading" | "done" | "error";
  error: string | null;
  onRegenerate: () => void;
  minRows?: number;
}) {
  const showEditor = text.length > 0;

  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <CopyButton value={text} />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onRegenerate}
            disabled={status === "loading"}
          >
            <RefreshCw className={cn("size-4", status === "loading" && "animate-spin")} />
            Regenerate
          </Button>
        </div>
      </div>

      {status === "loading" && !showEditor ? <GeneratingIndicator /> : null}

      {status === "error" ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error ?? "Generation failed."}
        </div>
      ) : null}

      {showEditor ? (
        <>
          {status === "loading" ? <GeneratingIndicator label="Streaming" /> : null}
          <Textarea
            value={text}
            onChange={(event) => onTextChange(event.target.value)}
            rows={minRows}
            className="min-h-64 flex-1 resize-y font-sans text-sm leading-relaxed"
          />
        </>
      ) : status !== "loading" && status !== "error" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
          <Sparkle className="size-6 text-primary" />
          <p className="max-w-sm text-sm text-muted-foreground">{emptyHint}</p>
        </div>
      ) : null}

      <AiDisclaimer />
    </div>
  );
}
