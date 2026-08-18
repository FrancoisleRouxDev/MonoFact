import fs from "fs";
import path from "path";

const files = [
  { name: "animals.json", category: "Animals" },
  { name: "nature.json", category: "Nature" },
  { name: "photography.json", category: "Photography" },
  { name: "science.json", category: "Science" },
  { name: "space.json", category: "Space" },
  { name: "technology.json", category: "Technology" }
];

const factsDir = path.resolve(__dirname, "../data/facts");

for (const { name, category } of files) {
  const filePath = path.join(factsDir, name);
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  const formatted = data.map((item: any, index: number) => ({
    category: category,
    statement: item.statement,
    isFact: item.isFact,
    explanation: item.explanation,
    order: index + 1
  }));

  fs.writeFileSync(filePath, JSON.stringify(formatted, null, 2) + "\n", "utf-8");
  console.log(`Formatted ${name} with ${formatted.length} facts.`);
}
