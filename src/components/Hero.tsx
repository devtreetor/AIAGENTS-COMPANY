"use client";

import { ArrowRight, Sparkles, Zap, Brain } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-30" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 sm:px-10 lg:px-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">New: Autonomous Agent Orchestration v2.0</span>
          </div>

          {/* Main headline */}
          <h1 className="mb-8 text-5xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl animate-fade-in-up delay-100">
            Build <span className="relative">AI Agents</span> That <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
              Think, Act & Scale
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-lg text-slate-600 dark:text-slate-300 sm:text-xl max-w-3xl mx-auto animate-fade-in-up delay-200">
            Deploy production-ready autonomous agents in minutes, not months.
            Our platform handles orchestration, memory, tools, and scaling — so you can focus on building intelligence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300">
            <a
              href="#demo"
              className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <Span className="relative z-10">Start Building Free</Span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="#docs"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-8 py-4 text-base font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              View Documentation
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400 animate-fade-in-up delay-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">Trusted by innovative teams at</span>
            <div className="flex items-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
              <span className="font-semibold text-slate-400 dark:text-slate-500">Acme Corp</span>
              <span className="font-semibold text-slate-400 dark:text-slate-500">TechStart</span>
              <span className="font-semibold text-slate-400 dark:text-slate-500">DataFlow</span>
              <span className="font-semibold text-slate-400 dark:text-slate-500">CloudNine</span>
            </div>
          </div>
        </div>

        {/* Visual demo area */}
        <div className="mt-20 relative animate-fade-in-up delay-500">
          <AgentDemo />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

function AgentDemo() {
  const steps = [
    { icon: Brain, label: "Define Goal", color: "blue" },
    { icon: Zap, label: "Plan & Execute", color: "purple" },
    { icon: Sparkles, label: "Deliver Result", color: "emerald" },
  ];

  return (
    <div className="relative">
      {/* Floating cards */}
      <div className="relative h-64 lg:h-80">
        {/* Central agent visualization */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/25 animate-float">
            <Brain className="w-16 h-16 lg:w-20 lg:h-20 text-white" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-30 blur-xl animate-ping" />
          </div>
        </div>

        {/* Orbiting step cards */}
        {steps.map((step, index) => {
          const angle = (index * 120 - 90) * (Math.PI / 180);
          const radius = 160;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={step.label}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
              }}
            >
              <StepCard step={step} index={index} />
            </div>
          );
        })}

        {/* Connecting lines */}
        <svg className="absolute inset-0 -z-10 opacity-30" viewBox="0 0 400 320" preserveAspectRatio="none">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
          </defs>
          <circle cx="200" cy="160" r="160" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="8,8" className="text-slate-400 dark:text-slate-500" />
        </svg>
      </div>

      {/* Code snippet preview */}
      <div className="mt-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-950 dark:bg-slate-900 overflow-hidden shadow-2xl animate-fade-in-up delay-600">
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 dark:bg-slate-800 border-b border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="ml-4 text-sm text-slate-400 font-mono">agent.deploy.ts</span>
        </div>
        <pre className="p-6 overflow-x-auto text-sm"><code className="text-slate-100 font-mono leading-relaxed">{`// Define your autonomous agent
const agent = new Agent({
  name: "Research Analyst",
  goal: "Analyze market trends & generate reports",
  tools: [webSearch, dataAnalysis, reportWriter],
  memory: new VectorMemory({ namespace: "research" }),
  model: "claude-sonnet-4",
  maxSteps: 15,
});

// Deploy with one line
await agent.deploy({
  schedule: "0 9 * * 1-5", // Weekdays 9AM
  notifications: { slack: "#reports" },
  autoScale: true,
});

console.log("🚀 Agent deployed & running!");`}</code></pre>
      </div>
    </div>
  );
}

function StepCard({ step, index }: { step: { icon: any; label: string; color: string }; index: number }) {
  const Icon = step.icon;
  const colors = {
    blue: "bg-blue-500/10 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-500/10 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400",
    emerald: "bg-emerald-500/10 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className={`relative w-48 lg:w-56 rounded-xl border backdrop-blur-sm p-4 text-center ${colors[step.color as keyof typeof colors]} animate-orbit`} style={{ animationDelay: `${index * 200}ms` }}>
      <div className="mb-3 flex justify-center">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[step.color as keyof typeof colors].replace("border", "bg").replace("text", "bg").replace("dark:border", "dark:bg").replace("500/10", "500/20")}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white">{step.label}</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Automated & scalable</p>
    </div>
  );
}