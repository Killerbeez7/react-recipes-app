import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getDatabase, ref, get } from "firebase/database";
import { RecipeContext } from "../../contexts/RecipeContext";
import styles from "./UserProfile.module.css";

export const UserProfile = () => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [recipeDetails, setRecipeDetails] = useState({});

    const { currentUser: authUser } = useAuth();
    const { userId: commentUserId } = useParams();
    const { recipes } = useContext(RecipeContext);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log(
                    "Fetching user data for commentUserId:",
                    commentUserId
                );
                const db = getDatabase();
                const userRef = ref(db, `users/${commentUserId}`);
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

                if (authUser && authUser.uid === commentUserId) {
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

                // Fetch detailed data for saved recipes
                if (fetchedUserData.savedRecipes) {
                    await fetchRecipeDetails(fetchedUserData.savedRecipes);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchRecipeDetails = async (savedRecipes) => {
            try {
                const db = getDatabase();
                const recipePromises = Object.keys(savedRecipes).map(
                    async (recipeId) => {
                        const recipeRef = ref(db, `recipes/${recipeId}`);
                        const recipeSnapshot = await get(recipeRef);
                        if (recipeSnapshot.exists()) {
                            return { id: recipeId, ...recipeSnapshot.val() };
                        } else {
                            console.warn(
                                `Recipe with ID ${recipeId} not found.`
                            );
                            return null;
                        }
                    }
                );

                const fetchedRecipes = await Promise.all(recipePromises);
                const recipesById = fetchedRecipes.reduce((acc, recipe) => {
                    if (recipe) acc[recipe.id] = recipe;
                    return acc;
                }, {});

                setRecipeDetails(recipesById);
            } catch (error) {
                console.error("Error fetching recipe details:", error);
            }
        };

        if (commentUserId) fetchUserData();
    }, [commentUserId, authUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>User data not found.</div>;
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.userProfileWrapper}>
                <h2 className={styles.userName}>
                    {userData.username || "Unknown User"}
                </h2>
                <img
                    src={userData.profilePicture || "/default-avatar.png"}
                    alt={`${userData.username || "User"}'s avatar`}
                    className={styles.userPhoto}
                />
            </div>

            <div className={styles.sectionsContainer}>
                <section className={styles.section}>
                    <h3>Added Recipes</h3>
                    <ul className={styles.recipeList}>
                        {recipes &&
                            recipes
                                .filter((x) => x.authorId === commentUserId)
                                .map((recipe) => (
                                    <li
                                        key={recipe}
                                        className={styles.recipeItem}
                                    >
                                        <img
                                            src={
                                                recipe.imageUrl ||
                                                "/placeholder-recipe.png"
                                            }
                                            alt={recipe.title || "Recipe Image"}
                                        />
                                        <h4>
                                            {recipe.title || "Unknown Recipe"}
                                        </h4>
                                        <p>
                                            {recipe.description ||
                                                "No description available."}
                                        </p>
                                    </li>
                                ))}
                    </ul>
                </section>
                {/* -------------------------------- saved recipes ------------------------------------------ */}
                {/* <section className={styles.section}>
                    <h3>Saved Recipes</h3>
                    <ul className={styles.recipeList}>
                        {userData.savedRecipes &&
                            Object.keys(userData.savedRecipes).map((id) => (
                                <li key={id} className={styles.recipeItem}>
                                    <img
                                        src={
                                            recipeDetails[id]?.imageUrl ||
                                            "/placeholder-recipe.png"
                                        }
                                        alt={
                                            recipeDetails[id]?.title ||
                                            "Recipe Image"
                                        }
                                    />
                                    <h4>
                                        {recipeDetails[id]?.title ||
                                            "Unknown Recipe"}
                                    </h4>
                                    <p>
                                        {recipeDetails[id]?.description ||
                                            "No description available."}
                                    </p>
                                    <small>
                                        Steps:{" "}
                                        {recipeDetails[id]?.steps ||
                                            "Not provided"}
                                    </small>
                                </li>
                            ))}
                    </ul>
                </section> */}
            </div>
        </div>
    );
};
