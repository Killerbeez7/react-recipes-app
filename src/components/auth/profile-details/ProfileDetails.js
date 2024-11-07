import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { ref, update, get } from "firebase/database";
import { updateProfile } from "firebase/auth";
import { auth, database } from "../../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

import styles from "./ProfileDetails.module.css";

export const ProfileDetails = () => {
    const { currentUser, setCurrentUser } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            const userRef = ref(database, `users/${currentUser.uid}`);
            get(userRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        setUsername(userData.username);
                        setEmail(userData.email);
                    }
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    setIsLoading(false);
                });
        }
    }, [currentUser]);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();

        if (!username.trim()) {
            alert("Username cannot be empty");
            return;
        }

        try {
            const user = auth.currentUser;
            if (user) {
                await updateProfile(user, {
                    displayName: username,
                });

                const userRef = ref(database, `users/${user.uid}`);
                await update(userRef, { username: username });

                setCurrentUser({ ...user, displayName: username });

                console.log("Username updated successfully.");
                navigate(-1);
            } else {
                console.error("User not found in Firebase Authentication.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(
                "There was an error updating your profile. Please try again."
            );
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles["main"]}>
            <h1 className={styles["profile-title"]}>Profile Details</h1>

            {/* Profile Picture Section */}
            <div className={styles["profile-picture-section"]}>
                <img
                    src="https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png"
                    alt="Profile"
                    className={styles["profile-picture"]}
                />
                <label
                    htmlFor="profilePicture"
                    className={styles["upload-btn"]}
                >
                    Change Picture
                    <input
                        type="file"
                        id="profilePicture"
                        name="profilePicture"
                        className={styles["file-input"]}
                    />
                </label>
            </div>

            <form onSubmit={handleSaveChanges}>
                <div className={styles.containers}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={handleInputChange(setUsername)}
                    />
                </div>
                <div className={styles.containers}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        disabled
                    />
                </div>
                <button type="submit" className={styles["save-btn"]}>
                    Save Changes
                </button>
            </form>
        </div>
    );
};
