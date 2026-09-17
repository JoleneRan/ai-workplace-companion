import { useCallback, useRef, useState } from "react";
import { streamAi, type AiMessage } from "@/lib/ai";

type Status = "idle" | "loading" | "done" | "error";

export function useAiGeneration() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const lastRequest = useRef<{ system: string; messages: AiMessage[] } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async (system: string, messages: AiMessage[]) => {
    lastRequest.current = { system, messages };
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setError(null);
    setText("");
    try {
      await streamAi({
        system,
        messages,
        signal: controller.signal,
        onDelta: setText,
      });
      setStatus("done");
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      setError((err as Error).message || "Something went wrong while generating.");
      setStatus("error");
    }
  }, []);

  const regenerate = useCallback(() => {
    const last = lastRequest.current;
    if (last) void run(last.system, last.messages);
  }, [run]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setText("");
    setStatus("idle");
    setError(null);
  }, []);

  return {
    text,
    setText,
    status,
    error,
    run,
    regenerate,
    reset,
    canRegenerate: lastRequest.current !== null,
    isLoading: status === "loading",
  };
}
