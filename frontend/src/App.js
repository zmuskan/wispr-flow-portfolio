import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import { SCENE_NAMES } from "@/data/content";
import { MEDIA, BG_TEXTURE } from "@/data/media";
import HomeScene from "@/scenes/HomeScene";
import StoryScene from "@/scenes/StoryScene";
import ToolkitScene from "@/scenes/ToolkitScene";
import WisprScene from "@/scenes/WisprScene";
import BuildScene from "@/scenes/BuildScene";
import NextScene from "@/scenes/NextScene";

const SCENES = [HomeScene, StoryScene, ToolkitScene, WisprScene, BuildScene, NextScene];
const slug = (s) => s.toLowerCase().replace(/\s+/g, "-");

const isEditable = (el) =>
  !!el && !!el.closest && el.closest('input, textarea, select, [contenteditable="true"], [data-no-scene-nav]');

// Returns true when the gesture should be consumed by an inner scroll container.
const innerScrollable = (target, deltaY) => {
  const sc = target && target.closest ? target.closest("[data-inner-scroll]") : null;
  if (!sc || sc.scrollHeight <= sc.clientHeight + 2) return false;
  const atTop = sc.scrollTop <= 1;
  const atBottom = sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2;
  return (deltaY > 0 && !atBottom) || (deltaY < 0 && !atTop);
};

class SceneErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }
  static getDerivedStateFromError(err) {
    return { err };
  }
  render() {
    if (this.state.err) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-cream/90 px-8 text-center">
          <p className="t-serif italic text-2xl">Something came unstuck in this scene.</p>
          <button className="btn-pink mt-4 px-5 py-2 text-sm" onClick={() => this.setState({ err: null })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function SceneControls({ index, goTo }) {
  return (
    <>
      <div className="dots" role="tablist" aria-label="Scene indicator">
        {SCENE_NAMES.map((name, i) => (
          <button
            key={name}
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to ${name}`}
            data-testid={`dot-${slug(name)}`}
            className={i === index ? "on" : ""}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
      <div className="arrows">
        <button onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous scene" data-testid="prev-scene-btn">
          <ChevronUp size={17} />
        </button>
        <button onClick={() => goTo(index + 1)} disabled={index === 5} aria-label="Next scene" data-testid="next-scene-btn">
          <ChevronDown size={17} />
        </button>
      </div>
    </>
  );
}

function LeafBackground() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  const leaves = [
    { left: 7, top: -18, size: 16, delay: 0, duration: 19, rotate: 18, opacity: 0.48 },
    { left: 12, top: -12, size: 20, delay: 2, duration: 24, rotate: -20, opacity: 0.42 },
    { left: 20, top: -18, size: 15, delay: 5, duration: 21, rotate: 14, opacity: 0.38 },
    { left: 30, top: -16, size: 18, delay: 3, duration: 26, rotate: -14, opacity: 0.44 },
    { left: 38, top: -10, size: 17, delay: 1, duration: 18, rotate: 30, opacity: 0.5 },
    { left: 49, top: -20, size: 21, delay: 4, duration: 22, rotate: -18, opacity: 0.45 },
    { left: 58, top: -12, size: 18, delay: 6, duration: 20, rotate: 20, opacity: 0.39 },
    { left: 67, top: -16, size: 22, delay: 2, duration: 23, rotate: -26, opacity: 0.46 },
    { left: 76, top: -8, size: 16, delay: 4, duration: 19, rotate: 16, opacity: 0.41 },
    { left: 84, top: -22, size: 20, delay: 1, duration: 25, rotate: -24, opacity: 0.44 },
    { left: 91, top: -17, size: 15, delay: 3, duration: 21, rotate: 10, opacity: 0.39 },
    { left: 96, top: -13, size: 18, delay: 7, duration: 24, rotate: -12, opacity: 0.42 },
  ];

  return (
    <div className="leaf-layer" aria-hidden="true">
      {leaves.map((leaf, index) => (
        <span
          key={index}
          className="leaf"
          style={{
            left: `${leaf.left}%`,
            top: `${leaf.top}px`,
            width: `${leaf.size}px`,
            height: `${leaf.size * 1.38}px`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
            opacity: leaf.opacity,
            '--leaf-rotation': `${leaf.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const lockRef = useRef(false);
  const lockTimer = useRef(null);
  const accRef = useRef(0);
  const lastWheel = useRef(0);
  const touchRef = useRef(null);
  const reduced = useReducedMotion();

  const goTo = useCallback((i) => {
    if (lockRef.current) return;
    const next = Math.max(0, Math.min(SCENE_NAMES.length - 1, i));
    if (next === indexRef.current) return;
    indexRef.current = next;
    lockRef.current = true;
    clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      lockRef.current = false;
    }, 750);
    setIndex(next);
  }, []);

  useEffect(() => {
    const onWheel = (e) => {
      if (isEditable(e.target)) return;
      if (innerScrollable(e.target, e.deltaY)) return;
      e.preventDefault();
      if (lockRef.current) {
        accRef.current = 0;
        return;
      }
      const now = Date.now();
      if (now - lastWheel.current > 240) accRef.current = 0;
      lastWheel.current = now;
      accRef.current += e.deltaY;
      if (Math.abs(accRef.current) >= 48) {
        const dir = accRef.current > 0 ? 1 : -1;
        accRef.current = 0;
        goTo(indexRef.current + dir);
      }
    };

    const onKey = (e) => {
      if (isEditable(document.activeElement)) return;
      const cur = indexRef.current;
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(e.key)) {
        e.preventDefault();
        goTo(cur + 1);
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(cur - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(SCENE_NAMES.length - 1);
      }
    };

    const onTouchStart = (e) => {
      const t = e.touches[0];
      touchRef.current = { x: t.clientX, y: t.clientY, target: e.target };
    };
    const onTouchEnd = (e) => {
      if (!touchRef.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchRef.current.x;
      const dy = t.clientY - touchRef.current.y;
      const startTarget = touchRef.current.target;
      touchRef.current = null;
      if (Math.abs(dy) < 70 || Math.abs(dy) < Math.abs(dx) * 1.4) return;
      if (startTarget && startTarget.closest && startTarget.closest("a, button, input, textarea, select")) return;
      if (innerScrollable(startTarget, dy)) return;
      goTo(indexRef.current + (dy > 0 ? 1 : -1));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      clearTimeout(lockTimer.current);
    };
  }, [goTo]);

  const Scene = SCENES[index];

  return (
    <div className="app-root" data-testid="app-root">
      <div className="bg-texture" style={{ backgroundImage: `url(${BG_TEXTURE})` }} aria-hidden="true" />
      <div className="bg-vignette" aria-hidden="true" />
      <LeafBackground />
      <Navigation index={index} goTo={goTo} />

      <main className="scene-viewport" data-testid="scene-viewport">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="scene"
            data-testid={`scene-${slug(SCENE_NAMES[index])}`}
            initial={{ opacity: 0, y: 26, scale: 0.985 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: reduced ? 0.01 : 0.62, ease: [0.45, 0.05, 0.25, 1] },
            }}
            exit={{
              opacity: 0,
              y: -22,
              scale: 0.99,
              transition: { duration: reduced ? 0.01 : 0.45, ease: "easeIn" },
              pointerEvents: "none",
            }}
          >
            <SceneErrorBoundary>
              <Scene goTo={goTo} />
            </SceneErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>

      <SceneControls index={index} goTo={goTo} />

      {index === 4 && MEDIA.next?.video?.src && (
        <video src={MEDIA.next.video.src} preload="auto" muted className="hidden" aria-hidden="true" tabIndex={-1} />
      )}
    </div>
  );
}
