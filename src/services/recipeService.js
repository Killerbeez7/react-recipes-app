import { ref, set, get, push, update, remove, child } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

const recipesRef = ref(database, "recipes");

export const getOne = async (recipeId) => {
    const snapshot = await get(child(recipesRef, recipeId));
    return snapshot.exists() ? { id: recipeId, ...snapshot.val() } : null;
};

export const create = async (recipeData) => {
    const newRecipeRef = push(recipesRef);
    const recipe = { ...recipeData, createdAt: new Date().toISOString() };
    await set(newRecipeRef, recipe);
    return { id: newRecipeRef.key, ...recipe };
};

export const edit = (recipeId, recipeData) =>
    update(child(recipesRef, recipeId), recipeData);

export const del = (recipeId) => remove(child(recipesRef, recipeId));

export const toggleSavedRecipe = (userId, recipeId, isSaved) =>
    set(
        ref(database, `users/${userId}/savedRecipes/${recipeId}`),
        isSaved ? null : true
    );
