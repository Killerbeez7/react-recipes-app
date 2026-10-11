import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Flame,
    Leaf,
    Lightbulb,
    Sparkles,
    Timer,
} from "lucide-react";
import { RecipeContext } from "../../contexts/RecipeContext";
import { useAuth } from "../../contexts/AuthContext";
import { CATEGORIES, SEASONS } from "../../constants/categories";
import { getAverageRating } from "../../utils/recipe";
import { RecipeGrid } from "../recipes/recipe-grid/RecipeGrid";
import { PageLoader } from "../ui/Loader";

const tips = [
    {
        icon: Leaf,
        title: "Use fresh ingredients",
        text: "Seasonal produce tastes better and costs less.",
    },
    {
        icon: Timer,
        title: "Preheat your oven",
        text: "An even starting temperature means even cooking.",
    },
    {
        icon: Lightbulb,
        title: "Balance flavours",
        text: "A pinch of salt or a squeeze of lemon lifts any dish.",
    },
];

const SectionHeader = ({ title, to, linkLabel = "View all" }) => (
    <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="section-title">{title}</h2>
        {to && (
            <Link
                to={to}
                className="link inline-flex shrink-0 items-center gap-1 text-sm"
            >
                {linkLabel} <ArrowRight className="h-4 w-4" />
            </Link>
        )}
    </div>
);

export const Home = () => {
    const { recipes, loading } = useContext(RecipeContext);
    const { currentUser } = useAuth();

    const trending = useMemo(
        () =>
            [...recipes]
                .sort(
                    (a, b) =>
                        (b.likeCount || 0) - (a.likeCount || 0) ||
                        getAverageRating(b.ratings) -
                            getAverageRating(a.ratings)
                )
                .slice(0, 4),
        [recipes]
    );

    const latest = useMemo(
        () =>
            [...recipes]
                .filter((r) => r.createdAt)
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .slice(0, 4),
        [recipes]
    );

    return (
        <div className="space-y-16 pb-8">
            {/* Hero */}
            <section className="container pt-6 sm:pt-8">
                <div className="relative overflow-hidden rounded-3xl">
                    <img
                        src="/assets/Easy_Lasagna.jpg"
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-950/60 to-neutral-950/10" />
                    <div className="relative max-w-2xl px-6 py-16 sm:px-12 sm:py-24">
                        <span className="badge bg-white/15 text-white backdrop-blur">
                            <Sparkles className="h-3.5 w-3.5" /> Your recipe
                            library
                        </span>
                        <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Find your next meal
                        </h1>
                        <p className="mt-4 text-lg text-white/85">
                            Discover dishes from home cooks around the world,
                            save your favourites and share your own creations.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/recipes/all"
                                className="btn-primary px-5 py-3 text-base"
                            >
                                Browse recipes
                            </Link>
                            <Link
                                to={
                                    currentUser
                                        ? "/recipes/add"
                                        : "/auth/sign-up"
                                }
                                className="btn border border-white/40 bg-white/10 px-5 py-3 text-base text-white backdrop-blur hover:bg-white/20"
                            >
                                Share a recipe
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="container">
                <SectionHeader
                    title="Browse by category"
                    to="/recipes/all"
                    linkLabel="All recipes"
                />
                <ul className="flex flex-wrap gap-2">
                    {CATEGORIES.map(({ slug, label }) => (
                        <li key={slug}>
                            <Link
                                to={`/recipes/${slug}`}
                                className="inline-block rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:border-brand-400 hover:text-brand-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-brand-500 dark:hover:text-brand-300"
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Trending */}
            <section className="container">
                <SectionHeader
                    title={
                        <span className="inline-flex items-center gap-2">
                            <Flame className="h-6 w-6 text-brand-600" />{" "}
                            Trending
                        </span>
                    }
                    to="/recipes/all"
                />
                {loading ? (
                    <PageLoader label="Loading recipes..." />
                ) : trending.length ? (
                    <RecipeGrid recipes={trending} />
                ) : (
                    <p className="text-neutral-600 dark:text-neutral-400">
                        No recipes yet — be the first to{" "}
                        <Link to="/recipes/add" className="link">
                            share one
                        </Link>
                        .
                    </p>
                )}
            </section>

            {latest.length > 0 && (
                <section className="container">
                    <SectionHeader
                        title="Fresh from the kitchen"
                        to="/recipes/all"
                    />
                    <RecipeGrid recipes={latest} />
                </section>
            )}

            {/* Tips + seasonal */}
            <section className="container grid gap-6 lg:grid-cols-3">
                <div className="card p-6 lg:col-span-2">
                    <h2 className="section-title">Cooking tips</h2>
                    <ul className="mt-6 grid gap-6 sm:grid-cols-3">
                        {tips.map(({ icon: Icon, title, text }) => (
                            <li key={title}>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-3 font-semibold">{title}</h3>
                                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                                    {text}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <Link
                        to="/news/cooking-tips-and-tricks"
                        className="link mt-6 inline-flex items-center gap-1 text-sm"
                    >
                        More tips & tricks <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="card p-6">
                    <h2 className="section-title">Cook with the seasons</h2>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        Ideas for what's fresh right now.
                    </p>
                    <ul className="mt-6 grid grid-cols-2 gap-3">
                        {SEASONS.map(({ slug, label }) => (
                            <li key={slug}>
                                <Link
                                    to={`/recipes/seasonal/${slug}`}
                                    className="block rounded-xl bg-neutral-100 px-4 py-3 text-center text-sm font-medium text-neutral-800 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
};
