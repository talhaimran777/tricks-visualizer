export type Category = {
  id: string;
  title: string;
  /** Center of the node on the roadmap canvas. */
  x: number;
  y: number;
  parents: string[];
};

export const ROADMAP_WIDTH = 820;
export const ROADMAP_HEIGHT = 780;
export const NODE_WIDTH = 132;
export const NODE_HEIGHT = 44;

// Layout follows the NeetCode roadmap.
export const categories: Category[] = [
  { id: "arrays-hashing", title: "Arrays & Hashing", x: 410, y: 40, parents: [] },
  { id: "two-pointers", title: "Two Pointers", x: 320, y: 135, parents: ["arrays-hashing"] },
  { id: "stack", title: "Stack", x: 500, y: 135, parents: ["arrays-hashing"] },
  { id: "binary-search", title: "Binary Search", x: 170, y: 235, parents: ["two-pointers"] },
  { id: "sliding-window", title: "Sliding Window", x: 320, y: 235, parents: ["two-pointers"] },
  { id: "linked-list", title: "Linked List", x: 470, y: 235, parents: ["two-pointers"] },
  { id: "trees", title: "Trees", x: 320, y: 330, parents: ["binary-search", "linked-list"] },
  { id: "tries", title: "Tries", x: 170, y: 425, parents: ["trees"] },
  { id: "backtracking", title: "Backtracking", x: 470, y: 425, parents: ["trees"] },
  { id: "heap", title: "Heap / Priority Queue", x: 270, y: 515, parents: ["trees"] },
  { id: "graphs", title: "Graphs", x: 450, y: 530, parents: ["backtracking"] },
  { id: "dp-1d", title: "1-D Dynamic Programming", x: 630, y: 525, parents: ["backtracking"] },
  { id: "intervals", title: "Intervals", x: 80, y: 610, parents: ["heap"] },
  { id: "greedy", title: "Greedy", x: 215, y: 650, parents: ["heap"] },
  { id: "advanced-graphs", title: "Advanced Graphs", x: 360, y: 625, parents: ["heap", "graphs"] },
  { id: "dp-2d", title: "2-D Dynamic Programming", x: 520, y: 650, parents: ["graphs", "dp-1d"] },
  { id: "bit-manipulation", title: "Bit Manipulation", x: 700, y: 640, parents: ["dp-1d"] },
  { id: "math-geometry", title: "Math & Geometry", x: 620, y: 740, parents: ["dp-2d", "bit-manipulation"] },
];

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}
