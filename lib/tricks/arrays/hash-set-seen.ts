import { defineCode, lc } from "../code";
import type { Step, Tone, Trick } from "../types";

const { code, lines } = defineCode(
  `
function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>(); //@init
  for (let i = 0; i < nums.length; i++) { //@loop
    if (seen.has(nums[i])) return true; //@check
    seen.add(nums[i]); //@add
  }
  return false; //@end
}
`,
  ["init", "loop", "check", "add", "end"],
);

const nums = [3, 1, 4, 1, 5];

function steps(): Step[] {
  const out: Step[] = [];
  const seen: number[] = [];
  const snap = (line: number, message: string, i?: number, tone: Tone = "active", setTone?: Tone): Step => {
    const tones: Record<number, Tone> = {};
    if (i !== undefined) {
      for (let k = 0; k < i; k++) tones[k] = "done";
      tones[i] = tone;
    }
    return {
      line,
      message,
      arrays: [{ name: "nums", values: nums, tones, pointers: i !== undefined ? { i } : {} }],
      maps: [
        {
          name: "seen",
          kind: "set",
          entries: seen.map((n) => [String(n)]),
          tones: i !== undefined && setTone ? { [String(nums[i])]: setTone } : {},
        },
      ],
    };
  };

  out.push(snap(lines.init, "Start with an empty set. It remembers every number we've already walked past."));
  for (let i = 0; i < nums.length; i++) {
    out.push(snap(lines.loop, `Look at nums[${i}] = ${nums[i]}.`, i));
    if (seen.includes(nums[i])) {
      out.push(snap(lines.check, `${nums[i]} is already in the set — we've seen it before. Duplicate found with one O(1) lookup.`, i, "bad", "bad"));
      return out;
    }
    out.push(snap(lines.check, `Is ${nums[i]} in the set? No — first time we see it.`, i, "compare"));
    seen.push(nums[i]);
    out.push(snap(lines.add, `Add ${nums[i]} to the set and move on.`, i, "match", "match"));
  }
  out.push(snap(lines.end, "Walked the whole array without a repeat: no duplicates."));
  return out;
}

export const hashSetSeen: Trick = {
  id: "hash-set-seen",
  title: "Hash set: \"have I seen this?\"",
  idea: "Instead of comparing every pair (O(n²)), keep a set of what you've already visited — each lookup is O(1).",
  problems: [lc("contains-duplicate", "Contains Duplicate"), lc("valid-sudoku", "Valid Sudoku")],
  viz: { input: `nums = [${nums.join(", ")}]`, code, steps },
};
