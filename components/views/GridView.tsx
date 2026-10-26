import type { GridState } from "@/lib/tricks/types";
import { tone } from "./tones";

export function GridView({ state }: { state: GridState }) {
  const box = state.boxSize;
  return (
    <div>
      <div className="mb-1 font-mono text-xs text-zinc-400">{state.name}</div>
      <div className="w-fit max-w-full overflow-x-auto">
        <div className="grid w-max gap-0.5" style={{ gridTemplateColumns: `repeat(${state.cells[0]?.length ?? 0}, auto)` }}>
          {state.cells.flatMap((row, r) =>
            row.map((v, c) => {
              const gapRight = box && (c + 1) % box === 0 && c + 1 < row.length ? "mr-1.5" : "";
              const gapBottom = box && (r + 1) % box === 0 && r + 1 < state.cells.length ? "mb-1.5" : "";
              return (
                <div
                  key={`${r},${c}`}
                  className={`flex size-8 items-center justify-center rounded border font-mono text-sm transition-colors duration-300 sm:size-9 ${gapRight} ${gapBottom} ${tone(state.tones?.[`${r},${c}`])}`}
                >
                  {v === "." ? "" : v}
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
