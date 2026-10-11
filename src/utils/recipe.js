// Recipes were saved in a few different shapes over time (categories as a
// comma string or an array, steps separated by periods or new lines).
// These helpers normalise them for display.

export const toCategoryArray = (categories) => {
    if (Array.isArray(categories)) return categories.filter(Boolean);
    if (typeof categories === "string") {
        return categories
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);
    }
    return [];
};

export const parseIngredients = (ingredients = "") => {
    const separator = ingredients.includes("\n") ? "\n" : ",";
    return ingredients
        .split(separator)
        .map((item) => item.trim())
        .filter(Boolean);
};

export const parseSteps = (steps = "") => {
    if (steps.includes("\n")) {
        return steps
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    // Legacy single-line format: split on sentence endings only, so values
    // like "1.5 cups" stay intact.
    return steps
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
};

export const getAverageRating = (ratings) => {
    const values = Object.values(ratings || {});
    if (!values.length) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
};
