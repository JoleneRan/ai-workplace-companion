export type AiMessage = { role: "user" | "assistant"; content: string };

/**
 * Streams a completion from the AI model.
 * The model/provider wiring lives in `src/routes/api/ai.ts` — swap the model id
 * or provider there to connect a different AI key/model.
 */
export async function streamAi(options: {
  system: string;
  messages: AiMessage[];
  onDelta: (fullText: string) => void;
  signal?: AbortSignal;
}): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system: options.system, messages: options.messages }),
    signal: options.signal ?? null,
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || "The AI request failed. Please try again.");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    options.onDelta(text);
  }

  if (!text.trim()) {
    throw new Error("The AI returned an empty response. Try regenerating.");
  }
  return text;
}
