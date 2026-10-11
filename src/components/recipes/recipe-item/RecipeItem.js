import { Link } from "react-router-dom";
import { Clock, Heart, Users } from "lucide-react";
import { RecipeImage } from "../../ui/RecipeImage";
import { StarRating } from "../../ui/StarRating";
import { getAverageRating } from "../../../utils/recipe";

const difficultyStyles = {
    easy: "bg-emerald-600",
    medium: "bg-amber-500",
    hard: "bg-red-600",
};

export const RecipeItem = ({ recipe }) => {
    const difficulty = recipe.difficulty || "Easy";
    const rating = recipe.averageRating ?? getAverageRating(recipe.ratings);

    return (
        <Link
            to={`/recipes/details/${recipe.id}`}
            className="card group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <RecipeImage
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                />
                <span
                    className={`badge absolute left-3 top-3 text-white shadow-sm ${
                        difficultyStyles[difficulty.toLowerCase()] ||
                        difficultyStyles.easy
                    }`}
                >
                    {difficulty}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-1 text-base font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {recipe.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                    {recipe.description}
                </p>

                <div className="mb-4 mt-3 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <StarRating value={rating} size="h-3.5 w-3.5" />
                    <span>{rating ? rating.toFixed(1) : "No ratings"}</span>
                </div>

                <div className="mt-auto flex items-center gap-4 border-t border-neutral-100 pt-3 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />{" "}
                        {recipe.timeToCook || "?"} min
                    </span>
                    {recipe.servings && (
                        <span className="inline-flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" /> {recipe.servings}{" "}
                            servings
                        </span>
                    )}
                    <span className="ml-auto inline-flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" />{" "}
                        {recipe.likeCount || 0}
                    </span>
                </div>
            </div>
        </Link>
    );
};
