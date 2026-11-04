import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Lightbulb, Mail, Mic, RotateCcw, Send, Sparkles, Languages, Square, Trash2, Volume2 } from "lucide-react";
import { WISPR } from "@/data/content";

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

export function UseCaseCard({ icon, title, desc, className = "" }) {
  const Icon = USE_ICONS[icon] || Lightbulb;
  return (
    <div className={`paper p-2.5 flex items-start gap-2.5 ${className}`.trim()} style={{ "--rot": "0deg" }}>
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

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

export function WhatsAppDemo() {
  const createInitialMessages = () =>
    WISPR.chat.map((message, index) => ({
      id: `${message.who}-${index}-${message.text.slice(0, 8)}`,
      text: message.text,
      from: message.who === "out" ? "me" : "them",
      time: new Date(Date.now() - (WISPR.chat.length - index) * 60000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

  const [chat, setChat] = useState(createInitialMessages);
  const [text, setText] = useState("");
  const [dictating, setDictating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const timersRef = useRef([]);
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearTimers();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat, text, dictating, isTyping]);

  const addMessage = (incomingText, from) => {
    const trimmed = incomingText.trim();
    if (!trimmed) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setChat((previous) => [
      ...previous,
      {
        id: `${from}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text: trimmed,
        from,
        time: timestamp,
      },
    ]);
  };

  const askAssistant = async (incomingMessage, customHistory = chat) => {
    const message = incomingMessage.trim();
    if (!message) return;

    setIsTyping(true);
    setSpeechError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: customHistory.map(({ from, text }) => ({ role: from === "me" ? "user" : "assistant", text })),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.detail || "Assistant request failed.");
      }

      if (payload?.reply) {
        addMessage(payload.reply, "them");
      } else {
        addMessage("I’m not able to answer that from this portfolio right now.", "them");
      }
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "The assistant is temporarily unavailable.";
      addMessage("I’m sorry — I’m unable to answer that right now. Please try again in a moment.", "them");
      setSpeechError(messageText);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async () => {
    const value = text.trim();
    if (!value || isTyping) return;

    const history = [...chat, { from: "me", text: value }];
    addMessage(value, "me");
    setText("");
    await askAssistant(value, history);
  };

  const startDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("Voice dictation is not available in this browser. Please type your message instead.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setSpeechError("");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setDictating(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ")
        .trim();
      if (transcript) {
        setText(transcript);
      }
    };
    recognition.onerror = (event) => {
      const level = event.error || "unknown";
      const message =
        level === "not-allowed" || level === "service-not-allowed"
          ? "Microphone access was denied. Please allow microphone access and try again."
          : "Voice recognition is unavailable right now. Please type your message instead.";
      setSpeechError(message);
      setDictating(false);
    };
    recognition.onend = () => setDictating(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopDictation = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setDictating(false);
  };

  const onMic = () => (dictating ? stopDictation() : startDictation());

  const speakLatestReply = () => {
    const latestReply = [...chat].reverse().find((message) => message.from === "them");
    if (!latestReply) {
      setSpeechError("There isn’t a reply to read aloud yet.");
      return;
    }

    if (!("speechSynthesis" in window)) {
      setSpeechError("Speech synthesis is not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(latestReply.text);
    utterance.lang = "en-IN";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeechError("");
  };

  const resetConversation = () => {
    clearTimers();
    stopDictation();
    setText("");
    setIsTyping(false);
    setSpeechError("");
    setChat(createInitialMessages());
  };

  const onReplay = async () => {
    clearTimers();
    setText("");
    setSpeechError("");
    const replayMessage = WISPR.demoMessage;
    const history = [...chat, { from: "me", text: replayMessage }];
    addMessage(replayMessage, "me");
    await askAssistant(replayMessage, history);
  };

  return (
    <div className="whatsapp-demo relative shrink-0">
      <div className="phone" data-testid="whatsapp-demo">
        <div className="phone-screen">
          <div className="wa-header">
            <span className="wa-avatar">M</span>
            <div className="flex-1">
              <div className="wa-name">Muskan</div>
              <div className="wa-status">online</div>
            </div>
          </div>
          <div className="wa-chat" ref={chatRef} data-testid="whatsapp-chat">
            <span className="wa-date">Today</span>
            {chat.map((message) => (
              <div key={message.id} className={`wa-bubble ${message.from === "me" ? "out" : "in"}`}>
                {message.text}
                <span className="wa-time">{message.time}</span>
              </div>
            ))}
            {isTyping && (
              <div className="wa-bubble in typing" data-testid="whatsapp-typing-indicator">
                <MiniWave />
              </div>
            )}
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
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              className="wa-round"
              data-testid="whatsapp-mic-btn"
              aria-label={dictating ? "Stop dictation" : "Start dictation"}
              title={dictating ? "Stop dictation" : "Start dictation"}
              onClick={onMic}
            >
              {dictating ? <Square size={13} fill="currentColor" /> : <Mic size={15} />}
            </button>
            <button
              className="wa-round"
              data-testid="whatsapp-send-btn"
              aria-label="Send message"
              disabled={!text.trim() || isTyping}
              onClick={sendMessage}
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
        <button className="wa-ctrl" data-testid="whatsapp-replay-btn" onClick={onReplay}>
          <RotateCcw size={11} /> Replay
        </button>
        <button className="wa-ctrl" data-testid="whatsapp-clear-btn" onClick={resetConversation}>
          <Trash2 size={11} /> Clear
        </button>
        <button className="wa-ctrl" data-testid="whatsapp-speak-btn" onClick={speakLatestReply}>
          <Volume2 size={11} /> Speak
        </button>
      </div>
      {speechError && (
        <p className="mt-2 max-w-[272px] text-[9px] leading-snug text-[#F7D0DB]" data-testid="whatsapp-speech-error">
          {speechError}
        </p>
      )}
      <p className="mt-2 text-[9px] italic leading-snug text-cream/55 max-w-[272px]">{WISPR.disclaimer}</p>
    </div>
  );
}
