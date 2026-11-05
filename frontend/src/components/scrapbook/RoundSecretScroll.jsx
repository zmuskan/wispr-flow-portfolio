import React, { useState } from "react";
import "./RoundSecretScroll.css";

function Bird({ className, delay, scale = 1 }) {
  return (
    <svg
      className={`bird-svg ${className}`}
      viewBox="0 0 84 52"
      aria-hidden="true"
      style={{ animationDelay: `${delay}s`, transform: `scale(${scale})` }}
    >
      <g className="bird-body">
        <g className="bird-wing bird-wing--upper">
          <path d="M36 30c-8.5-9.5-17.6-13.7-29.4-13.5 8.2 4.8 16.4 12.5 20.9 21.2 2.4 4.5 7.1 7 11.1 6.6-2.5-4.7-3.1-9.5-2.6-14.3z" />
        </g>
        <g className="bird-wing bird-wing--lower">
          <path d="M36 29.5c11.4-10.6 24-15.4 36.2-13.1-9.1 6.4-18.7 15.9-22.6 25.4-1.8 4.4-7.6 6.8-10.8 6.1 0-5.3 0-10.9-2.8-18.4z" />
        </g>
        <ellipse className="bird-core" cx="40" cy="26" rx="18" ry="12" />
        <circle className="bird-eye" cx="56" cy="22" r="2.2" />
        <path className="bird-beak" d="M58 25l11 3-11 4 2-7z" />
        <path className="bird-tail" d="M20 30l-12 4 12 4-1-8z" />
      </g>
    </svg>
  );
}

export default function RoundSecretScroll() {
  const [isOpen, setIsOpen] = useState(false);

  const goals = [
    "Build cool stuff.",
    "Keep learning & experimenting.",
    "Make an actual difference.",
    "Become famous & ridiculously rich. 💅",
  ];

  return (
    <div className={`secret-scroll-wrap ${isOpen ? "is-open" : ""}`}>
      <div className="scroll-birds" aria-hidden="true">
        <Bird className="bird bird-one" delay={0.3} scale={1.02} />
        <Bird className="bird bird-two" delay={0.8} scale={0.78} />
        <span className="bird-hello">hiiii!! ♡</span>
      </div>

      <button
        type="button"
        className={`secret-scroll ${isOpen ? "opened" : "closed"}`}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close the secret scroll" : "Open the secret scroll"}
      >
        {!isOpen ? (
          <div className="scroll-rolled">
            <span className="scroll-roll scroll-roll-left" />
            <span className="scroll-roll scroll-roll-right" />
            <span className="scroll-closed-phrase">a little secret...</span>
            <span className="scroll-closed-title">DON'T OPEN ME</span>
            <span className="scroll-closed-note">unless you're nosy ♡</span>
            <span className="scroll-tiny-heart">♥</span>
          </div>
        ) : (
          <div className="scroll-unrolled">
            <div className="scroll-inner">
              <div className="scroll-heading">My delulu little life plan ♡</div>

              <ul className="scroll-goals">
                {goals.map((goal, index) => (
                  <li key={index} className={index === goals.length - 1 ? "scroll-goal--highlight" : ""}>
                    <span className="goal-star">✿</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>

              <div className="scroll-secret-message">AHH MANNN... U REALLY OPENED IT 😭</div>
            </div>
          </div>
        )}
      </button>

      {!isOpen && <div className="scroll-secret-footer">it's literally a secret 👀</div>}
    </div>
  );
}