import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoImg from "@/imports/image.png";
import {
  Shield,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Terminal,
  X,
} from "lucide-react";

// ─── design tokens ──────────────────────────────────────────────────
const C = {
  bg: "#ffffff",
  bgSoft: "#f5faf7",
  ink: "#26332f",
  inkSoft: "#5b6b66",
  sage: "#6fa98f",
  sageDeep: "#487a63",
  sageTint: "#e5f2ec",
  line: "#e2ebe6",
  shadow: "0 1px 2px rgba(38,51,47,0.04), 0 8px 24px rgba(38,51,47,0.06)",
};

// ─── fonts ───────────────────────────────────────────────────────────
const serif = "'Fraunces', serif";
const sans = "'Inter', sans-serif";
const mono = "'JetBrains Mono', monospace";

// ─── helpers ─────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Workzounds logo ──────────────────────────────────────────────────
function Logo({ size = 34 }: { size?: number }) {
  return (
    <ImageWithFallback
      src={logoImg}
      alt="Workzounds logo"
      style={{ width: size, height: size, objectFit: "contain", display: "block" }}
    />
  );
}

// ─── Monogram icons (letterpress style) ──────────────────────────────
function MonogramIcon({ letter, accent = false }: { letter: string; accent?: boolean }) {
  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 10,
        background: accent ? C.ink : C.sageTint,
        border: `1px solid ${accent ? "transparent" : "#c8e2d6"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontFamily: serif,
        fontSize: 18,
        fontWeight: 500,
        color: accent ? "#f4faf7" : C.sageDeep,
        letterSpacing: "-0.02em",
        userSelect: "none",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {letter}
    </div>
  );
}

// ─── Thread-rule divider ──────────────────────────────────────────────
function ThreadRule() {
  return (
    <div
      style={{
        height: 10,
        width: "100%",
        backgroundImage: `repeating-linear-gradient(-55deg, ${C.line} 0 2px, transparent 2px 14px)`,
        opacity: 0.9,
      }}
    />
  );
}

// ─── Eyebrow label ────────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: mono,
        fontSize: 12.5,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: C.sageDeep,
        background: C.sageTint,
        border: `1px solid #d3e9df`,
        padding: "6px 14px",
        borderRadius: 100,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: C.sage,
          boxShadow: `0 0 0 3px rgba(111,169,143,0.25)`,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {children}
    </span>
  );
}

// ─── Button ───────────────────────────────────────────────────────────
type BtnVariant = "primary" | "ghost";
function Btn({
  variant = "primary",
  small,
  children,
  onClick,
  type = "button",
  full,
}: {
  variant?: BtnVariant;
  small?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  full?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: full ? "center" : undefined,
    gap: 8,
    padding: small ? "9px 15px" : "11px 20px",
    borderRadius: 9,
    fontSize: small ? 13.5 : 14.5,
    fontWeight: 600,
    fontFamily: sans,
    cursor: "pointer",
    border: "1px solid transparent",
    transition: "transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
    whiteSpace: "nowrap",
    width: full ? "100%" : undefined,
    transform: hovered ? "translateY(-1px)" : "none",
    boxShadow: hovered && variant === "primary" ? `0 4px 12px rgba(72,122,99,0.25)` : "none",
  };
  const styles: Record<BtnVariant, React.CSSProperties> = {
    primary: {
      background: hovered ? C.sageDeep : C.ink,
      color: "#f4faf7",
    },
    ghost: {
      background: "transparent",
      color: C.ink,
      borderColor: hovered ? C.ink : C.line,
    },
  };
  return (
    <button
      type={type}
      style={{ ...base, ...styles[variant] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(1px)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = hovered ? "translateY(-1px)" : "none")}
    >
      {children}
    </button>
  );
}

// ─── Live Monitor ─────────────────────────────────────────────────────
const LOG_LINES = [
  "LEDGER: payout batch cleared via Whop",
  "COMPILER: task-118 verified — status APPROVED",
  "GATEWAY: secure handshake complete",
  "ROUTER: cluster traffic re-balanced",
  "LEDGER: stablecoin transfer confirmed",
  "COMPILER: pull request merged to main",
];

function Monitor() {
  const [tasks, setTasks] = useState(42);
  const [eng, setEng] = useState(20);
  const [logs, setLogs] = useState<string[]>([]);
  const logIdxRef = useRef(0);

  useEffect(() => {
    const push = () => {
      const time = new Date().toLocaleTimeString("en-US", { hour12: false });
      const line = `>> [${time}] ${LOG_LINES[logIdxRef.current % LOG_LINES.length]}`;
      logIdxRef.current++;
      setLogs((prev) => [line, ...prev].slice(0, 4));
    };
    push();
    const li = setInterval(push, 5000);
    const si = setInterval(() => {
      setTasks((t) => Math.max(30, Math.min(58, t + (Math.random() > 0.5 ? 1 : -1))));
      setEng((e) => Math.max(12, Math.min(28, e + (Math.random() > 0.6 ? 1 : Math.random() < 0.3 ? -1 : 0))));
    }, 4000);
    return () => { clearInterval(li); clearInterval(si); };
  }, []);

  return (
    <div
      style={{
        border: `1px solid ${C.line}`,
        borderRadius: 14,
        background: C.bgSoft,
        boxShadow: C.shadow,
        overflow: "hidden",
      }}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: `1px solid ${C.line}`,
          fontFamily: mono,
          fontSize: 12,
          color: C.inkSoft,
        }}
      >
        <span>CONVEYOR MONITOR v2.1</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, color: C.sageDeep, fontWeight: 500 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.sage,
              animation: "wz-pulse 1.8s ease-in-out infinite",
              display: "inline-block",
            }}
          />
          LIVE
        </span>
      </div>

      {/* stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: C.line }}>
        {[
          { label: "Active Tasks", value: tasks, accent: false },
          { label: "Engineers Online", value: eng, accent: true },
        ].map((s) => (
          <div key={s.label} style={{ background: C.bg, padding: 18 }}>
            <div style={{ fontFamily: mono, fontSize: 11, color: C.inkSoft, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
            <div style={{ fontFamily: serif, fontSize: 30, marginTop: 6, color: s.accent ? C.sageDeep : C.ink }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* log feed */}
      <div style={{ padding: "14px 18px 18px", fontFamily: mono, fontSize: 12, color: C.inkSoft, minHeight: 100 }}>
        {logs.map((l, i) => (
          <div
            key={i}
            style={{
              padding: "4px 0",
              borderBottom: i < logs.length - 1 ? `1px dashed ${C.line}` : "none",
              animation: i === 0 ? "wz-fadeIn 0.5s ease forwards" : "none",
              opacity: 1 - i * 0.18,
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Animated section wrapper ─────────────────────────────────────────
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Card with hover ──────────────────────────────────────────────────
function FactoryCard({
  idx,
  title,
  desc,
  tags,
  monogram,
}: {
  idx: string;
  title: string;
  desc: string;
  tags: string[];
  monogram: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.bg,
        border: `1px solid ${hovered ? C.sage : C.line}`,
        borderRadius: 14,
        padding: 28,
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.2s ease, transform 0.25s ease, box-shadow 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 8px 28px rgba(111,169,143,0.15)` : C.shadow,
        cursor: "default",
      }}
    >
      {/* diagonal stitch corner */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 34,
          height: 34,
          backgroundImage: `repeating-linear-gradient(-55deg, ${C.sageTint} 0 2px, transparent 2px 8px)`,
          borderBottomRightRadius: 10,
        }}
      />
      {/* monogram + index row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <MonogramIcon letter={monogram} accent={hovered} />
        <span style={{ fontFamily: mono, fontSize: 11, color: C.sageDeep, letterSpacing: "0.06em", textTransform: "uppercase" }}>{idx}</span>
      </div>
      <h3 style={{ fontFamily: serif, fontSize: 20, margin: "0 0 10px", color: C.ink }}>{title}</h3>
      <p style={{ color: C.inkSoft, fontSize: 14.5, margin: 0 }}>{desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
        {tags.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: mono,
              fontSize: 11.5,
              color: C.inkSoft,
              background: C.bgSoft,
              border: `1px solid ${C.line}`,
              padding: "4px 10px",
              borderRadius: 100,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Benefit card with hover ──────────────────────────────────────────
function BenefitCard({
  icon,
  monogram,
  title,
  desc,
}: {
  icon: React.ReactNode;
  monogram: string;
  title: string;
  desc: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        background: hovered ? C.sageTint : C.bg,
        border: `1px solid ${hovered ? "#c8e2d6" : C.line}`,
        borderRadius: 14,
        padding: 24,
        transition: "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        cursor: "default",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 42,
          height: 42,
          borderRadius: 10,
          background: hovered ? C.ink : C.sageTint,
          color: hovered ? "#f4faf7" : C.sageDeep,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s ease, color 0.2s ease",
          fontFamily: serif,
          fontSize: 16,
          fontWeight: 500,
          position: "relative",
        }}
      >
        {hovered ? (
          <span style={{ fontSize: 17, letterSpacing: "-0.02em" }}>{monogram}</span>
        ) : (
          icon
        )}
      </div>
      <div>
        <h3 style={{ fontFamily: sans, fontSize: 16.5, fontWeight: 600, margin: "0 0 6px", color: C.ink }}>{title}</h3>
        <p style={{ color: C.inkSoft, fontSize: 14, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

// ─── Infra badge with hover ───────────────────────────────────────────
function InfraBadge({ name, monogram }: { name: string; monogram: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        border: `1px solid ${hovered ? C.sage : C.line}`,
        borderRadius: 100,
        padding: "11px 22px",
        background: hovered ? C.sageTint : C.bg,
        fontFamily: mono,
        fontSize: 14,
        color: hovered ? C.sageDeep : C.ink,
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        cursor: "default",
      }}
    >
      {/* monogram dot replacement on hover */}
      <div
        style={{
          width: hovered ? 22 : 7,
          height: hovered ? 22 : 7,
          borderRadius: hovered ? 6 : "50%",
          background: hovered ? C.ink : C.sage,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {hovered && (
          <span style={{ fontFamily: serif, fontSize: 11, color: "#f4faf7", fontWeight: 500 }}>{monogram}</span>
        )}
      </div>
      {name}
    </div>
  );
}

// ─── Terminal modal ───────────────────────────────────────────────────
function TerminalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(38,51,47,0.4)",
            zIndex: 100,
            backdropFilter: "blur(4px)",
            animation: "wz-fadeIn 0.2s ease",
          }}
        />
        <Dialog.Content
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 101,
            background: C.bg,
            borderRadius: 14,
            border: `1px solid ${C.line}`,
            maxWidth: 400,
            width: "calc(100% - 40px)",
            padding: 28,
            boxShadow: "0 20px 60px rgba(38,51,47,0.2)",
            animation: "wz-slideUp 0.25s ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <MonogramIcon letter="T" accent />
              <Dialog.Title style={{ fontFamily: serif, fontSize: 20, color: C.ink, margin: 0 }}>
                Enter Terminal
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", color: C.inkSoft, fontSize: 20, lineHeight: 1, padding: 2 }}
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description style={{ color: C.inkSoft, fontSize: 14, marginBottom: 18 }}>
            Have an access token? Enter it below. Otherwise, request an invite and we'll review your profile.
          </Dialog.Description>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontFamily: mono, fontSize: 12.5, fontWeight: 600, color: C.inkSoft, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
              Access token
            </label>
            <input
              type="text"
              placeholder="WZ-XXXX-XXXX"
              style={{
                width: "100%",
                border: `1px solid ${C.line}`,
                borderRadius: 8,
                padding: "11px 13px",
                fontFamily: mono,
                fontSize: 14,
                color: C.ink,
                background: C.bgSoft,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>
          <Btn variant="primary" full onClick={onClose}>Unlock Access</Btn>
          <div style={{ marginTop: 10 }}>
            <Btn variant="ghost" full onClick={onClose}>I don't have a token</Btn>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Apply form ───────────────────────────────────────────────────────
function ApplyForm() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: C.bg,
        border: `1px solid ${C.line}`,
        borderRadius: 14,
        padding: 28,
        boxShadow: C.shadow,
      }}
    >
      {(["Email", "GitHub / Behance link", "Tech stack"] as const).map((label, i) => (
        <div key={label} style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontFamily: mono,
              fontSize: 12.5,
              fontWeight: 600,
              color: C.inkSoft,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: 6,
            }}
          >
            {label}
          </label>
          {i < 2 ? (
            <input
              type={i === 0 ? "email" : "url"}
              placeholder={i === 0 ? "you@domain.com" : "https://github.com/yourname"}
              required
              style={{
                width: "100%",
                border: `1px solid ${C.line}`,
                borderRadius: 8,
                padding: "11px 13px",
                fontFamily: sans,
                fontSize: 14.5,
                color: C.ink,
                background: C.bgSoft,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          ) : (
            <textarea
              placeholder="e.g. React, Node, Tailwind, Notion API"
              style={{
                width: "100%",
                border: `1px solid ${C.line}`,
                borderRadius: 8,
                padding: "11px 13px",
                fontFamily: sans,
                fontSize: 14.5,
                color: C.ink,
                background: C.bgSoft,
                resize: "vertical",
                minHeight: 72,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          )}
        </div>
      ))}
      <Btn variant="primary" type="submit" full>Request an Invite</Btn>
      {submitted && (
        <p style={{ marginTop: 14, fontSize: 13.5, color: C.sageDeep, fontWeight: 500 }}>
          Application received — check your email for an access token.
        </p>
      )}
    </form>
  );
}

// ─── Global keyframes (injected once) ────────────────────────────────
const KF = `
@keyframes wz-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
@keyframes wz-fadeIn { from{opacity:0} to{opacity:1} }
@keyframes wz-slideUp { from{opacity:0;transform:translate(-50%,-46%)} to{opacity:1;transform:translate(-50%,-50%)} }
`;

// ─── App ──────────────────────────────────────────────────────────────
export default function App() {
  const [termOpen, setTermOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <style>{KF}</style>

      {/* Nav */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 32px",
            maxWidth: 1180,
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Logo size={48} />
            <span style={{ fontFamily: serif, fontWeight: 500, fontSize: 21, color: C.ink }}>
              Work<em style={{ fontStyle: "normal", color: C.sageDeep }}>zounds</em>
            </span>
          </div>

          {/* desktop nav */}
          <nav
            style={{
              display: "flex",
              gap: 30,
              alignItems: "center",
            }}
            className="hidden md:flex"
          >
            {["Factory Output", "Why Workzounds", "Infrastructure", "Apply"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().split(" ")[0]}`}
                style={{ fontSize: 14.5, color: C.inkSoft, fontWeight: 500, transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.inkSoft)}
              >
                {l}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="#apply">
              <Btn variant="ghost" small>Request Access</Btn>
            </a>
            <Btn variant="primary" small onClick={() => setTermOpen(true)}>
              <Terminal size={14} />
              Enter Terminal
            </Btn>
          </div>
        </div>
      </header>

      <ThreadRule />

      {/* Hero */}
      <section style={{ padding: "88px 0 64px" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "0 32px",
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: 56,
            alignItems: "start",
          }}
        >
          <FadeUp>
            <Eyebrow>Restricted Coder Portal</Eyebrow>
            <h1
              style={{
                fontFamily: serif,
                fontSize: "clamp(38px, 5vw, 56px)",
                lineHeight: 1.06,
                margin: "22px 0",
                color: C.ink,
                letterSpacing: "-0.01em",
                fontWeight: 500,
              }}
            >
              The Micro-Tasking<br />
              Engine for{" "}
              <em style={{ color: C.sageDeep, fontStyle: "italic" }}>Engineers.</em>
            </h1>
            <p style={{ fontSize: 17.5, color: C.inkSoft, maxWidth: 520, marginBottom: 32, lineHeight: 1.6 }}>
              Workzounds is a decentralized product house. We break massive SaaS platforms, AI-driven tools, and digital assets into fast, atomic tasks. Build a real portfolio, ship with modern tooling, and get paid instantly in crypto.
            </p>
            <div style={{ display: "flex", gap: 14, marginBottom: 26, flexWrap: "wrap" }}>
              <Btn variant="primary" onClick={() => setTermOpen(true)}>
                <span style={{ fontFamily: mono }}>&gt;_</span> Enter Terminal
              </Btn>
              <a href="#apply">
                <Btn variant="ghost">
                  Request Access <ArrowRight size={15} />
                </Btn>
              </a>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: mono, fontSize: 12.5, color: C.inkSoft }}>
              <Shield size={14} color={C.sageDeep} />
              Zero-interview pipeline. Secure task ledger. Payouts cleared by Whop.
            </div>
          </FadeUp>

          <FadeUp delay={150}>
            <Monitor />
          </FadeUp>
        </div>
      </section>

      <ThreadRule />

      {/* Factory Output */}
      <section id="factory" style={{ padding: "88px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>
          <FadeUp>
            <div style={{ maxWidth: 640, marginBottom: 48 }}>
              <Eyebrow>Factory Output</Eyebrow>
              <h2 style={{ fontFamily: serif, fontSize: 36, margin: "16px 0 14px", color: C.ink, fontWeight: 500 }}>
                What we build together
              </h2>
              <p style={{ color: C.inkSoft, fontSize: 16 }}>
                Every task connects to a real, shipped product — not a training exercise. Here's where the work lands.
              </p>
            </div>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              {
                idx: "01", monogram: "B", title: "BitForge Assets",
                desc: "Automation workflows and clean interfaces built for premium coaching and creator platforms.",
                tags: ["React", "Automation", "UI"],
              },
              {
                idx: "02", monogram: "S", title: "SaaS Ecosystems",
                desc: "Micro-services, endpoints, and integrations that power large-scale software platforms.",
                tags: ["Node", "API", "Infra"],
              },
              {
                idx: "03", monogram: "D", title: "Digital Products Labs",
                desc: "Advanced Notion systems, interactive maps, and detailed graphic planners for real client launches.",
                tags: ["Notion API", "Design", "Data"],
              },
            ].map((c, i) => (
              <FadeUp key={c.idx} delay={i * 80}>
                <FactoryCard {...c} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Why Workzounds */}
      <section id="why" style={{ padding: "88px 0", background: C.bgSoft }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>
          <FadeUp>
            <div style={{ maxWidth: 640, marginBottom: 48 }}>
              <Eyebrow>Why Workzounds</Eyebrow>
              <h2 style={{ fontFamily: serif, fontSize: 36, margin: "16px 0 14px", color: C.ink, fontWeight: 500 }}>
                Built for how engineers actually want to work
              </h2>
              <p style={{ color: C.inkSoft, fontSize: 16 }}>
                No pitching for free. No endless calls. Just tasks, code, and payout.
              </p>
            </div>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              {
                monogram: "N",
                icon: <CheckCircle2 size={19} />,
                title: "No unpaid pitches",
                desc: "No free tests, no endless interview loops. Find a task, ship it, get paid.",
              },
              {
                monogram: "R",
                icon: <TrendingUp size={19} />,
                title: "Real commercial case studies",
                desc: "You ship live market products, not sandbox exercises. Your GitHub tells a real story.",
              },
              {
                monogram: "F",
                icon: <DollarSign size={19} />,
                title: "Frictionless payouts",
                desc: "Skip local banking delays. Stablecoins land in your wallet in one click.",
              },
            ].map((b, i) => (
              <FadeUp key={b.title} delay={i * 80}>
                <BenefitCard {...b} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section id="infrastructure" style={{ padding: "88px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>
          <FadeUp>
            <div style={{ maxWidth: 560, margin: "0 auto 40px", textAlign: "center" }}>
              <Eyebrow>Ecosystem Integrity</Eyebrow>
              <h2 style={{ fontFamily: serif, fontSize: 36, margin: "16px 0 0", color: C.ink, fontWeight: 500 }}>
                Powered by global infrastructure
              </h2>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
              {[
                { name: "Whop", monogram: "W" },
                { name: "GitHub", monogram: "G" },
                { name: "Vercel", monogram: "V" },
                { name: "Cloudflare", monogram: "C" },
                { name: "Claude", monogram: "Cl" },
                { name: "OpenAI", monogram: "O" },
              ].map((b) => (
                <InfraBadge key={b.name} {...b} />
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <ThreadRule />

      {/* Apply */}
      <section id="apply" style={{ padding: "88px 0", background: C.bgSoft }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "0 32px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 56,
            alignItems: "start",
          }}
        >
          <FadeUp>
            <div>
              <Eyebrow>Application Queue</Eyebrow>
              <h2 style={{ fontFamily: serif, fontSize: 32, margin: "16px 0 14px", color: C.ink, fontWeight: 500 }}>
                No invite code? Request one.
              </h2>
              <p style={{ color: C.inkSoft, fontSize: 15.5, maxWidth: 420 }}>
                Tell us where you build. If your work fits the backlog, you'll receive an access token to enter the terminal.
              </p>
              <div
                style={{
                  marginTop: 22,
                  padding: "16px 18px",
                  borderRadius: 10,
                  background: C.sageTint,
                  border: "1px solid #d3e9df",
                  fontSize: 13.5,
                  color: C.ink,
                }}
              >
                This is a restricted portal. Access is granted, not purchased — every applicant is reviewed against the current backlog.
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <ApplyForm />
          </FadeUp>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.line}`, padding: "28px 0" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "0 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 13,
            color: C.inkSoft,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Logo size={32} />
            <span>© 2026 Workzounds by Starluck Ecosystem.</span>
          </div>
          <span style={{ fontFamily: mono }}>Access is strictly restricted.</span>
        </div>
      </footer>

      {/* Terminal modal */}
      <TerminalModal open={termOpen} onClose={() => setTermOpen(false)} />
    </>
  );
}
