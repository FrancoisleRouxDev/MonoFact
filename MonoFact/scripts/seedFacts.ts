import "dotenv/config";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../app/services/config";

import animals from "../data/facts/animals.json";
import nature from "../data/facts/nature.json";
import photography from "../data/facts/photography.json";
import science from "../data/facts/science.json";
import space from "../data/facts/space.json";
import technology from "../data/facts/technology.json";

const allFacts = {
  animals,
  nature,
  photography,
  science,
  space,
  technology
};

async function uploadAll() {
  for (const [category, facts] of Object.entries(allFacts)) {
    console.log(`Uploading ${category}...`);
    for (const fact of facts as any[]) {
      await addDoc(collection(db, "categories", category, "facts"), {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        ...fact,
      });
    }
    console.log(`${category} uploaded`);
  }
}

uploadAll();
