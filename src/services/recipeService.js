import { ref, set, get, push, update, remove, child } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

// Define the base path for recipes in your database
const recipesRef = ref(database, 'recipes');

// Function to fetch all recipes
export const getAll = async () => {
    const snapshot = await get(recipesRef);
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
};

// Function to fetch a single recipe by ID
export const getOne = async (recipeId) => {
    const recipeRef = child(recipesRef, recipeId);
    const snapshot = await get(recipeRef);
    return snapshot.exists() ? snapshot.val() : null;
};

// Function to create a new recipe
export const create = async (recipeData) => {
    const newRecipeRef = push(recipesRef);
    await set(newRecipeRef, recipeData);
    return { id: newRecipeRef.key, ...recipeData };
};

// Function to edit an existing recipe by ID
export const edit = async (recipeId, recipeData) => {
    const recipeRef = child(recipesRef, recipeId);
    await update(recipeRef, recipeData);
};

// Function to delete a recipe by ID
export const del = async (recipeId) => {
    const recipeRef = child(recipesRef, recipeId);
    await remove(recipeRef);
};
