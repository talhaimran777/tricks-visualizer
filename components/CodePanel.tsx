"use client";

import { useEffect, useRef } from "react";

const KEYWORDS =
  /\b(function|const|let|return|for|of|while|if|else|continue|new|true|false|number|string|boolean)\b/;
const TOKEN = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|`[^`]*`)|\b(\d+)\b|(\b[A-Za-z_]\w*\b)/g;

/** Tiny highlighter: comments, strings, numbers and keywords are enough for these snippets. */
function highlight(line: string) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const idx = m.index;
    if (idx > last) parts.push(line.slice(last, idx));
    const [text, comment, str, num, word] = m;
    const cls = comment
      ? "text-zinc-500 italic"
      : str
        ? "text-emerald-300"
        : num
          ? "text-orange-300"
          : word && KEYWORDS.test(word)
            ? "text-fuchsia-300"
            : undefined;
    parts.push(cls ? <span key={idx} className={cls}>{text}</span> : text);
    last = idx + text.length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}

export function CodePanel({ code, line }: { code: string; line: number }) {
  const scroller = useRef<HTMLDivElement>(null);
  const lines = code.split("\n");

  // Keep the active line visible inside the panel without scrolling the page.
  useEffect(() => {
    const box = scroller.current;
    const el = box?.querySelector<HTMLElement>(`[data-line="${line}"]`);
    if (!box || !el) return;
    const top = el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2;
    box.scrollTo({ top, behavior: "smooth" });
  }, [line]);

  return (
    <div ref={scroller} className="relative max-h-[520px] overflow-auto rounded-lg border border-zinc-700 bg-zinc-950/80 py-3">
      <pre className="w-max min-w-full font-mono text-[13px] leading-6">
        {lines.map((text, i) => {
          const n = i + 1;
          const active = n === line;
          return (
            <div
              key={n}
              data-line={n}
              className={`flex pr-4 transition-colors duration-200 ${active ? "bg-amber-400/15 shadow-[inset_3px_0_0] shadow-amber-400" : ""}`}
            >
              <span className={`w-10 shrink-0 pr-3 text-right select-none ${active ? "text-amber-300" : "text-zinc-600"}`}>{n}</span>
              <code className="text-zinc-200">{highlight(text)}</code>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
