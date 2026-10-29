import AsyncStorage from "@react-native-async-storage/async-storage";

// ---------------------------------------------------------------------------
// Fact type — matches the Firestore document structure under
// categories/{categoryId}/facts/{factId}
// ---------------------------------------------------------------------------
export type Fact = {
    id: string;
    category: string;
    statement: string;   // the question text shown on the card
    isFact: boolean;     // true = fact, false = myth — this is the correct answer
    explanation: string; // shown on the feedback screen after answering
    order: number;       // position in the source JSON (no longer the play order)
};

// Card counts offered on the pre-game screen. The last option is "all": the
// whole pool (the fact library holds 100 facts per category).
export const CARD_COUNT_OPTIONS = [10, 25, 50, 100] as const;

// Rough time per card (read, swipe, read the explanation), used for the
// "about N min" estimates shown on the category cards and the selector.
const SECONDS_PER_CARD = 15;

export function estimateMinutes(cardCount: number): number {
    return Math.max(1, Math.round((cardCount * SECONDS_PER_CARD) / 60));
}

// ---------------------------------------------------------------------------
// shuffle
// ---------------------------------------------------------------------------
// Fisher-Yates shuffle. Returns a new array; the input is left untouched.
// ---------------------------------------------------------------------------
export function shuffle<T>(items: readonly T[]): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// ---------------------------------------------------------------------------
// buildDeck
// ---------------------------------------------------------------------------
// Shuffles the full fact pool and keeps the first `count` cards, so every
// session gets a different selection and order.
// ---------------------------------------------------------------------------
export function buildDeck(pool: readonly Fact[], count: number): Fact[] {
    return shuffle(pool).slice(0, count);
}

// ---------------------------------------------------------------------------
// Deck session
// ---------------------------------------------------------------------------
// The game screen is re-mounted for every question (feedback.tsx navigates
// back with index + 1), so the drawn deck must outlive the screen. It is kept
// in memory for the running app, and its fact ids are mirrored to
// AsyncStorage so "Continue where you left off" can rebuild the same deck
// after the app restarts.
// ---------------------------------------------------------------------------
const STORAGE_KEY = "monofact:deck-session";

type DeckSession = { category: string; deck: Fact[] };

let session: DeckSession | null = null;

export function getDeckSession(category: string): Fact[] | null {
    return session?.category === category ? session.deck : null;
}

export async function saveDeckSession(category: string, deck: Fact[]) {
    session = { category, deck };
    try {
        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ category, ids: deck.map((fact) => fact.id) }),
        );
    } catch (error) {
        console.warn("Failed to persist deck:", error);
    }
}

// Rebuilds the saved deck for `category` from a freshly loaded pool.
// Returns null when nothing usable was saved (e.g. facts were re-seeded).
export async function restoreDeckSession(
    category: string,
    pool: readonly Fact[],
): Promise<Fact[] | null> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const saved = JSON.parse(raw) as { category?: string; ids?: string[] };
        if (saved.category !== category || !Array.isArray(saved.ids)) return null;

        const byId = new Map(pool.map((fact) => [fact.id, fact]));
        const deck = saved.ids
            .map((id) => byId.get(id))
            .filter((fact): fact is Fact => fact !== undefined);

        if (deck.length !== saved.ids.length) return null;

        session = { category, deck };
        return deck;
    } catch (error) {
        console.warn("Failed to restore deck:", error);
        return null;
    }
}
