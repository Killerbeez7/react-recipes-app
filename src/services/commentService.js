import { database } from '../firebase/firebaseConfig';
import { ref, push, update, remove, set, get, child } from 'firebase/database';
import { formatISO } from 'date-fns';  // Import date-fns for timestamp creation


export const create = async (recipeId, comment) => {
    try {
        const commentsRef = ref(database, `recipes/${recipeId}/comments`);
        const newCommentRef = push(commentsRef);
        const timestamp = formatISO(new Date());  // Add current timestamp
        const commentWithTimestamp = { ...comment, createdAt: timestamp };  // Add timestamp to comment
        await set(newCommentRef, commentWithTimestamp);
        return { id: newCommentRef.key, ...commentWithTimestamp };
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
};
// export const create = async (recipeId, comment) => {
//     try {
//         const commentsRef = ref(database, `recipes/${recipeId}/comments`);
//         const newCommentRef = push(commentsRef);
//         await set(newCommentRef, comment);
//             return { id: newCommentRef.key, ...comment };
//     } catch (error) {
//         console.error("Error adding comment:", error);
//         throw error;
//     }
// };

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
