import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowDown, Github, Globe, Instagram, Linkedin, Mail } from "lucide-react";
import { CONTACT } from "@/data/content";
import { MEDIA } from "@/data/media";
import { VideoCard } from "@/components/media/MediaBits";
import { CheckTick, SketchUnderline, StarDoodle } from "@/components/scrapbook/Scrapbook";

const LINK_ICONS = { linkedin: Linkedin, github: Github, mail: Mail, instagram: Instagram, globe: Globe };

function RippleOverlay() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();
  const ripplesRef = useRef([]);

  useEffect(() => {
    if (reduced) return undefined;

    const canvas = canvasRef.current;
    const wrap = canvas?.parentElement;
    if (!canvas || !wrap) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const addRipple = (x, y) => {
      ripplesRef.current.push({ x, y, radius: 8, alpha: 0.42, growth: 1.8 });
      if (ripplesRef.current.length > 16) ripplesRef.current.shift();
    };

    const pointerMove = (event) => {
      const rect = wrap.getBoundingClientRect();
      addRipple(event.clientX - rect.left, event.clientY - rect.top);
    };

    const touchMove = (event) => {
      const touch = event.touches?.[0];
      if (!touch) return;
      const rect = wrap.getBoundingClientRect();
      addRipple(touch.clientX - rect.left, touch.clientY - rect.top);
    };

    resize();
    window.addEventListener("resize", resize);
    wrap.addEventListener("pointermove", pointerMove);
    wrap.addEventListener("pointerdown", pointerMove);
    wrap.addEventListener("touchstart", touchMove, { passive: true });
    wrap.addEventListener("touchmove", touchMove, { passive: true });

    let rafId;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const next = [];
      ripplesRef.current.forEach((ripple) => {
        ripple.radius += ripple.growth;
        ripple.alpha *= 0.94;
        if (ripple.alpha > 0.03) {
          next.push(ripple);
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(200, 232, 255, ${ripple.alpha})`;
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.62, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.alpha * 0.7})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });
      ripplesRef.current = next;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("pointermove", pointerMove);
      wrap.removeEventListener("pointerdown", pointerMove);
      wrap.removeEventListener("touchstart", touchMove);
      wrap.removeEventListener("touchmove", touchMove);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="next-ripple-layer" aria-hidden="true" />;
}

export default function NextScene() {
  const c = CONTACT;
  const emailLink = c.links.find((l) => l.email);
  const mailtoLink = emailLink?.url || "mailto:zaibamuskan60@gmail.com";

  return (
    <div className="next-scene" data-testid="next-content">
      <div className="next-video-shell">
        <VideoCard
          entry={MEDIA.next.video}
          className="next-video-card"
          objectPosition="center 38%"
          muted={true}
          autoplay={true}
          loop={true}
          playsInline={true}
        />
        <RippleOverlay />
      </div>
      <div className="next-scene-overlay" aria-hidden />

      <div className="next-scene-content">
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
