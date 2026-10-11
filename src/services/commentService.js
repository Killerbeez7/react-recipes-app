import {
    collection,
    doc,
    writeBatch,
    updateDoc,
    serverTimestamp,
    increment,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const recipeRef = (recipeId) => doc(db, "recipes", recipeId);
const commentsRef = (recipeId) => collection(recipeRef(recipeId), "comments");

// Comment writes also keep the recipe's commentCount in sync
export const create = async (recipeId, comment) => {
    const commentRef = doc(commentsRef(recipeId));
    const batch = writeBatch(db);
    batch.set(commentRef, { ...comment, createdAt: serverTimestamp() });
    batch.update(recipeRef(recipeId), { commentCount: increment(1) });
    await batch.commit();
    return commentRef.id;
};

export const edit = (recipeId, commentId, updatedComment) =>
    updateDoc(doc(commentsRef(recipeId), commentId), {
        ...updatedComment,
        updatedAt: serverTimestamp(),
    });

export const del = async (recipeId, commentId) => {
    const batch = writeBatch(db);
    batch.delete(doc(commentsRef(recipeId), commentId));
    batch.update(recipeRef(recipeId), { commentCount: increment(-1) });
    await batch.commit();
};
