import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Flower2, Leaf, Snowflake, Sun } from "lucide-react";
import { RecipeContext } from "../../contexts/RecipeContext";
import { useAuth } from "../../contexts/AuthContext";
import { getCategoryLabel } from "../../constants/categories";
import { toCategoryArray } from "../../utils/recipe";
import { RecipeGrid } from "../recipes/recipe-grid/RecipeGrid";
import { NotFound } from "../not-found/NotFound";

const seasons = {
    spring: {
        title: "Spring recipes",
        name: "spring",
        intro: "Light, green and fresh — dishes that celebrate the first produce of the year.",
        icon: Flower2,
        gradient: "from-emerald-500 to-lime-400",
        categories: ["vegetarian", "lunch", "breakfast"],
    },
    summer: {
        title: "Summer recipes",
        name: "summer",
        intro: "Fire up the grill and cool down with refreshing drinks and quick plates.",
        icon: Sun,
        gradient: "from-amber-500 to-yellow-300",
        categories: ["grilling", "drinks", "easy"],
    },
    fall: {
        title: "Fall recipes",
        name: "autumn",
        intro: "Cosy bakes and slow-cooked comfort food for crisp autumn evenings.",
        icon: Leaf,
        gradient: "from-orange-600 to-amber-400",
        categories: ["baking", "slow", "dessert"],
    },
    winter: {
        title: "Winter recipes",
        name: "winter",
        intro: "Hearty, warming meals to get you through the coldest days.",
        icon: Snowflake,
        gradient: "from-sky-600 to-indigo-400",
        categories: ["slow", "instant-pot", "dinner"],
    },
};

export const SeasonalRecipes = () => {
    const { season } = useParams();
    const { recipes } = useContext(RecipeContext);
    const { currentUser } = useAuth();
    const config = seasons[season];

    if (!config) return <NotFound />;

    const { title, name, intro, icon: Icon, gradient, categories } = config;
    const suggestions = recipes
        .filter((r) =>
            toCategoryArray(r.categories).some((c) => categories.includes(c))
        )
        .slice(0, 8);

    return (
        <div className="page">
            <section
                className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} px-6 py-14 text-white sm:px-12`}
            >
                <Icon
                    className="absolute -right-6 -top-6 h-48 w-48 opacity-20"
                    aria-hidden="true"
                />
                <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    {title}
                </h1>
                <p className="mt-3 max-w-xl text-lg text-white/90">{intro}</p>
                <Link
                    to={currentUser ? "/recipes/add" : "/auth/sign-in"}
                    className="btn mt-8 bg-white px-5 py-3 text-neutral-900 shadow-sm hover:bg-neutral-100"
                >
                    Share your {name} recipe
                </Link>
            </section>

            <section className="mt-12">
                <h2 className="section-title">Good for the season</h2>
                <p className="page-subtitle mb-6">
                    Picks from{" "}
                    {categories.map((c) => getCategoryLabel(c)).join(", ")}.
                </p>
                {suggestions.length ? (
                    <RecipeGrid recipes={suggestions} />
                ) : (
                    <p className="text-neutral-600 dark:text-neutral-400">
                        No matching recipes yet — be the first to share one!
                    </p>
                )}
            </section>
        </div>
    );
};
