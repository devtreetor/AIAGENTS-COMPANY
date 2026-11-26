"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================================
   CONFIGURATION — Single source of truth
   ============================================================================ */
const CONFIG = {
  // Layout — calibrated for 300×300 container
  agentCount: 6,
  orbitRadiusRatio: 0.28,           // Leaves room for labels
  agentBaseRadius: 18,              // Base node radius
  agentRadiusVariance: 2,
  minCanvasSize: 260,

  // Animation timing
  phaseDuration: 2.2,
  transitionDuration: 0.35,
  messageSpeed: 2.5,
  spawnInterval: 2.5,
  delegationChance: 0.3,
  connectionChance: 0.8,

  // Visual
  connectionLineWidth: 1,
  messageSize: 5,
  messageTrailLength: 0.22,
  glowMultiplier: 2.4,
  phaseRingWidth: 3,
  phaseRingGap: 6,
  labelOffset: 16,

  // Colors with CSS variable fallbacks
  phaseColors: {
    THINK: { css: "var(--phase-think)", fallback: "#3B82F6" },
    PLAN: { css: "var(--phase-plan)", fallback: "#8B5CF6" },
    ACT: { css: "var(--phase-act)", fallback: "#F59E0B" },
    OBSERVE: { css: "var(--phase-observe)", fallback: "#10B981" },
    IDLE: { css: "var(--phase-idle)", fallback: "#6B7280" },
  } as const,

  phaseOrder: ["THINK", "PLAN", "ACT", "OBSERVE", "IDLE"] as const,
} as const;

type Phase = (typeof CONFIG.phaseOrder)[number];
type PhaseKey = Exclude<Phase, "IDLE">;

interface Agent {
  id: number;
  x: number; y: number;
  targetX: number; targetY: number;
  phase: Phase;
  phaseProgress: number;
  phaseTransitionProgress: number;
  baseRadius: number;
  color: string;
  connections: number[];
  taskLoad: number;
  isTransitioning: boolean;
  previousPhase: Phase | null;
  pulse: number;
}

interface Message {
  from: number; to: number;
  progress: number;
  phase: PhaseKey;
  pathCurve: number;
}

/* ============================================================================
   UTILITIES
   ============================================================================ */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2;

function resolveColor(_ctx: CanvasRenderingContext2D, color: string): string {
  if (color.startsWith("var(")) {
    const dummy = document.createElement("div");
    dummy.style.color = color;
    document.body.appendChild(dummy);
    const resolved = getComputedStyle(dummy).color;
    document.body.removeChild(dummy);
    const rgbMatch = resolved.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    if (resolved.startsWith("#")) return resolved;
  }
  return color;
}

function shadeColor(color: string, percent: number): string {
  const hex = color.replace("#", "");
  const num = parseInt(hex, 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return "#" + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
}

function lightenColor(color: string, percent: number): string {
  return shadeColor(color, percent);
}

function interpolateColor(c1: string, c2: string, t: number): string {
  const h1 = c1.replace("#", ""), h2 = c2.replace("#", "");
  const r1 = parseInt(h1.slice(0, 2), 16), g1 = parseInt(h1.slice(2, 4), 16), b1 = parseInt(h1.slice(4, 6), 16);
  const r2 = parseInt(h2.slice(0, 2), 16), g2 = parseInt(h2.slice(2, 4), 16), b2 = parseInt(h2.slice(4, 6), 16);
  const r = Math.round(lerp(r1, r2, t)), g = Math.round(lerp(g1, g2, t)), b = Math.round(lerp(b1, b2, t));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/* ============================================================================
   AGENT INITIALIZATION
   ============================================================================ */
function createAgents(cx: number, cy: number, orbitR: number): Agent[] {
  const agents: Agent[] = [];
  for (let i = 0; i < CONFIG.agentCount; i++) {
    const angle = (i / CONFIG.agentCount) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * orbitR;
    const y = cy + Math.sin(angle) * orbitR;

    const connections: number[] = [];
    const n = CONFIG.agentCount;
    connections.push((i + 1) % n, (i - 1 + n) % n);
    if (n >= 5) connections.push((i + Math.floor(n / 2)) % n);

    agents.push({
      id: i, x, y, targetX: x, targetY: y,
      phase: "IDLE", phaseProgress: 0, phaseTransitionProgress: 0,
      baseRadius: CONFIG.agentBaseRadius + (Math.random() - 0.5) * CONFIG.agentRadiusVariance * 2,
      color: CONFIG.phaseColors.IDLE.fallback,
      connections, taskLoad: 0, isTransitioning: false,
      previousPhase: null, pulse: 0,
    });
  }
  return agents;
}

/* ============================================================================
   MAIN COMPONENT
   ============================================================================ */
export default function SwarmAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const agentsRef = useRef<Agent[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const spawnTimerRef = useRef<number>(CONFIG.spawnInterval);
  const [isDark, setIsDark] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 });
  const phaseColorsRef = useRef<Record<Phase, string>>({} as Record<Phase, string>);

  const resolvePhaseColors = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    CONFIG.phaseOrder.forEach((phase) => {
      const def = CONFIG.phaseColors[phase];
      phaseColorsRef.current[phase] = resolveColor(ctx, def.css) || def.fallback;
    });
    agentsRef.current.forEach((a) => { if (a.phase === "IDLE") a.color = phaseColorsRef.current.IDLE; });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    agentsRef.current = createAgents(rect.width / 2, rect.height / 2, Math.min(rect.width, rect.height) * CONFIG.orbitRadiusRatio);
    resolvePhaseColors();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const mqm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const upd = () => { setIsDark(mq.matches); setPrefersReducedMotion(mqm.matches); resolvePhaseColors(); };
    upd(); mq.addEventListener("change", upd); mqm.addEventListener("change", upd);
    return () => { mq.removeEventListener("change", upd); mqm.removeEventListener("change", upd); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setCanvasSize({ width: rect.width, height: rect.height });
      resolvePhaseColors();
      const cx = rect.width / 2, cy = rect.height / 2, orbitR = Math.min(rect.width, rect.height) * CONFIG.orbitRadiusRatio;
      agentsRef.current.forEach((a, i) => {
        const ang = (i / CONFIG.agentCount) * Math.PI * 2 - Math.PI / 2;
        a.targetX = cx + Math.cos(ang) * orbitR; a.targetY = cy + Math.sin(ang) * orbitR;
      });
    };
    resize(); window.addEventListener("resize", resize);
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.1); last = t;
      if (!prefersReducedMotion) { updateAgents(dt); updateMessages(dt); updateSpawn(dt); }
      draw(ctx, canvasSize.width, canvasSize.height);
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); window.removeEventListener("resize", resize); };
  }, [prefersReducedMotion, canvasSize.width, canvasSize.height]);

  /* --- Agent behavior --- */
  function updateAgents(dt: number) {
    agentsRef.current.forEach((a) => {
      const k = 1 - Math.pow(0.003, dt);
      a.x += (a.targetX - a.x) * k; a.y += (a.targetY - a.y) * k;
      a.pulse = a.phase !== "IDLE" ? (a.pulse + dt * 1.2) % (Math.PI * 2) : 0;

      if (a.phase !== "IDLE") {
        a.phaseProgress += dt / CONFIG.phaseDuration;
        if (a.isTransitioning) {
          a.phaseTransitionProgress += dt / CONFIG.transitionDuration;
          if (a.phaseTransitionProgress >= 1) { a.isTransitioning = false; a.phaseTransitionProgress = 0; a.previousPhase = null; }
        }
        if (a.phaseProgress >= 1) {
          a.phaseProgress = 0;
          const idx = CONFIG.phaseOrder.indexOf(a.phase);
          const next = CONFIG.phaseOrder[(idx + 1) % CONFIG.phaseOrder.length];
          a.previousPhase = a.phase; a.phase = next; a.isTransitioning = true; a.phaseTransitionProgress = 0;
          a.color = phaseColorsRef.current[next];
          if (next === "IDLE" && Math.random() < CONFIG.delegationChance) delegate(a.id);
        }
      }
      if (a.taskLoad > 0 && a.phase === "IDLE") a.taskLoad = Math.max(0, a.taskLoad - dt * 0.3);
    });
  }

  function updateSpawn(dt: number) {
    spawnTimerRef.current += dt;
    if (spawnTimerRef.current >= CONFIG.spawnInterval) {
      spawnTimerRef.current = 0;
      const idle = agentsRef.current.filter(a => a.phase === "IDLE");
      if (idle.length) assign(idle[Math.floor(Math.random() * idle.length)].id);
    }
  }

  function assign(id: number) {
    const a = agentsRef.current[id]; if (!a || a.phase !== "IDLE") return;
    a.phase = "THINK"; a.phaseProgress = 0; a.color = phaseColorsRef.current.THINK; a.taskLoad = 1;
    a.isTransitioning = true; a.phaseTransitionProgress = 0; a.previousPhase = "IDLE";
    a.connections.forEach(tid => { if (Math.random() < CONFIG.connectionChance) send(a.id, tid, "THINK"); });
  }

  function delegate(from: number) {
    const agents = agentsRef.current; const fa = agents[from]; if (!fa) return;
    const targets = fa.connections.filter(tid => agents[tid].phase === "IDLE");
    if (!targets.length) return;
    const tid = targets[Math.floor(Math.random() * targets.length)];
    const ta = agents[tid];
    ta.phase = "THINK"; ta.phaseProgress = 0; ta.color = phaseColorsRef.current.THINK; ta.taskLoad = 1;
    ta.isTransitioning = true; ta.phaseTransitionProgress = 0; ta.previousPhase = "IDLE";
    send(from, tid, "PLAN");
  }

  function send(from: number, to: number, phase: PhaseKey) {
    messagesRef.current.push({ from, to, progress: 0, phase, pathCurve: (Math.random() - 0.5) * 0.3 });
  }

  /* --- Messages --- */
  function updateMessages(dt: number) {
    const msgs = messagesRef.current; const agents = agentsRef.current;
    for (let i = msgs.length - 1; i >= 0; i--) {
      const m = msgs[i]; m.progress += dt * CONFIG.messageSpeed;
      if (m.progress >= 1) {
        const ta = agents[m.to];
        if (ta && ta.phase === "IDLE") { ta.phase = m.phase; ta.phaseProgress = 0; ta.color = phaseColorsRef.current[m.phase]; ta.taskLoad = 1; ta.isTransitioning = true; ta.phaseTransitionProgress = 0; ta.previousPhase = "IDLE"; }
        msgs.splice(i, 1);
      }
    }
  }

  /* --- Rendering --- */
  function draw(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const agents = agentsRef.current; const msgs = messagesRef.current;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const small = Math.min(w, h) < CONFIG.minCanvasSize;

    drawBg(ctx, w, h, cx, cy, small);
    drawConns(ctx, agents);
    drawMsgs(ctx, msgs, agents);
    drawAgents(ctx, agents, cx, cy, small);
    if (!small) drawPhaseMarkers(ctx, w, h, cx, cy);
  }

  function drawBg(ctx: CanvasRenderingContext2D, w: number, h: number, cx: number, cy: number, small: boolean) {
    if (small) return;
    const gc = isDark ? "rgba(255,255,255,0.015)" : "rgba(15,17,21,0.015)";
    ctx.strokeStyle = gc; ctx.lineWidth = 0.5;
    const maxR = Math.max(w, h) * 0.5;
    for (let r = 40; r < maxR; r += 40) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.008)" : "rgba(15,17,21,0.01)"; ctx.stroke();
  }

  function drawConns(ctx: CanvasRenderingContext2D, agents: Agent[]) {
    const cc = isDark ? "rgba(255,255,255,0.025)" : "rgba(15,17,21,0.03)";
    ctx.strokeStyle = cc; ctx.lineWidth = CONFIG.connectionLineWidth; ctx.setLineDash([6, 10]);
    agents.forEach(a => a.connections.forEach(tid => { if (tid > a.id) { const t = agents[tid]; if (t) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(t.x, t.y); ctx.stroke(); } } }));
    ctx.setLineDash([]);
  }

  function drawMsgs(ctx: CanvasRenderingContext2D, msgs: Message[], agents: Agent[]) {
    msgs.forEach(m => {
      const fa = agents[m.from], ta = agents[m.to]; if (!fa || !ta) return;
      const t = easeInOutCubic(m.progress); const pc = phaseColorsRef.current[m.phase];
      const mx = (fa.x + ta.x) / 2, my = (fa.y + ta.y) / 2;
      const dx = ta.x - fa.x, dy = ta.y - fa.y, dist = Math.hypot(dx, dy);
      const px = -dy / dist * m.pathCurve * dist * 0.35, py = dx / dist * m.pathCurve * dist * 0.35;
      const cpx = mx + px, cpy = my + py;
      const x = lerp(lerp(fa.x, cpx, t), lerp(cpx, ta.x, t), t);
      const y = lerp(lerp(fa.y, cpy, t), lerp(cpy, ta.y, t), t);

      // Trail
      const ts = Math.max(0, t - CONFIG.messageTrailLength), steps = 14;
      for (let s = 0; s < steps; s++) {
        const st = ts + (t - ts) * (s / steps), nst = ts + (t - ts) * ((s + 1) / steps);
        const sx = lerp(lerp(fa.x, cpx, st), lerp(cpx, ta.x, st), st);
        const sy = lerp(lerp(fa.y, cpy, st), lerp(cpy, ta.y, st), st);
        const nx = lerp(lerp(fa.x, cpx, nst), lerp(cpx, ta.x, nst), nst);
        const ny = lerp(lerp(fa.y, cpy, nst), lerp(cpy, ta.y, nst), nst);
        const a = (s / steps) * 0.6, lw = lerp(0.6, CONFIG.messageSize * 0.45, s / steps);
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(nx, ny);
        ctx.strokeStyle = pc + Math.floor(a * 255).toString(16).padStart(2, "0"); ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.stroke();
      }

      // Packet — clean circle with inner dot (neuron style)
      const ps = CONFIG.messageSize * (1 + Math.sin(Date.now() / 120) * 0.15);
      const pg = ctx.createRadialGradient(x, y, 0, x, y, ps);
      pg.addColorStop(0, pc); pg.addColorStop(0.6, pc + "40"); pg.addColorStop(1, pc + "00");
      ctx.beginPath(); ctx.arc(x, y, ps, 0, Math.PI * 2); ctx.fillStyle = pg; ctx.fill();
      // Inner bright core
      ctx.beginPath(); ctx.arc(x, y, ps * 0.35, 0, Math.PI * 2); ctx.fillStyle = "#FFFFFF80"; ctx.fill();

      // Sender pulse
      if (m.progress < 0.05) {
        const ra = 1 - m.progress / 0.05;
        ctx.beginPath(); ctx.arc(fa.x, fa.y, fa.baseRadius * 1.7, 0, Math.PI * 2);
        ctx.strokeStyle = pc + Math.floor(ra * 150).toString(16).padStart(2, "0"); ctx.lineWidth = 2; ctx.stroke();
      }
    });
  }

  function drawAgents(ctx: CanvasRenderingContext2D, agents: Agent[], cx: number, cy: number, small: boolean) {
    agents.forEach(a => {
      const pulseScale = a.phase !== "IDLE" ? 1 + Math.sin(a.pulse) * 0.05 : 1;
      const r = a.baseRadius * pulseScale;

      let dc = a.color, dr = r;
      if (a.isTransitioning && a.previousPhase) {
        const tp = easeOutCubic(a.phaseTransitionProgress);
        dc = interpolateColor(phaseColorsRef.current[a.previousPhase], a.color, tp);
        dr = r * (1 + tp * 0.1);
      }

      // Glow
      if (a.phase !== "IDLE") {
        const gr = dr * CONFIG.glowMultiplier;
        const gg = ctx.createRadialGradient(a.x, a.y, dr, a.x, a.y, gr);
        gg.addColorStop(0, dc + "22"); gg.addColorStop(0.5, dc + "08"); gg.addColorStop(1, dc + "00");
        ctx.beginPath(); ctx.arc(a.x, a.y, gr, 0, Math.PI * 2); ctx.fillStyle = gg; ctx.fill();
      }

      // Node body — clean circle with subtle depth
      ctx.beginPath(); ctx.arc(a.x, a.y, dr, 0, Math.PI * 2);
      const bg = ctx.createRadialGradient(a.x - dr * 0.3, a.y - dr * 0.3, 0, a.x, a.y, dr);
      bg.addColorStop(0, lightenColor(dc, 12)); bg.addColorStop(0.5, dc); bg.addColorStop(1, shadeColor(dc, -25));
      ctx.fillStyle = bg; ctx.fill();
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.12)" : "rgba(15,17,21,0.07)"; ctx.lineWidth = 1; ctx.stroke();

      // Inner indicator — phase-appropriate
      if (a.phase !== "IDLE") {
        // Three concentric rings showing "processing depth"
        for (let k = 1; k <= 3; k++) {
          const ir = dr * (0.2 + k * 0.15);
          ctx.beginPath(); ctx.arc(a.x, a.y, ir, 0, Math.PI * 2);
          ctx.strokeStyle = dc + Math.floor(25 + k * 15).toString(16).padStart(2, "0"); ctx.lineWidth = 0.7; ctx.stroke();
        }
        // Bright core
        ctx.beginPath(); ctx.arc(a.x, a.y, dr * 0.18, 0, Math.PI * 2);
        const cg = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, dr * 0.18);
        cg.addColorStop(0, "#FFFFFF"); cg.addColorStop(1, dc); ctx.fillStyle = cg; ctx.fill();
      } else {
        // Idle — dim core
        ctx.beginPath(); ctx.arc(a.x, a.y, dr * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(255,255,255,0.06)" : "rgba(15,17,21,0.06)"; ctx.fill();
      }

      // Phase progress ring
      if (a.phase !== "IDLE") {
        const rr = dr + CONFIG.phaseRingGap;
        const prog = a.isTransitioning ? easeOutCubic(a.phaseTransitionProgress) : a.phaseProgress;
        // Track
        ctx.beginPath(); ctx.arc(a.x, a.y, rr, 0, Math.PI * 2);
        ctx.strokeStyle = dc + "10"; ctx.lineWidth = CONFIG.phaseRingWidth; ctx.lineCap = "round"; ctx.stroke();
        // Progress
        ctx.beginPath(); ctx.arc(a.x, a.y, rr, -Math.PI / 2, -Math.PI / 2 + prog * Math.PI * 2);
        ctx.strokeStyle = dc; ctx.lineWidth = CONFIG.phaseRingWidth; ctx.lineCap = "round"; ctx.stroke();
      }

      // Task badge
      if (a.taskLoad > 0.3) {
        const bx = a.x + dr * 0.65, by = a.y - dr * 0.65, bs = 8;
        ctx.beginPath(); ctx.arc(bx, by, bs, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#0F1115" : "#FFFFFF"; ctx.fill();
        ctx.strokeStyle = dc; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.font = "500 9px 'JetBrains Mono', monospace"; ctx.fillStyle = dc; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(Math.ceil(a.taskLoad).toString(), bx, by + 1);
      }

      // Label
      if (!small) {
        const ly = a.y + dr + CONFIG.phaseRingGap + CONFIG.labelOffset;
        const lc = isDark ? "rgba(240,242,245,0.35)" : "rgba(15,17,21,0.25)";
        ctx.font = "400 10px 'Instrument Sans', system-ui, sans-serif"; ctx.fillStyle = lc; ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(`Agent ${a.id + 1}`, a.x, ly);
      }
    });
  }

  function drawPhaseMarkers(ctx: CanvasRenderingContext2D, w: number, h: number, cx: number, cy: number) {
    const orbitR = Math.min(w, h) * CONFIG.orbitRadiusRatio;
    const labelR = orbitR + 48;
    const markers: { phase: Phase; angle: number; label: string }[] = [
      { phase: "THINK", angle: -Math.PI / 2, label: "THINK" },
      { phase: "PLAN", angle: 0, label: "PLAN" },
      { phase: "ACT", angle: Math.PI / 2, label: "ACT" },
      { phase: "OBSERVE", angle: Math.PI, label: "OBSERVE" },
    ];
    markers.forEach(({ phase, angle, label }) => {
      const x = cx + Math.cos(angle) * labelR, y = cy + Math.sin(angle) * labelR;
      const c = phaseColorsRef.current[phase];
      // Dot
      ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2);
      const dg = ctx.createRadialGradient(x - 1.5, y - 1.5, 0, x, y, 6);
      dg.addColorStop(0, lightenColor(c, 15)); dg.addColorStop(1, c);
      ctx.fillStyle = dg; ctx.fill();
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.15)" : "rgba(15,17,21,0.08)"; ctx.lineWidth = 1; ctx.stroke();
      // Label
      ctx.font = "500 10px 'JetBrains Mono', monospace";
      ctx.fillStyle = isDark ? "rgba(240,242,245,0.65)" : "rgba(15,17,21,0.5)";
      ctx.textAlign = angle === 0 ? "left" : angle === Math.PI ? "right" : "center";
      ctx.textBaseline = angle === -Math.PI / 2 ? "bottom" : angle === Math.PI / 2 ? "top" : "middle";
      const lx = angle === 0 ? x + 12 : angle === Math.PI ? x - 12 : x;
      const ly = angle === -Math.PI / 2 ? y - 8 : angle === Math.PI / 2 ? y + 8 : y;
      ctx.fillText(label, lx, ly);
    });
    // Center status — positioned well above orbit labels
    const ac = agentsRef.current.filter(a => a.phase !== "IDLE").length;
    const tc = agentsRef.current.length;
    const statusY = cy + orbitR + 18; // Just below orbit, well above ACT label
    ctx.font = "500 11px 'Instrument Sans', system-ui, sans-serif";
    ctx.fillStyle = isDark ? "rgba(240,242,245,0.7)" : "rgba(15,17,21,0.55)"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
    ctx.fillText(`${ac} / ${tc} active`, cx, statusY);
    ctx.font = "400 9px 'JetBrains Mono', monospace";
    ctx.fillStyle = isDark ? "rgba(160,166,180,0.35)" : "rgba(74,78,86,0.35)";
    ctx.fillText("SWARM COORDINATION", cx, statusY + 12);
  }

  return (
    <div className="relative w-full h-full" style={{ minHeight: 300 }}>
      <canvas ref={canvasRef} className="w-full h-full block"
        aria-label="Multi-agent swarm coordination — THINK → PLAN → ACT → OBSERVE loop" role="img" />
    </div>
  );
}