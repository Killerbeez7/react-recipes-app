import { NewsPage } from "../NewsPage";

const articles = [
    {
        tag: "Research",
        title: "Latest study: is olive oil really that healthy?",
        text: "A look at the newest research on olive oil's health benefits.",
    },
    {
        tag: "Explainer",
        title: "The truth about sugar substitutes – are they safe?",
        text: "We break down the pros and cons of popular sugar alternatives.",
    },
];

export const FoodAndNutrition = () => (
    <NewsPage
        title="Food & Nutrition News"
        intro="The latest research and practical advice on eating well."
        articles={articles}
    />
);
