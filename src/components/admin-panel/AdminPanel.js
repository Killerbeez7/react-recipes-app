import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { RecipeContext } from "../../contexts/RecipeContext";
import { useAuth } from "../../contexts/AuthContext";
import { RecipeForm } from "../recipes/recipe-form/RecipeForm";

export const AdminPanel = () => {
    const { currentUser } = useAuth();
    const { addRecipe, recipes } = useContext(RecipeContext);
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
        <div className="page max-w-4xl">
            <div className="mb-8 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="page-title">Admin panel</h1>
                    <p className="page-subtitle">
                        Manually add recipes and manage the site.{" "}
                        {recipes.length} recipes published so far.
                    </p>
                </div>
            </div>
            <RecipeForm onSubmit={onSubmit} submitLabel="Publish recipe" />
        </div>
    );
};
