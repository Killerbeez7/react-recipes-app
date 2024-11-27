import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import styles from "./UserProfile.module.css";

export const UserProfile = () => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    const auth = getAuth();
    const authUser = auth.currentUser;
    const { userId } = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log("Fetching user data for userId:", userId);
                const db = getDatabase();
                const userRef = ref(db, `users/${userId}`);
                const snapshot = await get(userRef);

                let fetchedUserData = {};

                if (snapshot.exists()) {
                    console.log(
                        "User data found in Realtime Database:",
                        snapshot.val()
                    );
                    fetchedUserData = snapshot.val();
                } else {
                    console.error("User data not found in Realtime Database.");
                }

                if (authUser && authUser.uid === userId) {
                    console.log("User data from Firebase Auth:", {
                        displayName: authUser.displayName,
                        email: authUser.email,
                        photoURL: authUser.photoURL,
                    });

                    fetchedUserData = {
                        ...fetchedUserData,
                        displayName: authUser.displayName,
                        email: authUser.email,
                        photoURL: authUser.photoURL,
                    };
                }

                setUserData(fetchedUserData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUserData();
    }, [userId, authUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>User data not found.</div>;
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.userProfileWrapper}>
                <h2 className={styles.userName}>{userData.username || "Unknown User"}</h2>
                <img
                    src={userData.profilePicture || "/default-avatar.png"}
                    alt={`${userData.username || "User"}'s avatar`}
                    className={styles.userPhoto}
                />
            </div>

            {/* New Sections */}
            <div className={styles.sectionsContainer}>
                <section className={styles.section}>
                    <h3>Saved Recipes</h3>
                    <p>No saved recipes yet.</p>
                </section>

                <section className={styles.section}>
                    <h3>Favorite Recipes</h3>
                    <p>No favorite recipes yet.</p>
                </section>

                <section className={styles.section}>
                    <h3>Liked Recipes</h3>
                    <p>No liked recipes yet.</p>
                </section>

                <section className={styles.section}>
                    <h3>Added Recipes</h3>
                    <p>No added recipes yet.</p>
                </section>
            </div>
        </div>
    );
};
