import { ref, push, set, child, get, update, remove } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

// Base reference for comments collection in Firebase
const commentsRef = ref(database, 'comments');

// Create a new comment
export const create = async (recipeId, commentText, user) => {
    const newCommentRef = push(commentsRef);
    const commentData = {
        recipeId,
        text: commentText,
        user: {
            username: user.displayName || user.email,
            userId: user.uid,
        },
        timestamp: Date.now(), // Adding a timestamp to sort comments if needed
    };
    await set(newCommentRef, commentData);
    return { id: newCommentRef.key, ...commentData };
};

// Get comments by recipe ID
export const getByRecipeId = async (recipeId) => {
    const snapshot = await get(commentsRef);
    if (snapshot.exists()) {
        const commentsData = snapshot.val();
        // Filter comments to only those related to the given recipe ID
        return Object.entries(commentsData)
            .filter(([id, data]) => data.recipeId === recipeId)
            .map(([id, data]) => ({ id, ...data }));
    } else {
        return [];
    }
};

// Edit a comment
export const edit = async (commentId, updatedText) => {
    const commentRef = child(commentsRef, commentId);
    await update(commentRef, { text: updatedText });
};

// Delete a comment
export const del = async (commentId) => {
    const commentRef = child(commentsRef, commentId);
    await remove(commentRef);
};
