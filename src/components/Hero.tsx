"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal, Brain, Zap, ArrowRight } from "lucide-react";
import { CalendlyPopupButton } from "@/components/CalendlyPopup";

const traceSteps = [
  { phase: "THINK", content: 'User asked: "Analyze Q3 revenue trends and draft investor memo"', duration: 800 },
  { phase: "PLAN", content: "Decomposing into subtasks: fetch data → analyze → synthesize → write", duration: 600 },
  { phase: "ACT", content: 'Calling tool: postgres.query("SELECT * FROM revenue WHERE quarter=\'Q3\'")', duration: 1200 },
  { phase: "OBSERVE", content: "Received 847 rows. Revenue up 23% YoY. Enterprise segment +41%.", duration: 900 },
  { phase: "THINK", content: "Pattern detected: Enterprise growth accelerating. SMB flat. Need context.", duration: 700 },
  { phase: "ACT", content: 'Calling tool: web.search("enterprise software spending trends 2024")', duration: 1100 },
  { phase: "OBSERVE", content: "Gartner: Enterprise IT spend growing 8.7%. AI workloads driving premium.", duration: 800 },
  { phase: "THINK", content: "Synthesizing: Our growth exceeds market. Product-market fit in enterprise AI.", duration: 600 },
  { phase: "ACT", content: 'Calling tool: notion.create_page({ title: "Q3 Investor Memo", content: ... })', duration: 900 },
  { phase: "DONE", content: "Memo drafted. 2,400 tokens used. 3 tools called. 4.2s elapsed.", duration: 1000 },
];

const phaseColors: Record<string, string> = {
  THINK: "text-[var(--phase-think)]",
  PLAN: "text-[var(--phase-plan)]",
  ACT: "text-[var(--phase-act)]",
  OBSERVE: "text-[var(--phase-observe)]",
  DONE: "text-[var(--accent)]",
};

export default function Hero() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [traceHistory, setTraceHistory] = useState<string[]>([]);

  useEffect(() => {
    if (!isPlaying) return;

    const step = traceSteps[currentStep];
    const phaseKey = step.phase;

    setTraceHistory(prev => [...prev, phaseKey]);

    const timer = setTimeout(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= traceSteps.length) {
          setIsPlaying(false);
          return prev;
        }
        return next;
      });
    }, step.duration);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying]);

  const restartTrace = () => {
    setCurrentStep(0);
    setTraceHistory([]);
    setIsPlaying(true);
  };

  return (
    <section className="relative bg-[var(--bg)] text-[var(--fg)] overflow-hidden pb-8 lg:pb-10">
      {/* Subtle grid — technical, not decorative */}
      <div className="absolute inset-0 opacity-[0.03] grid-pattern" aria-hidden="true" />

      {/* Single accent line — purposeful */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-[33%] accent-line" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6 lg:py-10 sm:px-10 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* Left: Narrative */}
          <div className="max-w-xl">
            {/* Minimal badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-elevated)] text-xs font-mono text-[var(--fg-muted)] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse-subtle" />
              <span>Runtime v2.1.0</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-[var(--fg)] mb-6">
              Agents that
              <br />
              <span className="relative">
                <span className="relative z-10">reason</span>
              </span>
              <span className="text-[var(--fg-muted)] font-normal">, not just respond</span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--fg-muted)] leading-relaxed mb-10 max-w-lg">
              Most "agents" are prompts in a loop. Ours plan, call tools, observe results,
              and iterate — autonomously. This trace is live.
            </p>

            {/* Metrics — real, not marketing */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-[var(--fg-muted)]">
                <Terminal className="w-4 h-4 text-[var(--fg-subtle)]" />
                <span><span className="text-[var(--fg)] font-mono">3</span> tool calls</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--fg-muted)]">
                <Zap className="w-4 h-4 text-[var(--fg-subtle)]" />
                <span><span className="text-[var(--fg)] font-mono">4.2s</span> latency</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--fg-muted)]">
                <Brain className="w-4 h-4 text-[var(--fg-subtle)]" />
                <span><span className="text-[var(--fg)] font-mono">2.4k</span> tokens</span>
              </div>
            </div>

            {/* CTA — minimal */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <CalendlyPopupButton
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-md)] bg-[var(--accent)] text-white font-medium text-sm hover:bg-[var(--accent-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
              >
                Book discovery call
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </CalendlyPopupButton>
              <button
                onClick={restartTrace}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-md)] bg-[var(--fg)] text-[var(--bg)] font-medium text-sm hover:bg-[var(--fg-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
              >
                Replay trace
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right: Live Agent Trace */}
          <div className="relative">
            <AgentTraceTerminal
              steps={traceSteps}
              currentStep={currentStep}
              traceHistory={traceHistory}
              isPlaying={isPlaying}
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator — subtle */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--fg-subtle)] font-mono text-xs">
        <span className="tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

function AgentTraceTerminal({
  steps,
  currentStep,
  traceHistory,
  isPlaying,
}: {
  steps: typeof traceSteps;
  currentStep: number;
  traceHistory: string[];
  isPlaying: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [traceHistory]);

  return (
    <div className="relative">
      {/* Terminal window */}
      <div className="rounded-t-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg)] overflow-hidden shadow-[var(--shadow-xl)]">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-4 text-xs font-mono text-[var(--fg-subtle)]">agent.trace.ts</span>
          <div className="ml-auto flex items-center gap-2 text-xs text-[var(--fg-subtle)]">
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-[var(--phase-observe)] animate-pulse-subtle" : "bg-[var(--fg-subtle)]"}`} />
              {isPlaying ? "RUNNING" : "COMPLETE"}
            </span>
            <span className="font-mono text-[var(--fg-subtle)]">step {currentStep + 1}/{steps.length}</span>
          </div>
        </div>

        {/* Trace content */}
        <div
          ref={contentRef}
          className="p-4 font-mono text-sm leading-relaxed max-h-[500px] overflow-y-auto"
        >
          {traceHistory.map((phase, idx) => {
            const step = steps[idx];
            if (!step) return null;
            const isCurrent = idx === currentStep && isPlaying;

            return (
              <div
                key={idx}
                className={`mb-3 pb-3 border-b border-[var(--border)]/50 last:border-0 transition-all duration-300 ${isCurrent ? "opacity-100" : "opacity-80"}`}
              >
                <div className="flex items-baseline gap-3">
                  <span className={`flex-shrink-0 w-20 text-right font-mono text-xs ${phaseColors[phase]}`}>
                    {phase}
                  </span>
                  <span className={`flex-1 ${isCurrent ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"}`}>
                    {step.content}
                  </span>
                  {isCurrent && (
                    <span className="flex-shrink-0 w-4 h-4 text-[var(--fg-subtle)] animate-pulse" aria-hidden="true">
                      ▋
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing indicator for current step */}
          {isPlaying && currentStep < steps.length && (
            <div className="flex items-baseline gap-3 mb-3">
              <span className={`flex-shrink-0 w-20 text-right font-mono text-xs ${phaseColors[steps[currentStep].phase]}`}>
                {steps[currentStep].phase}
              </span>
              <span className="flex-1 text-[var(--fg-subtle)]">
                <span className="inline-block w-24 h-4 bg-[var(--bg-subtle)] rounded animate-pulse" />
              </span>
              <span className="flex-shrink-0 w-4 h-4 text-[var(--fg-subtle)] animate-pulse" aria-hidden="true">
                ▋
              </span>
            </div>
          )}

          {!isPlaying && currentStep === steps.length - 1 && (
            <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center gap-3 text-[var(--accent)]">
              <span className="w-5 h-5 flex items-center justify-center">
                <ArrowRight className="w-5 h-5" />
              </span>
              <span className="font-medium">Trace complete. Agent awaiting next task.</span>
            </div>
          )}
        </div>
      </div>

      {/* Minimal legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--fg-subtle)]">
        <span className="text-[var(--fg-subtle)] uppercase tracking-wider">Agent loop phases</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--phase-think)]" />
          <span>Think</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--phase-plan)]" />
          <span>Plan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--phase-act)]" />
          <span>Act</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--phase-observe)]" />
          <span>Observe</span>
        </div>
      </div>
    </div>
  );
}