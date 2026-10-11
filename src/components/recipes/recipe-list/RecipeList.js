import { Link, useParams } from "react-router-dom";
import { useContext, useMemo } from "react";
import { SearchX } from "lucide-react";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { getCategoryLabel } from "../../../constants/categories";
import { toCategoryArray } from "../../../utils/recipe";
import { RecipeGrid } from "../recipe-grid/RecipeGrid";
import { PageLoader } from "../../ui/Loader";
import { EmptyState } from "../../ui/EmptyState";

export const RecipeList = () => {
    const { currentUser } = useAuth();
    const { recipes, loading } = useContext(RecipeContext);
    const { category } = useParams();

    const filteredRecipes = useMemo(
        () =>
            category
                ? recipes.filter((r) =>
                      toCategoryArray(r.categories).includes(category)
                  )
                : recipes,
        [category, recipes]
    );

    const title = category
        ? getCategoryLabel(category) || "Recipes"
        : "All recipes";

    return (
        <div className="page">
            <div className="mb-8">
                <h1 className="page-title">{title}</h1>
                {!loading && (
                    <p className="page-subtitle">
                        {filteredRecipes.length}{" "}
                        {filteredRecipes.length === 1 ? "recipe" : "recipes"}
                    </p>
                )}
            </div>

            {loading ? (
                <PageLoader label="Loading recipes..." />
            ) : filteredRecipes.length === 0 ? (
                <EmptyState
                    icon={SearchX}
                    title="No recipes here yet"
                    action={
                        <Link
                            to={currentUser ? "/recipes/add" : "/recipes/all"}
                            className="btn-primary"
                        >
                            {currentUser
                                ? "Share the first one"
                                : "Browse all recipes"}
                        </Link>
                    }
                >
                    {category
                        ? "Nobody has added a recipe to this category yet."
                        : "The recipe library is empty."}
                </EmptyState>
            ) : (
                <RecipeGrid recipes={filteredRecipes} />
            )}
        </div>
    );
};
