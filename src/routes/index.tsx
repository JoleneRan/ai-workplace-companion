import { createFileRoute, Link } from "@tanstack/react-router";
import { BotMessageSquare, CalendarClock, Mail, Telescope } from "lucide-react";
import { AiDisclaimer } from "@/components/ai-output";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "An AI dashboard for workplace tasks: write emails, plan your week, research topics and chat with an assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "AI tools for emails, task planning, research and workplace chat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    description: "Draft a complete, professional email from a short brief, tone and key points.",
  },
  {
    to: "/planner" as const,
    icon: CalendarClock,
    title: "AI Task Planner",
    description: "Turn a messy task list into a prioritised daily or weekly time-blocked plan.",
  },
  {
    to: "/research" as const,
    icon: Telescope,
    title: "AI Research Assistant",
    description: "Summaries, key insights and recommendations from a topic, document or link.",
  },
  {
    to: "/chat" as const,
    icon: BotMessageSquare,
    title: "AI Workplace Chat",
    description: "Ask anything: writing, planning, brainstorming or professional questions.",
  },
];

function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <section className="surface-glow rounded-2xl border p-6 sm:p-8">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          AI-first workspace
        </p>
        <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
          Get workplace work done, faster
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Every result here is generated live by an AI model from the context you provide. Nothing is
          stored — close the tab and it's gone.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Tip: press <kbd className="rounded border bg-muted px-1.5 py-0.5">⌘K</kbd> /{" "}
          <kbd className="rounded border bg-muted px-1.5 py-0.5">Ctrl K</kbd> to jump between tools.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.to}
            to={tool.to}
            className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent/40"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <tool.icon className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold">{tool.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
          </Link>
        ))}
      </section>

      <AiDisclaimer />
    </div>
  );
}
