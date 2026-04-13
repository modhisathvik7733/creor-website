export const DEMO_PROMPT = "cart total is missing tax";

export type StepKind = "grep" | "read" | "edit";

export interface DemoStep {
  kind: StepKind;
  label: string;
  badges?: string[];
  additions?: number;
  deletions?: number;
  targetFile?: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    kind: "grep",
    label: "Grep total|subtotal|tax",
    badges: ["mode=content", "include=**/*.{ts,tsx}"],
  },
  {
    kind: "read",
    label: "Read CartSummary.tsx",
    targetFile: "src/components/CartSummary.tsx",
  },
  {
    kind: "read",
    label: "Read utils.ts",
    targetFile: "src/lib/utils.ts",
  },
  {
    kind: "edit",
    label: "Edit CartSummary.tsx",
    additions: 2,
    deletions: 2,
    targetFile: "src/components/CartSummary.tsx",
  },
  {
    kind: "edit",
    label: "Edit utils.ts",
    additions: 8,
    deletions: 0,
    targetFile: "src/lib/utils.ts",
  },
];

export const DEMO_RESPONSE =
  "Added calculateTax helper to utils.ts (8% rate) and updated CartSummary to include tax in the total. Checkout now displays the correct tax-inclusive amount.";

export const CHANGED_FILES = [
  { name: "CartSummary.tsx", additions: 2, deletions: 2, path: "src/components/CartSummary.tsx" },
  { name: "utils.ts", additions: 8, deletions: 0, path: "src/lib/utils.ts" },
];

export interface DiffHunk {
  lineIndex: number;
  removed: { tokens: { text: string; color: string }[] }[];
  added: { tokens: { text: string; color: string }[] }[];
}

export const CODE_LINES = [
  { tokens: [{ text: "import", color: "text-purple-400" }, { text: " { useCart }", color: "text-white/75" }, { text: " from", color: "text-purple-400" }, { text: " \"@/hooks/useCart\"", color: "text-green-400/85" }] },
  { tokens: [{ text: "import", color: "text-purple-400" }, { text: " { formatPrice }", color: "text-white/75" }, { text: " from", color: "text-purple-400" }, { text: " \"@/lib/utils\"", color: "text-green-400/85" }] },
  { tokens: [] },
  { tokens: [{ text: "export", color: "text-purple-400" }, { text: " function", color: "text-purple-400" }, { text: " CartSummary", color: "text-yellow-300/90" }, { text: "() {", color: "text-white/55" }] },
  { tokens: [{ text: "  const", color: "text-purple-400" }, { text: " { items }", color: "text-white/75" }, { text: " = ", color: "text-white/55" }, { text: "useCart", color: "text-yellow-300/90" }, { text: "()", color: "text-white/55" }] },
  { tokens: [] },
  { tokens: [{ text: "  const", color: "text-purple-400" }, { text: " subtotal", color: "text-indigo-300" }, { text: " = items.", color: "text-white/55" }, { text: "reduce", color: "text-yellow-300/90" }, { text: "(", color: "text-white/55" }] },
  { tokens: [{ text: "    (sum, item) =>", color: "text-white/55" }, { text: " sum + item.", color: "text-white/75" }, { text: "price", color: "text-indigo-300" }, { text: " * item.", color: "text-white/75" }, { text: "qty", color: "text-indigo-300" }, { text: ", 0", color: "text-white/55" }] },
  { tokens: [{ text: "  )", color: "text-white/55" }] },
  { tokens: [{ text: "  const", color: "text-purple-400" }, { text: " total", color: "text-indigo-300" }, { text: " = subtotal", color: "text-white/55" }] },
  { tokens: [] },
  { tokens: [{ text: "  return", color: "text-purple-400" }, { text: " (", color: "text-white/55" }] },
  { tokens: [{ text: "    <div ", color: "text-white/75" }, { text: "className", color: "text-indigo-300" }, { text: "=", color: "text-white/55" }, { text: "\"rounded-lg border p-6\"", color: "text-green-400/85" }, { text: ">", color: "text-white/75" }] },
  { tokens: [{ text: "      <h2 ", color: "text-white/75" }, { text: "className", color: "text-indigo-300" }, { text: "=", color: "text-white/55" }, { text: "\"text-lg font-semibold\"", color: "text-green-400/85" }, { text: ">Order Summary</h2>", color: "text-white/75" }] },
  { tokens: [{ text: "      {items.", color: "text-white/55" }, { text: "map", color: "text-yellow-300/90" }, { text: "((item) => (", color: "text-white/55" }] },
  { tokens: [{ text: "        <div ", color: "text-white/75" }, { text: "key", color: "text-indigo-300" }, { text: "={item.id} ", color: "text-white/55" }, { text: "className", color: "text-indigo-300" }, { text: "=", color: "text-white/55" }, { text: "\"flex justify-between\"", color: "text-green-400/85" }, { text: ">", color: "text-white/75" }] },
  { tokens: [{ text: "          <span>", color: "text-white/75" }, { text: "{item.name}", color: "text-white/55" }, { text: "</span>", color: "text-white/75" }] },
  { tokens: [{ text: "          <span>", color: "text-white/75" }, { text: "{", color: "text-white/55" }, { text: "formatPrice", color: "text-yellow-300/90" }, { text: "(item.price)}", color: "text-white/55" }, { text: "</span>", color: "text-white/75" }] },
  { tokens: [{ text: "        </div>", color: "text-white/75" }] },
  { tokens: [{ text: "      ))}", color: "text-white/55" }] },
  { tokens: [{ text: "      <div ", color: "text-white/75" }, { text: "className", color: "text-indigo-300" }, { text: "=", color: "text-white/55" }, { text: "\"border-t pt-3 mt-4 flex justify-between font-bold\"", color: "text-green-400/85" }, { text: ">", color: "text-white/75" }] },
  { tokens: [{ text: "        <span>", color: "text-white/75" }, { text: "Total", color: "text-white/75" }, { text: "</span>", color: "text-white/75" }] },
  { tokens: [{ text: "        <span>", color: "text-white/75" }, { text: "{", color: "text-white/55" }, { text: "formatPrice", color: "text-yellow-300/90" }, { text: "(total)}", color: "text-white/55" }, { text: "</span>", color: "text-white/75" }] },
  { tokens: [{ text: "      </div>", color: "text-white/75" }] },
  { tokens: [{ text: "    </div>", color: "text-white/75" }] },
  { tokens: [{ text: "  )", color: "text-white/55" }] },
  { tokens: [{ text: "}", color: "text-white/55" }] },
];

// Diffs are defined after CODE_LINES so we can reference them
export const DIFF_HUNKS: DiffHunk[] = [
  {
    lineIndex: 1,
    removed: [CODE_LINES[1]],
    added: [
      {
        tokens: [
          { text: "import", color: "text-purple-400" },
          { text: " { formatPrice, calculateTax }", color: "text-white/75" },
          { text: " from", color: "text-purple-400" },
          { text: " \"@/lib/utils\"", color: "text-green-400/85" },
        ],
      },
    ],
  },
  {
    lineIndex: 9,
    removed: [CODE_LINES[9]],
    added: [
      {
        tokens: [
          { text: "  const", color: "text-purple-400" },
          { text: " total", color: "text-indigo-300" },
          { text: " = subtotal + ", color: "text-white/55" },
          { text: "calculateTax", color: "text-yellow-300/90" },
          { text: "(subtotal)", color: "text-white/55" },
        ],
      },
    ],
  },
];
