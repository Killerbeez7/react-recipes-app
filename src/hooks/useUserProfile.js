import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// One-off read of a user's public profile (username, avatar...)
export const useUserProfile = (userId) => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (!userId) return;
        let ignore = false;
        getDoc(doc(db, "users", userId))
            .then((snapshot) => {
                if (ignore || !snapshot.exists()) return;
                const data = snapshot.data();
                setProfile({
                    ...data,
                    username: data.username || data.displayName || "",
                });
            })
            .catch(() => {});
        return () => {
            ignore = true;
        };
    }, [userId]);

    return profile;
};
