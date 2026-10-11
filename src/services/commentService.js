import { database } from "../firebase/firebaseConfig";
import { ref, push, update, remove, set } from "firebase/database";

const commentRef = (recipeId, commentId = "") =>
    ref(database, `recipes/${recipeId}/comments/${commentId}`);

export const create = async (recipeId, comment) => {
    const newCommentRef = push(commentRef(recipeId));
    const data = { ...comment, createdAt: new Date().toISOString() };
    await set(newCommentRef, data);
    return { id: newCommentRef.key, ...data };
};

export const edit = (recipeId, commentId, updatedComment) =>
    update(commentRef(recipeId, commentId), {
        ...updatedComment,
        updatedAt: new Date().toISOString(),
    });

export const del = (recipeId, commentId) =>
    remove(commentRef(recipeId, commentId));
