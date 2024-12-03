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
                const db = getDatabase();
                const userRef = ref(db, `users/${commentUserId}`);
                const snapshot = await get(userRef);

                let fetchedUserData = {};

                if (snapshot.exists()) {
                    fetchedUserData = snapshot.val();
                } else {
                    console.error("User data not found in Realtime Database.");
                }

                if (authUser && authUser.uid === commentUserId) {
                    fetchedUserData = {
                        ...fetchedUserData,
                        displayName: authUser.displayName,
                        email: authUser.email,
                        photoURL: authUser.photoURL,
                    };
                }

                setUserData(fetchedUserData);

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
                            console.warn(`Recipe with ID ${recipeId} not found.`);
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
            <div className={styles.backgroundImage}>
                <div className={styles.userProfileHeader}>
                    <img
                        src={userData.photoURL || "/default-avatar.png"}
                        alt={`${userData.displayName || "User"}'s avatar`}
                        className={styles.userPhoto}
                    />
                    <h2 className={styles.userName}>
                        {userData.displayName || "Unknown User"}
                    </h2>
                    {/* to add location in user obj */}
                    <p className={styles.userLocation}>San Francisco, CA</p>         
                    {/* ----- */}
                </div>
            </div>

            <div className={styles.statsContainer}>
                <div className={styles.statCard}>
                    <h3>{recipes.filter((r) => r.authorId === commentUserId).length}</h3>
                    <p>Recipes</p>
                </div>
                <div className={styles.statCard}>
                    <h3>239</h3>
                    <p>Stars</p>
                </div>
                <div className={styles.statCard}>
                    <h3>125</h3>
                    <p>Followers</p>
                </div>
            </div>

            <div className={styles.sectionsContainer}>
                <section className={styles.section}>
                    <h3>{userData.displayName.split(" ")[0]}'s Recipes</h3>
                    <ul className={styles.recipeList}>
                        {recipes &&
                            recipes
                                .filter((x) => x.authorId === commentUserId)
                                .map((recipe) => (
                                    <li key={recipe.id} className={styles.recipeItem}>
                                        <img
                                            src={recipe.imageUrl || "/placeholder-recipe.png"}
                                            alt={recipe.title || "Recipe Image"}
                                        />
                                        <h4>{recipe.title || "Unknown Recipe"}</h4>
                                        <p>{recipe.description || "No description available."}</p>
                                    </li>
                                ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};
