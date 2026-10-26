import { bucketSort } from "./arrays/bucket-sort";
import { canonicalKey } from "./arrays/canonical-key";
import { hashMapComplement } from "./arrays/hash-map-complement";
import { hashSetSeen } from "./arrays/hash-set-seen";
import { lengthPrefix } from "./arrays/length-prefix";
import { prefixSuffix } from "./arrays/prefix-suffix";
import { rowColBox } from "./arrays/row-col-box";
import { sequenceStart } from "./arrays/sequence-start";
import { lc } from "./code";
import type { Trick } from "./types";

/** A trick whose animation hasn't been built yet. */
const stub = (id: string, title: string, idea: string, problems: Trick["problems"] = []): Trick => ({ id, title, idea, problems });

export const tricksByCategory: Record<string, Trick[]> = {
  "arrays-hashing": [hashSetSeen, hashMapComplement, canonicalKey, bucketSort, prefixSuffix, sequenceStart, lengthPrefix, rowColBox],
  "two-pointers": [
    stub("opposite-ends", "Opposite ends, move the worse side", "On sorted data, start at both ends and move the pointer that can only improve the answer.", [
      lc("two-sum-ii-input-array-is-sorted", "Two Sum II"),
      lc("container-with-most-water", "Container With Most Water"),
    ]),
    stub("palindrome-pointers", "Converging palindrome check", "Compare from both ends inward, skipping what doesn't count.", [lc("valid-palindrome", "Valid Palindrome")]),
    stub("sort-then-fix-one", "Sort, fix one, two-pointer the rest", "Reduce k-sum to (k−1)-sum by fixing an element and skipping duplicates.", [lc("3sum", "3Sum")]),
    stub("max-from-both-sides", "Max-left / max-right", "Water at i depends on min(maxLeft, maxRight); move the side with the smaller max.", [lc("trapping-rain-water", "Trapping Rain Water")]),
  ],
  stack: [
    stub("matching-pairs", "Push opens, pop on close", "A closing symbol must match the most recent unmatched opener — that's a stack.", [lc("valid-parentheses", "Valid Parentheses")]),
    stub("min-stack", "Stack of running minimums", "Store the min-so-far alongside each element so getMin is O(1).", [lc("min-stack", "Min Stack")]),
    stub("monotonic-stack", "Monotonic stack", "Keep the stack sorted; popping tells each element its next greater/smaller element.", [
      lc("daily-temperatures", "Daily Temperatures"),
      lc("largest-rectangle-in-histogram", "Largest Rectangle in Histogram"),
    ]),
    stub("eval-stack", "Evaluate with a stack", "Operands go on the stack; an operator pops two and pushes the result.", [lc("evaluate-reverse-polish-notation", "Evaluate Reverse Polish Notation")]),
  ],
  "binary-search": [
    stub("classic-binary-search", "Classic lo/hi/mid", "Halve the search range each step using a sorted order.", [lc("binary-search", "Binary Search")]),
    stub("search-on-answer", "Binary search on the answer", "If \"can we do it with x?\" is monotonic in x, binary search x.", [lc("koko-eating-bananas", "Koko Eating Bananas")]),
    stub("rotated-array", "Which half is sorted?", "In a rotated array one half is always sorted — decide which side the target is on.", [
      lc("search-in-rotated-sorted-array", "Search in Rotated Sorted Array"),
      lc("find-minimum-in-rotated-sorted-array", "Find Minimum in Rotated Sorted Array"),
    ]),
    stub("partition-search", "Binary search a partition", "Search the cut position in the smaller array so both halves balance.", [lc("median-of-two-sorted-arrays", "Median of Two Sorted Arrays")]),
  ],
  "sliding-window": [
    stub("variable-window", "Grow right, shrink left", "Expand the window until it breaks a rule, then shrink from the left until it's valid again.", [
      lc("longest-substring-without-repeating-characters", "Longest Substring Without Repeating Characters"),
    ]),
    stub("window-max-freq", "Window length − max frequency", "A window is fixable if (length − count of most common char) ≤ k.", [lc("longest-repeating-character-replacement", "Longest Repeating Character Replacement")]),
    stub("fixed-window-counts", "Fixed window with counts", "Slide a fixed-size window and compare letter counts in O(1) per move.", [lc("permutation-in-string", "Permutation in String")]),
    stub("min-window", "Minimum covering window", "Track how many required chars are satisfied; shrink while still covering.", [lc("minimum-window-substring", "Minimum Window Substring")]),
    stub("monotonic-deque", "Monotonic deque", "Keep a decreasing deque of indices so the window max is always at the front.", [lc("sliding-window-maximum", "Sliding Window Maximum")]),
  ],
  "linked-list": [
    stub("reverse-pointers", "Reverse with prev/curr/next", "Flip one arrow at a time while remembering the rest of the list.", [lc("reverse-linked-list", "Reverse Linked List")]),
    stub("dummy-head", "Dummy head node", "Start from a fake node so edge cases at the head disappear.", [lc("merge-two-sorted-lists", "Merge Two Sorted Lists")]),
    stub("fast-slow", "Fast & slow pointers", "A pointer moving 2× finds the middle, and meets the slow one if there's a cycle.", [lc("linked-list-cycle", "Linked List Cycle"), lc("reorder-list", "Reorder List")]),
    stub("gap-pointers", "Two pointers n apart", "Advance one pointer n steps first; when it hits the end, the other is at the target.", [lc("remove-nth-node-from-end-of-list", "Remove Nth Node From End of List")]),
  ],
  trees: [
    stub("dfs-recursion", "Recursive DFS returns a value", "Solve for left and right subtrees, combine at the node.", [lc("maximum-depth-of-binary-tree", "Maximum Depth of Binary Tree"), lc("invert-binary-tree", "Invert Binary Tree")]),
    stub("bfs-levels", "BFS level by level", "Process the queue one level (its current size) at a time.", [lc("binary-tree-level-order-traversal", "Binary Tree Level Order Traversal")]),
    stub("bst-bounds", "Pass down valid bounds", "Each BST node must lie in (low, high) inherited from its ancestors.", [lc("validate-binary-search-tree", "Validate Binary Search Tree")]),
    stub("global-best", "Return one thing, track another", "Return the best single path up; update a global with the path through the node.", [lc("binary-tree-maximum-path-sum", "Binary Tree Maximum Path Sum")]),
  ],
  tries: [
    stub("trie-insert-search", "Trie insert & search", "Each node is a map of next characters plus an end-of-word flag.", [lc("implement-trie-prefix-tree", "Implement Trie")]),
    stub("trie-wildcard", "DFS through a trie", "On a wildcard, branch into every child.", [lc("design-add-and-search-words-data-structure", "Design Add and Search Words")]),
    stub("trie-board", "Trie + grid DFS", "Walk the grid and the trie together, pruning when no word has this prefix.", [lc("word-search-ii", "Word Search II")]),
  ],
  "heap": [
    stub("top-k-heap", "Size-k heap", "Keep a min-heap of size k; its top is the k-th largest.", [lc("kth-largest-element-in-a-stream", "Kth Largest Element in a Stream")]),
    stub("two-heaps", "Two heaps for the median", "Max-heap for the low half, min-heap for the high half, keep them balanced.", [lc("find-median-from-data-stream", "Find Median from Data Stream")]),
    stub("heap-merge", "Merge k sorted with a heap", "Push the head of each list; pop the smallest and push its successor.", [lc("merge-k-sorted-lists", "Merge k Sorted Lists")]),
  ],
  backtracking: [
    stub("choose-unchoose", "Choose / explore / un-choose", "Add a choice, recurse, then remove it — the template for all backtracking.", [lc("subsets", "Subsets"), lc("permutations", "Permutations")]),
    stub("skip-duplicates", "Sort and skip duplicate branches", "After sorting, skip a value equal to the previous one at the same depth.", [lc("subsets-ii", "Subsets II"), lc("combination-sum-ii", "Combination Sum II")]),
    stub("grid-backtrack", "Grid DFS with mark/unmark", "Mark a cell visited before recursing and unmark after.", [lc("word-search", "Word Search")]),
  ],
  graphs: [
    stub("flood-fill", "Flood fill / count components", "DFS or BFS from each unvisited cell and mark the whole region.", [lc("number-of-islands", "Number of Islands")]),
    stub("multi-source-bfs", "Multi-source BFS", "Start BFS from all sources at once to get distances in one sweep.", [lc("rotting-oranges", "Rotting Oranges")]),
    stub("topo-sort", "Topological sort", "Repeatedly take nodes with in-degree 0; leftovers mean a cycle.", [lc("course-schedule", "Course Schedule")]),
    stub("union-find", "Union-Find", "Merge sets and ask \"same component?\" in near O(1).", [lc("redundant-connection", "Redundant Connection")]),
  ],
  "dp-1d": [
    stub("fib-recurrence", "dp[i] from dp[i-1], dp[i-2]", "Express the answer at i from the previous one or two answers.", [lc("climbing-stairs", "Climbing Stairs"), lc("house-robber", "House Robber")]),
    stub("expand-center", "Expand around center", "Every palindrome has a center; expand from each of the 2n−1 centers.", [lc("longest-palindromic-substring", "Longest Palindromic Substring")]),
    stub("unbounded-choice", "Try every last choice", "dp[x] = best over all choices c of dp[x − c].", [lc("coin-change", "Coin Change"), lc("word-break", "Word Break")]),
    stub("min-max-product", "Track min and max", "A negative number swaps the min and max product.", [lc("maximum-product-subarray", "Maximum Product Subarray")]),
  ],
  intervals: [
    stub("sort-by-start", "Sort by start, then merge", "After sorting, an interval overlaps only the last merged one.", [lc("merge-intervals", "Merge Intervals"), lc("insert-interval", "Insert Interval")]),
    stub("sort-by-end", "Greedy by earliest end", "Keep the interval that ends first to leave the most room.", [lc("non-overlapping-intervals", "Non-overlapping Intervals")]),
    stub("sweep-line", "Sweep line of starts and ends", "Sort start and end events separately and count how many are open.", [lc("meeting-rooms-ii", "Meeting Rooms II")]),
  ],
  greedy: [
    stub("kadane", "Kadane: drop a negative prefix", "If the running sum goes negative, restart from the next element.", [lc("maximum-subarray", "Maximum Subarray")]),
    stub("farthest-reach", "Track farthest reach", "Keep the farthest index reachable so far.", [lc("jump-game", "Jump Game"), lc("jump-game-ii", "Jump Game II")]),
    stub("gas-station", "Reset start when tank < 0", "If you run dry at i, no start before i works — start at i+1.", [lc("gas-station", "Gas Station")]),
  ],
  "advanced-graphs": [
    stub("dijkstra", "Dijkstra with a min-heap", "Always expand the closest unfinished node.", [lc("network-delay-time", "Network Delay Time")]),
    stub("prim-mst", "Minimum spanning tree", "Grow a tree by repeatedly adding the cheapest edge out of it.", [lc("min-cost-to-connect-all-points", "Min Cost to Connect All Points")]),
    stub("bellman-ford-k", "Bellman-Ford with k rounds", "Relax all edges k+1 times to allow at most k stops.", [lc("cheapest-flights-within-k-stops", "Cheapest Flights Within K Stops")]),
  ],
  "dp-2d": [
    stub("grid-paths", "Grid DP from top/left", "dp[r][c] depends on the cell above and the cell to the left.", [lc("unique-paths", "Unique Paths")]),
    stub("lcs", "Two-string table", "dp[i][j] compares prefixes of two strings; match → diagonal, else best of up/left.", [
      lc("longest-common-subsequence", "Longest Common Subsequence"),
      lc("edit-distance", "Edit Distance"),
    ]),
    stub("knapsack", "Knapsack", "For each item, take it or skip it against every capacity.", [lc("target-sum", "Target Sum"), lc("coin-change-ii", "Coin Change II")]),
  ],
  "bit-manipulation": [
    stub("xor-cancel", "XOR cancels pairs", "x ^ x = 0, so XOR-ing everything leaves the odd one out.", [lc("single-number", "Single Number"), lc("missing-number", "Missing Number")]),
    stub("lowest-bit", "n & (n − 1) drops the lowest set bit", "Count or test bits by repeatedly clearing the lowest one.", [lc("number-of-1-bits", "Number of 1 Bits"), lc("counting-bits", "Counting Bits")]),
    stub("bit-shift-build", "Shift and build", "Read bits from one end with >> & 1 and build the result with << |.", [lc("reverse-bits", "Reverse Bits")]),
  ],
  "math-geometry": [
    stub("matrix-layers", "Rotate / spiral by layers", "Process the matrix from the outer ring inward with four boundaries.", [lc("rotate-image", "Rotate Image"), lc("spiral-matrix", "Spiral Matrix")]),
    stub("cycle-detection-math", "Detect a cycle in a number sequence", "Use a set (or fast/slow) on the sequence of values.", [lc("happy-number", "Happy Number")]),
    stub("fast-power", "Fast exponentiation", "x^n = (x^(n/2))², halving n each step.", [lc("powx-n", "Pow(x, n)")]),
  ],
};

export function getTricks(categoryId: string): Trick[] {
  return tricksByCategory[categoryId] ?? [];
}

export function getTrick(categoryId: string, trickId: string): Trick | undefined {
  return getTricks(categoryId).find((t) => t.id === trickId);
}

/** Progress keys must be unique across categories. */
export const progressKey = (categoryId: string, trickId: string) => `${categoryId}/${trickId}`;
