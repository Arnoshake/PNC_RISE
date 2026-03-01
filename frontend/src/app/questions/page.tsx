"use client";

import { useState } from "react";
import { X, Flame, BookOpen } from "lucide-react";

const QUESTIONS = [
  {
    difficulty: "easy" as const,
    points: 1,
    question: "What does APR stand for?",
    answers: [
      "Annual Percentage Rate",
      "Applied Payment Rate",
      "Annual Profit Return",
      "Adjusted Payment Ratio",
    ],
    correct: 0,
    explanation:
      "APR is the yearly interest rate charged on borrowed money or earned on an investment.",
  },
  {
    difficulty: "medium" as const,
    points: 2,
    question:
      "If you invest $100/month at 7% annual return, approximately how much will you have after 30 years?",
    answers: ["$36,000", "$61,000", "$113,000", "$250,000"],
    correct: 2,
    explanation:
      "Compound interest grows $100/month to approximately $113,000 over 30 years at 7% annual return.",
  },
  {
    difficulty: "hard" as const,
    points: 3,
    question:
      "What is the 'sequence of returns risk' in retirement planning?",
    answers: [
      "Risk that returns happen in the wrong order",
      "Risk of investing in sequences",
      "Risk of sequential market crashes",
      "Risk of outliving your money",
    ],
    correct: 0,
    explanation:
      "Poor returns early in retirement deplete your portfolio faster than poor returns later, even if average returns are identical.",
  },
];

const DIFFICULTY_STYLES = {
  easy: { bg: "#78BE20", label: "Easy", text: "white" },
  medium: { bg: "#F7941D", label: "Medium", text: "white" },
  hard: { bg: "#002855", label: "Hard", text: "white" },
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const INITIAL_STREAK = 6;

const BG_GRADIENTS = [
  "linear-gradient(180deg, #0D1B2A 0%, #1A2744 40%, #0F1F3D 100%)",
  "linear-gradient(180deg, #1A1A4E 0%, #C94B4B 50%, #F97316 100%)",
  "linear-gradient(180deg, #F97316 0%, #FFB347 40%, #FFD700 100%)",
  "linear-gradient(180deg, #87CEEB 0%, #B0E0FF 50%, #E0F4FF 100%)",
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

export default function QuestionsPage() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );

  const questionsCompleted = answeredQuestions.size;
  const allDoneToday = questionsCompleted >= 3;
  const streakDays = allDoneToday ? 7 : INITIAL_STREAK;

  const handleAnswer = (answerIdx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIdx);
    if (activeQuestion !== null && answerIdx === QUESTIONS[activeQuestion].correct) {
      setAnsweredQuestions((prev) => new Set(prev).add(activeQuestion));
    }
  };

  const closeModal = () => {
    setActiveQuestion(null);
    setSelectedAnswer(null);
  };

  const phase = answeredQuestions.size / 3;
  const isDark = phase < 0.5;
  const bgGradient = BG_GRADIENTS[Math.min(answeredQuestions.size, 3)];
  const headingColor = isDark ? "#FFFFFF" : "#002855";
  const bodyColor = isDark ? "rgba(255,255,255,0.85)" : "#1A3A5C";

  const cardBg = isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.75)";
  const cardBorder = isDark
    ? "1px solid rgba(255,255,255,0.2)"
    : "1px solid rgba(0,40,85,0.1)";
  const cardText = isDark ? "#FFFFFF" : "#002855";

  const streakCardBg = isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.7)";

  const moonOpacity = phase < 0.5 ? 1 - phase * 2 : 0;
  const sunOpacity = phase > 0.3 ? (phase - 0.3) / 0.7 : 0;
  const sunTop = lerp(70, 10, phase);

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingBottom: 48,
        transition: "background 1.2s ease",
        background: bgGradient,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative moon */}
      <svg
        width={40}
        height={40}
        viewBox="0 0 40 40"
        style={{
          position: "absolute",
          top: 90,
          left: 24,
          opacity: moonOpacity,
          transform: `translateX(${phase * -80}px)`,
          transition: "all 1.2s ease",
          pointerEvents: "none",
        }}
      >
        <circle cx={20} cy={20} r={14} fill="#C8D8E8" />
        <circle cx={26} cy={16} r={12} fill={isDark ? "#0D1B2A" : "#87CEEB"} />
      </svg>

      {/* Decorative sun */}
      <svg
        width={56}
        height={56}
        viewBox="0 0 56 56"
        style={{
          position: "absolute",
          right: 24,
          top: `${sunTop}%`,
          opacity: sunOpacity,
          filter: "drop-shadow(0 0 16px rgba(255,180,0,0.7))",
          transition: "all 1.2s ease",
          pointerEvents: "none",
        }}
      >
        <circle cx={28} cy={28} r={12} fill="#FFB81C" />
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i}
            x1={28}
            y1={6}
            x2={28}
            y2={0}
            stroke="#FFB81C"
            strokeWidth={2}
            strokeLinecap="round"
            transform={`rotate(${i * 45} 28 28)`}
          />
        ))}
      </svg>

      <main
        style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 0", position: "relative", zIndex: 1 }}
      >
        {/* Page heading */}
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: headingColor,
            margin: "0 0 4px",
            transition: "color 1.2s ease",
            textShadow: isDark ? "0 2px 12px rgba(0,0,0,0.5)" : "none",
          }}
        >
          <span className="rise-glow">RISE</span>
          {' '}to the Challenge
        </h1>
        <p
          style={{
            fontSize: 15,
            color: bodyColor,
            margin: "0 0 28px",
            transition: "color 1.2s ease",
          }}
        >
          {answeredQuestions.size}/3 questions answered today
        </p>
        <p style={{ fontSize: 14, fontStyle: 'italic', color: bodyColor, margin: '4px 0 0', transition: 'color 1.2s ease', opacity: 0.8 }}>
          Consistency builds wealth. Your streak is your superpower.
        </p>

        {/* Two-column layout */}
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {/* LEFT — Questions Panel (60%) */}
          <div style={{ flex: "1 1 58%", minWidth: 320 }}>
            <div className="fade-in-1">
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: headingColor,
                  margin: "0 0 8px",
                  transition: "color 1.2s ease",
                }}
              >
                Daily Questions
              </h2>
              <p
                style={{
                  color: bodyColor,
                  fontSize: 15,
                  marginTop: 8,
                  marginBottom: 24,
                  transition: "color 1.2s ease",
                }}
              >
                Answer questions to earn points and grow your financial knowledge
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {QUESTIONS.map((q, idx) => {
                const diff = DIFFICULTY_STYLES[q.difficulty];
                const isAnswered = answeredQuestions.has(idx);
                return (
                  <div
                    key={idx}
                    className={`fade-in-${idx + 2}`}
                    style={{
                      padding: 24,
                      opacity: isAnswered ? 0.6 : undefined,
                      background: cardBg,
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: cardBorder,
                      borderRadius: 20,
                      transition: "all 1.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          background: diff.bg,
                          color: diff.text,
                          fontSize: 12,
                          fontWeight: 700,
                          padding: "4px 12px",
                          borderRadius: 20,
                          letterSpacing: 0.5,
                        }}
                      >
                        {diff.label} · +{q.points} pts
                      </span>
                      {isAnswered && (
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#78BE20",
                          }}
                        >
                          Completed
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: cardText,
                        margin: "0 0 16px",
                        lineHeight: 1.4,
                        transition: "color 1.2s ease",
                      }}
                    >
                      {q.question}
                    </p>
                    <button
                      className="btn-primary"
                      style={{ padding: "10px 24px", fontSize: 14 }}
                      onClick={() => {
                        setActiveQuestion(idx);
                        setSelectedAnswer(null);
                      }}
                      disabled={isAnswered}
                    >
                      {isAnswered ? "Answered" : "Answer"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Streak Tracker (40%) */}
          <div style={{ flex: "1 1 35%", minWidth: 260 }}>
            <div
              className="fade-in-2"
              style={{
                padding: 32,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                background: streakCardBg,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: cardBorder,
                borderRadius: 20,
                transition: "all 1.2s ease",
              }}
            >
              {/* Fire icon */}
              <div style={{ animation: "flicker 1.5s ease-in-out infinite" }}>
                <Flame size={64} style={{ color: "#F97316" }} />
              </div>

              <p
                style={{
                  fontSize: 72,
                  fontWeight: 800,
                  color: "#F97316",
                  margin: "8px 0 0",
                  lineHeight: 1,
                }}
              >
                {streakDays}
              </p>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: isDark ? "rgba(255,255,255,0.9)" : "var(--navy)",
                  margin: "4px 0 0",
                  transition: "color 1.2s ease",
                }}
              >
                day streak
              </p>

              {/* Weekly calendar */}
              <div style={{ display: "flex", gap: 8, margin: "16px 0 20px" }}>
                {DAYS.map((day, i) => {
                  const isSunday = i === 6;
                  const completed = !isSunday || allDoneToday;
                  const isPulsing = isSunday && !allDoneToday;
                  return (
                    <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: completed ? "var(--orange)" : "transparent",
                        border: completed ? "2px solid var(--orange)" : "2px solid #F7941D",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: completed ? "white" : "#F7941D",
                        fontSize: 12, fontWeight: 700,
                        animation: isPulsing ? "pulse 1.5s ease-in-out infinite" : allDoneToday && isSunday ? "none" : "none",
                        boxShadow: allDoneToday && isSunday ? "0 0 12px rgba(247,148,29,0.5)" : "none",
                      }}>
                        {completed ? "✓" : day[0]}
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 600,
                        color: isSunday ? "var(--orange)" : isDark ? "rgba(255,255,255,0.6)" : "var(--text-secondary)",
                      }}>{day}</span>
                    </div>
                  );
                })}
              </div>

              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#78BE20",
                  margin: "0 0 20px",
                }}
              >
                +{questionsCompleted * 2} pts today
              </p>

              {/* Points display */}
              <div
                style={{
                  padding: "16px 24px",
                  width: "100%",
                  textAlign: "center",
                  background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 16,
                  border: cardBorder,
                  transition: "all 1.2s ease",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    color: bodyColor,
                    margin: "0 0 4px",
                    transition: "color 1.2s ease",
                  }}
                >
                  Total Points
                </p>
                <p
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: headingColor,
                    margin: 0,
                    transition: "color 1.2s ease",
                  }}
                >
                  1,240 points
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM — Monthly Wrapped */}
        <div
          className="fade-in-4"
          style={{
            marginTop: 32,
            padding: 28,
            background: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.72)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: cardBorder,
            borderRadius: 20,
            transition: "all 1.2s ease",
          }}
        >
          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: headingColor,
              margin: "0 0 20px",
              transition: "color 1.2s ease",
            }}
          >
            Monthly Wrapped — February 2026
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              marginBottom: 20,
            }}
          >
            <div style={{ flex: "1 1 160px" }}>
              <p style={{ fontSize: 13, color: bodyColor, margin: "0 0 4px", transition: "color 1.2s ease" }}>
                Questions Answered
              </p>
              <p style={{ fontSize: 28, fontWeight: 800, color: headingColor, margin: 0, transition: "color 1.2s ease" }}>
                18
              </p>
            </div>
            <div style={{ flex: "1 1 160px" }}>
              <p style={{ fontSize: 13, color: bodyColor, margin: "0 0 4px", transition: "color 1.2s ease" }}>
                Points Earned
              </p>
              <p style={{ fontSize: 28, fontWeight: 800, color: "#F7941D", margin: 0 }}>
                1,240
              </p>
            </div>
            <div style={{ flex: "1 1 160px" }}>
              <p style={{ fontSize: 13, color: bodyColor, margin: "0 0 4px", transition: "color 1.2s ease" }}>
                Monthly Goal
              </p>
              <p style={{ fontSize: 28, fontWeight: 800, color: headingColor, margin: 0, transition: "color 1.2s ease" }}>
                62%
              </p>
            </div>
          </div>
          <div
            style={{
              height: 10,
              borderRadius: 999,
              background: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,40,85,0.08)",
              overflow: "hidden",
              transition: "background 1.2s ease",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "62%",
                borderRadius: 999,
                background: "linear-gradient(90deg, #F7941D, #E8830A)",
                transition: "width 0.6s ease",
              }}
            />
          </div>
        </div>

        {/* Learn More Resources */}
        <div className="fade-in-5" style={{ marginTop: 32, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: headingColor, margin: "0 0 16px", transition: "color 1.2s ease" }}>
            Deepen Your Knowledge
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { title: "Understanding Interest Rates", desc: "Learn how APR affects your loans and savings", href: "https://www.pnc.com/en/personal-banking/borrowing.html" },
              { title: "The Power of Compound Growth", desc: "See how investing early multiplies your money", href: "https://www.pnc.com/en/personal-banking/investments.html" },
              { title: "Planning for Retirement", desc: "Understand risks and strategies for long-term wealth", href: "https://www.pnc.com/en/personal-banking/retirement.html" },
            ].map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" style={{
                padding: 18, borderRadius: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 14,
                background: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.72)",
                backdropFilter: "blur(16px)", border: cardBorder, transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <BookOpen size={24} style={{ color: "#F7941D", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: headingColor, transition: "color 1.2s ease" }}>{link.title}</div>
                  <div style={{ fontSize: 12, color: bodyColor, transition: "color 1.2s ease", marginTop: 2 }}>{link.desc}</div>
                  <span style={{ fontSize: 12, color: "#F7941D", marginTop: 4, display: "inline-block" }}>Learn more →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* Answer Modal */}
      {activeQuestion !== null && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeModal();
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 24,
              padding: 32,
              maxWidth: 520,
              width: "90%",
              position: "relative",
              boxShadow: "0 24px 80px rgba(0,40,85,0.25)",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                color: "#4A6FA5",
              }}
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <span
              style={{
                background:
                  DIFFICULTY_STYLES[QUESTIONS[activeQuestion].difficulty].bg,
                color: "white",
                fontSize: 12,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 20,
              }}
            >
              +{QUESTIONS[activeQuestion].points} pts
            </span>

            <p
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--navy)",
                margin: "16px 0 24px",
                lineHeight: 1.4,
              }}
            >
              {QUESTIONS[activeQuestion].question}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {QUESTIONS[activeQuestion].answers.map((answer, aIdx) => {
                const isCorrect = aIdx === QUESTIONS[activeQuestion].correct;
                const isSelected = selectedAnswer === aIdx;
                let bg = "white";
                let borderColor = "var(--navy)";
                let textColor = "var(--navy)";

                if (selectedAnswer !== null) {
                  if (isSelected && isCorrect) {
                    bg = "#78BE20";
                    borderColor = "#78BE20";
                    textColor = "white";
                  } else if (isSelected && !isCorrect) {
                    bg = "#E74C3C";
                    borderColor = "#E74C3C";
                    textColor = "white";
                  } else if (isCorrect) {
                    bg = "rgba(120,190,32,0.1)";
                    borderColor = "#78BE20";
                  }
                }

                const letter = String.fromCodePoint(65 + aIdx);

                return (
                  <button
                    key={aIdx}
                    onClick={() => handleAnswer(aIdx)}
                    disabled={selectedAnswer !== null}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "100%",
                      background: bg,
                      border: `2px solid ${borderColor}`,
                      borderRadius: 12,
                      padding: "12px 20px",
                      cursor: selectedAnswer !== null ? "default" : "pointer",
                      color: textColor,
                      fontSize: 15,
                      fontWeight: 600,
                      fontFamily: "'Nunito Sans', sans-serif",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedAnswer === null) {
                        e.currentTarget.style.background = "var(--navy)";
                        e.currentTarget.style.color = "white";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedAnswer === null) {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.color = "var(--navy)";
                      }
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: `2px solid ${
                          selectedAnswer !== null && (isSelected || isCorrect)
                            ? "transparent"
                            : "currentColor"
                        }`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        flexShrink: 0,
                        background:
                          selectedAnswer !== null && isSelected
                            ? "rgba(255,255,255,0.2)"
                            : "transparent",
                      }}
                    >
                      {letter}
                    </span>
                    {answer}
                  </button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <div
                style={{
                  marginTop: 20,
                  padding: "16px 20px",
                  borderRadius: 12,
                  background:
                    selectedAnswer === QUESTIONS[activeQuestion].correct
                      ? "rgba(120,190,32,0.1)"
                      : "rgba(231,76,60,0.08)",
                  border: `1px solid ${
                    selectedAnswer === QUESTIONS[activeQuestion].correct
                      ? "rgba(120,190,32,0.3)"
                      : "rgba(231,76,60,0.2)"
                  }`,
                }}
              >
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color:
                      selectedAnswer === QUESTIONS[activeQuestion].correct
                        ? "#78BE20"
                        : "#E74C3C",
                    margin: "0 0 6px",
                  }}
                >
                  {selectedAnswer === QUESTIONS[activeQuestion].correct
                    ? `Correct! +${QUESTIONS[activeQuestion].points} pts earned!`
                    : "Incorrect"}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {QUESTIONS[activeQuestion].explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
