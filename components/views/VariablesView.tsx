import type { Step } from "@/lib/tricks/types";

export function VariablesView({ vars }: { vars: NonNullable<Step["vars"]> }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(vars).map(([name, value]) => (
        <div key={name} className="rounded-md border border-zinc-700 bg-zinc-800/60 px-2 py-1 font-mono text-sm">
          <span className="text-zinc-400">{name} = </span>
          <span className="text-zinc-100">{String(value)}</span>
        </div>
      ))}
    </div>
  );
}
