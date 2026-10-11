import { useContext } from "react";
import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { RecipeGrid } from "../recipe-grid/RecipeGrid";
import { PageLoader } from "../../ui/Loader";
import { EmptyState } from "../../ui/EmptyState";

export const SavedRecipes = () => {
    const { userProfile } = useAuth();
    const { recipes, loading } = useContext(RecipeContext);

    const savedIds = new Set(userProfile?.savedRecipes || []);
    const savedRecipes = recipes.filter((recipe) => savedIds.has(recipe.id));

    return (
        <div className="page">
            <div className="mb-8">
                <h1 className="page-title">Saved recipes</h1>
                <p className="page-subtitle">
                    Your personal collection of dishes to cook next.
                </p>
            </div>

            {loading ? (
                <PageLoader />
            ) : savedRecipes.length === 0 ? (
                <EmptyState
                    icon={Bookmark}
                    title="No saved recipes yet"
                    action={
                        <Link to="/recipes/all" className="btn-primary">
                            Browse recipes
                        </Link>
                    }
                >
                    Tap the Save button on any recipe to keep it here.
                </EmptyState>
            ) : (
                <RecipeGrid recipes={savedRecipes} />
            )}
        </div>
    );
};
