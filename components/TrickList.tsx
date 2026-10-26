"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { getTricks, progressKey } from "@/lib/tricks";

export function TrickList({ categoryId }: { categoryId: string }) {
  const tricks = getTricks(categoryId);
  const { learned, setLearned } = useProgress();

  return (
    <ol className="flex flex-col gap-3">
      {tricks.map((t, i) => {
        const key = progressKey(categoryId, t.id);
        return (
          <li key={t.id} className="flex items-start gap-3 rounded-lg border border-zinc-700 bg-zinc-900/80 p-4">
            <input
              type="checkbox"
              className="mt-1 size-4 shrink-0 accent-emerald-500"
              checked={learned.has(key)}
              onChange={(e) => setLearned(key, e.target.checked)}
              aria-label={`Mark "${t.title}" as learned`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-zinc-500">{i + 1}.</span>
                {t.viz ? (
                  <Link href={`/${categoryId}/${t.id}`} className="font-semibold text-indigo-200 hover:text-white hover:underline">
                    {t.title}
                  </Link>
                ) : (
                  <span className="font-semibold text-zinc-300">{t.title}</span>
                )}
                {!t.viz && <span className="rounded bg-zinc-700/60 px-1.5 py-0.5 text-[11px] text-zinc-400">visualization coming soon</span>}
              </div>
              <p className="mt-1 text-sm text-zinc-300">{t.idea}</p>
              {t.problems.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  {t.problems.map((p) => (
                    <a key={p.url} href={p.url} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-200 hover:underline">
                      {p.name} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
            {t.viz && (
              <Link
                href={`/${categoryId}/${t.id}`}
                className="shrink-0 rounded-md border border-amber-400/50 bg-amber-400/15 px-3 py-1.5 text-sm text-amber-100 hover:bg-amber-400/25"
              >
                Visualize
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
