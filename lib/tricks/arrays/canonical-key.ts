import { defineCode, lc } from "../code";
import type { ArrayState, Step, Tone, Trick } from "../types";

const { code, lines } = defineCode(
  `
function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>(); //@init
  for (const word of strs) { //@loop
    const key = [...word].sort().join(""); //@key
    if (!groups.has(key)) groups.set(key, []); //@create
    groups.get(key)!.push(word); //@push
  }
  return [...groups.values()]; //@end
}
`,
  ["init", "loop", "key", "create", "push", "end"],
);

const strs = ["eat", "tea", "tan", "ate", "nat", "bat"];

function steps(): Step[] {
  const out: Step[] = [];
  const groups = new Map<string, string[]>();
  const snap = (line: number, message: string, i?: number, word?: string[], key?: string[], mapTone?: [string, Tone]): Step => {
    const tones: Record<number, Tone> = {};
    if (i !== undefined) {
      for (let k = 0; k < i; k++) tones[k] = "done";
      tones[i] = "active";
    }
    const arrays: ArrayState[] = [{ name: "strs", values: strs, tones, pointers: i !== undefined ? { i } : {} }];
    if (word) arrays.push({ name: "word", values: word });
    if (key) arrays.push({ name: "key (sorted)", values: key, tones: Object.fromEntries(key.map((_, k) => [k, "compare" as Tone])) });
    return {
      line,
      message,
      arrays,
      maps: [
        {
          name: "groups (key → words)",
          kind: "map",
          entries: [...groups].map(([k, v]) => [k, `[${v.join(", ")}]`]),
          tones: mapTone ? { [mapTone[0]]: mapTone[1] } : {},
        },
      ],
    };
  };

  out.push(snap(lines.init, "Anagrams have the same letters in a different order. Turn each word into a canonical form and all anagrams collide on the same key."));
  strs.forEach((w, i) => {
    const chars = [...w];
    const key = [...chars].sort();
    const k = key.join("");
    out.push(snap(lines.loop, `Take "${w}".`, i, chars));
    out.push(snap(lines.key, `Sort its letters: "${w}" → "${k}". Every anagram of "${w}" sorts to the same thing.`, i, chars, key));
    if (!groups.has(k)) {
      groups.set(k, []);
      out.push(snap(lines.create, `"${k}" is a new key — open an empty group for it.`, i, chars, key, [k, "active"]));
    } else {
      out.push(snap(lines.create, `"${k}" already exists — "${w}" is an anagram of a word we've seen.`, i, chars, key, [k, "match"]));
    }
    groups.get(k)!.push(w);
    out.push(snap(lines.push, `Add "${w}" to group "${k}".`, i, chars, key, [k, "match"]));
  });
  out.push(snap(lines.end, `Done: ${groups.size} groups. A 26-slot letter count works as the key too (O(n·k) instead of O(n·k log k)).`));
  return out;
}

export const canonicalKey: Trick = {
  id: "canonical-key",
  title: "Canonical key / frequency signature",
  idea: "Map each item to a signature (sorted letters or letter counts) so that \"equivalent\" items land on the same hash key.",
  problems: [lc("valid-anagram", "Valid Anagram"), lc("group-anagrams", "Group Anagrams")],
  viz: { input: `strs = [${strs.map((s) => `"${s}"`).join(", ")}]`, code, steps },
};
