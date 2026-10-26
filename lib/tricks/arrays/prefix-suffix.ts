import { defineCode, lc } from "../code";
import type { Step, Tone, Trick } from "../types";

const { code, lines } = defineCode(
  `
function productExceptSelf(nums: number[]): number[] {
  const res = new Array(nums.length).fill(1); //@init
  let prefix = 1; // product of everything LEFT of i
  for (let i = 0; i < nums.length; i++) { //@prefixLoop
    res[i] = prefix; //@prefixSet
    prefix *= nums[i]; //@prefixMul
  }
  let suffix = 1; // product of everything RIGHT of i //@suffixInit
  for (let i = nums.length - 1; i >= 0; i--) { //@suffixLoop
    res[i] *= suffix; //@suffixSet
    suffix *= nums[i]; //@suffixMul
  }
  return res; //@end
}
`,
  ["init", "prefixLoop", "prefixSet", "prefixMul", "suffixInit", "suffixLoop", "suffixSet", "suffixMul", "end"],
);

const nums = [2, 3, 4, 5];

function steps(): Step[] {
  const out: Step[] = [];
  const res: number[] = new Array(nums.length).fill(1);
  let prefix = 1;
  let suffix = 1;
  let phase: "prefix" | "suffix" = "prefix";

  const snap = (line: number, message: string, i?: number, resTone?: Tone): Step => {
    const numTones: Record<number, Tone> = {};
    const resTones: Record<number, Tone> = {};
    if (i !== undefined) {
      // Shade the part of nums that the running product currently covers.
      for (let j = 0; j < nums.length; j++) {
        if (phase === "prefix" ? j < i : j > i) numTones[j] = "compare";
      }
      numTones[i] = "active";
      if (resTone) resTones[i] = resTone;
    }
    return {
      line,
      message,
      arrays: [
        { name: "nums", values: nums, tones: numTones, pointers: i !== undefined ? { i } : {} },
        { name: "res", values: [...res], tones: resTones, pointers: i !== undefined ? { i } : {} },
      ],
      vars: phase === "prefix" ? { prefix } : { prefix, suffix },
    };
  };

  out.push(
    snap(
      lines.init,
      "res[i] must be (product of everything left of i) × (product of everything right of i). No division allowed — so build those two products in two passes.",
    ),
  );
  for (let i = 0; i < nums.length; i++) {
    out.push(snap(lines.prefixLoop, `Left-to-right pass, i = ${i}. prefix = product of the blue cells = ${prefix}.`, i));
    res[i] = prefix;
    out.push(snap(lines.prefixSet, `res[${i}] = prefix = ${prefix} (everything to the left of ${nums[i]}).`, i, "active"));
    prefix *= nums[i];
    out.push(snap(lines.prefixMul, `Fold nums[${i}] = ${nums[i]} into prefix → ${prefix}.`, i));
  }
  phase = "suffix";
  out.push(snap(lines.suffixInit, `res now holds every left product: [${res.join(", ")}]. Now sweep right-to-left with a running suffix.`));
  for (let i = nums.length - 1; i >= 0; i--) {
    out.push(snap(lines.suffixLoop, `Right-to-left pass, i = ${i}. suffix = product of the blue cells = ${suffix}.`, i));
    const before = res[i];
    res[i] *= suffix;
    out.push(snap(lines.suffixSet, `res[${i}] = ${before} (left) × ${suffix} (right) = ${res[i]}. This cell is final.`, i, "match"));
    suffix *= nums[i];
    out.push(snap(lines.suffixMul, `Fold nums[${i}] = ${nums[i]} into suffix → ${suffix}.`, i, "match"));
  }
  out.push(snap(lines.end, `Answer: [${res.join(", ")}]. Two O(n) passes, O(1) extra space besides the output.`));
  return out;
}

export const prefixSuffix: Trick = {
  id: "prefix-suffix",
  title: "Prefix & suffix passes",
  idea: "Precompute running totals from the left and from the right; then any \"everything except i\" or range question is O(1).",
  problems: [
    lc("product-of-array-except-self", "Product of Array Except Self"),
    lc("range-sum-query-immutable", "Range Sum Query - Immutable"),
    lc("trapping-rain-water", "Trapping Rain Water"),
  ],
  viz: { input: `nums = [${nums.join(", ")}]`, code, steps },
};
