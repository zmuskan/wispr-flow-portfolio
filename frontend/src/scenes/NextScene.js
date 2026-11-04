import { ArrowDown, Github, Globe, Instagram, Linkedin, Mail } from "lucide-react";
import { CONTACT } from "@/data/content";
import { MEDIA } from "@/data/media";
import { VideoCard } from "@/components/media/MediaBits";
import { CheckTick, SketchUnderline, StarDoodle } from "@/components/scrapbook/Scrapbook";

const LINK_ICONS = { linkedin: Linkedin, github: Github, mail: Mail, instagram: Instagram, globe: Globe };

export default function NextScene() {
  const c = CONTACT;
  const emailLink = c.links.find((l) => l.email);
  const mailtoLink = emailLink?.url || "mailto:zaibamuskan60@gmail.com";

  return (
    <div className="relative h-full w-full overflow-hidden" data-testid="next-content">
      <div className="absolute inset-0 overflow-hidden">
        <VideoCard
          entry={MEDIA.next.video}
          className="absolute inset-0 w-full h-full"
          objectPosition="center 38%"
          muted={true}
          autoplay={true}
          loop={true}
          playsInline={true}
        />
      </div>
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(90deg, rgba(20,10,6,0.68) 0%, rgba(20,10,6,0.22) 40%, rgba(20,10,6,0.08) 58%, rgba(20,10,6,0.55) 100%), linear-gradient(rgba(20,10,6,0.2), rgba(20,10,6,0.4))",
        }}
      />

      <div className="relative z-10 h-full max-w-[1500px] mx-auto px-7 sm:px-12 xl:px-20 pb-16 pt-3 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <ul className="space-y-2.5 lg:pb-10" data-testid="next-checklist">
          {c.checklist.map((item) => (
            <li key={item} className="flex items-center gap-2.5 t-hand text-[clamp(18px,1.7vw,23px)] leading-none text-cream drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
              <CheckTick size={17} color="var(--pink)" />
              <span>{item}</span>
            </li>
          ))}
          <StarDoodle size={17} className="ml-1 mt-1" />
        </ul>

        <div className="lg:max-w-[560px] flex flex-col items-start lg:items-end lg:text-right">
          <h2 className="t-serif italic font-medium text-cream text-[clamp(44px,5vw,68px)] leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
            {c.heading}
          </h2>
          <SketchUnderline width={170} className="mt-1.5" />
          <p className="mt-4 text-[clamp(13px,1.05vw,15.5px)] leading-relaxed text-cream/90 max-w-[520px]">{c.copy}</p>

          <div className="mt-6 flex flex-wrap items-center justify-start gap-3 lg:justify-end">
            <a
              href={c.resume}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="download-resume-btn"
              className="btn-pink inline-flex items-center gap-2 px-6 py-3 text-[15px]"
            >
              Download Résumé <ArrowDown size={16} strokeWidth={2.5} />
            </a>
            <a
              href={mailtoLink}
              data-testid="contact-me-btn"
              className="btn-pink inline-flex items-center justify-center gap-2 px-6 py-3 text-[15px]"
            >
              Contact Me
            </a>
          </div>

          <div className="mt-5 flex gap-2.5">
            {c.links.map((link) => {
              const Icon = LINK_ICONS[link.icon];
              return (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  aria-label={link.label}
                  title={link.label}
                  data-testid={`contact-${link.label.toLowerCase()}-link`}
                  className="social-btn"
                >
                  <Icon size={17} strokeWidth={1.8} />
                </a>
              );
            })}
          </div>
          {emailLink && <p className="mt-2 text-[11px] text-cream/70">{emailLink.email}</p>}
        </div>
      </div>
    </div>
  );
}
