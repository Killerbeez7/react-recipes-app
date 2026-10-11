import { NewsPage } from "../NewsPage";

const articles = [
    {
        tag: "Kitchen hacks",
        title: "5 kitchen hacks to save you time & effort",
        text: "Discover simple tricks that make cooking faster and easier.",
    },
    {
        tag: "Technique",
        title: "The secret to perfectly fluffy pancakes",
        text: "Master the technique of making soft, airy pancakes every time.",
    },
    {
        tag: "Storage",
        title: "How to store fresh herbs like a pro",
        text: "Learn the best ways to keep herbs fresh for weeks.",
    },
];

export const CookingTipsAndTricks = () => (
    <NewsPage
        title="Cooking Tips & Tricks"
        intro="Small techniques that make a big difference in the kitchen."
        articles={articles}
    />
);
