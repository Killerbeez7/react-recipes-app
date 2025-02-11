import { useEffect, useState, useContext } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useParams, Link } from "react-router-dom";
import { RecipeContext } from "../../contexts/RecipeContext";
import styles from "./UserProfile.module.css";

export const UserProfile = () => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    const { userId } = useParams();
    const { recipes } = useContext(RecipeContext);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const db = getDatabase();
                const userRef = ref(db, `users/${userId}`);
                const snapshot = await get(userRef);

                let fetchedUserData = {};

                if (snapshot.exists()) {
                    fetchedUserData = snapshot.val();
                } else {
                    console.error("User data not found.");
                }

                setUserData(fetchedUserData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUserData();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>User data not found.</div>;
    }

    console.log(`Looking at user profile from comments: ${userData}`);
    const totalRecipesCount = recipes.filter(
        (r) => r.authorId === userId
    ).length;

    const totalRatingsSum = recipes.reduce((total, recipe) => {
        const recipeRatingsSum = Object.values(recipe.ratings ?? {}).reduce(
            (sum, rating) => sum + rating,
            0
        );
        return total + recipeRatingsSum;
    }, 0);

    return (
        <div>
            <div className={styles.profileContainer}>
                <div className={styles.backgroundImage}>
                    <div className={styles.userProfileHeader}>
                        <img
                            src={
                                userData.profilePicture || "/default-avatar.png"
                            }
                            alt={`${userData.username || "User"}'s avatar`}
                            className={styles.userPhoto}
                        />
                        <h2 className={styles.userName}>
                            {userData.username || "Unknown User"}
                        </h2>
                        {/* to add location in user obj */}
                        <p className={styles.userLocation}>San Francisco, CA</p>
                        {/* ----- */}
                    </div>
                </div>

                <div className={styles.statsContainer}>
                    <div className={styles.statCard}>
                        <h3>{totalRecipesCount}</h3>
                        <p> {totalRecipesCount > 1 ? "Recipes" : "Recipe"}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>{totalRatingsSum}</h3>
                        <p> {totalRatingsSum > 1 ? "Stars" : "Star"}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>125</h3>
                        <p>Followers</p>
                    </div>
                </div>

                <div className={styles.sectionsContainer}>
                    <section className={styles.section}>
                        <h3>All Recipes</h3>
                        <ul className={styles.recipeList}>
                            {recipes &&
                                recipes
                                    .filter((x) => x.authorId === userId)
                                    .map((recipe) => (
                                        <li
                                            key={recipe.id}
                                            className={styles.recipeItem}
                                        >
                                            <Link
                                                to={`/recipes/details/${recipe.id}`}
                                                className={styles.recipeLink}
                                            >
                                                <img
                                                    src={
                                                        recipe.imageUrl ||
                                                        "/placeholder-recipe.png"
                                                    }
                                                    alt={
                                                        recipe.title ||
                                                        "Recipe Image"
                                                    }
                                                />
                                                <h4>
                                                    {recipe.title ||
                                                        "Unknown Recipe"}
                                                </h4>
                                                <p>
                                                    {recipe.description ||
                                                        "No description available."}
                                                </p>
                                            </Link>
                                        </li>
                                    ))}
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};
