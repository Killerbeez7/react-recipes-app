import {
    toCategoryArray,
    parseIngredients,
    parseSteps,
    getAverageRating,
    pushIdToDate,
} from "./recipe";

test("toCategoryArray handles arrays, strings and empty values", () => {
    expect(toCategoryArray(["lunch", "dinner"])).toEqual(["lunch", "dinner"]);
    expect(toCategoryArray("lunch, dinner")).toEqual(["lunch", "dinner"]);
    expect(toCategoryArray(undefined)).toEqual([]);
});

test("parseIngredients supports new-line and comma separated lists", () => {
    expect(parseIngredients("eggs\nflour\n\nmilk")).toEqual([
        "eggs",
        "flour",
        "milk",
    ]);
    expect(parseIngredients("eggs, flour")).toEqual(["eggs", "flour"]);
});

test("parseSteps keeps decimals intact in legacy format", () => {
    expect(parseSteps("Add 1.5 cups flour. Stir well.")).toEqual([
        "Add 1.5 cups flour.",
        "Stir well.",
    ]);
    expect(parseSteps("Mix\nBake")).toEqual(["Mix", "Bake"]);
});

test("getAverageRating", () => {
    expect(getAverageRating({ a: 4, b: 5 })).toBe(4.5);
    expect(getAverageRating(null)).toBe(0);
});

test("pushIdToDate decodes Firebase push IDs", () => {
    expect(pushIdToDate("-OAy2dvFZugIeZkmn5FB").toISOString()).toBe(
        "2024-11-05T20:40:24.016Z"
    );
    expect(pushIdToDate("not-a-push-id")).toBeNull();
});

test("experimental layout helpers split and match ingredients", () => {
    const {
        splitIngredient,
        ingredientsInStep,
    } = require("../components/recipes/recipe-details/layouts/recipeParts");
    expect(splitIngredient("350 g spaghetti 12 oz")).toEqual({
        quantity: "350 g",
        name: "spaghetti 12 oz",
    });
    expect(splitIngredient("4 eggs")).toEqual({ quantity: "4", name: "eggs" });
    expect(splitIngredient("Black pepper ground")).toEqual({
        quantity: "",
        name: "Black pepper ground",
    });
    expect(splitIngredient("4 бр. червени чушки").quantity).toBe("4 бр.");
    const ingredients = [
        "350 g spaghetti",
        "4 eggs",
        "100 g pecorino Romano",
        "Black pepper",
    ];
    expect(
        ingredientsInStep(
            "In a bowl put the eggs and pecorino Romano cheese.",
            ingredients
        )
    ).toEqual([1, 2]);
    expect(
        ingredientsInStep("Add some freshly ground black pepper.", ingredients)
    ).toEqual([3]);
});
