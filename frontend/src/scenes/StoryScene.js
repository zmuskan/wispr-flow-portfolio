import { Camera, ExternalLink } from "lucide-react";
import { STORY } from "@/data/content";
import { MEDIA } from "@/data/media";
import { MediaCarousel, MediaSlot, CodeEditorVisual } from "@/components/media/MediaBits";
import { ArrowDoodle, PaperCard, SketchUnderline } from "@/components/scrapbook/Scrapbook";

const ROTS = [-1.6, 1.2, -0.8, 1.6, -1.1, 0.9, -1.4, 1.1, -0.7];

function CpaExtras() {
  const { supportingImage, instagramUrl } = MEDIA.story.cpa;
  return (
    <div className="mt-1.5 flex items-center gap-1.5">
      <span className="w-7 h-7 rounded-[5px] overflow-hidden shrink-0 border border-[rgba(36,23,18,0.2)] bg-[#221209] flex items-center justify-center">
        {supportingImage?.src ? (
          <img src={supportingImage.src} alt={supportingImage.alt} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <Camera size={11} className="text-cream/40" strokeWidth={1.6} />
        )}
      </span>
      <span className="text-[8.5px] leading-tight opacity-75 mr-auto">
        Creative writing — “Beyond the Siren’s Call”
      </span>
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="cpa-instagram-link"
        className="shrink-0 inline-flex items-center gap-0.5 text-[9px] font-bold text-[#A94B66] hover:underline"
      >
        Reel <ExternalLink size={9} />
      </a>
    </div>
  );
}

function StoryCard({ card, index }) {
  const { id, title, desc } = card;
  const mediaCls = "h-32 sm:h-36 rounded-[7px] overflow-hidden";
  let media = null;
  if (id === "chemical") {
    media = <MediaSlot kind="video" entry={MEDIA.story.chemicalEngineering.video} label="Clip reserved" className={mediaCls} badge muted autoplay loop playsInline />;
  } else if (id === "content") {
    media = <MediaCarousel kind="video" entries={MEDIA.story.contentCreation.videos} testid="content-carousel" className={mediaCls} muted autoplay loop />;
  } else if (id === "cpa") {
    media = <MediaSlot kind="video" entry={MEDIA.story.cpa.video} label="Clip reserved" className={mediaCls} badge muted autoplay loop playsInline />;
  } else if (id === "iedc") {
    media = <MediaSlot kind="image" entry={MEDIA.story.iedc.image} label="Photo reserved" className={mediaCls} objectPosition="center 30%" />;
  } else if (id === "under25") {
    media = <MediaSlot kind="image" entry={MEDIA.story.under25.image} label="Photo reserved" className={mediaCls} />;
  } else if (id === "data") {
    media = <CodeEditorVisual className={mediaCls} />;
  } else if (id === "social") {
    media = <MediaSlot kind="image" entry={MEDIA.story.socialService.media} label="Photo reserved" className={mediaCls} />;
  } else if (id === "candle") {
    media = <MediaCarousel kind="image" entries={MEDIA.story.candleMaking.images} testid="candle-carousel" className={mediaCls} />;
  } else {
    media = <MediaCarousel kind="image" entries={MEDIA.story.braceletMaking.images} testid="bracelet-carousel" className={mediaCls} />;
  }

  return (
    <PaperCard
      rot={ROTS[index]}
      tapeSmall={index % 2 === 0}
      tapeTone={index % 2 === 0 ? "pink" : "cream"}
      className={`p-2.5 pt-3 flex flex-col ${id === "data" ? "story-card story-card--featured" : "story-card"}`}
    >
      {media}
      {id === "cpa" && <CpaExtras />}
      <h3 className="t-play font-bold text-[14.5px] leading-tight mt-2">{title}</h3>
      <p className="text-[10.5px] leading-snug opacity-80 mt-0.5">{desc}</p>
    </PaperCard>
  );
}

export default function StoryScene() {
  return (
    <div className="scene-scroll h-full" data-inner-scroll data-testid="story-content">
      <div className="max-w-[1460px] mx-auto px-6 sm:px-10 xl:px-14 pb-12 relative min-h-full flex flex-col justify-center">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2 pt-1">
          <h2 className="t-serif italic font-medium text-cream text-[clamp(32px,3.8vw,52px)] leading-none">
            {STORY.heading}
          </h2>
          <p className="text-[12px] sm:text-[13px] text-cream/75 leading-snug max-w-[330px] lg:text-right pb-1">
            {STORY.subtitle}
          </p>
        </div>
        <SketchUnderline width={150} className="mt-0.5" />

        <div className="relative mt-5">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
            {STORY.cards.slice(0, 5).map((card, i) => (
              <StoryCard key={card.id} card={card} index={i} />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 mt-4 xl:px-[9%]">
            {STORY.cards.slice(5).map((card, i) => (
              <StoryCard key={card.id} card={card} index={i + 5} />
            ))}
          </div>

          <div className="hidden xl:block absolute left-[40%] top-[24%] pointer-events-none opacity-90" aria-hidden>
            <ArrowDoodle />
          </div>
          <div className="hidden xl:block absolute left-[11%] top-[46%] pointer-events-none opacity-90 rotate-[24deg]" aria-hidden>
            <ArrowDoodle />
          </div>
          <div className="hidden xl:block absolute left-[56%] top-[76%] pointer-events-none opacity-90 -rotate-[14deg]" aria-hidden>
            <ArrowDoodle flip />
          </div>
        </div>

        <div className="scroll-hint xl:hidden">
          <span>keep scrolling</span>
        </div>
      </div>
    </div>
  );
}
