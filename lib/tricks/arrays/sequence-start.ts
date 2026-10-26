import { defineCode, lc } from "../code";
import type { Step, Tone, Trick } from "../types";

const { code, lines } = defineCode(
  `
function longestConsecutive(nums: number[]): number {
  const set = new Set(nums); //@init
  let best = 0;
  for (const n of set) { //@loop
    if (set.has(n - 1)) continue; // not the start of a run //@skip
    let len = 1; //@start
    while (set.has(n + len)) len++; //@extend
    best = Math.max(best, len); //@best
  }
  return best; //@end
}
`,
  ["init", "loop", "skip", "start", "extend", "best", "end"],
);

const nums = [100, 4, 200, 1, 3, 2];

function steps(): Step[] {
  const out: Step[] = [];
  const set = [...new Set(nums)];
  let best = 0;

  const snap = (
    line: number,
    message: string,
    i?: number,
    opts: { tone?: Tone; run?: number[]; lookup?: number; lookupTone?: Tone; len?: number } = {},
  ): Step => {
    const tones: Record<number, Tone> = {};
    if (i !== undefined) tones[i] = opts.tone ?? "active";
    const setTones: Record<string, Tone> = {};
    for (const r of opts.run ?? []) setTones[String(r)] = "match";
    if (opts.lookup !== undefined) setTones[String(opts.lookup)] = opts.lookupTone ?? "compare";
    const step: Step = {
      line,
      message,
      arrays: [{ name: "iterating the set", values: set, tones, pointers: i !== undefined ? { n: i } : {} }],
      maps: [{ name: "set", kind: "set", entries: [...set].sort((a, b) => a - b).map((v) => [String(v)]), tones: setTones }],
      vars: { best, ...(opts.len !== undefined ? { len: opts.len } : {}) },
    };
    if (opts.run) step.arrays!.push({ name: "current run", values: opts.run, tones: Object.fromEntries(opts.run.map((_, j) => [j, "match" as Tone])) });
    return step;
  };

  out.push(snap(lines.init, "Put everything in a set so \"is x present?\" is O(1). Sorting would cost O(n log n); we want O(n)."));
  set.forEach((n, i) => {
    out.push(snap(lines.loop, `Consider n = ${n}.`, i));
    if (set.includes(n - 1)) {
      out.push(
        snap(lines.skip, `${n - 1} exists, so ${n} is in the middle of some run — skip it. Only start counting at the beginning of a run.`, i, {
          tone: "dim",
          lookup: n - 1,
          lookupTone: "compare",
        }),
      );
      return;
    }
    const run = [n];
    out.push(snap(lines.start, `${n - 1} is missing, so ${n} starts a run. Count upward from here.`, i, { run: [...run], lookup: n - 1, lookupTone: "bad", len: 1 }));
    while (set.includes(n + run.length)) {
      run.push(n + run.length);
      out.push(snap(lines.extend, `${run[run.length - 1]} is in the set → run length ${run.length}.`, i, { run: [...run], len: run.length }));
    }
    out.push(
      snap(lines.extend, `${n + run.length} is not in the set — the run ends.`, i, { run: [...run], lookup: n + run.length, lookupTone: "bad", len: run.length }),
    );
    best = Math.max(best, run.length);
    out.push(snap(lines.best, `best = max(best, ${run.length}) = ${best}.`, i, { run: [...run], len: run.length }));
  });
  out.push(snap(lines.end, `Answer: ${best}. Each number is visited at most twice (once in the loop, once while extending), so it's O(n).`));
  return out;
}

export const sequenceStart: Trick = {
  id: "sequence-start",
  title: "Only start at the start (set + n−1 check)",
  idea: "Use a set and only begin counting a run from x when x−1 is absent — each element is touched O(1) times.",
  problems: [lc("longest-consecutive-sequence", "Longest Consecutive Sequence")],
  viz: { input: `nums = [${nums.join(", ")}]`, code, steps },
};
