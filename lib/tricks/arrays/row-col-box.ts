import { defineCode, lc } from "../code";
import type { Step, Tone, Trick } from "../types";

const { code, lines } = defineCode(
  `
function isValidSudoku(board: string[][]): boolean {
  const rows = Array.from({ length: 9 }, () => new Set<string>()); //@init
  const cols = Array.from({ length: 9 }, () => new Set<string>());
  const boxes = Array.from({ length: 9 }, () => new Set<string>());
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = board[r][c]; //@cell
      if (v === ".") continue;
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3); //@box
      if (rows[r].has(v) || cols[c].has(v) || boxes[b].has(v)) { //@check
        return false; //@fail
      }
      rows[r].add(v); //@add
      cols[c].add(v);
      boxes[b].add(v);
    }
  }
  return true; //@end
}
`,
  ["init", "cell", "box", "check", "fail", "add", "end"],
);

// LeetCode example 1 with a "3" planted at (2, 0): row and column are fine, only the box catches it.
const board = [
  ["5", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  ["3", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"],
];

const boxOf = (r: number, c: number) => Math.floor(r / 3) * 3 + Math.floor(c / 3);

function steps(): Step[] {
  const out: Step[] = [];
  const rows = Array.from({ length: 9 }, () => new Set<string>());
  const cols = Array.from({ length: 9 }, () => new Set<string>());
  const boxes = Array.from({ length: 9 }, () => new Set<string>());
  const visited = new Set<string>();

  const snap = (line: number, message: string, r?: number, c?: number, opts: { dup?: [number, number]; setTone?: Tone; showBox?: boolean } = {}): Step => {
    const tones: Record<string, Tone> = {};
    for (const key of visited) tones[key] = "done";
    if (r !== undefined && c !== undefined) {
      const b = boxOf(r, c);
      if (opts.showBox) {
        for (let rr = 0; rr < 9; rr++)
          for (let cc = 0; cc < 9; cc++) {
            if (rr === r || cc === c || boxOf(rr, cc) === b) tones[`${rr},${cc}`] ??= "dim";
          }
      }
      tones[`${r},${c}`] = opts.dup ? "bad" : "active";
      if (opts.dup) tones[opts.dup.join(",")] = "bad";
    }
    const step: Step = { line, message, grids: [{ name: "board", cells: board, tones, boxSize: 3 }] };
    if (r !== undefined && c !== undefined) {
      const b = boxOf(r, c);
      const v = board[r][c];
      const t = opts.setTone ? { [v]: opts.setTone } : {};
      const sorted = (s: Set<string>) => [...s].sort().map((x) => [x] as [string]);
      step.maps = [
        { name: `rows[${r}]`, kind: "set", entries: sorted(rows[r]), tones: rows[r].has(v) || opts.setTone === "match" ? t : {} },
        { name: `cols[${c}]`, kind: "set", entries: sorted(cols[c]), tones: cols[c].has(v) || opts.setTone === "match" ? t : {} },
        { name: `boxes[${b}]`, kind: "set", entries: sorted(boxes[b]), tones: boxes[b].has(v) || opts.setTone === "match" ? t : {} },
      ];
      step.vars = { r, c, v, b };
    }
    return step;
  };

  out.push(
    snap(
      lines.init,
      "A valid board has no repeated digit in any row, column or 3×3 box. Keep one set per row, per column and per box: 27 sets, one pass.",
    ),
  );
  let shownBoxTip = false;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (v === ".") continue;
      const b = boxOf(r, c);
      out.push(snap(lines.cell, `Cell (${r}, ${c}) holds ${v}.`, r, c, { showBox: true }));
      if (!shownBoxTip) {
        out.push(
          snap(lines.box, `Box id = floor(r/3)·3 + floor(c/3) = ${Math.floor(r / 3)}·3 + ${Math.floor(c / 3)} = ${b}. This maps every cell to one of the 9 boxes.`, r, c, {
            showBox: true,
          }),
        );
        shownBoxTip = true;
      } else {
        out.push(snap(lines.box, `Box id = ${Math.floor(r / 3)}·3 + ${Math.floor(c / 3)} = ${b}.`, r, c, { showBox: true }));
      }
      const where = rows[r].has(v) ? "row" : cols[c].has(v) ? "column" : boxes[b].has(v) ? "box" : null;
      if (where) {
        let dup: [number, number] = [r, c];
        for (let rr = 0; rr < 9; rr++)
          for (let cc = 0; cc < 9; cc++) {
            const same = where === "row" ? rr === r : where === "column" ? cc === c : boxOf(rr, cc) === b;
            if (same && board[rr][cc] === v && visited.has(`${rr},${cc}`)) dup = [rr, cc];
          }
        out.push(snap(lines.check, `${v} is already in this ${where}'s set (at (${dup[0]}, ${dup[1]})).`, r, c, { dup, setTone: "bad", showBox: true }));
        out.push(snap(lines.fail, "Invalid board — return false.", r, c, { dup, setTone: "bad", showBox: true }));
        return out;
      }
      out.push(snap(lines.check, `${v} is not in rows[${r}], cols[${c}] or boxes[${b}] — OK.`, r, c, { showBox: true }));
      rows[r].add(v);
      cols[c].add(v);
      boxes[b].add(v);
      visited.add(`${r},${c}`);
      out.push(snap(lines.add, `Record ${v} in all three sets.`, r, c, { setTone: "match", showBox: true }));
    }
  }
  out.push(snap(lines.end, "No conflicts anywhere: valid."));
  return out;
}

export const rowColBox: Trick = {
  id: "row-col-box",
  title: "Group keys: row / column / box",
  idea: "Compute a key for every group a cell belongs to (r, c, ⌊r/3⌋·3+⌊c/3⌋) and keep a set per key — constraint checks become set lookups.",
  problems: [lc("valid-sudoku", "Valid Sudoku"), lc("sudoku-solver", "Sudoku Solver")],
  viz: { input: "9×9 board with a duplicate 3 in the top-left box", code, steps },
};
