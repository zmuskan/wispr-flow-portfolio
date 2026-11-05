import React, { useCallback, useEffect, useRef } from "react";
import "./WalkingGirlCursor.css";

function WalkingGirlArt() {
  return (
    <svg viewBox="0 0 240 480" className="walking-girl-svg" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="fabric" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffdf8" />
          <stop offset="0.48" stopColor="#f4eee8" />
          <stop offset="1" stopColor="#ded5d0" />
        </linearGradient>
        <linearGradient id="skirt" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#fffdfb" />
          <stop offset="0.6" stopColor="#f4efeb" />
          <stop offset="1" stopColor="#dcd4d0" />
        </linearGradient>
        <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e9b99f" />
          <stop offset="1" stopColor="#c98e79" />
        </linearGradient>
        <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#30201f" />
          <stop offset="1" stopColor="#120f12" />
        </linearGradient>
      </defs>

      <ellipse cx="120" cy="459" rx="54" ry="8" fill="#3d261f" opacity="0.16" />

      <g id="hair">
        <path d="M82 56 C76 28 95 12 120 14 C146 14 163 33 157 65 C153 91 146 109 133 116 L89 105 C79 91 76 74 82 56Z" fill="url(#hair)" />
        <circle cx="153" cy="29" r="17" fill="#211719" />
        <path d="M143 22 C151 9 166 15 168 28 C164 39 153 43 145 35Z" fill="#392324" />
      </g>

      <g id="left-leg" className="walking-state leg-left">
        <path d="M103 337 C99 370 94 407 91 445 L108 448 C119 414 125 378 128 342Z" fill="url(#skin)" />
        <path d="M90 442 C82 448 76 458 80 464 C89 469 108 467 116 462 L109 447Z" fill="#e8d6cc" />
        <path d="M83 460 Q98 466 115 460" fill="none" stroke="#c99e91" strokeWidth="2" />
      </g>
      <g id="right-leg" className="walking-state leg-right">
        <path d="M128 337 C134 369 143 405 151 445 L168 441 C165 402 157 365 151 335Z" fill="url(#skin)" />
        <path d="M148 440 C143 449 145 461 154 464 C164 467 181 462 183 455 L169 440Z" fill="#ead9d0" />
        <path d="M151 458 Q166 464 181 454" fill="none" stroke="#c99e91" strokeWidth="2" />
      </g>

      <g id="skirt" className="walking-state skirt">
        <path d="M91 263 C79 306 67 370 57 438 Q118 462 187 438 C177 374 163 306 151 263Z" fill="url(#skirt)" stroke="#d9d0cb" strokeWidth="2" />
        <path d="M111 278 C108 334 109 390 105 449" fill="none" stroke="#d6ccc7" strokeWidth="2" opacity="0.7" />
        <path d="M145 280 C151 341 158 398 166 447" fill="none" stroke="#fff" strokeWidth="2" opacity="0.8" />
        <path d="M62 433 Q120 450 184 433" fill="none" stroke="#cfc4bf" strokeWidth="2" />
      </g>

      <g id="left-arm" className="walking-state arm-left">
        <path d="M88 150 C69 177 63 219 66 258 L79 266 C91 235 98 193 107 166Z" fill="url(#skin)" />
        <path d="M65 251 Q58 266 65 277 Q74 282 80 269 L79 255Z" fill="url(#skin)" />
      </g>
      <g id="right-arm" className="walking-state arm-right">
        <path d="M151 150 C173 177 179 219 175 258 L162 266 C150 235 143 193 134 166Z" fill="url(#skin)" />
        <path d="M175 251 Q183 266 175 277 Q166 282 161 269 L162 255Z" fill="url(#skin)" />
      </g>

      <g id="kurta" className="walking-state kurta">
        <path d="M91 115 Q120 105 149 115 L168 153 L190 274 L157 310 L120 279 L83 310 L50 274 L72 153Z" fill="url(#fabric)" stroke="#d6cbc5" strokeWidth="2" />
        <path d="M91 116 Q120 132 149 116 L143 145 Q120 157 97 145Z" fill="#f7f1ed" stroke="#d8cec8" />
        <path d="M91 116 Q120 134 149 116" fill="none" stroke="#cfc4bf" strokeWidth="2" />
        <path d="M75 160 L59 271 M165 160 L181 271" stroke="#fff" strokeWidth="5" opacity="0.65" />
        <g fill="none" stroke="#d9b8b2" strokeWidth="1.7" opacity="0.9">
          <path d="M79 188 q-9 -8 -3 -14 q8 -4 9 6 q7 -8 12 -1 q2 8 -8 9 q8 8 1 13 q-8 1 -9 -8 q-7 8 -12 1 q-1 -7 10 -6Z" />
          <path d="M151 187 q-8 -8 -2 -14 q8 -4 9 6 q7 -8 12 -1 q2 8 -8 9 q8 8 1 13 q-8 1 -9 -8 q-7 8 -12 1 q-1 -7 9 -6Z" />
          <path d="M119 218 q-8 -8 -2 -14 q8 -4 9 6 q7 -8 12 -1 q2 8 -8 9 q8 8 1 13 q-8 1 -9 -8 q-7 8 -12 1 q-1 -7 9 -6Z" />
          <path d="M83 250 q-7 -7 -2 -12 q7 -3 8 5 q6 -7 10 -1 q2 7 -7 8 q7 7 1 11 q-7 1 -8 -7 q-6 7 -11 1 q-1 -6 9 -5Z" />
          <path d="M151 250 q-7 -7 -2 -12 q7 -3 8 5 q6 -7 10 -1 q2 7 -7 8 q7 7 1 11 q-7 1 -8 -7 q-6 7 -11 1 q-1 -6 9 -5Z" />
        </g>
        <g fill="#d9a8a5">
          <circle cx="85" cy="196" r="2" /><circle cx="157" cy="195" r="2" />
          <circle cx="125" cy="226" r="2" /><circle cx="88" cy="258" r="2" /><circle cx="156" cy="258" r="2" />
        </g>
        <path d="M120 150 L120 278" stroke="#ded4ce" strokeWidth="1.5" strokeDasharray="3 5" />
      </g>

      <g id="dupatta" className="walking-state dupatta">
        <path d="M94 110 Q120 129 147 109 L157 124 Q143 145 120 145 Q97 145 83 124Z" fill="#f0e9e7" stroke="#d4c8c4" strokeWidth="2" />
        <path d="M86 124 Q102 144 120 142 Q139 144 154 123" fill="none" stroke="#fff" strokeWidth="3" />
      </g>

      <path d="M108 89 L108 116 Q120 127 132 116 L132 89Z" fill="url(#skin)" />
      <path d="M87 58 Q88 30 120 29 Q151 30 153 59 L148 91 Q141 113 120 116 Q99 113 91 91Z" fill="url(#skin)" />
      <path d="M84 66 C79 30 101 18 123 20 C149 20 161 40 154 72 L147 62 Q141 46 128 44 Q109 49 96 43 Q94 59 87 76Z" fill="url(#hair)" />
      <path d="M91 67 Q88 91 99 104" fill="none" stroke="#211719" strokeWidth="5" strokeLinecap="round" />
      <path d="M148 63 Q153 86 141 103" fill="none" stroke="#211719" strokeWidth="4" strokeLinecap="round" />
      <path d="M101 75 Q108 71 114 75 M127 75 Q134 71 140 75" fill="none" stroke="#49312c" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="108" cy="79" rx="2.3" ry="2.7" fill="#302322" />
      <ellipse cx="134" cy="79" rx="2.3" ry="2.7" fill="#302322" />
      <path d="M120 80 Q116 91 121 92" fill="none" stroke="#b77d70" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M112 100 Q120 105 128 99" fill="none" stroke="#9d5e5b" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="101" cy="91" rx="6" ry="3" fill="#d98788" opacity="0.25" />
      <ellipse cx="139" cy="91" rx="6" ry="3" fill="#d98788" opacity="0.25" />
      <path d="M120 39 L120 44" stroke="#b77d70" strokeWidth="1.2" />
      <circle cx="120" cy="45" r="1.6" fill="#c28b79" />

      <path d="M73 153 Q84 165 95 159 M145 159 Q157 165 167 153" fill="none" stroke="#d4c9c4" strokeWidth="2" />
      <g fill="#d7a9a4">
        <circle cx="100" cy="169" r="2" /><circle cx="140" cy="169" r="2" />
        <circle cx="120" cy="184" r="2" />
      </g>
    </svg>
  );
}

export default function WalkingGirlCursor() {
  const cursorRef = useRef(null);
  const audioRef = useRef(null);

  const stopFootstepLoop = useCallback(() => {
    const engine = audioRef.current;
    if (!engine) return;

    if (engine.loopTimer) {
      window.clearInterval(engine.loopTimer);
      engine.loopTimer = null;
    }

    if (engine.pendingTimeouts?.length) {
      engine.pendingTimeouts.forEach((timer) => window.clearTimeout(timer));
      engine.pendingTimeouts = [];
    }
  }, []);

  const createStepSound = useCallback((engine, leftFoot) => {
    const ctx = engine.ctx;
    const t = ctx.currentTime;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.18, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i += 1) {
      const envelope = Math.exp(-8.5 * (i / data.length));
      const noise = (Math.random() * 2 - 1) * 0.7;
      const footTone = Math.sin((i / ctx.sampleRate) * (leftFoot ? 220 : 190) * Math.PI * 2) * 0.22;
      data[i] = (noise * 0.5 + footTone) * envelope;
    }

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    source.buffer = buffer;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(leftFoot ? 2500 : 2200, t);
    filter.Q.value = 0.7;

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.34, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(engine.master);

    source.start(t);
    source.stop(t + 0.18);
  }, []);

  const ensureAudioReady = useCallback(async () => {
    if (typeof window === "undefined") return null;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduced.matches) return null;

    if (!audioRef.current) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) {
        console.warn("Walking cursor: Web Audio is not available in this browser.");
        return null;
      }

      const ctx = new AudioCtor();
      const master = ctx.createGain();
      master.gain.value = 0.42;
      master.connect(ctx.destination);
      audioRef.current = { ctx, master, loopTimer: null, pendingTimeouts: [] };
    }

    const engine = audioRef.current;
    if (engine.ctx.state === "suspended") {
      try {
        await engine.ctx.resume();
      } catch (error) {
        console.warn("Walking cursor: AudioContext could not resume.", error);
        return null;
      }
    }

    return engine;
  }, []);

  const startFootstepLoop = useCallback(async () => {
    const engine = await ensureAudioReady();
    if (!engine) return;

    stopFootstepLoop();
    let stepIndex = 0;

    engine.loopTimer = window.setInterval(() => {
      const leftFoot = stepIndex % 2 === 0;
      createStepSound(engine, leftFoot);
      stepIndex += 1;
    }, 400);
  }, [createStepSound, ensureAudioReady, stopFootstepLoop]);

  useEffect(() => {
    const node = cursorRef.current;
    if (!node) return;

    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!media.matches || reduced.matches) return;

    let raf = 0;
    let idleTimer = 0;
    let targetX = -100;
    let targetY = -100;
    let currentX = targetX;
    let currentY = targetY;
    let lastX = -100;
    let lastY = -100;
    let facing = 1;

    const setWalking = async (isWalking) => {
      if (isWalking) {
        node.classList.add("walking");
        node.classList.add("walking-girl-cursor--visible");
        await startFootstepLoop();
      } else {
        node.classList.remove("walking");
        stopFootstepLoop();
      }
    };

    const handlePointerDown = (event) => {
      lastX = event.clientX;
      lastY = event.clientY;
      move(event);
      ensureAudioReady().catch((error) => {
        console.warn("Walking cursor: could not unlock audio on pointer interaction.", error);
      });
    };

    const move = (event) => {
      const nextX = event.clientX;
      const nextY = event.clientY;
      const moved = Math.abs(nextX - lastX) > 2 || Math.abs(nextY - lastY) > 2;

      targetX = nextX;
      targetY = nextY;

      if (moved) {
        if (nextX < lastX - 1) facing = -1;
        else if (nextX > lastX + 1) facing = 1;
        lastX = nextX;
        lastY = nextY;
        setWalking(true);
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(() => setWalking(false), 180);
      }

      node.style.setProperty("--facing", String(facing));
      node.classList.add("walking-girl-cursor--visible");
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.34;
      currentY += (targetY - currentY) * 0.34;
      node.style.transform = `translate3d(${currentX + 12}px, ${currentY - 42}px, 0) scaleX(${facing})`;
      raf = window.requestAnimationFrame(animate);
    };

    const hide = () => {
      node.classList.remove("walking-girl-cursor--visible");
      node.classList.remove("walking");
      stopFootstepLoop();
    };
    const show = () => node.classList.add("walking-girl-cursor--visible");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("keydown", ensureAudioReady, { passive: true });
    window.addEventListener("blur", hide);
    window.addEventListener("focus", show);
    window.addEventListener("pointerleave", hide);
    raf = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", ensureAudioReady);
      window.removeEventListener("blur", hide);
      window.removeEventListener("focus", show);
      window.removeEventListener("pointerleave", hide);
      window.clearTimeout(idleTimer);
      window.cancelAnimationFrame(raf);
      stopFootstepLoop();
    };
  }, [ensureAudioReady, startFootstepLoop, stopFootstepLoop]);

  useEffect(() => {
    return () => {
      stopFootstepLoop();
      if (audioRef.current?.ctx) {
        try {
          if (audioRef.current.ctx.state === "running") {
            audioRef.current.ctx.suspend();
          }
          audioRef.current.ctx.close();
        } catch (error) {
          console.warn("Walking cursor: could not close AudioContext cleanly.", error);
        }
      }
    };
  }, [stopFootstepLoop]);

  return (
    <div ref={cursorRef} className="walking-girl-cursor" aria-hidden="true">
      <WalkingGirlArt />
    </div>
  );
}
