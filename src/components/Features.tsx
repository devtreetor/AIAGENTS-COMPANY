"use client";

import { useState, useRef, useEffect } from "react";
import { Brain, Zap, Database, Shield, GitBranch, Globe, Terminal, Code } from "lucide-react";
import SwarmAnimation from "./SwarmAnimation";

const capabilities = [
  {
    id: "reasoning",
    phase: "THINK",
    title: "Autonomous Reasoning",
    description: "Chain-of-thought with self-reflection. Agents plan multi-step tasks, detect errors, and retry with corrected approach.",
    technical: "ReAct + self-consistency. Configurable max steps, temperature, stop sequences.",
    icon: Brain,
    color: "text-[var(--phase-think)]",
    bg: "bg-[var(--phase-think)]/10",
    border: "border-[var(--phase-think)]/20",
    dotColor: "bg-[var(--phase-think)]",
    angle: -90, // Top
  },
  {
    id: "orchestration",
    phase: "PLAN",
    title: "Multi-Agent Orchestration",
    description: "Supervisor patterns, swarm coordination, consensus voting, dynamic delegation. Human-in-the-loop gates.",
    technical: "LangGraph-compatible. State machines. Checkpointing. Time-travel debugging.",
    icon: GitBranch,
    color: "text-[var(--phase-plan)]",
    bg: "bg-[var(--phase-plan)]/10",
    border: "border-[var(--phase-plan)]/20",
    dotColor: "bg-[var(--phase-plan)]",
    angle: -45, // Top-right
  },
  {
    id: "tools",
    phase: "ACT",
    title: "Tool Execution",
    description: "Parallel tool calls with timeout, retry, and fallback. 100+ built-in tools. Custom tools in TypeScript.",
    technical: "Structured output parsing. Zod schemas. Streaming results. Tool composition.",
    icon: Zap,
    color: "text-[var(--phase-act)]",
    bg: "bg-[var(--phase-act)]/10",
    border: "border-[var(--phase-act)]/20",
    dotColor: "bg-[var(--phase-act)]",
    angle: 0, // Right
  },
  {
    id: "deployment",
    phase: "ACT",
    title: "Global Deployment",
    description: "35+ regions. Edge workers. Auto-scale to zero. Cold start <200ms. Blue-green. Canary. Rollback.",
    technical: "Cloudflare Workers / AWS Lambda / GCP Cloud Run. Terraform provider.",
    icon: Globe,
    color: "text-[var(--phase-act)]",
    bg: "bg-[var(--phase-act)]/10",
    border: "border-[var(--phase-act)]/20",
    dotColor: "bg-[var(--phase-act)]",
    angle: 45, // Bottom-right
  },
  {
    id: "memory",
    phase: "OBSERVE",
    title: "Persistent Memory",
    description: "Vector memory with semantic search. Episodic traces. Knowledge consolidation across sessions. TTL and namespaces.",
    technical: "pgvector / Pinecone / Weaviate. Embedding model agnostic. Hybrid search.",
    icon: Database,
    color: "text-[var(--phase-observe)]",
    bg: "bg-[var(--phase-observe)]/10",
    border: "border-[var(--phase-observe)]/20",
    dotColor: "bg-[var(--phase-observe)]",
    angle: 90, // Bottom
  },
  {
    id: "observability",
    phase: "OBSERVE",
    title: "Full Observability",
    description: "OpenTelemetry traces. Token/cost per step. Latency percentiles. Custom dashboards. Alerting on anomalies.",
    technical: "OTLP export. Grafana/Datadog/Console. PII redaction. Cost budgets.",
    icon: Terminal,
    color: "text-[var(--phase-observe)]",
    bg: "bg-[var(--phase-observe)]/10",
    border: "border-[var(--phase-observe)]/20",
    dotColor: "bg-[var(--phase-observe)]",
    angle: 135, // Bottom-left
  },
  {
    id: "security",
    phase: "THINK",
    title: "Enterprise Security",
    description: "SOC 2 Type II. VPC deploy. RBAC. Audit logs. Data residency. Bring your own keys. Pen tested.",
    technical: "mTLS. KMS integration. SCIM provisioning. SIEM export. Compliance reports.",
    icon: Shield,
    color: "text-[var(--phase-think)]",
    bg: "bg-[var(--phase-think)]/10",
    border: "border-[var(--phase-think)]/20",
    dotColor: "bg-[var(--phase-think)]",
    angle: 180, // Left
  },
  {
    id: "developer",
    phase: "PLAN",
    title: "Developer Experience",
    description: "Local dev server with hot reload. TypeScript SDK. VS Code extension. Test harness. CI/CD templates.",
    technical: "npm create agent. Jest/Vitest matchers. GitHub Actions. Dev containers.",
    icon: Code,
    color: "text-[var(--phase-plan)]",
    bg: "bg-[var(--phase-plan)]/10",
    border: "border-[var(--phase-plan)]/20",
    dotColor: "bg-[var(--phase-plan)]",
    angle: -135, // Top-left
  },
];

const phaseOrder = ["THINK", "PLAN", "ACT", "OBSERVE"];

const phaseMeta = {
  THINK: { label: "Reason & Plan", desc: "Agents analyze context, decompose goals, and formulate multi-step strategies", color: "var(--phase-think)" },
  PLAN: { label: "Coordinate", desc: "Supervisor orchestrates swarm, assigns tasks, manages consensus and delegation", color: "var(--phase-plan)" },
  ACT: { label: "Execute Tools", desc: "Parallel tool calls with structured output, retries, fallbacks, and streaming results", color: "var(--phase-act)" },
  OBSERVE: { label: "Observe & Learn", desc: "Results fed back to memory, traces logged, metrics collected, loop continues", color: "var(--phase-observe)" },
};

// Card dimensions
const CARD_WIDTH = 180;
const CARD_HEIGHT = 140;
const ANIMATION_SIZE = 300;
const GAP = 24;

export default function Features() {
  const [activePhase, setActivePhase] = useState<string>("ALL");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredCapabilities = activePhase === "ALL"
    ? capabilities
    : capabilities.filter(c => c.phase === activePhase);

  // Calculate radius for card positioning
  const radius = ANIMATION_SIZE / 2 + CARD_WIDTH / 2 + GAP;

  return (
    <section id="features" className="relative bg-[var(--bg)] text-[var(--fg)] overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.03] grid-pattern" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-elevated)] text-xs font-mono text-[var(--fg-muted)] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse-subtle" />
            Runtime v2.1.0
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] text-[var(--fg)] mb-5">
            Agent runtime
            <br />
            <span className="text-[var(--fg-muted)] font-normal">capabilities</span>
          </h2>
          <p className="text-lg text-[var(--fg-muted)] max-w-xl mx-auto">
            Eight core capabilities. Each maps to a phase in the agent loop.
            No feature flags. No upsells. Included in every engagement.
          </p>
        </div>

        {/* Radial Layout Container */}
        <div
          ref={containerRef}
          className="relative flex flex-col items-center"
          style={{ minHeight: isMobile ? "auto" : `${ANIMATION_SIZE + radius * 2 + 80}px` }}
        >
          {/* Phase Filter Tabs — centered above */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-8" role="tablist" aria-label="Filter by agent phase">
            <button
              role="tab"
              aria-selected={activePhase === "ALL"}
              onClick={() => setActivePhase("ALL")}
              className={`px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                activePhase === "ALL"
                  ? "bg-[var(--fg)] text-[var(--bg)] shadow-[var(--shadow-sm)]"
                  : "bg-[var(--bg-elevated)] text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)] border border-[var(--border)]"
              }`}
            >
              All
            </button>
            {phaseOrder.map((phase) => (
              <button
                key={phase}
                role="tab"
                aria-selected={activePhase === phase}
                onClick={() => setActivePhase(phase)}
                className={`px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                  activePhase === phase
                    ? "bg-[var(--fg)] text-[var(--bg)] shadow-[var(--shadow-sm)]"
                    : "bg-[var(--bg-elevated)] text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)] border border-[var(--border)]"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `var(--phase-${phase.toLowerCase()})` }} />
                {phase}
              </button>
            ))}
          </div>

          {/* Radial Canvas */}
          <div
            className="relative flex items-center justify-center"
            style={{
              width: isMobile ? "100%" : `${ANIMATION_SIZE + radius * 2}px`,
              height: isMobile ? "auto" : `${ANIMATION_SIZE + radius * 2}px`,
              minHeight: isMobile ? "auto" : `${ANIMATION_SIZE + radius * 2}px`,
            }}
          >
            {/* Orbital Capability Cards — rendered FIRST so animation sits on top */}
            {!isMobile && (
              <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
                {filteredCapabilities.map((cap, index) => {
                  const angleRad = (cap.angle * Math.PI) / 180;
                  const x = Math.cos(angleRad) * radius;
                  const y = Math.sin(angleRad) * radius;

                  return (
                    <div
                      key={cap.id}
                      className="pointer-events-auto"
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                        zIndex: 1,
                      }}
                    >
                      <CapabilityCard
                        capability={cap}
                        isHighlighted={highlightedId === cap.id}
                        onMouseEnter={() => setHighlightedId(cap.id)}
                        onMouseLeave={() => setHighlightedId(null)}
                        index={index}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Center: Live Swarm Animation — rendered LAST, highest z-index */}
            <div
              ref={animationRef}
              className="relative flex-shrink-0 z-50"
              style={{ width: ANIMATION_SIZE, height: ANIMATION_SIZE }}
            >
              <SwarmAnimation />
            </div>

            {/* Mobile: Cards below animation */}
            {isMobile && (
              <div className="w-full mt-8 grid grid-cols-2 gap-3">
                {filteredCapabilities.map((cap, index) => (
                  <CapabilityCard
                    key={cap.id}
                    capability={cap}
                    isHighlighted={highlightedId === cap.id}
                    onMouseEnter={() => setHighlightedId(cap.id)}
                    onMouseLeave={() => setHighlightedId(null)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Phase Legend — center bottom */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-[var(--fg-subtle)]">
            <span className="uppercase tracking-wider">Loop phases</span>
            {phaseOrder.map((phase) => (
              <span
                key={phase}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full border ${
                  activePhase === phase || activePhase === "ALL"
                    ? "border-[var(--border-strong)] text-[var(--fg-muted)]"
                    : "border-[var(--border)] text-[var(--fg-subtle)]"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `var(--phase-${phase.toLowerCase()})` }} />
                {phase}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CapabilityCard({
  capability,
  isHighlighted,
  onMouseEnter,
  onMouseLeave,
  index,
}: {
  capability: typeof capabilities[0];
  isHighlighted: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  index: number;
}) {
  const Icon = capability.icon;
  const delay = index * 50;

  return (
    <article
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative rounded-[var(--radius-lg)] border transition-all duration-300 overflow-hidden group ${capability.border} ${isHighlighted ? "ring-2 ring-[var(--accent)]/30 z-20" : "hover:border-[var(--border-strong)]"} bg-[var(--bg-elevated)]/50 backdrop-blur-sm`}
      style={{ width: CARD_WIDTH, animationDelay: `${delay}ms` }}
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onMouseEnter(); } }}
    >
      {/* Phase badge */}
      <div className="absolute top-2 left-2 z-10">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${capability.color} bg-transparent border ${capability.border}`}>
          <span className={`w-1 h-1 rounded-full ${capability.dotColor}`} />
          {capability.phase}
        </span>
      </div>

      {/* Highlight indicator */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${isHighlighted ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-[var(--accent)]/20" />
      </div>

      <div className="relative z-10 pt-8 pr-3.5 pb-3.5 pl-3.5 flex flex-col">
        {/* Icon + Heading side by side */}
        <div className="flex items-start gap-2.5 mb-2">
          <div className={`flex-shrink-0 w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center ${capability.bg} transition-transform duration-300 group-hover:scale-105`}>
            <Icon className="w-4 h-4" style={{ color: capability.dotColor.replace("bg-", "") }} />
          </div>
          <h3 className="text-xs font-semibold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors leading-tight mt-0.5 whitespace-normal break-words min-w-0">
            {capability.title}
          </h3>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[var(--fg-muted)] text-[11px] leading-relaxed line-clamp-2">{capability.description}</p>

          {/* Technical detail — shows on hover */}
          <div className="mt-1.5 pt-1.5 border-t border-[var(--border)]">
            <p className="text-[9px] font-mono text-[var(--fg-subtle)] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-200 max-h-0 overflow-hidden group-hover:max-h-16">
              {capability.technical}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom accent line — phase color */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: capability.dotColor.replace("bg-", "") }}
        aria-hidden="true"
      />
    </article>
  );
}