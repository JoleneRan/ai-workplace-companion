import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useState } from "react";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useAiGeneration } from "@/hooks/use-ai-generation";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Generate professional workplace emails with adjustable tone and length using AI.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "AI-written workplace emails with tone and length control.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const SYSTEM =
  "You are an expert workplace communication assistant. Write complete, ready-to-send professional emails. Include a subject line, greeting, body and sign-off. Match the requested tone and length precisely. Never use placeholder text like [Your Name] unless the user gave no name.";

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState("Formal");
  const [detail, setDetail] = useState([40]);
  const ai = useAiGeneration();

  const loadSample = () => {
    setRecipient("Priya Nair, Head of Operations at Northwind Logistics (external client)");
    setPurpose("Ask for a two-week extension on the Q4 warehouse audit deliverable");
    setKeyPoints(
      "- Data handover from their IT team arrived 9 days late\n- New deadline requested: 14 November\n- We will still deliver the interim findings on the original date\n- Offer a 20-minute call on Thursday to align",
    );
    setTone("Formal");
    setDetail([55]);
  };

  const generate = () => {
    const level = detail[0] ?? 50;
    const conciseness =
      level < 33 ? "brief and to the point" : level > 66 ? "detailed and thorough" : "balanced in length";
    void ai.run(SYSTEM, [
      {
        role: "user",
        content: `Write a workplace email.\n\nRecipient / context: ${recipient}\nPurpose: ${purpose}\nKey points to include:\n${keyPoints}\n\nTone: ${tone}\nLength: ${conciseness} (conciseness setting ${detail[0]}/100).`,
      },
    ]);
  };

  const disabled = !purpose.trim() || ai.isLoading;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form
        className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!disabled) generate();
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold">Email brief</h2>
          <Button type="button" variant="ghost" size="sm" onClick={loadSample}>
            Load sample data
          </Button>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="recipient">Recipient & context</Label>
          <Input
            id="recipient"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            placeholder="e.g. My manager, Alex — weekly project sync"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="purpose">Purpose</Label>
          <Input
            id="purpose"
            value={purpose}
            onChange={(event) => setPurpose(event.target.value)}
            placeholder="e.g. Request a deadline extension"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="points">Key points</Label>
          <Textarea
            id="points"
            rows={6}
            value={keyPoints}
            onChange={(event) => setKeyPoints(event.target.value)}
            placeholder="One point per line"
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-2 sm:items-end sm:gap-4">
          <div className="grid gap-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Conciseness</Label>
            <Slider value={detail} onValueChange={setDetail} max={100} step={1} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Brief</span>
              <span>Detailed</span>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={disabled} className="mt-auto">
          <Send className="size-4" />
          {ai.isLoading ? "Generating…" : "Generate email"}
        </Button>
      </form>

      <AiOutput
        title="Generated email"
        emptyHint="Fill in the brief and generate — your email will appear here, fully editable."
        text={ai.text}
        onTextChange={ai.setText}
        status={ai.status}
        error={ai.error}
        onRegenerate={ai.canRegenerate ? ai.regenerate : generate}
      />
    </div>
  );
}
