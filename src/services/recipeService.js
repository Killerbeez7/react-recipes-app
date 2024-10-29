import { ref, set, get, push, update, remove, child } from "firebase/database";
import { database } from "../firebase/firebaseConfig";


const recipesRef = ref(database, 'recipes');


export const getAll = async () => {
    const snapshot = await get(recipesRef);
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
};


export const getOne = async (recipeId) => {
    const recipeRef = child(recipesRef, recipeId);
    const snapshot = await get(recipeRef);
    return snapshot.exists() ? snapshot.val() : null;
};


export const create = async (recipeData) => {
    const newRecipeRef = push(recipesRef);
    await set(newRecipeRef, recipeData);
    return { id: newRecipeRef.key, ...recipeData };
};


export const edit = async (recipeId, recipeData) => {
    const recipeRef = child(recipesRef, recipeId);
    await update(recipeRef, recipeData);
};


export const del = async (recipeId) => {
    const recipeRef = child(recipesRef, recipeId);
    await remove(recipeRef);
};
