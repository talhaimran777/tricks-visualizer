import { defineCode, lc } from "../code";
import type { Step, Tone, Trick } from "../types";

const { code, lines } = defineCode(
  `
function topKFrequent(nums: number[], k: number): number[] {
  const count = new Map<number, number>(); //@init
  for (const n of nums) count.set(n, (count.get(n) ?? 0) + 1); //@count
  // bucket index = how many times a number appears
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []); //@buckets
  for (const [n, c] of count) buckets[c].push(n); //@place
  const res: number[] = [];
  for (let c = buckets.length - 1; c > 0; c--) { //@scan
    for (const n of buckets[c]) {
      res.push(n); //@take
      if (res.length === k) return res; //@done
    }
  }
  return res;
}
`,
  ["init", "count", "buckets", "place", "scan", "take", "done"],
);

const nums = [5, 1, 5, 2, 1, 5, 3, 1, 5];
const k = 2;

function steps(): Step[] {
  const out: Step[] = [];
  const count = new Map<number, number>();
  let buckets: number[][] | null = null;
  const res: number[] = [];

  const snap = (
    line: number,
    message: string,
    opts: { i?: number; key?: number; bucket?: number; bucketTone?: Tone } = {},
  ): Step => {
    const tones: Record<number, Tone> = {};
    if (opts.i !== undefined) {
      for (let j = 0; j < opts.i; j++) tones[j] = "done";
      tones[opts.i] = "active";
    }
    const step: Step = {
      line,
      message,
      arrays: [{ name: "nums", values: nums, tones, pointers: opts.i !== undefined ? { i: opts.i } : {} }],
      maps: [
        {
          name: "count (number → frequency)",
          kind: "map",
          entries: [...count].map(([n, c]) => [String(n), String(c)]),
          tones: opts.key !== undefined ? { [String(opts.key)]: "active" } : {},
        },
      ],
      vars: { k, res: `[${res.join(", ")}]` },
    };
    if (buckets) {
      step.buckets = [
        {
          name: "buckets (index = frequency)",
          buckets: buckets.map((b) => [...b]),
          tones: opts.bucket !== undefined ? { [opts.bucket]: opts.bucketTone ?? "active" } : {},
        },
      ];
    }
    return step;
  };

  out.push(snap(lines.init, `Find the ${k} most frequent numbers. Sorting by frequency would be O(n log n) — we can do O(n).`));
  nums.forEach((n, i) => {
    count.set(n, (count.get(n) ?? 0) + 1);
    out.push(snap(lines.count, `Count ${n}: now seen ${count.get(n)} time(s).`, { i, key: n }));
  });
  buckets = Array.from({ length: nums.length + 1 }, () => []);
  out.push(
    snap(
      lines.buckets,
      `Key insight: a frequency can never exceed nums.length (${nums.length}). So make ${nums.length + 1} buckets, where bucket[c] holds numbers that appear exactly c times.`,
    ),
  );
  for (const [n, c] of count) {
    buckets[c].push(n);
    out.push(snap(lines.place, `${n} appears ${c} time(s) → drop it in bucket ${c}.`, { key: n, bucket: c }));
  }
  for (let c = buckets.length - 1; c > 0; c--) {
    if (buckets[c].length === 0) {
      out.push(snap(lines.scan, `Scan from the highest frequency down. Bucket ${c} is empty.`, { bucket: c, bucketTone: "compare" }));
      continue;
    }
    for (const n of buckets[c]) {
      res.push(n);
      out.push(snap(lines.take, `Bucket ${c} has ${n} — take it. res = [${res.join(", ")}].`, { bucket: c, bucketTone: "match" }));
      if (res.length === k) {
        out.push(snap(lines.done, `We have k = ${k} numbers. Answer: [${res.join(", ")}]. No sorting needed.`, { bucket: c, bucketTone: "match" }));
        return out;
      }
    }
  }
  return out;
}

export const bucketSort: Trick = {
  id: "bucket-sort",
  title: "Bucket sort by frequency",
  idea: "When the value you'd sort by is bounded (a count ≤ n), use it as an array index instead of sorting.",
  problems: [lc("top-k-frequent-elements", "Top K Frequent Elements"), lc("sort-characters-by-frequency", "Sort Characters By Frequency")],
  viz: { input: `nums = [${nums.join(", ")}], k = ${k}`, code, steps },
};
