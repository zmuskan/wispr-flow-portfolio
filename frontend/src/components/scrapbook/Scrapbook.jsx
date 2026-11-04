import { Camera, Clapperboard, MonitorPlay } from "lucide-react";

export function Tape({ tone = "pink", small = false, style, className = "" }) {
  return <span aria-hidden className={`tape tape--${tone} ${small ? "tape--sm" : ""} ${className}`} style={style} />;
}

export function PaperCard({ children, className = "", rot = 0, tape = true, tapeTone = "pink", tapeSmall = false, hover = true, style }) {
  return (
    <div
      className={`paper ${hover ? "paper-hover" : ""} ${className}`}
      style={{ "--rot": `${rot}deg`, ...style }}
    >
      {tape && <Tape tone={tapeTone} small={tapeSmall} />}
      {children}
    </div>
  );
}

export function SketchUnderline({ className = "", width = 160 }) {
  return (
    <svg viewBox="0 0 220 14" preserveAspectRatio="none" style={{ width, height: 12 }} className={className} aria-hidden>
      <path d="M4 9 C 40 4, 78 11, 112 7 C 150 3, 186 9, 216 6" stroke="var(--rose)" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M10 12 C 60 8, 130 12, 204 9" stroke="var(--rose)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.65" />
    </svg>
  );
}

export function CheckTick({ size = 14, color = "currentColor", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style} className="cert-marker" aria-hidden>
      <path
        d="M2.2 2.9 C 6 2.3, 11 2.4, 13.8 2.7 C 13.9 6, 13.8 11, 13.5 13.6 C 9.5 13.9, 5 13.8, 2.4 13.5 C 2.1 10, 2 6, 2.2 2.9 Z"
        stroke={color} strokeWidth="1.4" strokeLinejoin="round"
      />
      <path d="M4.7 8.1 C 6 9.3, 6.8 10.5, 7.2 10.9 C 8.4 9, 10.4 6.6, 11.6 5.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function HeartDoodle({ size = 14, color = "var(--rose)", className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M8 13.6 C 3.8 10.6, 2.6 8.2, 3.9 6.4 C 5 4.9, 7 5.3, 8 7 C 9 5.3, 11 4.9, 12.1 6.4 C 13.4 8.2, 12.2 10.6, 8 13.6 Z"
        stroke={color} strokeWidth="1.4"
      />
    </svg>
  );
}

export function StarDoodle({ size = 16, color = "var(--gold)", className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 2 C 13 8, 16 11, 22 12 C 16 13, 13 16, 12 22 C 11 16, 8 13, 2 12 C 8 11, 11 8, 12 2 Z"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowDoodle({ className = "", flip = false }) {
  return (
    <svg width="52" height="30" viewBox="0 0 60 34" fill="none" className={className} aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M5 7 C 20 26, 36 28, 52 15" stroke="var(--rose)" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 5" />
      <path d="M45 11 L 54 14 L 47 23" stroke="var(--rose)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function HandwrittenNote({ title, items, heart = false, rot = 1.5, tapeTone = "cream", className = "", testid }) {
  return (
    <PaperCard rot={rot} tapeTone={tapeTone} className={`p-5 pt-6 ${className}`} hover={false}>
      <h3 className="t-hand font-bold text-[24px] leading-none text-[var(--ink)]">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2.5 t-hand text-[17.5px] leading-none text-[var(--ink)]">
            <CheckTick size={15} color="var(--ink)" />
            <span>{item}</span>
            {heart && i === items.length - 1 && <HeartDoodle className="ml-0.5" />}
          </li>
        ))}
      </ul>
      {testid && <div data-testid={testid} hidden />}
    </PaperCard>
  );
}

const PH_ICONS = { video: Clapperboard, image: Camera, screenshot: MonitorPlay };
const PH_LABELS = { video: "Clip reserved", image: "Photo reserved", screenshot: "Screenshot reserved" };

export function MediaPlaceholder({ kind = "image", label, className = "" }) {
  const Icon = PH_ICONS[kind] || Camera;
  return (
    <div className={`placeholder-media ${className}`} role="img" aria-label={label || PH_LABELS[kind]}>
      <Icon size={17} className="text-[rgba(255,242,219,0.4)] relative z-[1]" strokeWidth={1.6} />
      <span className="ph-label">{label || PH_LABELS[kind]}</span>
    </div>
  );
}
