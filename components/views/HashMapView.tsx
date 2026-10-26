import type { MapState } from "@/lib/tricks/types";
import { tone } from "./tones";

export function HashMapView({ state }: { state: MapState }) {
  return (
    <div className="min-w-0">
      <div className="mb-1 font-mono text-xs text-zinc-400">
        {state.name} <span className="text-zinc-600">({state.kind})</span>
      </div>
      {state.entries.length === 0 ? (
        <div className="font-mono text-sm text-zinc-500">empty</div>
      ) : state.kind === "set" ? (
        <div className="flex flex-wrap gap-1">
          {state.entries.map(([k]) => (
            <span key={k} className={`rounded-md border px-2 py-1 font-mono text-sm transition-colors duration-300 ${tone(state.tones?.[k])}`}>
              {k}
            </span>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {state.entries.map(([k, v]) => (
            <div key={k} className={`flex w-fit max-w-full items-center rounded-md border font-mono text-sm transition-colors duration-300 ${tone(state.tones?.[k])}`}>
              <span className="px-2 py-1">{k}</span>
              <span className="border-l border-inherit px-2 py-1 opacity-60">→</span>
              <span className="px-2 py-1 break-all">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
