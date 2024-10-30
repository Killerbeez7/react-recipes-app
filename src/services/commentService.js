import { database } from '../firebase/firebaseConfig';
import { ref, push, get, child } from 'firebase/database';

export const create = async (recipeId, comment) => {
    const commentRef = ref(database, `comments/${recipeId}`);
    return await push(commentRef, comment);
};

export const getByRecipeId = async (recipeId) => {
    const snapshot = await get(child(ref(database), `comments/${recipeId}`));
    if (snapshot.exists()) {
        return Object.values(snapshot.val());
    } else {
        return [];
    }
};
