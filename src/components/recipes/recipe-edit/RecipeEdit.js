import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";
import * as recipeService from "../../../services/recipeService";
import { RecipeForm } from "../recipe-form/RecipeForm";
import { PageLoader } from "../../ui/Loader";
import { EmptyState } from "../../ui/EmptyState";
import { SearchX, ShieldAlert } from "lucide-react";

export const RecipeEdit = () => {
    const { editRecipe } = useContext(RecipeContext);
    const { currentUser } = useAuth();
    const { recipeId } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;
        recipeService
            .getOne(recipeId)
            .then((data) => !ignore && setRecipe(data))
            .catch((error) => console.error("Error fetching recipe:", error))
            .finally(() => !ignore && setLoading(false));
        return () => {
            ignore = true;
        };
    }, [recipeId]);

    const onSubmit = async (recipeData) => {
        await editRecipe(recipeId, recipeData);
        navigate(`/recipes/details/${recipeId}`);
    };

    if (loading) return <PageLoader />;

    if (!recipe) {
        return (
            <div className="page max-w-2xl">
                <EmptyState
                    icon={SearchX}
                    title="Recipe not found"
                    action={
                        <Link to="/recipes/all" className="btn-primary">
                            Browse recipes
                        </Link>
                    }
                />
            </div>
        );
    }

    if (recipe.authorId !== currentUser.uid) {
        return (
            <div className="page max-w-2xl">
                <EmptyState
                    icon={ShieldAlert}
                    title="You can't edit this recipe"
                    action={
                        <Link
                            to={`/recipes/details/${recipeId}`}
                            className="btn-primary"
                        >
                            Back to recipe
                        </Link>
                    }
                >
                    Only the author of a recipe can edit it.
                </EmptyState>
            </div>
        );
    }

    return (
        <div className="page max-w-4xl">
            <div className="mb-8">
                <h1 className="page-title">Edit recipe</h1>
                <p className="page-subtitle">{recipe.title}</p>
            </div>
            <RecipeForm
                initialRecipe={recipe}
                onSubmit={onSubmit}
                submitLabel="Save changes"
                cancelTo={`/recipes/details/${recipeId}`}
            />
        </div>
    );
};
