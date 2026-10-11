import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { blobToDataUrl, compressToFit } from "../utils/image";

/**
 * Photos are stored as compressed data URLs in Firestore `images` docs
 * (Firebase Storage needs the paid Blaze plan). Recipes and profiles keep a
 * reference like "fsimg:<docId>" in their imageUrl / profilePicture field.
 */
const PREFIX = "fsimg:";
// Firestore documents max out at 1 MiB; base64 adds ~33%, so stay well below
const MAX_IMAGE_BYTES = 680 * 1024;

const imagesRef = collection(db, "images");
const cache = new Map(); // ref -> Promise<dataUrl | "">

export const isStoredImage = (value) =>
    typeof value === "string" && value.startsWith(PREFIX);

export const uploadImage = async (file, ownerId, { maxSize = 1600 } = {}) => {
    const compressed = await compressToFit(file, MAX_IMAGE_BYTES, { maxSize });
    const data = await blobToDataUrl(compressed);
    const imageDoc = await addDoc(imagesRef, {
        data,
        ownerId,
        contentType: compressed.type,
        size: compressed.size,
        createdAt: serverTimestamp(),
    });
    const ref = `${PREFIX}${imageDoc.id}`;
    cache.set(ref, Promise.resolve(data));
    return ref;
};

export const resolveImage = (ref) => {
    if (!isStoredImage(ref)) return Promise.resolve(ref || "");
    if (!cache.has(ref)) {
        cache.set(
            ref,
            getDoc(doc(imagesRef, ref.slice(PREFIX.length)))
                .then((snapshot) =>
                    snapshot.exists() ? snapshot.get("data") : ""
                )
                .catch(() => {
                    cache.delete(ref); // allow a retry later
                    return "";
                })
        );
    }
    return cache.get(ref);
};

export const deleteImage = async (ref) => {
    if (!isStoredImage(ref)) return;
    cache.delete(ref);
    try {
        await deleteDoc(doc(imagesRef, ref.slice(PREFIX.length)));
    } catch (error) {
        // An orphaned image isn't worth failing the user's action over
        console.warn("Couldn't delete image", ref, error);
    }
};
