/**
 * Lets trick files tag code lines by name instead of hard-coding line numbers.
 * A line ending in `//@name` is recorded as `lines.name` and the marker is stripped.
 */
export function defineCode<const L extends string>(source: string, labels: readonly L[]) {
  const lines = {} as Record<L, number>;
  const out = source
    .replace(/^\n/, "")
    .trimEnd()
    .split("\n")
    .map((text, i) => {
      const m = text.match(/\s*\/\/@(\w+)$/);
      if (!m) return text;
      lines[m[1] as L] = i + 1;
      return text.slice(0, m.index);
    });
  for (const label of labels) {
    if (!(label in lines)) throw new Error(`Missing code label: ${label}`);
  }
  return { code: out.join("\n"), lines };
}

export const lc = (slug: string, name: string) => ({
  name,
  url: `https://leetcode.com/problems/${slug}/`,
});
