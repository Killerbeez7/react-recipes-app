import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    setDoc,
    writeBatch,
    serverTimestamp,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { fromDoc } from "../firebase/firestore";
import { deleteImage } from "./imageService";

const recipesRef = collection(db, "recipes");

export const getOne = async (recipeId) => {
    const snapshot = await getDoc(doc(recipesRef, recipeId));
    return snapshot.exists() ? fromDoc(snapshot) : null;
};

export const create = async (recipeData) => {
    const ref = await addDoc(recipesRef, {
        ...recipeData,
        likes: {},
        likeCount: 0,
        ratings: {},
        ratingCount: 0,
        averageRating: 0,
        commentCount: 0,
        createdAt: serverTimestamp(),
    });
    return { id: ref.id, ...recipeData };
};

export const edit = (recipeId, recipeData) =>
    updateDoc(doc(recipesRef, recipeId), {
        ...recipeData,
        updatedAt: serverTimestamp(),
    });

// Deletes the recipe together with its comments and stored photo
export const del = async (recipeId) => {
    const recipeRef = doc(recipesRef, recipeId);
    const recipe = await getDoc(recipeRef);
    const comments = await getDocs(collection(recipeRef, "comments"));
    const batch = writeBatch(db);
    comments.forEach((comment) => batch.delete(comment.ref));
    batch.delete(recipeRef);
    await batch.commit();
    await deleteImage(recipe.get("imageUrl"));
};

export const toggleSavedRecipe = (userId, recipeId, isSaved) =>
    setDoc(
        doc(db, "users", userId),
        {
            savedRecipes: isSaved
                ? arrayRemove(recipeId)
                : arrayUnion(recipeId),
        },
        { merge: true }
    );
