import { createContext, useEffect, useState } from "react";
import {
    collection,
    deleteField,
    doc,
    increment,
    onSnapshot,
    runTransaction,
    updateDoc,
} from "firebase/firestore";
import * as recipeService from "../services/recipeService";
import * as commentService from "../services/commentService";
import { db } from "../firebase/firebaseConfig";
import { fromDoc } from "../firebase/firestore";

export const RecipeContext = createContext();

// All writes go to Firestore; the realtime listener below keeps `recipes`
// in sync (local writes fire it immediately), so no manual state patching.
export const RecipeProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Don't spin forever if Firestore is unreachable
        const timeoutId = setTimeout(() => {
            setLoading(false);
            setError("timeout");
        }, 10000);

        const unsubscribe = onSnapshot(
            collection(db, "recipes"),
            (snapshot) => {
                clearTimeout(timeoutId);
                setError(null);
                setRecipes(snapshot.docs.map(fromDoc));
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

        const liked = !!recipe.likes?.[user.uid];
        await updateDoc(doc(db, "recipes", recipeId), {
            [`likes.${user.uid}`]: liked ? deleteField() : true,
            likeCount: increment(liked ? -1 : 1),
        });
    };

    // A transaction, so concurrent ratings can't overwrite each other's average
    const rateRecipe = (recipeId, user, ratingValue) =>
        runTransaction(db, async (transaction) => {
            const recipeRef = doc(db, "recipes", recipeId);
            const snapshot = await transaction.get(recipeRef);
            if (!snapshot.exists() || !user) return;

            const ratings = {
                ...(snapshot.data().ratings || {}),
                [user.uid]: ratingValue,
            };
            const values = Object.values(ratings);
            transaction.update(recipeRef, {
                [`ratings.${user.uid}`]: ratingValue,
                ratingCount: values.length,
                averageRating: Number(
                    (
                        values.reduce((sum, v) => sum + v, 0) / values.length
                    ).toFixed(2)
                ),
            });
        });

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
