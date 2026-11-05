import { ArrowDown } from "lucide-react";
import { HOME } from "@/data/content";
import { BG_TEXTURE } from "@/data/media";
import { VideoCard } from "@/components/media/MediaBits";
import RoundSecretScroll from "../components/scrapbook/RoundSecretScroll";
import { SketchUnderline, Tape } from "@/components/scrapbook/Scrapbook";

export default function HomeScene({ goTo }) {
  const personalName = "ZAIBA MUSKAN D.M.";
  const professionalDescriptor = "SOFTWARE · DATA · APPLIED AI";
  const supportingCopy = "An engineer by training, a builder by choice, and a storyteller at heart — turning ideas into products, content, and a life I'm proud of.";
  const heroVideo = {
    src: "/assets/images/vids.bne/hero.wispr.mp4",
    alt: "Zaiba smiling at her laptop in warm candlelight",
  };

  return (
    <div
      className="h-full w-full max-w-[1500px] mx-auto px-6 sm:px-12 xl:px-20 pb-10 flex flex-col lg:flex-row items-center justify-center gap-7 lg:gap-10"
      data-testid="home-content"
    >
      <div className="lg:w-[29%] text-center lg:text-left">
        <p className="t-serif italic text-[12px] sm:text-[13px] uppercase tracking-[0.18em] text-[var(--pink)]/90 text-center lg:text-left">
          {personalName}
        </p>
        <p className="mt-2 text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.22em] text-[var(--pink)]/90 text-center lg:text-left">
          {professionalDescriptor}
        </p>
        <div className="mt-1.5 flex justify-center lg:justify-start">
          <SketchUnderline width={175} />
        </div>
        <p className="mt-5 text-[clamp(13px,1vw,15.5px)] leading-relaxed text-cream/85 max-w-[360px] mx-auto lg:mx-0">
          {supportingCopy}
        </p>
        <button
          data-testid="explore-my-world-btn"
          onClick={() => goTo(1)}
          className="btn-pink mt-7 inline-flex items-center gap-2 px-6 py-3 text-[15px]"
        >
          {HOME.cta} <ArrowDown size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="lg:flex-1 w-full max-w-[660px] relative">
        <div className="relative rotate-[-1.2deg]">
          <Tape tone="cream" />
          <VideoCard
            entry={heroVideo}
            fallbackSrc={BG_TEXTURE}
            className="aspect-video rounded-xl overflow-hidden border border-[rgba(255,242,219,0.14)] shadow-[0_26px_60px_rgba(12,5,3,0.6)]"
            objectPosition="center 30%"
            muted
            loop
            autoplay
          />
        </div>
      </div>

      <div className="lg:w-[272px] w-full max-w-[330px] lg:max-w-none shrink-0">
        <RoundSecretScroll />
      </div>
    </div>
  );
}
