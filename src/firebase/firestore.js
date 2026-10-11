import { Timestamp } from "firebase/firestore";

// Firestore Timestamps -> ISO strings, so components keep working with
// plain dates (sorting, date-fns, JSON drafts...).
const toIso = (value) =>
    value instanceof Timestamp ? value.toDate().toISOString() : value;

export const fromDoc = (snapshot) => {
    // "estimate" fills pending serverTimestamp() fields with the local time
    const data = snapshot.data({ serverTimestamps: "estimate" });
    return {
        id: snapshot.id,
        ...data,
        createdAt: toIso(data.createdAt),
        updatedAt: toIso(data.updatedAt),
    };
};
