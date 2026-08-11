import "dotenv/config";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../app/services/config";

import science from "../data/facts/science.json";

async function uploadScience() {
    for (const fact of science) {
        await addDoc(collection(db, "categories", "science", "facts"), {
            category: "Science",
            ...fact,
        });
    }

    console.log("Science uploaded");
}

uploadScience();

