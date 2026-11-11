import animals from "@/data/facts/animals.json";
import daily from "@/data/facts/daily.json";
import nature from "@/data/facts/nature.json";
import photography from "@/data/facts/photography.json";
import science from "@/data/facts/science.json";
import space from "@/data/facts/space.json";
import technology from "@/data/facts/technology.json";
import { Fact } from "./deck";

type BundledFact = Omit<Fact, "id">;

const FACTS_BY_CATEGORY: Record<string, BundledFact[]> = {
    animals,
    daily,
    nature,
    photography,
    science,
    space,
    technology,
};

export function getLocalFacts(category: string): Fact[] {
    const categoryId = category.trim().toLowerCase();
    const facts = FACTS_BY_CATEGORY[categoryId] ?? [];

    return facts.map((fact) => ({
        ...fact,
        id: `${categoryId}-${fact.order}`,
    }));
}
