import { createContext, useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import * as recipeService from "../services/recipeService";
import * as commentService from "../services/commentService";
import { database } from "../firebase/firebaseConfig";

export const RecipeContext = createContext();

// All writes go to Firebase; the realtime listener below keeps `recipes`
// in sync (local writes fire it immediately), so no manual state patching.
export const RecipeProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // The SDK neither resolves nor errors when the DB is unreachable
        // (offline, deactivated...), so give up waiting after a while.
        const timeoutId = setTimeout(() => {
            setLoading(false);
            setError("timeout");
        }, 10000);

        const recipesRef = ref(database, "recipes");
        const unsubscribe = onValue(
            recipesRef,
            (snapshot) => {
                clearTimeout(timeoutId);
                setError(null);
                const data = snapshot.val();
                setRecipes(
                    data
                        ? Object.entries(data).map(([id, recipe]) => ({
                              id,
                              ...recipe,
                          }))
                        : []
                );
                setLoading(false);
            },
            (err) => {
                clearTimeout(timeoutId);
                console.error("Error loading recipes:", err);
                setLoading(false);
                setError(err.code || "error");
            }
        );

        return () => {
            clearTimeout(timeoutId);
            unsubscribe();
        };
    }, []);

    // ------------------------------------------------- Recipes ---------------------------------------------------------

    const addRecipe = (recipeData) => recipeService.create(recipeData);

    const editRecipe = (recipeId, recipeData) =>
        recipeService.edit(recipeId, recipeData);

    const deleteRecipe = (recipeId) => recipeService.del(recipeId);

    const selectRecipe = (recipeId) =>
        recipes.find((recipe) => recipe.id === recipeId);

    // ------------------------------------------------- Comments ---------------------------------------------------

    const addComment = (recipeId, comment) =>
        commentService.create(recipeId, comment);

    const editComment = (recipeId, commentId, updatedComment) =>
        commentService.edit(recipeId, commentId, updatedComment);

    const deleteComment = (recipeId, commentId) =>
        commentService.del(recipeId, commentId);

    // ------------------------------------------------- Likes & ratings ---------------------------------------------

    const toggleLike = async (recipeId, user) => {
        const recipe = selectRecipe(recipeId);
        if (!recipe || !user) return;

        const likes = { ...(recipe.likes || {}) };
        if (likes[user.uid]) {
            delete likes[user.uid];
        } else {
            likes[user.uid] = true;
        }

        await update(ref(database, `recipes/${recipeId}`), {
            likes,
            likeCount: Object.keys(likes).length,
        });
    };

    const rateRecipe = async (recipeId, user, ratingValue) => {
        const recipe = selectRecipe(recipeId);
        if (!recipe || !user) return;

        const ratings = { ...(recipe.ratings || {}), [user.uid]: ratingValue };
        const values = Object.values(ratings);
        const averageRating = parseFloat(
            (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2)
        );

        await update(ref(database, `recipes/${recipeId}`), {
            ratings,
            ratingCount: values.length,
            averageRating,
        });
    };

    return (
        <RecipeContext.Provider
            value={{
                recipes,
                loading,
                error,
                addRecipe,
                editRecipe,
                deleteRecipe,
                selectRecipe,
                addComment,
                editComment,
                deleteComment,
                toggleLike,
                rateRecipe,
            }}
        >
            {children}
        </RecipeContext.Provider>
    );
};
