import { getCategoryLabel } from "../../constants/categories";
import { toCategoryArray } from "../../utils/recipe";

// Wrap the matched part of `text` in a highlight
export const Highlight = ({ text = "", term }) => {
    const index = term ? text.toLowerCase().indexOf(term) : -1;
    if (index === -1) return text;
    return (
        <>
            {text.slice(0, index)}
            <mark className="rounded-sm bg-brand-100 text-inherit dark:bg-brand-500/30">
                {text.slice(index, index + term.length)}
            </mark>
            {text.slice(index + term.length)}
        </>
    );
};

export const searchRecipes = (recipes, term, limit = 8) =>
    recipes
        .map((recipe) => {
            const title = recipe.title?.toLowerCase() || "";
            const haystack = [
                recipe.description,
                recipe.cuisine,
                ...toCategoryArray(recipe.categories).map(getCategoryLabel),
            ]
                .join(" ")
                .toLowerCase();
            // Title matches rank above matches elsewhere
            const score = title.startsWith(term)
                ? 3
                : title.includes(term)
                  ? 2
                  : haystack.includes(term)
                    ? 1
                    : 0;
            return { recipe, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ recipe }) => recipe);
