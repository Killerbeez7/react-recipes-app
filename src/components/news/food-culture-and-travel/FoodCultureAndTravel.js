import { NewsPage } from "../NewsPage";

const articles = [
    {
        tag: "Flavours of the world",
        title: "Exploring Thai street food",
        text: "Discover the vibrant street food culture of Thailand.",
    },
    {
        tag: "Regional specialties",
        title: "What makes Southern BBQ unique?",
        text: "Unravel the smoky secrets behind the best Southern BBQ styles.",
    },
];

export const FoodCultureAndTravel = () => (
    <NewsPage
        title="Food Culture & Travel"
        intro="Stories and dishes from kitchens around the globe."
        articles={articles}
    />
);
