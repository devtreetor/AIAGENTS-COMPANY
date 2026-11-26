"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Terminal, CheckCircle, Clock, DollarSign, TrendingUp, Activity } from "lucide-react";
import { CalendlyPopupButton } from "@/components/CalendlyPopup";

interface TraceStep {
  phase: string;
  content: string;
}

interface CaseStudy {
  id: string;
  company: string;
  agent: string;
  problem: string;
  solution: string;
  trace: TraceStep[];
  metrics: { time: string; cost: string; tokens: string; accuracy: string };
  schedule: string;
  sparklineData: number[];
}

const caseStudies: CaseStudy[] = [
  {
    id: "revenue-intel",
    company: "FinTech Series B",
    agent: "Revenue Intelligence Agent",
    problem: "Manual CRM analysis taking 20h/week. Missed upsell signals.",
    solution: "Agent queries Snowflake, enriches via Clearbit, scores accounts, drafts Slack alerts.",
    trace: [
      { phase: "THINK", content: "Identify accounts with usage growth >30% but no expansion ARR" },
      { phase: "PLAN", content: "Query warehouse → enrich firmographics → score → notify reps" },
      { phase: "ACT", content: 'snowflake.query("SELECT ...") → clearbit.enrich() → score_model.predict()' },
      { phase: "OBSERVE", content: "47 accounts flagged. $2.3M pipeline surfaced. 3 conversions in week 1." },
    ],
    metrics: { time: "4.2s", cost: "$0.08", tokens: "3.1k", accuracy: "94%" },
    schedule: "Every Monday 06:00 UTC",
    sparklineData: [12, 19, 15, 28, 22, 35, 31, 42, 38, 47, 44, 52],
  },
  {
    id: "incident-response",
    company: "Cloud Infrastructure",
    agent: "Incident Response Agent",
    problem: "PagerDuty noise. 40% false positives. Mean time to acknowledge: 12min.",
    solution: "Agent correlates alerts, checks runbooks, enriches with context, proposes remediation.",
    trace: [
      { phase: "THINK", content: "Alert: p99 latency spike on payments-api. Check dependencies." },
      { phase: "PLAN", content: "Check upstream services → recent deploys → capacity → runbook" },
      { phase: "ACT", content: "datadog.query() → github.recent_deploys() → k8s.get_pods() → runbook.match()" },
      { phase: "OBSERVE", content: "Root cause: payments-db connection pool exhausted. Runbook: scale pool + restart." },
    ],
    metrics: { time: "2.8s", cost: "$0.04", tokens: "1.9k", accuracy: "91%" },
    schedule: "Event-driven (PagerDuty webhook)",
    sparklineData: [8, 12, 9, 15, 11, 18, 14, 22, 19, 25, 23, 28],
  },
  {
    id: "contract-review",
    company: "Legal Services",
    agent: "Contract Review Agent",
    problem: "600+ vendor contracts/year. Manual review: 45min each. Inconsistent risk flags.",
    solution: "Agent extracts clauses, scores risk against playbook, generates redline suggestions.",
    trace: [
      { phase: "THINK", content: "New MSA uploaded. Identify liability, IP, data, termination clauses." },
      { phase: "PLAN", content: "Parse PDF → extract clauses → score against playbook → generate redlines" },
      { phase: "ACT", content: "pdf.parse() → clause_extractor() → risk_scorer(playbook) → redline_generator()" },
      { phase: "OBSERVE", content: "12 high-risk clauses found. 3 non-standard. Review time: 45min → 8min." },
    ],
    metrics: { time: "8.5s", cost: "$0.22", tokens: "8.7k", accuracy: "96%" },
    schedule: "On-demand (SharePoint webhook)",
    sparklineData: [45, 42, 38, 35, 31, 28, 24, 20, 16, 12, 9, 8],
  },
  {
    id: "code-migration",
    company: "E-commerce Platform",
    agent: "Legacy Migration Agent",
    problem: "200k LOC legacy PHP → Node.js. Manual estimate: 18 months.",
    solution: "Agent analyzes dependencies, generates migration plan, translates modules with tests.",
    trace: [
      { phase: "THINK", content: "Map PHP service boundaries. Identify shared state. Prioritize by risk." },
      { phase: "PLAN", content: "Static analysis → dependency graph → module order → test strategy" },
      { phase: "ACT", content: "phpstan.analyze() → ast.parse() → ts.transpile() → jest.generate_tests()" },
      { phase: "OBSERVE", content: "12 services migrated. 84% test coverage. 6 months → 11 weeks." },
    ],
    metrics: { time: "15.2s", cost: "$0.67", tokens: "24.3k", accuracy: "89%" },
    schedule: "Batch (GitHub Actions nightly)",
    sparklineData: [5, 12, 22, 35, 48, 55, 62, 70, 76, 80, 83, 84],
  },
];

const phaseColors: Record<string, string> = {
  THINK: "var(--phase-think)",
  PLAN: "var(--phase-plan)",
  ACT: "var(--phase-act)",
  OBSERVE: "var(--phase-observe)",
};

const metricConfigs = [
  { key: "time", label: "Latency", icon: Clock, unit: "s", color: "var(--accent)" },
  { key: "cost", label: "Cost/Run", icon: DollarSign, unit: "", color: "var(--emerald)" },
  { key: "tokens", label: "Tokens", icon: TrendingUp, unit: "k", color: "var(--indigo)" },
  { key: "accuracy", label: "Accuracy", icon: CheckCircle, unit: "%", color: "var(--phase-observe)" },
] as const;

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animatedMetrics, setAnimatedMetrics] = useState<Record<string, number>>({});

  const study = caseStudies[currentIndex];

  // Animate metrics on study change
  useEffect(() => {
    const targetMetrics: Record<string, number> = {};
    Object.entries(study.metrics).forEach(([key, value]) => {
      const num = parseFloat(value.replace(/[^0-9.]/g, ""));
      targetMetrics[key] = num;
    });

    Object.keys(targetMetrics).forEach((key, i) => {
      setTimeout(() => {
        animateValue(key, 0, targetMetrics[key], 800);
      }, i * 150);
    });
  }, [currentIndex]);

  const animateValue = (key: string, start: number, end: number, duration: number) => {
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setAnimatedMetrics(prev => ({ ...prev, [key]: current }));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? caseStudies.length - 1 : prev - 1));
    setAnimatedMetrics({});
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === caseStudies.length - 1 ? 0 : prev + 1));
    setAnimatedMetrics({});
  }, []);

  return (
    <section id="testimonials" className="relative bg-[var(--bg)] text-[var(--fg)] overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.03] grid-pattern" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-elevated)] text-xs font-mono text-[var(--fg-muted)] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse-subtle" />
            Production traces
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] text-[var(--fg)] mb-5">
            Real agents.
            <br />
            <span className="text-[var(--fg-muted)] font-normal">Real results.</span>
          </h2>
          <p className="text-lg text-[var(--fg-muted)] max-w-xl mx-auto">
            These are actual production traces from client engagements.
            Names anonymized. Metrics verbatim.
          </p>
        </div>

        {/* Main Dashboard — balanced two-column layout */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-start">
          {/* Left: Context + Metrics + Details */}
          <div className="space-y-6">
            {/* Company + Agent Header */}
            <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)]/50 backdrop-blur-sm p-5 lg:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono text-[var(--fg-muted)] uppercase tracking-wider">{study.company}</p>
                  <h3 className="text-xl lg:text-2xl font-bold text-[var(--fg)]">{study.agent}</h3>
                </div>
              </div>

              {/* 2x2 Metric Grid — balanced, not cramped */}
              <div className="grid grid-cols-2 gap-4">
                {metricConfigs.map((config, i) => {
                  const rawValue = study.metrics[config.key as keyof typeof study.metrics];
                  const animatedValue = animatedMetrics[config.key];
                  const displayValue = animatedValue !== undefined ? animatedValue : parseFloat(rawValue.replace(/[^0-9.]/g, ""));
                  const isAnimated = animatedValue !== undefined;

                  return (
                    <MetricCard
                      key={config.key}
                      label={config.label}
                      value={displayValue}
                      rawValue={rawValue}
                      isAnimated={isAnimated}
                      index={i}
                      icon={config.icon}
                      color={config.color}
                    />
                  );
                })}
              </div>

              {/* Schedule info */}
              <div className="flex flex-wrap gap-3 text-xs pt-4 border-t border-[var(--border)]">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] bg-[var(--bg-subtle)] border border-[var(--border)]">
                  <span className="font-mono text-[var(--fg-subtle)]">Schedule</span>
                  <span className="font-mono text-[var(--fg)]">{study.schedule}</span>
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] bg-[var(--bg-subtle)] border border-[var(--border)]">
                  <span className="font-mono text-[var(--fg-subtle)]">Trigger</span>
                  <span className="font-mono text-[var(--fg)]">{study.schedule.includes("Event") ? "Webhook" : "Cron"}</span>
                </span>
              </div>
            </div>

            {/* Problem / Solution */}
            <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)]/50 backdrop-blur-sm p-5 lg:p-7">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs font-mono text-[var(--fg-subtle)] uppercase tracking-wider mb-2">Problem</p>
                  <p className="text-[var(--fg-muted)]">{study.problem}</p>
                </div>
                <div className="pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-[var(--border)]">
                  <p className="text-xs font-mono text-[var(--fg-subtle)] uppercase tracking-wider mb-2">Solution</p>
                  <p className="text-[var(--fg-muted)]">{study.solution}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual Analysis — Sparkline + Trace */}
          <div className="space-y-6">
            {/* Sparkline Trend */}
            <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)]/50 backdrop-blur-sm p-5 lg:p-7">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[var(--accent)]" />
                  <span className="font-semibold text-[var(--fg)]">Execution Trend</span>
                </div>
                <span className="text-xs font-mono text-[var(--fg-subtle)]">{study.schedule}</span>
              </div>
              <Sparkline
                data={study.sparklineData}
                color="var(--accent)"
                height={70}
                showPoints={true}
                currentIndex={study.sparklineData.length - 1}
              />
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-[var(--fg-muted)]">First run</span>
                <span className="font-mono text-[var(--fg)]">{study.sparklineData[0]}</span>
                <span className="text-[var(--fg-muted)]">Latest run</span>
                <span className="font-mono text-[var(--fg)]">{study.sparklineData[study.sparklineData.length - 1]}</span>
              </div>
            </div>

            {/* Live Trace Panel — flex to fill height */}
            <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)]/50 backdrop-blur-sm overflow-hidden shadow-[var(--shadow-xl)] flex flex-col min-h-[420px]">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-subtle)]/50 flex-shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[var(--accent)]/60" />
                  <div className="w-3 h-3 rounded-full bg-[var(--accent)]/40" />
                  <div className="w-3 h-3 rounded-full bg-[var(--accent)]/20" />
                </div>
                <span className="ml-4 text-xs font-mono text-[var(--fg-subtle)]">agent.trace.{study.id}.ts</span>
                <div className="ml-auto flex items-center gap-2 text-xs text-[var(--fg-subtle)]">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--phase-observe)] animate-pulse-subtle" />
                    COMPLETE
                  </span>
                </div>
              </div>

              {/* Trace content — scrollable, fills remaining space */}
              <div className="p-4 lg:p-6 font-mono text-sm leading-relaxed flex-1 overflow-y-auto">
                {study.trace.map((step, idx) => (
                  <TraceStepItem
                    key={idx}
                    step={step}
                    index={idx}
                    delay={idx * 150}
                  />
                ))}

                {/* Completion indicator */}
                <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center gap-3 text-[var(--accent)] flex-shrink-0">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">Trace complete. Agent idle.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-14 flex items-center justify-center gap-3">
          <button
            onClick={goToPrev}
            className="p-3 rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Previous case study"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-1.5">
            {caseStudies.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentIndex(i); setAnimatedMetrics({}); }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "bg-[var(--fg)] w-8"
                    : "bg-[var(--fg-subtle)] hover:bg-[var(--fg-muted)]"
                }`}
                aria-label={`View case study ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="p-3 rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Next case study"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-[var(--fg-muted)] mb-4">Want to see what an agent would look like for your use case?</p>
          <CalendlyPopupButton
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[var(--radius-md)] bg-[var(--accent)] text-white font-semibold text-base hover:bg-[var(--accent-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
          >
            Book discovery call
            <ChevronRight className="w-5 h-5" />
          </CalendlyPopupButton>
        </div>
      </div>
    </section>
  );
}

function Sparkline({
  data,
  color,
  height = 60,
  showPoints = false,
  currentIndex = -1,
}: {
  data: number[];
  color: string;
  height?: number;
  showPoints?: boolean;
  currentIndex?: number;
}) {
  const width = 100;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 20) - 10;
    return `${x}% ${y}px`;
  }).join(" ");

  return (
    <div className="relative h-[60px] w-full" style={{ height: `${height}px` }}>
      <svg className="w-full h-full" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M${points} L${width}% ${height} L0% ${height} Z`}
          fill="url(#sparkline-gradient)"
        />
        <path
          d={`M${points}`}
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw"
          style={{ strokeDasharray: "300", strokeDashoffset: "300" }}
        />
        {showPoints && data.map((value, i) => (
          <circle
            key={i}
            cx={`${(i / (data.length - 1)) * width}%`}
            cy={`${height - ((value - min) / range) * (height - 20) - 10}px`}
            r={i === currentIndex ? 4 : 3}
            fill={i === currentIndex ? color : "var(--bg)"}
            stroke={color}
            strokeWidth={i === currentIndex ? 0 : 2}
            className="animate-pop"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </svg>
      <style jsx>{`
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes pop { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .animate-draw { animation: draw 1.2s ease-out forwards; }
        .animate-pop { animation: pop 0.4s ease-out backwards; }
      `}</style>
    </div>
  );
}

function MetricCard({
  label,
  value,
  rawValue,
  isAnimated,
  index,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  rawValue: string;
  isAnimated: boolean;
  index: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const displayValue = isAnimated ? formatAnimatedValue(label, value) : rawValue;

  return (
    <div className="relative rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)]/50 backdrop-blur-sm p-4 lg:p-5 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-2 text-[var(--fg-subtle)] text-xs mb-2">
        <span style={{ color }}><Icon className="w-4 h-4" /></span>
        <span className="uppercase tracking-wider">{label}</span>
      </div>
      <div className="relative">
        <span className={`text-2xl lg:text-3xl font-bold font-mono text-[var(--fg)] ${isAnimated ? "animate-counter" : ""}`}>
          {displayValue}
        </span>
      </div>
      <div className="mt-2 h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${Math.min((value / parseFloat(rawValue.replace(/[^0-9.]/g, ""))) * 100, 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function formatAnimatedValue(label: string, value: number): string {
  if (label === "Latency") return `${value.toFixed(1)}s`;
  if (label === "Cost/Run") return `$${value.toFixed(2)}`;
  if (label === "Tokens") return `${value.toFixed(1)}k`;
  if (label === "Accuracy") return `${value.toFixed(0)}%`;
  return value.toString();
}

function TraceStepItem({ step, index, delay }: { step: TraceStep; index: number; delay: number }) {
  return (
    <div
      className={`mb-3 pb-3 border-b border-[var(--border)]/50 last:border-0 last:pb-0 animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-baseline gap-3">
        <span className={`flex-shrink-0 w-20 text-right font-mono text-xs`} style={{ color: phaseColors[step.phase] }}>
          {step.phase}
        </span>
        <span className="flex-1 text-[var(--fg-muted)] break-all">{step.content}</span>
      </div>
    </div>
  );
}