import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import styles from "./UserProfile.module.css";

export const UserProfile = () => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [recipeDetails, setRecipeDetails] = useState({}); // Store detailed recipe data

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
  <h3>Saved Recipes</h3>
  <ul className={styles.recipeList}>
    {userData.savedRecipes &&
      Object.keys(userData.savedRecipes).map((id) => (
        <li key={id} className={styles.recipeItem}>
          <img
            src={recipeDetails[id]?.imageUrl || "/placeholder-recipe.png"}
            alt={recipeDetails[id]?.title || "Recipe Image"}
          />
          <h4>{recipeDetails[id]?.title || "Unknown Recipe"}</h4>
          <p>{recipeDetails[id]?.description || "No description available."}</p>
          <small>Steps: {recipeDetails[id]?.steps || "Not provided"}</small>
        </li>
      ))}
  </ul>
</section>

<section className={styles.section}>
  <h3>Favorite Recipes</h3>
  <ul className={styles.recipeList}>
    {/* {userData.favoriteRecipes ? (
      Object.keys(userData.favoriteRecipes).map((id) => (
        <li key={id} className={styles.recipeItem}>
          <img
            src={favoriteDetails[id]?.imageUrl || "/placeholder-recipe.png"}
            alt={favoriteDetails[id]?.title || "Recipe Image"}
          />
          <h4>{favoriteDetails[id]?.title || "Unknown Recipe"}</h4>
          <p>{favoriteDetails[id]?.description || "No description available."}</p>
        </li>
      ))
    ) : (
      <p>No favorite recipes yet.</p>
    )} */}
  </ul>
</section>

<section className={styles.section}>
  <h3>Liked Recipes</h3>
  <ul className={styles.recipeList}>
    {/* {userData.likedRecipes ? (
      Object.keys(userData.likedRecipes).map((id) => (
        <li key={id} className={styles.recipeItem}>
          <img
            src={likedDetails[id]?.imageUrl || "/placeholder-recipe.png"}
            alt={likedDetails[id]?.title || "Recipe Image"}
          />
          <h4>{likedDetails[id]?.title || "Unknown Recipe"}</h4>
        </li>
      ))
    ) : (
      <p>No liked recipes yet.</p>
    )} */}
  </ul>
</section>

<section className={styles.section}>
  <h3>Added Recipes</h3>
  <ul className={styles.recipeList}>
    {/* {userData.addedRecipes ? (
      Object.keys(userData.addedRecipes).map((id) => (
        <li key={id} className={styles.recipeItem}>
          <img
            src={addedDetails[id]?.imageUrl || "/placeholder-recipe.png"}
            alt={addedDetails[id]?.title || "Recipe Image"}
          />
          <h4>{addedDetails[id]?.title || "Unknown Recipe"}</h4>
        </li>
      ))
    ) : (
      <p>No added recipes yet.</p>
    )} */}
  </ul>
</section>
            </div>
        </div>
    );
};
