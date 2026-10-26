import type { ArrayState } from "@/lib/tricks/types";
import { tone } from "./tones";

export function ArrayView({ state }: { state: ArrayState }) {
  const pointersAt = new Map<number, string[]>();
  for (const [label, idx] of Object.entries(state.pointers ?? {})) {
    pointersAt.set(idx, [...(pointersAt.get(idx) ?? []), label]);
  }
  const hasPointers = pointersAt.size > 0;

  return (
    <div>
      <div className="mb-1 font-mono text-xs text-zinc-400">{state.name}</div>
      <div className="overflow-x-auto pb-1">
        {state.values.length === 0 ? (
          <div className="flex h-11 items-center font-mono text-sm text-zinc-500">empty</div>
        ) : (
          <div className="flex w-max gap-1">
            {state.values.map((v, i) => (
              <div key={i} className="flex flex-col items-center">
                {hasPointers && (
                  <div className="h-5 font-mono text-xs font-semibold text-amber-300">
                    {pointersAt.get(i)?.join(",")}
                    {pointersAt.has(i) && "↓"}
                  </div>
                )}
                <div
                  className={`flex h-11 min-w-11 items-center justify-center rounded-md border px-2 font-mono text-base transition-colors duration-300 ${tone(state.tones?.[i])}`}
                >
                  {v}
                </div>
                <div className="mt-0.5 font-mono text-[10px] text-zinc-500">{i}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
