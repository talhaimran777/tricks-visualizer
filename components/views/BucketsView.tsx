import type { BucketsState } from "@/lib/tricks/types";
import { tone } from "./tones";

export function BucketsView({ state }: { state: BucketsState }) {
  return (
    <div>
      <div className="mb-1 font-mono text-xs text-zinc-400">{state.name}</div>
      <div className="overflow-x-auto pb-1">
        <div className="flex w-max items-end gap-1">
          {state.buckets.map((items, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`flex min-h-16 w-11 flex-col-reverse items-center gap-1 rounded-b-md border border-t-0 p-1 transition-colors duration-300 ${tone(state.tones?.[i])}`}
              >
                {items.map((v, j) => (
                  <span key={j} className="w-full rounded bg-zinc-100/10 text-center font-mono text-sm">
                    {v}
                  </span>
                ))}
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-zinc-500">{i}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
