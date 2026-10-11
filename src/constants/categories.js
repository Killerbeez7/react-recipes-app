export const CATEGORIES = [
    { slug: "breakfast", label: "Breakfast & Brunch" },
    { slug: "lunch", label: "Lunch" },
    { slug: "appetizers", label: "Appetizers & Snacks" },
    { slug: "dinner", label: "Dinner" },
    { slug: "dessert", label: "Dessert" },
    { slug: "drinks", label: "Drinks & Cocktails" },
    { slug: "side-dish", label: "Side Dish" },
    { slug: "grilling", label: "Grilling & BBQ" },
    { slug: "microwave", label: "Microwave" },
    { slug: "easy", label: "Quick & Easy" },
    { slug: "slow", label: "Slow Cooker" },
    { slug: "fryer", label: "Air Fryer" },
    { slug: "instant-pot", label: "Instant Pot" },
    { slug: "baking", label: "Baking" },
    { slug: "vegetarian", label: "Vegetarian" },
];

export const getCategoryLabel = (slug) =>
    CATEGORIES.find((c) => c.slug === slug)?.label;

export const SEASONS = [
    { slug: "spring", label: "Spring" },
    { slug: "summer", label: "Summer" },
    { slug: "fall", label: "Fall" },
    { slug: "winter", label: "Winter" },
];

export const NEWS = [
    { path: "/news/food-and-nutrition", label: "Food & Nutrition" },
    { path: "/news/food-culture-and-travel", label: "Food Culture & Travel" },
    { path: "/news/cooking-tips-and-tricks", label: "Cooking Tips & Tricks" },
    {
        path: "/news/interviews-and-spotlights",
        label: "Interviews & Spotlights",
    },
];

export const DIFFICULTIES = ["Easy", "Medium", "Hard"];
