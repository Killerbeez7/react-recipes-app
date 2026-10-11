import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { RecipeForm } from "../recipe-form/RecipeForm";

export const RecipeAdd = () => {
    const { currentUser } = useAuth();
    const { addRecipe } = useContext(RecipeContext);
    const navigate = useNavigate();

    const onSubmit = async (recipeData) => {
        const newRecipe = await addRecipe({
            ...recipeData,
            authorId: currentUser.uid,
            authorName: currentUser.displayName || "",
            likeCount: 0,
        });
        navigate(`/recipes/details/${newRecipe.id}`);
    };

    return (
        <div className="page max-w-6xl">
            <div className="mb-8">
                <h1 className="page-title">Add a recipe</h1>
                <p className="page-subtitle">
                    Share a dish you love with the community.
                </p>
            </div>
            <RecipeForm
                onSubmit={onSubmit}
                submitLabel="Publish recipe"
                draftKey={`recipe-draft-${currentUser.uid}`}
            />
        </div>
    );
};
