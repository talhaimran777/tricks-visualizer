import type { Tone } from "@/lib/tricks/types";

export const toneClass: Record<Tone, string> = {
  active: "border-amber-400 bg-amber-400/20 text-amber-100",
  compare: "border-sky-400 bg-sky-400/15 text-sky-100",
  match: "border-emerald-400 bg-emerald-400/20 text-emerald-100",
  bad: "border-rose-500 bg-rose-500/25 text-rose-100",
  done: "border-indigo-400/40 bg-indigo-400/10 text-zinc-300",
  dim: "border-slate-500/70 bg-slate-500/25 text-zinc-300",
};

export const baseCell = "border-zinc-600 bg-zinc-800/60 text-zinc-100";

export const tone = (t: Tone | undefined) => (t ? toneClass[t] : baseCell);

export const legend: [Tone, string][] = [
  ["active", "current"],
  ["compare", "looking up / in range"],
  ["match", "found / final"],
  ["bad", "conflict"],
  ["done", "processed"],
];
