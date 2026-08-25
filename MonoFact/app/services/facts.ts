import {
    collection,
    getDocs,
    query,
    orderBy,
} from "firebase/firestore";

import { db } from "./config";

// ---------------------------------------------------------------------------
// getFacts
// ---------------------------------------------------------------------------
// Loads all facts for a given category from Firestore, ordered by their
// "order" field so questions always appear in a consistent sequence.
//
// Firestore path: categories/{categoryId}/facts
//   where categoryId is the lowercase version of the category name
//   e.g. "Nature" → "nature", "Space" → "space"
// ---------------------------------------------------------------------------
export async function getFacts(category: string) {
    // Normalise to lowercase to match the Firestore collection IDs.
    const categoryId = category.trim().toLowerCase();

    const factsRef = collection(db, "categories", categoryId, "facts");
    const q = query(factsRef, orderBy("order"));

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
}