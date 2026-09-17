import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useAiGeneration } from "@/hooks/use-ai-generation";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Turn messy task lists into a prioritised daily or weekly schedule with AI.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "AI prioritises your tasks and builds a realistic schedule.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

const SYSTEM =
  "You are an expert productivity coach. Given tasks, deadlines, priorities and available time, prioritise realistically (urgency vs impact), respect the available hours, add focus blocks and short breaks, and flag anything that does not fit or should be deferred/delegated. Output a clean time-blocked schedule with headings, plus a short 'Trade-offs & risks' section.";

const PRESETS = {
  launch: {
    tasks:
      "- Finalise launch landing page copy (due Wed, high)\n- QA signup flow on staging (due Tue, high)\n- Brief support team on new pricing (due Thu, medium)\n- Draft launch announcement email (due Wed, high)\n- Update help centre articles (due Fri, low)\n- Investor update slide (due Fri, medium)",
    hours: "6 focused hours per day, Mon–Fri, plus 2 recurring meetings daily",
    mode: "Weekly",
  },
  review: {
    tasks:
      "- Review team OKR progress (medium)\n- Write weekly status summary for leadership (high, due today 17:00)\n- 1:1 prep notes for 3 reports (medium)\n- Clear inbox backlog (low)\n- Plan next sprint scope (high)",
    hours: "5 hours today, with a 1-hour leadership meeting at 14:00",
    mode: "Daily",
  },
} as const;

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("");
  const [mode, setMode] = useState<string>("Daily");
  const ai = useAiGeneration();

  const applyPreset = (key: keyof typeof PRESETS) => {
    const preset = PRESETS[key];
    setTasks(preset.tasks);
    setHours(preset.hours);
    setMode(preset.mode);
  };

  const generate = () => {
    void ai.run(SYSTEM, [
      {
        role: "user",
        content: `Create a ${mode.toLowerCase()} plan.\n\nTasks with deadlines and priorities:\n${tasks}\n\nAvailable time / constraints: ${hours || "not specified"}`,
      },
    ]);
  };

  const disabled = !tasks.trim() || ai.isLoading;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form
        className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!disabled) generate();
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold">Your workload</h2>
          <div className="flex gap-1">
            <Button type="button" variant="ghost" size="sm" onClick={() => applyPreset("launch")}>
              Project launch
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => applyPreset("review")}>
              Weekly review
            </Button>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tasks">Tasks, deadlines & priorities</Label>
          <Textarea
            id="tasks"
            rows={10}
            value={tasks}
            onChange={(event) => setTasks(event.target.value)}
            placeholder="- Ship pricing page update (due Thu, high)&#10;- Review contractor invoices (due Fri, low)"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="hours">Available time & constraints</Label>
          <Input
            id="hours"
            value={hours}
            onChange={(event) => setHours(event.target.value)}
            placeholder="e.g. 5 hours today, standup at 09:30"
          />
        </div>

        <div className="grid gap-2">
          <Label>Plan type</Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily plan</SelectItem>
              <SelectItem value="Weekly">Weekly plan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={disabled} className="mt-auto">
          <CalendarClock className="size-4" />
          {ai.isLoading ? "Planning…" : "Generate plan"}
        </Button>
      </form>

      <AiOutput
        title="Your schedule"
        emptyHint="Add your tasks and available time — the AI will prioritise them into an editable schedule."
        text={ai.text}
        onTextChange={ai.setText}
        status={ai.status}
        error={ai.error}
        onRegenerate={ai.canRegenerate ? ai.regenerate : generate}
      />
    </div>
  );
}
