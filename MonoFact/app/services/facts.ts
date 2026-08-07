import {
    collection,
    getDocs,
    query,
    where
} from "firebase/firestore";

import { db } from "./config";

export async function getFacts(category: string) {

    const q = query(
        collection(db, "facts"),
        where("category", "==", category)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}