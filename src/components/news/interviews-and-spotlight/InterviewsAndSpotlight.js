import { NewsPage } from "../NewsPage";

const articles = [
    {
        tag: "Chef's corner",
        title: "An interview with a local chef",
        text: "We sat down with a local chef to talk about their journey and favourite cooking tips.",
    },
    {
        tag: "Community",
        title: "Home cook of the month: your stories, your recipes",
        text: "Meet this month's featured home cook and their favourite recipe.",
    },
];

export const InterviewsAndSpotlight = () => (
    <NewsPage
        title="Interviews & Spotlights"
        intro="Meet the people behind the plates."
        articles={articles}
    />
);
