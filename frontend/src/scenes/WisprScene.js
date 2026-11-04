import { useState } from "react";
import { FileText, RotateCcw } from "lucide-react";
import { WISPR } from "@/data/content";
import { MEDIA } from "@/data/media";
import { TypeInText, Waveform, WhatsAppDemo, UseCaseCard } from "@/components/wispr/WisprBits";
import { ArrowDoodle, SketchUnderline } from "@/components/scrapbook/Scrapbook";

function Placeholder({ label }) {
  return (
    <div className="h-[52px] rounded-[7px] border border-[rgba(255,242,219,0.16)] bg-[#221209] relative overflow-hidden flex items-center justify-center">
      <span className="absolute inset-1.5 border border-dashed border-[rgba(255,242,219,0.2)] rounded-[4px]" />
      <span className="text-[7.5px] tracking-[0.14em] uppercase font-bold text-cream/45">{label}</span>
    </div>
  );
}

export default function WisprScene() {
  const [replayKey, setReplayKey] = useState(0);
  const w = WISPR;

  return (
    <div className="scene-scroll h-full" data-inner-scroll data-testid="wispr-content">
      <div className="wispr-scene-shell px-6 sm:px-10 xl:px-14 pb-8 min-h-full">
        <h2 className="wispr-title t-serif italic font-medium text-cream leading-none">{w.heading}</h2>
        <SketchUnderline width={150} className="mt-1" />
        <p className="wispr-subtitle mt-3 text-cream/80">{w.subtitle}</p>

        <div className="wispr-content-grid mt-6">
          <div className="spoken-prompt-card rounded-xl border border-[rgba(255,242,219,0.14)] bg-[#1B100D] shadow-[var(--shadow-paper)]">
            <h3 className="text-[10.5px] font-extrabold tracking-[0.12em] uppercase text-[#F0A6B8]">1. Spoken Prompt</h3>
            <div className="flex items-center gap-3 mt-3">
              <Waveform height={30} />
              <span className="text-[10px] font-bold text-[var(--gold)]">{w.spokenDuration}</span>
            </div>
            <p className="mt-3 t-serif italic text-[12px] leading-snug text-cream/75">“{w.spoken}”</p>
          </div>

          <div className="wispr-output-card paper" style={{ "--rot": "0deg" }}>
            <h3 className="text-[10.5px] font-extrabold tracking-[0.12em] uppercase text-[var(--ink)]/70">2. Wispr Flow Output</h3>
            <div className="flex items-center gap-1.5 mt-2 text-[var(--ink)]/55">
              <FileText size={12} />
              <span className="text-[9px] font-bold tracking-wide">DICTATED TEXT</span>
            </div>
            <TypeInText
              key={replayKey}
              text="Build a personal portfolio that reflects my journey across software, data and applied AI. Make it feel personal, warm and different from a conventional developer portfolio."
              speed={24}
              testid="wispr-typein"
              className="mt-1.5 text-[10.5px] leading-snug min-h-[84px] text-[var(--ink)]/85"
            />
            <div className="flex items-center justify-between gap-2 mt-1">
              <p className="text-[8.5px] leading-tight opacity-65">{w.outputCaption}</p>
              <button
                data-testid="wispr-replay-btn"
                onClick={() => setReplayKey((k) => k + 1)}
                aria-label="Replay transcription"
                className="shrink-0 inline-flex items-center gap-1 text-[9.5px] font-bold text-[#A94B66] hover:underline"
              >
                <RotateCcw size={10} /> Replay
              </button>
            </div>
          </div>

          <div className="emergent-card paper" style={{ "--rot": "0deg" }}>
            <h3 className="text-[10.5px] font-extrabold tracking-[0.12em] uppercase text-[var(--ink)]/70">
              3. Emergent Output + My Correction
            </h3>
            <div className="mt-3 flex flex-col gap-2.5">
              <div className="rounded-[7px] border border-[rgba(255,242,219,0.16)] bg-[#221209] p-1.5 shadow-[var(--shadow-paper)] overflow-hidden">
                <img
                  src="/assets/images/emergent/emergent1.jpeg"
                  alt="Original Emergent output"
                  className="block w-full max-w-[390px] mx-auto h-auto rounded-[5px] object-contain bg-[#160d0a]"
                />
              </div>
              <div className="emergent-prompt mx-auto w-full max-w-[390px] bg-[rgba(240,166,184,0.55)] rounded-[6px] rotate-[-1.6deg] px-2.5 py-2 t-hand text-[12.5px] leading-tight text-center text-[var(--ink)] shadow-[0_3px_8px_rgba(0,0,0,0.15)] ring-1 ring-[rgba(58,29,21,0.15)]">
                “Make it feel more personal. I want an editorial scrapbook aesthetic, warm colours, storytelling and a distinctive visual identity.”
              </div>
              <div className="rounded-[7px] border border-[rgba(255,242,219,0.16)] bg-[#221209] p-1.5 shadow-[var(--shadow-paper)] overflow-hidden">
                <img
                  src="/assets/images/emergent/emergent3.jpeg"
                  alt="Improved Emergent output"
                  className="block w-full max-w-[390px] mx-auto h-auto rounded-[5px] object-contain bg-[#160d0a]"
                />
              </div>
            </div>
            <p className="mt-3 text-[8.5px] leading-tight opacity-65">From first output to a more intentional result.</p>
          </div>

          <div className="whatsapp-column">
            <div className="torn-title px-6 py-2.5 rotate-[-1.5deg]">
              <span className="t-play italic font-semibold text-[clamp(16px,1.5vw,20px)] leading-[1.15] block text-center">
                {w.rightTitle[0]}
                <br />
                {w.rightTitle[1]}
              </span>
            </div>
            <h3 className="mt-3 t-serif italic text-[clamp(16px,1.5vw,19px)] leading-tight text-cream">{w.demoHeadline}</h3>
            <p className="mt-1 text-[11.5px] leading-snug text-cream/75 max-w-[270px]">{w.demoCopy}</p>
            <div className="mt-3">
              <WhatsAppDemo />
            </div>
          </div>

          <div className="voice-feature-list">
            {w.useCases.map((u) => (
              <UseCaseCard key={u.title} icon={u.icon} title={u.title} desc={u.desc} className="voice-feature-card" />
            ))}
          </div>
        </div>

        <p className="mt-3 text-[9px] italic text-cream/50">{w.logDisclaimer}</p>
      </div>
    </div>
  );
}
