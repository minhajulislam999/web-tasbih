import { useState, useEffect, useCallback, useRef } from "react";

const DHIKR_LIST = [
  { id: 0, latin: "Subhanallah", arabic: "سُبْحَانَ اللَّهِ", meaning: "Glory be to Allah", target: 33 },
  { id: 1, latin: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", meaning: "All praise is due to Allah", target: 33 },
  { id: 2, latin: "Allahu Akbar", arabic: "اللَّهُ أَكْبَرُ", meaning: "Allah is the Greatest", target: 34 },
  { id: 3, latin: "La ilaha illallah", arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", meaning: "There is no god but Allah", target: 100 },
  { id: 4, latin: "Dorud Sharif",arabic: "اللهم صلِّ على سيدنا محمد وسلم عليه", meaning: "O Allah, send blessings and peace upon our Prophet Muhammad.", target: 100 },
  { id: 5, latin: "Astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ", meaning: "I seek forgiveness from Allah", target: 100 },
];

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
}));

const CircularProgress = ({ count, target }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(count / target, 1);
  const offset = circumference * (1 - pct);
  const completed = count >= target;

  return (
    <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
      <circle
        cx="65" cy="65" r={radius} fill="none"
        stroke={completed ? "#f59e0b" : "url(#progressGrad)"}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.4s cubic-bezier(0.4,0,0.2,1), stroke 0.3s ease" }}
      />
      <defs>
        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default function Tasbih() {
  const [selectedId, setSelectedId] = useState(0);
  const [counts, setCounts] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 });
  const [totalAll, setTotalAll] = useState(0);
  const [ripples, setRipples] = useState([]);
  const [pressing, setPressing] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const rippleId = useRef(0);

  const dhikr = DHIKR_LIST[selectedId];
  const count = counts[selectedId];
  const completed = count >= dhikr.target;

  const increment = useCallback(() => {
    if (counts[selectedId] >= dhikr.target) return;
    setCounts(prev => ({ ...prev, [selectedId]: prev[selectedId] + 1 }));
    setTotalAll(prev => prev + 1);
    if (counts[selectedId] + 1 >= dhikr.target) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 3000);
    }
  }, [counts, selectedId, dhikr.target]);

  const reset = useCallback(() => {
    setCounts(prev => ({ ...prev, [selectedId]: 0 }));
    setJustCompleted(false);
  }, [selectedId]);

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleId.current++;
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);
  };

  const handleTap = (e) => {
    addRipple(e);
    increment();
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        increment();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [increment]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0f1b2d 0%, #1a2d4a 50%, #0d2235 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "24px 16px 40px",
      fontFamily: "Georgia, serif",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Stars */}
      {STARS.map(s => (
        <div key={s.id} style={{
          position: "absolute",
          top: `${s.top}%`,
          left: `${s.left}%`,
          width: `${s.size}px`,
          height: `${s.size}px`,
          borderRadius: "50%",
          background: "white",
          animation: `twinkle ${s.duration}s ${s.delay}s infinite alternate ease-in-out`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Moon */}
      <div style={{
        position: "absolute",
        top: 20,
        right: 28,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "radial-gradient(circle at 38% 38%, #fde68a, #f59e0b)",
        boxShadow: "0 0 24px 8px rgba(245,158,11,0.25)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28, zIndex: 1 }}>
        <div style={{
          color: "#fbbf24",
          fontSize: 13,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          marginBottom: 4,
          fontStyle: "italic",
        }}>Ramadan Kareem ✦</div>
        <h1 style={{
          color: "white",
          fontSize: 26,
          fontWeight: "bold",
          margin: 0,
          letterSpacing: "0.05em",
          textShadow: "0 0 30px rgba(251,191,36,0.3)",
        }}>Digital Tasbih</h1>
      </div>

      {/* Pill Selectors */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "center",
        marginBottom: 24,
        zIndex: 1,
        maxWidth: 500,
      }}>
        {DHIKR_LIST.map(d => (
          <button
            key={d.id}
            onClick={() => { setSelectedId(d.id); setJustCompleted(false); }}
            style={{
              padding: "6px 16px",
              borderRadius: 999,
              border: selectedId === d.id ? "1.5px solid #fbbf24" : "1.5px solid rgba(255,255,255,0.15)",
              background: selectedId === d.id
                ? "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.1))"
                : "rgba(255,255,255,0.05)",
              color: selectedId === d.id ? "#fbbf24" : "rgba(255,255,255,0.65)",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s ease",
              boxShadow: selectedId === d.id ? "0 0 12px rgba(251,191,36,0.2)" : "none",
            }}
          >{d.latin}</button>
        ))}
      </div>

      {/* Dhikr Card */}
      <div style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20,
        padding: "24px 32px",
        textAlign: "center",
        marginBottom: 28,
        zIndex: 1,
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}>
        <div style={{
          fontFamily: "'Amiri', Georgia, serif",
          fontSize: 34,
          color: "#fde68a",
          marginBottom: 10,
          lineHeight: 1.6,
          textShadow: "0 0 20px rgba(251,191,36,0.3)",
          direction: "rtl",
        }}>{dhikr.arabic}</div>
        <div style={{
          color: "rgba(255,255,255,0.9)",
          fontSize: 18,
          fontStyle: "italic",
          marginBottom: 4,
        }}>{dhikr.latin}</div>
        <div style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: 13,
          letterSpacing: "0.05em",
        }}>{dhikr.meaning}</div>
      </div>

      {/* Progress Ring + Count */}
      <div style={{ position: "relative", marginBottom: 24, zIndex: 1 }}>
        <CircularProgress count={count} target={dhikr.target} />
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          textAlign: "center",
        }}>
          <div style={{
            fontSize: 32,
            fontWeight: "bold",
            color: completed ? "#fbbf24" : "white",
            lineHeight: 1,
            textShadow: completed ? "0 0 20px rgba(251,191,36,0.8), 0 0 40px rgba(251,191,36,0.4)" : "none",
            transition: "all 0.3s ease",
          }}>{count}</div>
          <div style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            marginTop: 2,
          }}>/ {dhikr.target}</div>
        </div>
      </div>

      {/* Completion Message */}
      <div style={{
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        zIndex: 1,
      }}>
        {justCompleted && (
          <div style={{
            background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.15))",
            border: "1px solid rgba(251,191,36,0.5)",
            borderRadius: 999,
            padding: "6px 20px",
            color: "#fbbf24",
            fontSize: 15,
            fontStyle: "italic",
            animation: "bounceIn 0.5s cubic-bezier(0.36,0.07,0.19,0.97)",
            boxShadow: "0 0 20px rgba(251,191,36,0.2)",
          }}>Mashallah! Completed! 🌙</div>
        )}
      </div>

      {/* Tap Button */}
      <div style={{ position: "relative", marginBottom: 28, zIndex: 1 }}>
        <button
          onMouseDown={() => setPressing(true)}
          onMouseUp={() => setPressing(false)}
          onMouseLeave={() => setPressing(false)}
          onTouchStart={() => setPressing(true)}
          onTouchEnd={() => { setPressing(false); }}
          onClick={handleTap}
          disabled={completed}
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: completed
              ? "2px solid rgba(251,191,36,0.3)"
              : "2px solid rgba(96,165,250,0.4)",
            background: completed
              ? "radial-gradient(circle at 40% 35%, rgba(251,191,36,0.15), rgba(245,158,11,0.05))"
              : pressing
              ? "radial-gradient(circle at 40% 35%, #1e40af, #1e3a8a)"
              : "radial-gradient(circle at 40% 35%, #2563eb, #1d4ed8)",
            cursor: completed ? "not-allowed" : "pointer",
            position: "relative",
            overflow: "hidden",
            transform: pressing && !completed ? "scale(0.93)" : "scale(1)",
            boxShadow: completed
              ? "0 0 30px rgba(251,191,36,0.15)"
              : pressing
              ? "0 4px 20px rgba(37,99,235,0.4), inset 0 2px 8px rgba(0,0,0,0.3)"
              : "0 8px 40px rgba(37,99,235,0.5), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
            transition: "transform 0.1s ease, box-shadow 0.15s ease, background 0.2s ease",
            outline: "none",
          }}
        >
          {ripples.map(r => (
            <span key={r.id} style={{
              position: "absolute",
              left: r.x - 10,
              top: r.y - 10,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.35)",
              animation: "rippleOut 0.7s ease-out forwards",
              pointerEvents: "none",
            }} />
          ))}
          <span style={{
            fontSize: 36,
            display: "block",
            lineHeight: 1,
            filter: completed ? "grayscale(0.5)" : "none",
          }}>📿</span>
          <span style={{
            display: "block",
            color: completed ? "rgba(251,191,36,0.5)" : "rgba(255,255,255,0.8)",
            fontSize: 11,
            marginTop: 4,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>{completed ? "Done" : "Tap"}</span>
        </button>
      </div>

      {/* Total & Reset */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        zIndex: 1,
        marginBottom: 32,
      }}>
        <div style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: "8px 20px",
          textAlign: "center",
        }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>Total</div>
          <div style={{ color: "#fbbf24", fontSize: 22, fontWeight: "bold" }}>{totalAll}</div>
        </div>
        <button
          onClick={reset}
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            padding: "8px 20px",
            color: "rgba(255,255,255,0.6)",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "Georgia, serif",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "rgba(255,255,255,0.6)";
          }}
        >↺ Reset</button>
      </div>

      {/* Keyboard hint */}
      <div style={{
        color: "rgba(255,255,255,0.25)",
        fontSize: 11,
        letterSpacing: "0.08em",
        marginBottom: 20,
        zIndex: 1,
      }}>Press Space or Enter to count</div>

      {/* Footer */}
      <div style={{
        color: "rgba(251,191,36,0.5)",
        fontSize: 18,
        fontFamily: "'Amiri', Georgia, serif",
        zIndex: 1,
        direction: "rtl",
        letterSpacing: "0.05em",
      }}>رَمَضَان مُبَارَك</div>

      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.15; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes rippleOut {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(12); opacity: 0; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.5) translateY(10px); opacity: 0; }
          60% { transform: scale(1.1) translateY(-4px); opacity: 1; }
          80% { transform: scale(0.95) translateY(2px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}