import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { ref, update, get, remove } from "firebase/database";
import { updateProfile, updatePassword, deleteUser } from "firebase/auth";

import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { auth, database, storage } from "../../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

import styles from "./ProfileDetails.module.css";

export const ProfileDetails = () => {
    const { currentUser, setCurrentUser } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
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
                        setBio(userData.bio || "");
                        setProfilePicture(userData.profilePicture || "");
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
                let newProfilePictureUrl = profilePicture;
                if (profilePicture instanceof File) {
                    const imageRef = storageRef(
                        storage,
                        `profilePictures/${user.uid}`
                    );
                    await uploadBytes(imageRef, profilePicture);
                    newProfilePictureUrl = await getDownloadURL(imageRef);
                }

                await updateProfile(user, {
                    displayName: username,
                    photoURL: newProfilePictureUrl,
                });

                const userRef = ref(database, `users/${user.uid}`);
                await update(userRef, {
                    username: username,
                    bio: bio,
                    profilePicture: newProfilePictureUrl,
                });

                setCurrentUser({
                    ...user,
                    displayName: username,
                    photoURL: newProfilePictureUrl,
                });

                console.log("Profile updated successfully.");
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
        <div className={styles.mainContainer}>
            <div className={styles.sideBox}>
                <div className={styles.sideBox}>
                    <h3>Recent Activity</h3>
                    <ul>
                        <li>
                            You liked <strong>Spaghetti Carbonara</strong>
                        </li>
                        <li>
                            You commented on <strong>Vegan Brownies</strong>
                        </li>
                        <li>
                            Uploaded <strong>Best Tacos Recipe</strong>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles.sideBox}>
                <h3>Quick Actions</h3>
                <button className={styles.quickActionBtn}>
                    🔍 Search Recipes
                </button>
                <button className={styles.quickActionBtn}>➕ Add Recipe</button>
                <button className={styles.quickActionBtn}>
                    ⭐ View Favorites
                </button>
                <button className={styles.quickActionBtn}>
                    ⚙️ Edit Profile
                </button>
            </div>
            <div className={styles.profileContainer}>
                <h1 className={styles.profileTitle}>Profile Details</h1>
                <div className={styles.profilePictureSection}>
                    <img
                        src={
                            currentUser.photoURL ||
                            "https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png"
                        }
                        alt="Profile"
                        className={styles.profilePicture}
                    />
                    <label
                        htmlFor="profilePicture"
                        className={styles.uploadBtn}
                    >
                        Change Picture
                        <input
                            type="file"
                            id="profilePicture"
                            name="profilePicture"
                            className={styles.fileInput}
                            onChange={(e) =>
                                setProfilePicture(e.target.files[0])
                            }
                        />
                    </label>
                </div>
                <form
                    onSubmit={handleSaveChanges}
                    className={styles.formContainer}
                >
                    <div className={styles.inputContainer}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={handleInputChange(setUsername)}
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            disabled
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={bio}
                            onChange={handleInputChange(setBio)}
                            className={styles.textArea}
                        />
                    </div>
                    <div className={styles.buttonRow}>
                        <button type="submit" className={styles.saveBtn}>
                            Save
                        </button>
                        <button
                            type="button"
                            className={styles.changePasswordBtn}
                        >
                            Change Password
                        </button>
                        <button
                            type="button"
                            className={styles.deleteAccountBtn}
                        >
                            Delete
                        </button>
                    </div>
                </form>
            </div>
            <div className={styles.sideBox}>
                <h3>Achievements</h3>
                <p>🏆 Recipe Master</p>
                <p>💬 Active Commenter</p>
                <p>⭐ Top Chef</p>
            </div>
            <div className={styles.sideBox}>
                <h3>Saved Recipes</h3>
                <div className={styles.recipeGrid}>
                    <img src="recipe1.jpg" alt="Recipe 1" />
                    <img src="recipe2.jpg" alt="Recipe 2" />
                    <img src="recipe3.jpg" alt="Recipe 3" />
                </div>
            </div>
        </div>
    );
};
