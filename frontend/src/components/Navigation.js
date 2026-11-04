import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Lightbulb, Mail, Mic, RotateCcw, Send, Sparkles, Languages, Square, Trash2 } from "lucide-react";
import { SCENE_NAMES, WISPR } from "@/data/content";

const WAVE_HEIGHTS = [10, 16, 24, 12, 20, 26, 14, 8, 18, 22, 9, 24, 15, 7, 19, 11, 25, 13, 8, 18, 22, 10, 16, 6, 21, 14, 9, 17, 12, 23];

export function Waveform({ bars = 30, height = 34, className = "" }) {
  return (
    <div className={`wave ${className}`} style={{ height }} aria-hidden>
      {WAVE_HEIGHTS.slice(0, bars).map((h, i) => (
        <span
          key={i}
          style={{
            height: `${h}px`,
            animationDelay: `${(i * 0.06).toFixed(2)}s`,
            animationDuration: `${(0.72 + (i % 5) * 0.09).toFixed(2)}s`,
          }}
        />
      ))}
    </div>
  );
}

export function MiniWave() {
  return (
    <span className="wave !h-[14px] !gap-[2px]" aria-hidden>
      {[7, 12, 9, 14, 8].map((h, i) => (
        <span key={i} style={{ height: h / 1.4, width: 2, animationDelay: `${i * 0.08}s` }} />
      ))}
    </span>
  );
}

export function TypeInText({ text, speed = 24, className = "", replayKey = 0, testid }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setN(text.length);
      return;
    }
    let stopped = false;
    let timer;
    let i = 0;
    const tick = () => {
      if (stopped) return;
      i += 1;
      setN(i);
      if (i >= text.length) return;
      const prev = text[i - 1];
      const pause = ",.!?—".includes(prev) ? 280 : 0;
      timer = setTimeout(tick, speed + pause);
    };
    timer = setTimeout(tick, speed);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [inView, text, speed, reduced, replayKey]);

  const done = n >= text.length;
  return (
    <p ref={ref} className={className} data-testid={testid}>
      {text.slice(0, n)}
      {!done && <span className="type-caret" aria-hidden />}
    </p>
  );
}

const USE_ICONS = { lightbulb: Lightbulb, mail: Mail, sparkles: Sparkles, languages: Languages };

export function UseCaseCard({ icon, title, desc }) {
  const Icon = USE_ICONS[icon] || Lightbulb;
  return (
    <div className="paper p-2.5 flex items-start gap-2.5" style={{ "--rot": "0deg" }}>
      <span className="w-7 h-7 rounded-full bg-[rgba(240,166,184,0.4)] text-[var(--ink)] flex items-center justify-center shrink-0">
        <Icon size={13} strokeWidth={2} />
      </span>
      <div>
        <h4 className="t-play font-bold text-[12px] leading-tight">{title}</h4>
        <p className="text-[10px] leading-snug opacity-75 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

export function WhatsAppDemo() {
  const [chat, setChat] = useState(WISPR.chat);
  const [text, setText] = useState("");
  const [dictating, setDictating] = useState(false);
  const timersRef = useRef([]);
  const chatRef = useRef(null);
  const reduced = useReducedMotion();

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };
  useEffect(() => clearTimers, []);

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat, text]);

  const startDictation = () => {
    clearTimers();
    setDictating(true);
    if (reduced) {
      setText(WISPR.demoMessage);
      setDictating(false);
      return;
    }
    const listen = setTimeout(() => {
      let i = 0;
      const tick = () => {
        i += 1;
        setText(WISPR.demoMessage.slice(0, i));
        if (i >= WISPR.demoMessage.length) {
          setDictating(false);
          return;
        }
        const prev = WISPR.demoMessage[i - 1];
        const pause = ",.!?—".includes(prev) ? 300 : 0;
        timersRef.current.push(setTimeout(tick, 24 + pause));
      };
      tick();
    }, 900);
    timersRef.current.push(listen);
  };

  const stopDictation = () => {
    clearTimers();
    setDictating(false);
  };

  const onMic = () => (dictating ? stopDictation() : startDictation());
  const onClear = () => {
    stopDictation();
    setText("");
  };
  const onSend = () => {
    const value = text.trim();
    if (!value) return;
    stopDictation();
    setChat((prev) => [...prev, { who: "out", text: value }]);
    setText("");
  };

  return (
    <div className="relative shrink-0">
      <div className="phone" data-testid="whatsapp-demo">
        <div className="phone-screen">
          <div className="wa-header">
            <span className="wa-avatar">A</span>
            <div className="flex-1">
              <div className="wa-name">Ananya</div>
              <div className="wa-status">online</div>
            </div>
          </div>
          <div className="wa-chat" ref={chatRef} data-testid="whatsapp-chat">
            <span className="wa-date">Today</span>
            {chat.map((m, i) => (
              <div key={i} className={`wa-bubble ${m.who}`}>
                {m.text}
                <span className="wa-time">10:4{i % 10} AM</span>
              </div>
            ))}
          </div>
          <div className="wa-composer">
            <textarea
              className="wa-input"
              data-testid="whatsapp-composer"
              aria-label="Message composer"
              placeholder="Type a message"
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="wa-round"
              data-testid="whatsapp-mic-btn"
              aria-label={dictating ? "Stop dictation" : "Start dictation (illustrative)"}
              title={dictating ? "Stop" : "Dictate (illustrative)"}
              onClick={onMic}
            >
              {dictating ? <Square size={13} fill="currentColor" /> : <Mic size={15} />}
            </button>
            <button
              className="wa-round"
              data-testid="whatsapp-send-btn"
              aria-label="Send message"
              disabled={!text.trim()}
              onClick={onSend}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
        {dictating && (
          <div className="wa-listening" data-testid="whatsapp-listening">
            <MiniWave /> Listening…
          </div>
        )}
      </div>

      <div className="wa-controls">
        <button className="wa-ctrl" data-testid="whatsapp-replay-btn" onClick={startDictation}>
          <RotateCcw size={11} /> Replay
        </button>
        <button className="wa-ctrl" data-testid="whatsapp-clear-btn" onClick={onClear}>
          <Trash2 size={11} /> Clear
        </button>
      </div>
      <p className="mt-2 text-[9px] italic leading-snug text-cream/55 max-w-[272px]">{WISPR.disclaimer}</p>
    </div>
  );
}

export default function Navigation({ index, goTo }) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-[var(--nav-h)] max-w-[1500px] items-center justify-between px-6 sm:px-10 xl:px-16">
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="t-serif italic text-[15px] font-semibold tracking-[0.08em] text-cream/80">Zaiba Muskan D.M.</div>
        </div>

        <nav aria-label="Scene navigation" className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {SCENE_NAMES.map((name, i) => (
            <button
              key={name}
              type="button"
              className={`nav-link ${i === index ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-current={i === index ? "page" : undefined}
            >
              {name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
