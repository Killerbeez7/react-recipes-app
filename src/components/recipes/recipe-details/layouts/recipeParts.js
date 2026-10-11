// Helpers shared by the experimental recipe layouts

const UNITS =
    "g|gr|kg|mg|ml|l|dl|cl|oz|lb|lbs|cups?|tbsp|tsp|pinch|cloves?|slices?|pcs|бр\\.?|гр\\.?|кг|мл|л|ч\\.ч\\.?|с\\.л\\.?|к\\.л\\.?|щипка";

const QUANTITY = new RegExp(
    `^\\s*((?:[~≈]\\s*)?\\d+(?:[.,/]\\d+)?(?:\\s*[-–]\\s*\\d+(?:[.,/]\\d+)?)?\\s*(?:${UNITS})?\\.?)\\s+(.+)$`,
    "i"
);

/** "350 g spaghetti 12 oz" -> { quantity: "350 g", name: "spaghetti 12 oz" } */
export const splitIngredient = (text) => {
    const match = text.match(QUANTITY);
    return match
        ? { quantity: match[1].trim(), name: match[2].trim() }
        : { quantity: "", name: text.trim() };
};

const STOP_WORDS = new Set([
    "and",
    "the",
    "with",
    "for",
    "fresh",
    "ground",
    "large",
    "small",
    "chopped",
    "finely",
    "about",
    "cup",
    "cups",
    "или",
    "за",
    "на",
    "със",
]);

// Distinctive words of an ingredient name, used to spot it inside a step
const keywords = (ingredient) =>
    splitIngredient(ingredient)
        .name.toLowerCase()
        .replace(/[^\p{L}\s]/gu, " ")
        .split(/\s+/)
        .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

/** Indexes of the ingredients a step mentions */
export const ingredientsInStep = (step, ingredients) => {
    const text = step.toLowerCase();
    return ingredients.reduce((found, ingredient, index) => {
        // Match on the word stem so "egg" finds "eggs" and vice versa
        const hit = keywords(ingredient).some((word) =>
            text.includes(word.length > 4 ? word.slice(0, -1) : word)
        );
        return hit ? [...found, index] : found;
    }, []);
};

export const plural = (count, word) =>
    `${count} ${word}${Number(count) === 1 ? "" : "s"}`;
