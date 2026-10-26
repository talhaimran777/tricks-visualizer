import { defineCode, lc } from "../code";
import type { Step, Tone, Trick } from "../types";

const { code, lines } = defineCode(
  `
function encode(strs: string[]): string {
  let out = ""; //@encInit
  for (const s of strs) out += s.length + "#" + s; //@encAdd
  return out;
}

function decode(str: string): string[] {
  const res: string[] = [];
  let i = 0; //@decInit
  while (i < str.length) {
    let j = i;
    while (str[j] !== "#") j++; //@findHash
    const len = Number(str.slice(i, j)); //@len
    res.push(str.slice(j + 1, j + 1 + len)); //@word
    i = j + 1 + len; //@jump
  }
  return res; //@end
}
`,
  ["encInit", "encAdd", "decInit", "findHash", "len", "word", "jump", "end"],
);

const strs = ["neet", "code", "4#you"];

function steps(): Step[] {
  const out: Step[] = [];
  let encoded = "";
  const res: string[] = [];

  const strsArray = (active?: number) => ({
    name: "strs",
    values: strs.map((s) => `"${s}"`),
    tones: active !== undefined ? { [active]: "active" as Tone } : {},
  });

  out.push({
    line: lines.encInit,
    message: "Problem: join a list of strings into one string and split it back — but the strings may contain any character, including your delimiter.",
    arrays: [strsArray(), { name: "encoded", values: [] }],
  });
  strs.forEach((s, w) => {
    const start = encoded.length;
    const chunk = `${s.length}#${s}`;
    encoded += chunk;
    const tones: Record<number, Tone> = {};
    const header = String(s.length).length + 1;
    for (let k = start; k < start + header; k++) tones[k] = "compare";
    for (let k = start + header; k < encoded.length; k++) tones[k] = "active";
    out.push({
      line: lines.encAdd,
      message: `Write the length first, then "#", then the raw string: "${chunk}".`,
      arrays: [strsArray(w), { name: "encoded", values: [...encoded], tones }],
    });
  });

  const chars = [...encoded];
  const snap = (line: number, message: string, i: number, j?: number, tones: Record<number, Tone> = {}, vars: Step["vars"] = {}): Step => ({
    line,
    message,
    arrays: [
      { name: "str", values: chars, tones, pointers: j !== undefined ? { i, j } : { i } },
      { name: "res", values: res.map((r) => `"${r}"`), tones: {} },
    ],
    vars,
  });

  out.push(snap(lines.decInit, `Now decode "${encoded}". Start reading at i = 0.`, 0));
  let i = 0;
  while (i < chars.length) {
    let j = i;
    while (chars[j] !== "#") j++;
    const digits: Record<number, Tone> = {};
    for (let k = i; k < j; k++) digits[k] = "compare";
    out.push(snap(lines.findHash, `Move j forward to the first "#" — everything between i and j is the length.`, i, j, { ...digits, [j]: "active" }));
    const len = Number(encoded.slice(i, j));
    out.push(snap(lines.len, `Length = ${len}.`, i, j, { ...digits, [j]: "active" }, { len }));
    const word = encoded.slice(j + 1, j + 1 + len);
    const wordTones: Record<number, Tone> = { ...digits, [j]: "active" };
    for (let k = j + 1; k < j + 1 + len; k++) wordTones[k] = "match";
    res.push(word);
    out.push(
      snap(
        lines.word,
        `Take exactly ${len} characters after "#": "${word}".${word.includes("#") ? ' The "#" inside is just data — we never scan for it, we count.' : ""}`,
        i,
        j,
        wordTones,
        { len },
      ),
    );
    i = j + 1 + len;
    if (i < chars.length) out.push(snap(lines.jump, `Jump i straight past the word to ${i}.`, i, undefined, {}, { len }));
  }
  out.push({
    line: lines.end,
    message: `Decoded back to [${res.map((r) => `"${r}"`).join(", ")}]. The length header tells you where each piece ends, so no escaping is needed.`,
    arrays: [
      { name: "str", values: chars, tones: Object.fromEntries(chars.map((_, k) => [k, "done" as Tone])) },
      { name: "res", values: res.map((r) => `"${r}"`), tones: Object.fromEntries(res.map((_, k) => [k, "match" as Tone])) },
    ],
  });
  return out;
}

export const lengthPrefix: Trick = {
  id: "length-prefix",
  title: "Length-prefix encoding",
  idea: "Prefix each piece with its length and a separator (\"4#neet\"); the reader counts characters instead of searching for a delimiter.",
  problems: [lc("encode-and-decode-strings", "Encode and Decode Strings")],
  viz: { input: `strs = [${strs.map((s) => `"${s}"`).join(", ")}]`, code, steps },
};
