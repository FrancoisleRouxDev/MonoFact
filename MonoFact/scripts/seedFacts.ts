import "dotenv/config";
import { addDoc, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../app/services/config";

import animals from "../data/facts/animals.json";
import daily from "../data/facts/daily.json";
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
  technology,
  daily,
};

async function uploadAll() {
  for (const [category, facts] of Object.entries(allFacts)) {
    console.log(`Clearing existing ${category}...`);
    const factsCollection = collection(db, "categories", category, "facts");
    const existingDocs = await getDocs(factsCollection);
    for (const d of existingDocs.docs) {
      await deleteDoc(doc(db, "categories", category, "facts", d.id));
    }

    console.log(`Uploading ${category}...`);
    for (const fact of facts as any[]) {
      await addDoc(factsCollection, {
        ...fact,
      });
    }
    console.log(`${category} uploaded successfully (${facts.length} facts)`);
  }
}

uploadAll();
