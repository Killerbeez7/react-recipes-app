import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

// One-off read of a user's public profile (username, avatar...)
export const useUserProfile = (userId) => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (!userId) return;
        let ignore = false;
        get(ref(database, `users/${userId}`))
            .then((snapshot) => !ignore && setProfile(snapshot.val()))
            .catch(() => {});
        return () => {
            ignore = true;
        };
    }, [userId]);

    return profile;
};
