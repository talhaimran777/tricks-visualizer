export type Tone = "active" | "compare" | "match" | "bad" | "done" | "dim";

export type ArrayState = {
  name: string;
  values: (string | number)[];
  /** index -> highlight tone */
  tones?: Record<number, Tone>;
  /** pointer label -> index */
  pointers?: Record<string, number>;
};

export type MapState = {
  name: string;
  /** A set has no values column. */
  kind: "map" | "set";
  entries: [string, string?][];
  /** key -> highlight tone */
  tones?: Record<string, Tone>;
};

export type GridState = {
  name: string;
  cells: string[][];
  /** "r,c" -> highlight tone */
  tones?: Record<string, Tone>;
  /** Draw thick lines every N cells (e.g. 3 for sudoku boxes). */
  boxSize?: number;
};

export type BucketsState = {
  name: string;
  buckets: (string | number)[][];
  tones?: Record<number, Tone>;
};

export type Step = {
  /** 1-based line of the code panel to highlight. */
  line: number;
  message: string;
  arrays?: ArrayState[];
  maps?: MapState[];
  grids?: GridState[];
  buckets?: BucketsState[];
  vars?: Record<string, string | number | boolean>;
};

export type Problem = { name: string; url: string };

export type Visualization = {
  /** Plain-text description of the example input. */
  input: string;
  code: string;
  steps: () => Step[];
};

export type Trick = {
  id: string;
  title: string;
  /** One-line statement of the trick itself. */
  idea: string;
  problems: Problem[];
  /** Missing until the trick's animation has been built. */
  viz?: Visualization;
};
