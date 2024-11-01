import { database } from '../firebase/firebaseConfig';
import { ref, push, update, remove, set, get, child } from 'firebase/database';


export const create = async (recipeId, comment) => {
    try {
        const commentsRef = ref(database, `recipes/${recipeId}/comments`);
        const newCommentRef = push(commentsRef);
        await set(newCommentRef, comment);
            return { id: newCommentRef.key, ...comment };
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
};

export const edit = async (recipeId, commentId, updatedComment) => {
    try {
        const commentRef = ref(database, `recipes/${recipeId}/comments/${commentId}`);
        await update(commentRef, updatedComment);
    } catch (error) {
        console.error("Error editing comment:", error);
        throw error;
    }
};

export const del = async (recipeId, commentId) => {
    try {
        const commentRef = ref(database, `recipes/${recipeId}/comments/${commentId}`);
        await remove(commentRef);
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
};

export const getByRecipeId = async (recipeId) => {
    const snapshot = await get(child(ref(database), `comments/${recipeId}`));
    if (snapshot.exists()) {
        return Object.values(snapshot.val());
    } else {
        return [];
    }
};
