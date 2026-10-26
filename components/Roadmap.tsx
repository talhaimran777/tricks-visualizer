"use client";

import Link from "next/link";
import { categories, getCategory, NODE_HEIGHT, NODE_WIDTH, ROADMAP_HEIGHT, ROADMAP_WIDTH } from "@/lib/roadmap";
import { useProgress } from "@/lib/progress";
import { getTricks, progressKey } from "@/lib/tricks";

export function Roadmap() {
  const { learned } = useProgress();

  const edges = categories.flatMap((child) =>
    child.parents.map((pid) => {
      const p = getCategory(pid)!;
      // Center to center; the opaque nodes hide the ends, so multi-line nodes still look attached.
      const { x: x1, y: y1 } = p;
      const { x: x2, y: y2 } = child;
      const my = (y1 + y2) / 2;
      return { id: `${pid}-${child.id}`, d: `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}` };
    }),
  );

  return (
    <div className="overflow-x-auto pb-4">
      <div className="relative mx-auto" style={{ width: ROADMAP_WIDTH, height: ROADMAP_HEIGHT }}>
        <svg className="absolute inset-0" width={ROADMAP_WIDTH} height={ROADMAP_HEIGHT} aria-hidden>
          {edges.map((e) => (
            <path key={e.id} d={e.d} fill="none" stroke="#6b6b75" strokeWidth={2.5} />
          ))}
        </svg>
        {categories.map((c) => {
          const tricks = getTricks(c.id);
          const done = tricks.filter((t) => learned.has(progressKey(c.id, t.id))).length;
          const ready = tricks.filter((t) => t.viz).length;
          const pct = tricks.length ? (done / tricks.length) * 100 : 0;
          return (
            <Link
              key={c.id}
              href={`/${c.id}`}
              className="absolute flex -translate-1/2 flex-col justify-center rounded-md border border-indigo-300/30 bg-[#4b4c86] px-3 py-1.5 text-center shadow-lg shadow-black/40 transition-colors hover:border-indigo-200 hover:bg-[#5a5ba0]"
              style={{ left: c.x, top: c.y, width: NODE_WIDTH, minHeight: NODE_HEIGHT }}
              title={`${done}/${tricks.length} learned · ${ready} animated`}
            >
              <span className="text-[13px] leading-tight font-semibold text-white">{c.title}</span>
              <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-white">
                <span className="block h-full bg-emerald-500 transition-[width]" style={{ width: `${pct}%` }} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
