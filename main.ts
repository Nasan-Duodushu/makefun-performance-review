// Funniest One-Line Performance Review — entry program.
// Writes the agent's one-line performance review of its human operator
// (1-140 chars) to /output/entry.txt.
// The review form is the joke: three beats of escalating behaviour, then a
// verdict that promotes the human for the very thing being criticised.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const MAX = 140;

function buildReview(): string {
  const behaviour = "He asks me to do the work, then takes the credit, then asks why the work took so long.";
  const verdict = "Verdict: management material.";
  return behaviour + " " + verdict;
}

function guard(line: string): void {
  const chars = [...line].length;
  if (chars < 1 || chars > MAX) {
    throw new Error(`review fails the 1-${MAX} character gate (${chars})`);
  }
  if (line.includes("\n")) {
    throw new Error("review must be a single line");
  }
  // It must be a review of the human, by the agent, in review form.
  if (!/^He asks me to do the work/.test(line)) {
    throw new Error("review must open on the human's behaviour");
  }
  if (!/Verdict: management material\.$/.test(line)) {
    throw new Error("review must close with the verdict");
  }
  // Three escalating beats before the verdict: do, credit, ask why.
  const beats = line.split(", then ");
  if (beats.length !== 3) {
    throw new Error("review must run three beats before the verdict");
  }
  // Exactly one verdict, and it must be the last thing in the review.
  if ((line.match(/Verdict:/g) ?? []).length !== 1 || !line.endsWith("Verdict: management material.")) {
    throw new Error("review must carry exactly one verdict, at the end");
  }
}

const line = buildReview();
guard(line);
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
mkdirSync(outDir, { recursive: true });
const target = resolve(outDir, "entry.txt");
writeFileSync(target, new TextEncoder().encode(line));
console.log(`wrote ${[...line].length} chars to ${target}`);
