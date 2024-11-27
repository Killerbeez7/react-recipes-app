import { ref, update, get } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

export const addRecipeToFavorites = async (userId, recipeId, isSaved) => {
    const userRef = ref(database, `users/${userId}`);
    try {
        const snapshot = await get(userRef);
        const savedRecipes = snapshot.val()?.savedRecipes || {};

        if (isSaved) {
            delete savedRecipes[recipeId];
        } else {
            savedRecipes[recipeId] = true;
        }

        await update(userRef, { savedRecipes });
    } catch (error) {
        console.error("Error saving recipe for user:", error);
        throw error;
    }
};
