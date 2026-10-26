"use client";

import { useEffect, useMemo, useState } from "react";
import { getTrick, progressKey } from "@/lib/tricks";
import { useProgress } from "@/lib/progress";
import { CodePanel } from "./CodePanel";
import { ArrayView } from "./views/ArrayView";
import { BucketsView } from "./views/BucketsView";
import { GridView } from "./views/GridView";
import { HashMapView } from "./views/HashMapView";
import { legend, toneClass } from "./views/tones";
import { VariablesView } from "./views/VariablesView";

const SPEEDS = [
  { label: "0.5×", ms: 2400 },
  { label: "1×", ms: 1400 },
  { label: "2×", ms: 700 },
];

export function TrickPlayer({ categoryId, trickId }: { categoryId: string; trickId: string }) {
  const trick = getTrick(categoryId, trickId)!;
  const viz = trick.viz!;
  const steps = useMemo(() => viz.steps(), [viz]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const { learned, setLearned } = useProgress();
  const key = progressKey(categoryId, trickId);

  const last = steps.length - 1;
  const step = steps[index];

  useEffect(() => {
    if (!playing || index >= last) return;
    const t = setTimeout(() => {
      setIndex(index + 1);
      if (index + 1 >= last) setPlaying(false);
    }, SPEEDS[speed].ms);
    return () => clearTimeout(t);
  }, [playing, index, last, speed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      // A focused button already handles space itself.
      if (e.key === " " && e.target instanceof HTMLButtonElement) return;
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, last));
      else if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
      else if (e.key === " ") {
        e.preventDefault();
        setIndex((i) => (i >= last ? 0 : i));
        setPlaying((p) => !p);
      } else return;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [last]);

  const go = (i: number) => {
    setPlaying(false);
    setIndex(Math.max(0, Math.min(i, last)));
  };

  const togglePlay = () => {
    if (index >= last) {
      setIndex(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  };

  const btn = "rounded-md border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-700 disabled:opacity-40";

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-indigo-400/30 bg-indigo-500/10 p-4">
        <div className="text-xs font-semibold tracking-wide text-indigo-300 uppercase">The trick</div>
        <p className="mt-1 text-zinc-100">{trick.idea}</p>
        <p className="mt-2 font-mono text-xs text-zinc-400">Example: {viz.input}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="min-h-20 rounded-lg border border-amber-400/30 bg-amber-400/5 p-3 text-zinc-100" aria-live="polite">
            <div className="mb-1 font-mono text-xs text-amber-300">
              step {index + 1} / {steps.length}
            </div>
            {step.message}
          </div>

          <div className="flex flex-col gap-5 rounded-lg border border-zinc-700 bg-zinc-900/70 p-4">
            {step.vars && <VariablesView vars={step.vars} />}
            {step.grids?.map((g) => <GridView key={g.name} state={g} />)}
            {step.arrays?.map((a) => <ArrayView key={a.name} state={a} />)}
            {step.buckets?.map((b) => <BucketsView key={b.name} state={b} />)}
            {step.maps && (
              <div className="flex flex-wrap gap-6">
                {step.maps.map((m, i) => <HashMapView key={i} state={m} />)}
              </div>
            )}
            <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-zinc-800 pt-3 text-xs text-zinc-400">
              {legend.map(([t, label]) => (
                <span key={t} className="flex items-center gap-1">
                  <span className={`inline-block size-3 rounded-sm border ${toneClass[t]}`} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <CodePanel code={viz.code} line={step.line} />
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-col gap-2 border-t border-zinc-800 bg-[var(--background)]/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border">
        <input
          type="range"
          min={0}
          max={last}
          value={index}
          onChange={(e) => go(Number(e.target.value))}
          className="w-full accent-amber-400"
          aria-label="Step"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button className={btn} onClick={() => go(0)} disabled={index === 0} title="Restart">
            ⏮
          </button>
          <button className={btn} onClick={() => go(index - 1)} disabled={index === 0} title="Previous step (←)">
            ◀ Prev
          </button>
          <button className={`${btn} min-w-20 border-amber-400/60 bg-amber-400/20`} onClick={togglePlay} title="Play / pause (space)">
            {playing ? "❚❚ Pause" : index >= last ? "↻ Replay" : "▶ Play"}
          </button>
          <button className={btn} onClick={() => go(index + 1)} disabled={index === last} title="Next step (→)">
            Next ▶
          </button>
          <div className="flex overflow-hidden rounded-md border border-zinc-600">
            {SPEEDS.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setSpeed(i)}
                className={`px-2 py-1.5 text-sm ${i === speed ? "bg-zinc-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              className="size-4 accent-emerald-500"
              checked={learned.has(key)}
              onChange={(e) => setLearned(key, e.target.checked)}
            />
            Learned
          </label>
        </div>
      </div>
    </div>
  );
}
