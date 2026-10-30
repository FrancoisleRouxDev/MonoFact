// Validates data/facts/*.json: counts, fact/myth ratio, duplicate statements,
// schema and length limits. Exits non-zero on any failure.
// Run with: npx tsx scripts/checkFacts.ts
import { readFileSync } from "fs";
import { join } from "path";

const CATEGORIES = ["animals", "nature", "photography", "science", "space", "technology"];
const EXPECTED_COUNT = 100;
const MAX_STATEMENT_CHARS = 120;
const MAX_EXPLANATION_WORDS = 30;
// The first 25 entries of each deck predate the limits below, so they only warn.
const ORIGINAL_ENTRIES = 25;

type RawFact = Partial<Record<"category" | "statement" | "isFact" | "explanation" | "order", unknown>>;

const errors: string[] = [];
const warnings: string[] = [];
const seen = new Map<string, string>();
const indexOf = (where: string) => Number(/\[(\d+)\]/.exec(where)?.[1] ?? 0);

function normalise(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

for (const category of [...CATEGORIES, "daily"]) {
  const facts = JSON.parse(
    readFileSync(join(__dirname, "..", "data", "facts", `${category}.json`), "utf8"),
  ) as RawFact[];

  let factCount = 0;
  facts.forEach((fact, i) => {
    const where = `${category}[${i}]`;

    if (typeof fact.statement !== "string" || fact.statement.trim() === "") {
      errors.push(`${where}: missing statement`);
      return;
    }
    if (typeof fact.isFact !== "boolean") errors.push(`${where}: isFact must be a boolean`);
    else if (fact.isFact) factCount++;
    if (typeof fact.explanation !== "string" || fact.explanation.trim() === "") {
      errors.push(`${where}: missing explanation`);
    }
    if (typeof fact.order !== "number") errors.push(`${where}: order must be a number`);
    if (category !== "daily" && String(fact.category).toLowerCase() !== category) {
      errors.push(`${where}: category is "${String(fact.category)}"`);
    }

    // Length limits apply to the added entries; the daily pool and the
    // original entries only warn.
    if (category !== "daily") {
      const report = i < ORIGINAL_ENTRIES ? warnings : errors;
      if (fact.statement.length > MAX_STATEMENT_CHARS) {
        report.push(`${where}: statement is ${fact.statement.length} chars (max ${MAX_STATEMENT_CHARS})`);
      }
      const words = typeof fact.explanation === "string" ? fact.explanation.trim().split(/\s+/).length : 0;
      if (words > MAX_EXPLANATION_WORDS) {
        report.push(`${where}: explanation is ${words} words (max ${MAX_EXPLANATION_WORDS})`);
      }
    }

    const key = normalise(fact.statement);
    const first = seen.get(key);
    if (first) {
      // The daily pool is a separate deck that overlaps the category decks, so
      // only a repeat between two category decks (or within one) is an error.
      const involvesDaily = category === "daily" || first.startsWith("daily");
      const bothOriginal = i < ORIGINAL_ENTRIES && indexOf(first) < ORIGINAL_ENTRIES;
      (involvesDaily || bothOriginal ? warnings : errors).push(`${where}: duplicate of ${first}`);
    }
    else seen.set(key, where);
  });

  if (category !== "daily" && facts.length !== EXPECTED_COUNT) {
    errors.push(`${category}: ${facts.length} entries (expected ${EXPECTED_COUNT})`);
  }

  const orders = facts.map((f) => f.order);
  if (category !== "daily" && orders.some((o, i) => o !== i + 1)) {
    errors.push(`${category}: order is not 1..${facts.length}`);
  }

  console.log(
    `${category.padEnd(12)} ${String(facts.length).padStart(3)} entries  ` +
      `${factCount} facts / ${facts.length - factCount} myths`,
  );
}

if (warnings.length > 0) {
  console.warn(`
${warnings.length} warning(s) (daily overlaps and original entries):`);
  warnings.forEach((w) => console.warn(`  - ${w}`));
}

if (errors.length > 0) {
  console.error(`\n${errors.length} problem(s):`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log("\nAll fact files are valid.");
