"use client";

import { useState } from "react";
import { Calendar, ArrowRight, Check, Sparkles, Zap, Brain, Rocket, Terminal, DollarSign, Clock, TrendingUp, Target, GitBranch, ChevronRight } from "lucide-react";
import { CalendlyPopupButton } from "@/components/CalendlyPopup";

const processSteps = [
  {
    id: "discovery",
    icon: Calendar,
    title: "Free Discovery Call",
    description: "30 minutes. We listen to your problem, understand constraints, and map out what an agent solution looks like.",
    duration: "30 min",
    phase: "THINK",
  },
  {
    id: "proposal",
    icon: Brain,
    title: "Technical Proposal",
    description: "We send a detailed spec: architecture, tool choices, memory strategy, eval plan, timeline, and fixed price.",
    duration: "2–3 days",
    phase: "PLAN",
  },
  {
    id: "build",
    icon: Zap,
    title: "Build & Evaluate",
    description: "We build the agent with your team in the loop. Weekly demos. Rigorous evals against your success criteria before any deploy.",
    duration: "2–8 weeks",
    phase: "ACT",
  },
  {
    id: "deploy",
    icon: Rocket,
    title: "Deploy & Handoff",
    description: "Production deploy to your infrastructure. Full docs, runbooks, and knowledge transfer. Optional retained support.",
    duration: "1 week",
    phase: "OBSERVE",
  },
];

const engagementModels = [
  {
    id: "full-build",
    label: "Full Build",
    description: "We design, build, test, and deploy. You own the code and IP. Best for net-new agents.",
    idealFor: "New capabilities, complex workflows, 0→1",
    icon: Sparkles,
    color: "var(--phase-think)",
  },
  {
    id: "co-build",
    label: "Co-Build",
    description: "Your engineers + our architects. We pair on the hard parts (orchestration, evals, memory). You ship faster.",
    idealFor: "Teams with eng capacity, need expertise",
    icon: GitBranch,
    color: "var(--phase-plan)",
  },
  {
    id: "audit-rescue",
    label: "Audit & Rescue",
    description: "Your agent exists but fails in production. We diagnose, fix the architecture, and get it reliable.",
    idealFor: "Stuck projects, reliability issues, scaling",
    icon: Target,
    color: "var(--phase-act)",
  },
];

const includedItems = [
  { icon: Sparkles, title: "Production-ready agent", desc: "Not a prototype. Deployed to your infra with monitoring." },
  { icon: Brain, title: "Eval suite", desc: "Automated tests for correctness, latency, cost. CI-integrated." },
  { icon: Zap, title: "Observability", desc: "Tracing, token/cost tracking, alerting. Day-one visibility." },
  { icon: Rocket, title: "Knowledge transfer", desc: "Runbooks, architecture docs, team training session." },
  { icon: Check, title: "Code ownership", desc: "You own everything. MIT-licensed. No vendor lock-in." },
  { icon: Calendar, title: "30-day warranty", desc: "Post-launch support included. We fix regressions free." },
  { icon: Sparkles, title: "Model-agnostic", desc: "Works with any LLM provider. Swap models without rewrites." },
  { icon: Terminal, title: "Memory & tools", desc: "Persistent memory, custom tools, human-in-the-loop gates." },
];

export default function Pricing() {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  return (
    <section id="pricing" className="relative bg-[var(--bg)] text-[var(--fg)] overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.03] grid-pattern" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-elevated)] text-xs font-mono text-[var(--fg-muted)] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse-subtle" />
            Custom Engagements
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] text-[var(--fg)] mb-5">
            No fixed tiers.
            <br />
            <span className="text-[var(--fg-muted)] font-normal">We build what you need.</span>
          </h2>
          <p className="text-lg text-[var(--fg-muted)] max-w-xl mx-auto">
            Every agent is different. We start with a free discovery call, then send a fixed-price proposal tailored to your problem.
          </p>
        </div>

        {/* Primary CTA — Discovery Call */}
        <div className="max-w-xl mx-auto mb-12 lg:mb-16">
          <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-7 lg:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-[var(--indigo)]/5" aria-hidden="true" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-md)] bg-[var(--accent-light)] text-[var(--accent)] text-xs font-medium mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                Complimentary
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-[var(--fg)] mb-4">
                Start with a free discovery call
              </h3>
              <p className="text-[var(--fg-muted)] mb-7 max-w-lg mx-auto">
                No sales pitch. We'll understand your use case, sketch the architecture, and give you a clear sense of scope and timeline.
              </p>
              <CalendlyPopupButton
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[var(--radius-md)] bg-[var(--accent)] text-white font-semibold text-base hover:bg-[var(--accent-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
              >
                Book discovery call
                <ArrowRight className="w-5 h-5" />
              </CalendlyPopupButton>
              <p className="mt-4 text-sm text-[var(--fg-subtle)]">
                30 min · No commitment · Technical conversation
              </p>
            </div>
          </div>
        </div>

        {/* Visual Process Flowchart — clean, no expand */}
        <div className="mb-12 lg:mb-16">
          <h3 className="text-center text-2xl lg:text-3xl font-bold text-[var(--fg)] mb-10">
            How an engagement works
          </h3>

          <div className="relative">
            {/* Central timeline */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--border)] to-transparent" aria-hidden="true" />

            <div className="space-y-8 lg:space-y-12">
              {processSteps.map((step, index) => (
                <ProcessFlowStep
                  key={step.id}
                  step={step}
                  index={index}
                  total={processSteps.length}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Engagement Models — Compact Cards */}
        <div className="mb-12 lg:mb-16">
          <h3 className="text-center text-2xl lg:text-3xl font-bold text-[var(--fg)] mb-5">
            Ways we work together
          </h3>
          <p className="text-center text-[var(--fg-muted)] mb-10 max-w-2xl mx-auto">
            Choose the model that fits your team and timeline. All include production deploy and handoff.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {engagementModels.map((model) => (
              <EngagementCard key={model.id} model={model} />
            ))}
          </div>
        </div>

        {/* What's Included — Compact Grid */}
        <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-7 lg:p-10">
          <h3 className="text-center text-2xl lg:text-3xl font-bold text-[var(--fg)] mb-8">
            Every engagement includes
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {includedItems.map((item) => (
              <IncludedItem key={item.title} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessFlowStep({
  step,
  index,
  total,
}: {
  step: typeof processSteps[0];
  index: number;
  total: number;
}) {
  const isLeft = index % 2 === 0;
  const phaseColors = {
    THINK: "var(--phase-think)",
    PLAN: "var(--phase-plan)",
    ACT: "var(--phase-act)",
    OBSERVE: "var(--phase-observe)",
  };
  const phaseColor = phaseColors[step.phase as keyof typeof phaseColors];

  return (
    <div className={`relative flex flex-col lg:flex-row ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"} items-start gap-4 lg:gap-10`}>
      {/* Timeline marker & connector */}
      <div className="relative flex-shrink-0 w-12 lg:w-16 flex flex-col items-center lg:self-start">
        {/* Connector line to next - vertical on mobile, horizontal on desktop */}
        {index < total - 1 && (
          <div className="absolute left-1/2 top-8 w-px h-full -translate-x-1/2 lg:left-auto lg:top-0 lg:w-full lg:h-px lg:-translate-x-0 lg:-translate-y-1/2 bg-gradient-to-b lg:bg-gradient-to-r from-[var(--border)] to-transparent" aria-hidden="true" />
        )}

        {/* Step number circle */}
        <div className="relative z-10 w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center border-3"
          style={{
            borderColor: phaseColor,
            backgroundColor: "var(--bg-elevated)",
            boxShadow: `0 0 0 4px ${phaseColor}20`,
          }}
        >
          <span className="text-xl lg:text-2xl font-bold" style={{ color: phaseColor }}>
            {index + 1}
          </span>
          {/* Phase indicator ring */}
          <div className="absolute -inset-1.5 rounded-full border-2 border-dashed" style={{ borderColor: phaseColor, opacity: 0.4 }} />
        </div>

        {/* Duration label */}
        <span className="mt-2 text-[11px] font-mono text-[var(--fg-subtle)] whitespace-nowrap text-center">{step.duration}</span>
      </div>

      {/* Step content */}
      <div className="flex-1 w-full lg:max-w-md">
        <div className="relative rounded-[var(--radius-xl)] border p-5 lg:p-7 bg-[var(--bg-elevated)]/50 backdrop-blur-sm"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Phase badge */}
          <div className="absolute -top-3 left-5 lg:left-7 px-3 py-1 rounded-[var(--radius-full)] text-[10px] font-mono font-medium text-white"
            style={{ backgroundColor: phaseColor }}
          >
            {step.phase}
          </div>

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-11 h-11 rounded-[var(--radius-md)] flex items-center justify-center transition-transform duration-300"
              style={{ backgroundColor: `${phaseColor}15` }}
            >
              <step.icon className="w-5 h-5" style={{ color: phaseColor }} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[var(--fg)] mb-2">{step.title}</h4>
              <p className="text-sm text-[var(--fg-muted)]">{step.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EngagementCard({
  model,
}: {
  model: typeof engagementModels[0];
}) {
  const Icon = model.icon;

  return (
    <article className="relative rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)]/50 backdrop-blur-sm p-5 lg:p-7 hover:border-[var(--border-strong)] transition-colors flex flex-col h-full">
      {/* Phase color top bar */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: model.color }} />

      {/* Header: icon + title + idealFor — fixed height */}
      <div className="flex items-start gap-3 mb-4 flex-shrink-0">
        <div className="flex-shrink-0 w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center" style={{ backgroundColor: `${model.color}15` }}>
          <Icon className="w-5 h-5" style={{ color: model.color }} />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-[var(--fg)]">{model.label}</h4>
          <p className="text-sm text-[var(--fg-subtle)]">{model.idealFor}</p>
        </div>
      </div>

      {/* Description — fills remaining space */}
      <p className="text-[var(--fg-muted)] mb-5 flex-1">{model.description}</p>

      {/* CTA button — anchored at bottom */}
      <CalendlyPopupButton
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors flex-shrink-0 mt-auto self-start"
        style={{
          backgroundColor: "transparent",
          color: model.color,
          borderColor: model.color,
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        Book a call
        <ArrowRight className="w-4 h-4 transition-transform hover:translate-x-1" />
      </CalendlyPopupButton>
    </article>
  );
}

function IncludedItem({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="group relative rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)]/50 backdrop-blur-sm p-4 hover:border-[var(--border-strong)] transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-[var(--radius-md)] bg-[var(--accent-light)] flex items-center justify-center group-hover:scale-105 transition-transform">
          <Icon className="w-4.5 h-4.5 text-[var(--accent)]" />
        </div>
        <div>
          <h5 className="font-medium text-[var(--fg)] text-sm">{title}</h5>
          <p className="text-[12px] text-[var(--fg-muted)] mt-0.5">{desc}</p>
        </div>
      </div>
      {/* Subtle hover accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
    </div>
  );
}