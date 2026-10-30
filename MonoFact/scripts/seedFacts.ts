// ---------------------------------------------------------------------------
// Seeds Firestore from data/facts/*.json (each category holds 100 facts, the
// daily pool holds 200).
//
// Uses the Firebase Admin SDK because the security rules deny client writes to
// categories/**. Point GOOGLE_APPLICATION_CREDENTIALS at a service-account JSON
// file (in your shell or .env), then run `npm run seed`.
//
// The app reads facts from Firestore, not from these JSON files, so
// `npm run seed` must be re-run whenever they change. The script clears each
// category before uploading, so it is safe to re-run.
// ---------------------------------------------------------------------------
import "dotenv/config";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error(
      "Set GOOGLE_APPLICATION_CREDENTIALS to the path of your service-account JSON file.",
    );
  }

  initializeApp({ credential: applicationDefault() });
  const db = getFirestore();

  for (const [category, facts] of Object.entries(allFacts)) {
    console.log(`Clearing existing ${category}...`);
    const factsCollection = db.collection("categories").doc(category).collection("facts");
    await db.recursiveDelete(factsCollection);

    console.log(`Uploading ${category}...`);
    for (let start = 0; start < facts.length; start += 400) {
      const batch = db.batch();
      for (const fact of facts.slice(start, start + 400)) {
        batch.set(factsCollection.doc(), { ...fact });
      }
      await batch.commit();
    }
    console.log(`${category} uploaded successfully (${facts.length} facts)`);
  }
}

uploadAll().catch((error) => {
  console.error(error);
  process.exit(1);
});
