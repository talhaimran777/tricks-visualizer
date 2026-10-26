import { defineCode, lc } from "../code";
import type { Step, Tone, Trick } from "../types";

const { code, lines } = defineCode(
  `
function twoSum(nums: number[], target: number): number[] {
  const indexOf = new Map<number, number>(); //@init
  for (let i = 0; i < nums.length; i++) { //@loop
    const need = target - nums[i]; //@need
    if (indexOf.has(need)) { //@check
      return [indexOf.get(need)!, i]; //@found
    }
    indexOf.set(nums[i], i); //@store
  }
  return [];
}
`,
  ["init", "loop", "need", "check", "found", "store"],
);

const nums = [4, 1, 7, 9, 3];
const target = 12;

function steps(): Step[] {
  const out: Step[] = [];
  const map: [number, number][] = [];
  const snap = (
    line: number,
    message: string,
    i?: number,
    extra: { need?: number; arrTones?: Record<number, Tone>; mapTones?: Record<string, Tone> } = {},
  ): Step => {
    const tones: Record<number, Tone> = {};
    if (i !== undefined) {
      for (let k = 0; k < i; k++) tones[k] = "done";
      tones[i] = "active";
    }
    return {
      line,
      message,
      arrays: [{ name: "nums", values: nums, tones: { ...tones, ...extra.arrTones }, pointers: i !== undefined ? { i } : {} }],
      maps: [
        {
          name: "indexOf (value → index)",
          kind: "map",
          entries: map.map(([v, idx]) => [String(v), String(idx)]),
          tones: extra.mapTones,
        },
      ],
      vars: { target, ...(extra.need !== undefined ? { need: extra.need } : {}) },
    };
  };

  out.push(snap(lines.init, `Goal: two numbers that add up to ${target}. The map will remember every value we've passed and where it was.`));
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    out.push(snap(lines.loop, `Look at nums[${i}] = ${nums[i]}.`, i));
    out.push(snap(lines.need, `Its partner would have to be ${target} − ${nums[i]} = ${need}.`, i, { need }));
    const hit = map.find(([v]) => v === need);
    if (hit) {
      out.push(
        snap(lines.check, `Is ${need} in the map? Yes — at index ${hit[1]}.`, i, {
          need,
          mapTones: { [String(need)]: "match" },
        }),
      );
      out.push(
        snap(lines.found, `Answer: [${hit[1]}, ${i}] because ${nums[hit[1]]} + ${nums[i]} = ${target}. One pass, O(n).`, i, {
          need,
          arrTones: { [hit[1]]: "match", [i]: "match" },
          mapTones: { [String(need)]: "match" },
        }),
      );
      return out;
    }
    out.push(snap(lines.check, `Is ${need} in the map? Not yet.`, i, { need }));
    map.push([nums[i], i]);
    out.push(
      snap(lines.store, `Store ${nums[i]} → ${i}, so a later number that needs ${nums[i]} can find it instantly.`, i, {
        need,
        mapTones: { [String(nums[i])]: "active" },
      }),
    );
  }
  return out;
}

export const hashMapComplement: Trick = {
  id: "hash-map-complement",
  title: "Hash map complement lookup",
  idea: "For each x, ask the map \"have I already seen target − x?\" — turns a pair search into one pass.",
  problems: [lc("two-sum", "Two Sum"), lc("subarray-sum-equals-k", "Subarray Sum Equals K")],
  viz: { input: `nums = [${nums.join(", ")}], target = ${target}`, code, steps },
};
