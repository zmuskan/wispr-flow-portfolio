import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/data/content";
import { MEDIA } from "@/data/media";
import { PaperCard, SketchUnderline } from "@/components/scrapbook/Scrapbook";

const ROTS = [-1.1, 0.9, -0.8, 1.1];

function ProjectMedia({ media, className }) {
  const videoRef = useRef(null);
  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(media?.src || "");

  useEffect(() => {
    if (!isVideo || !videoRef.current) return undefined;

    const video = videoRef.current;
    const handleVisibility = (entry) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(([entry]) => handleVisibility(entry), { threshold: 0.2 });
    observer.observe(video);

    return () => observer.disconnect();
  }, [isVideo]);

  if (isVideo) {
    return (
      <div className={`media-frame ${className}`}>
        <video
          ref={videoRef}
          src={media.src}
          autoPlay
          loop
          muted
          playsInline
          controls
          preload="metadata"
          aria-label={media.alt || "Project media"}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
    );
  }

  return (
    <div className={`media-frame ${className}`}>
      <img src={media.src} alt={media.alt || "Project media"} loading="lazy" style={{ objectFit: "cover", objectPosition: "center" }} />
    </div>
  );
}

function ProjectCard({ p, i }) {
  const media = MEDIA.build[p.id];

  return (
    <PaperCard rot={ROTS[i]} tapeSmall tapeTone={i % 2 === 0 ? "cream" : "pink"} className="p-2.5 pt-3.5 flex flex-col">
      <ProjectMedia media={media} className="h-28 rounded-[7px] overflow-hidden" />
      <h3 className="t-play font-extrabold text-[15px] leading-tight mt-2">{p.name}</h3>
      <p className="text-[8px] uppercase tracking-[0.08em] font-extrabold text-[#7A5A33] leading-tight mt-0.5">{p.sub}</p>
      <p className="text-[10.5px] leading-snug opacity-85 mt-1.5">{p.desc}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        {p.tech.map((t) => (
          <span key={t} className="chip !text-[8.5px] !px-1.5">
            {t}
          </span>
        ))}
      </div>
      {(p.live || p.github) && (
        <div className="mt-auto pt-2.5 flex gap-1.5">
          {p.live && (
            <a href={p.live} target="_blank" rel="noopener noreferrer" data-testid={`${p.id}-live-link`} className="proj-link">
              Live <ArrowUpRight size={9} />
            </a>
          )}
          {p.github && (
            <a href={p.github} target="_blank" rel="noopener noreferrer" data-testid={`${p.id}-github-link`} className="proj-link">
              GitHub <ArrowUpRight size={9} />
            </a>
          )}
        </div>
      )}
    </PaperCard>
  );
}

export default function BuildScene() {
  const p = PROJECTS;
  return (
    <div className="scene-scroll h-full" data-inner-scroll data-testid="build-content">
      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 xl:px-14 pb-10 min-h-full flex flex-col justify-center">
        <div className="mb-4 text-center xl:text-left">
          <h2 className="t-serif italic font-medium text-cream text-[clamp(30px,3.5vw,52px)] leading-none">Projects</h2>
          <SketchUnderline width={150} className="mt-1 mx-auto xl:mx-0" />
          <p className="mt-3 text-[12.5px] sm:text-[13.5px] leading-relaxed text-cream/80 max-w-[640px] mx-auto xl:mx-0">
            Things I've built, problems I've explored, and work I've taken ownership of.
          </p>
        </div>

        <div className="mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 justify-items-center xl:justify-items-stretch">
            {p.items.map((item, i) => (
              <div key={item.id} className={item.id === "pat" ? "relative pt-8 sm:pt-7" : "relative"}>
                {item.id === "pat" && (
                  <div className="pat-annotation" aria-hidden="true">
                    <span className="t-hand text-[20px] leading-none text-[var(--ink)]/85">EXPERIENCE</span>
                    <svg viewBox="0 0 180 86" className="w-[140px] sm:w-[150px] h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 58C24 47 36 35 52 28C72 19 100 18 120 26C131 30 144 37 164 48" stroke="rgba(217,139,156,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M156 48L166 48L161 41" stroke="rgba(217,139,156,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                <ProjectCard p={item} i={i} />
              </div>
            ))}
          </div>
        </div>

        <div className="scroll-hint xl:hidden">
          <span>keep scrolling</span>
        </div>
      </div>
    </div>
  );
}
