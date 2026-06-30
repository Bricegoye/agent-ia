"use client";

import { useState, useRef, useEffect } from "react";

function MarkdownBlock({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      const numMatch = line.match(/^## (\d+)\./);
      const title = line.replace(/^## \d+\.\s*/, "").replace(/^## /, "");
      elements.push(
        <h2 key={i} className="section-title">
          {numMatch && <span className="section-num">{numMatch[1]}</span>}
          {title}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="sub-title">{line.replace(/^### /, "")}</h3>
      );
    } else if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      elements.push(
        <p key={i} className="tool-name">{line.replace(/\*\*/g, "")}</p>
      );
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].replace(/^- /, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="item-list">
          {items.map((item, j) => {
            const colonIdx = item.indexOf(" : ");
            if (colonIdx !== -1) {
              const label = item.slice(0, colonIdx);
              const value = item.slice(colonIdx + 3);
              return (
                <li key={j}>
                  <span className="label">{label}</span>
                  <span className="sep">:</span>
                  <span className="value">{value}</span>
                </li>
              );
            }
            return <li key={j}><span className="value">{item}</span></li>;
          })}
        </ul>
      );
      continue;
    } else if (line === "---") {
      elements.push(<hr key={i} className="divider" />);
    } else if (line.trim() !== "") {
      const formatted = line
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/`([^`]+)`/g, "<code>$1</code>");
      elements.push(
        <p key={i} className="body-text" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    }
    i++;
  }

  return <div className="markdown-output">{elements}</div>;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  async function generate() {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setResult(data.output || JSON.stringify(data, null, 2));
    } catch {
      setResult("Erreur lors de l'appel API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #f8f9fb;
          color: #111318;
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .page {
          max-width: 760px;
          margin: 0 auto;
          padding: 64px 24px 100px;
        }

        /* ── Header ── */
        .header { margin-bottom: 48px; }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6366f1;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.18);
          border-radius: 20px;
          padding: 4px 12px;
          margin-bottom: 20px;
        }
        .eyebrow-dot {
          width: 6px; height: 6px;
          background: #6366f1;
          border-radius: 50%;
        }

        h1 {
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: #111318;
          margin-bottom: 12px;
        }
        h1 span { color: #6366f1; }

        .subtitle {
          font-size: 15px;
          font-weight: 400;
          color: #6b7280;
          line-height: 1.6;
          max-width: 480px;
        }

        /* ── Form card ── */
        .form-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 10px;
        }

        textarea {
          width: 100%;
          background: #f8f9fb;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding: 14px 16px;
          color: #111318;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.65;
          resize: vertical;
          min-height: 110px;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        textarea::placeholder { color: #9ca3af; }
        textarea:focus {
          border-color: #6366f1;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
          gap: 12px;
        }

        .char-count {
          font-size: 12px;
          color: #9ca3af;
        }

        button {
          background: #6366f1;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 11px 22px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.01em;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
          white-space: nowrap;
        }
        button:hover:not(:disabled) {
          background: #4f46e5;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99,102,241,0.3);
        }
        button:active:not(:disabled) { transform: translateY(0); }
        button:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        .spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Result ── */
        .result-wrap {
          margin-top: 40px;
          animation: fadeUp 0.35s ease forwards;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .result-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
        }

        .result-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f3f4f6;
        }
        .result-icon {
          width: 32px; height: 32px;
          background: rgba(99,102,241,0.1);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .result-meta { flex: 1; }
        .result-title {
          font-size: 14px;
          font-weight: 600;
          color: #111318;
        }
        .result-sub {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 2px;
        }

        /* ── Markdown ── */
        .markdown-output { display: flex; flex-direction: column; gap: 4px; }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #111318;
          margin-top: 36px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: -0.02em;
        }
        .section-title:first-child { margin-top: 0; }

        .section-num {
          font-size: 11px;
          font-weight: 700;
          color: #6366f1;
          background: rgba(99,102,241,0.1);
          border-radius: 6px;
          padding: 3px 8px;
          flex-shrink: 0;
          letter-spacing: 0;
        }

        .sub-title {
          font-size: 11px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 16px;
          margin-bottom: 8px;
        }

        .tool-name {
          font-size: 14px;
          font-weight: 600;
          color: #111318;
          background: #f8f9fb;
          border: 1px solid #e5e7eb;
          border-left: 3px solid #6366f1;
          padding: 10px 16px;
          border-radius: 0 8px 8px 0;
          margin-top: 20px;
          margin-bottom: 8px;
        }

        .item-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .item-list li {
          font-size: 14px;
          line-height: 1.6;
          padding: 9px 14px;
          background: #f8f9fb;
          border: 1px solid #f0f1f3;
          border-radius: 8px;
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 6px;
        }
        .label {
          font-size: 12px;
          font-weight: 500;
          color: #9ca3af;
          flex-shrink: 0;
        }
        .sep {
          color: #d1d5db;
          font-size: 12px;
        }
        .value {
          color: #374151;
          font-weight: 400;
          font-size: 14px;
        }

        .body-text {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.75;
        }
        .body-text strong { color: #374151; font-weight: 600; }
        .body-text code {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 12px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          padding: 1px 6px;
          border-radius: 4px;
          color: #6366f1;
        }

        .divider {
          border: none;
          border-top: 1px solid #f3f4f6;
          margin: 28px 0 4px;
        }
      `}</style>

      <div className="page">
        {/* Header */}
        <header className="header">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Digital Analytics
          </div>
          <h1>
            Génère ton audit <br />
            <span> analytics</span>
          </h1>
          <p className="subtitle">
            Colle une URL — l'agent détecte les outils en place et génère un audit complet avec plan de taggage.
          </p>
        </header>

        {/* Form */}
        <div className="form-card">
          <label className="form-label" htmlFor="input">
            URL ou description du site
          </label>
          <textarea
            id="input"
            placeholder="Ex : https://monsite.com — décris ton site, tes objectifs analytics…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
          />
          <div className="form-footer">
            <span className="char-count">{input.length} caractères</span>
            <button onClick={generate} disabled={loading || !input.trim()}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Analyse en cours…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Générer l'audit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="result-wrap" ref={resultRef}>
            <div className="result-card">
              <div className="result-header">
                <div className="result-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M2 8h8M2 12h10" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="result-meta">
                  <div className="result-title">Résultat de l'audit</div>
                  <div className="result-sub">Généré par l'agent analytics</div>
                </div>
              </div>
              <MarkdownBlock content={result} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}