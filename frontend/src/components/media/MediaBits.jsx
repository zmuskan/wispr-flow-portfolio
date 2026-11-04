import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { MediaPlaceholder } from "@/components/scrapbook/Scrapbook";

export function VideoCard({
  entry,
  className = "",
  objectPosition = "center",
  badge = false,
  loop = true,
  autoplay = true,
  controls = false,
  muted = false,
  playsInline = true,
  fallbackSrc = null,
  onEnded,
}) {
  const reduced = useReducedMotion();
  const wrapRef = useRef(null);
  const vidRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [playBlocked, setPlayBlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;

    const tryAutoplay = async () => {
      if (!inView || !autoplay || reduced) {
        v.pause();
        setIsPlaying(false);
        return;
      }
      v.muted = muted;
      try {
        await v.play();
        setPlayBlocked(false);
        setIsPlaying(true);
      } catch {
        setPlayBlocked(true);
        setIsPlaying(false);
      }
    };

    tryAutoplay();
  }, [autoplay, inView, muted, reduced, entry.src]);

  return (
    <div ref={wrapRef} className={`media-frame ${className}`}>
      <video
        ref={vidRef}
        src={entry.src}
        autoPlay={autoplay && !reduced}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload="auto"
        controls={controls}
        aria-label={entry.alt}
        style={{ objectPosition, display: videoFailed ? "none" : undefined }}
        onPlay={() => {
          setPlayBlocked(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={onEnded}
        onError={() => setVideoFailed(true)}
        onLoadedData={() => setVideoFailed(false)}
      />
      {videoFailed && fallbackSrc && (
        <img src={fallbackSrc} alt={entry.alt || "Video fallback"} className="w-full h-full object-cover" style={{ objectPosition }} />
      )}
      {badge && (
        <span className="play-badge" aria-hidden>
          <Play size={11} fill="currentColor" />
        </span>
      )}
    </div>
  );
}

export function MediaSlot({
  entry,
  kind = "image",
  label,
  className = "",
  objectPosition = "center",
  badge = false,
  muted = false,
  autoplay = true,
  loop = true,
  controls = false,
  playsInline = true,
}) {
  if (!entry || !entry.src) {
    return <MediaPlaceholder kind={kind === "video" ? "video" : kind === "screenshot" ? "screenshot" : "image"} label={label} className={className} />;
  }
  if (kind === "video") {
    return (
      <VideoCard
        entry={entry}
        className={className}
        objectPosition={objectPosition}
        badge={badge}
        muted={muted}
        autoplay={autoplay}
        loop={loop}
        controls={controls}
        playsInline={playsInline}
      />
    );
  }
  return (
    <div className={`media-frame ${className}`}>
      <img src={entry.src} alt={entry.alt || ""} loading="lazy" style={{ objectPosition }} className="ken-burns" />
    </div>
  );
}

export function MediaCarousel({ entries, kind = "image", label, className = "", objectPosition = "center", testid, muted = false, autoplay = true, loop = true, controls = false, playsInline = true }) {
  const withSrc = entries.filter((e) => e && e.src);
  const [i, setI] = useState(0);
  const n = withSrc.length;

  useEffect(() => {
    if (kind !== "image" || n <= 1) return undefined;
    const timer = setInterval(() => {
      setI((prev) => (prev + 1) % n);
    }, 3000);
    return () => clearInterval(timer);
  }, [kind, n]);

  if (n === 0) {
    const unit = kind === "video" ? "clips" : "photos";
    return <MediaPlaceholder kind={kind === "video" ? "video" : "image"} label={label || `${entries.length} ${unit} reserved`} className={className} />;
  }

  const cur = withSrc[i % n];
  const go = (d) => setI((prev) => (prev + d + n) % n);

  return (
    <div className={`media-frame ${className}`} data-testid={testid}>
      {kind === "video" ? (
        <VideoCard
          key={cur.src}
          entry={cur}
          className="w-full h-full"
          objectPosition={objectPosition}
          autoplay={autoplay}
          loop={loop && n === 1 ? true : loop}
          muted={muted}
          controls={controls}
          playsInline={playsInline}
          onEnded={() => go(1)}
        />
      ) : (
        <img key={cur.src} src={cur.src} alt={cur.alt || ""} loading="lazy" style={{ objectPosition }} className="ken-burns" />
      )}
      {n > 1 && (
        <>
          <button className="car-btn left-1.5" onClick={() => go(-1)} aria-label="Previous" data-testid={`${testid}-prev`}>
            <ChevronLeft size={13} />
          </button>
          <button className="car-btn right-1.5" onClick={() => go(1)} aria-label="Next" data-testid={`${testid}-next`}>
            <ChevronRight size={13} />
          </button>
          <div className="car-dots" aria-hidden>
            {withSrc.map((_, d) => (
              <span key={d} className={d === i % n ? "on" : ""} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function CodeEditorVisual({ className = "" }) {
  return (
    <div className={`code-editor ${className}`} aria-hidden="true">
      <div className="ce-bar">
        <span className="ce-dots"><i /><i /><i /></span>
        <span className="ce-tabs">
          <span className="ce-tab on">pipeline.py</span>
          <span className="ce-tab">query.sql</span>
        </span>
      </div>
      <div className="ce-code">
        <div className="ce-line"><span className="tk-k">import</span> pandas <span className="tk-k">as</span> pd</div>
        <div className="ce-line">df = pd.read_sql(<span className="tk-s">"SELECT * FROM events"</span>, db)</div>
        <div className="ce-line">df = df.dropna(subset=[<span className="tk-s">"user_id"</span>])</div>
        <div className="ce-line">out = df.groupby(<span className="tk-s">"city"</span>).agg(</div>
        <div className="ce-line">&nbsp;&nbsp;plays=(<span className="tk-s">"id"</span>, <span className="tk-s">"count"</span>))</div>
        <div className="ce-line"><span className="tk-c"># score locality features → rank</span></div>
      </div>
      <div className="ce-term">
        <span className="tk-p">$</span> python pipeline.py
        <br />
        <span className="tk-ok">✓</span> 3,204 rows cleaned · features scored<span className="ce-cursor" />
      </div>
    </div>
  );
}
