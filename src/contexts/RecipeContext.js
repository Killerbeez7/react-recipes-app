import { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import * as recipeService from "../services/recipeService";
import * as commentService from "../services/commentService";
import { ref, onValue, update, get } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

export const RecipeContext = createContext();

const recipeReducer = (state, action) => {
    switch (action.type) {
        case "ADD_RECIPES":
            return action.payload;
        case "SET_RECIPES":
            return action.payload;
        case "EDIT_RECIPE":
            return state.map((recipe) =>
                recipe.id === action.recipeId
                    ? { ...recipe, ...action.payload }
                    : recipe
            );
        case "DELETE_RECIPE":
            return state.filter((recipe) => recipe.id !== action.recipeId);
        case "ADD_RECIPE":
            return [...state, action.payload];
        case "TOGGLE_LIKE":
            return state.map((recipe) =>
                recipe.id === action.recipeId
                    ? {
                          ...recipe,
                          likes: action.payload.likes,
                          likeCount: action.payload.likeCount,
                      }
                    : recipe
            );
        case "RATE_RECIPE":
            // We update the recipe in the state with the new ratings data.
            return state.map((recipe) =>
                recipe.id === action.recipeId
                    ? {
                          ...recipe,
                          ratings: action.payload.ratings,
                          ratingCount: action.payload.ratingCount,
                          averageRating: action.payload.averageRating,
                      }
                    : recipe
            );
        default:
            return state;
    }
};

export const RecipeProvider = ({ children }) => {
    const navigate = useNavigate();
    const [recipes, dispatch] = useReducer(recipeReducer, []);

    useEffect(() => {
        const recipesRef = ref(database, "recipes");
        const unsubscribe = onValue(recipesRef, (snapshot) => {
            const recipesData = snapshot.val();
            const recipesArray = recipesData
                ? Object.entries(recipesData).map(([id, data]) => ({
                      id,
                      ...data,
                  }))
                : [];
            dispatch({ type: "SET_RECIPES", payload: recipesArray });
        });

        return () => unsubscribe();
    }, []);

    // ------------------------------------------------- Filter ---------------------------------------------------------
    const filterRecipes = async (search, criteria) => {
        let filteredRecipes = [];
        const recipesRef = ref(database, "recipes");
        const snapshot = await get(recipesRef);

        if (snapshot.exists()) {
            const allRecipes = Object.entries(snapshot.val()).map(
                ([id, data]) => ({ id, ...data })
            );

            if (criteria === "title") {
                const normalizedSearch = search.toLowerCase().trim();
                filteredRecipes = allRecipes.filter((recipe) =>
                    recipe.title.toLowerCase().includes(normalizedSearch)
                );
            } else if (criteria === "timeToCook") {
                const maxTime = Number(search.trim());
                if (!isNaN(maxTime) && maxTime > 0) {
                    filteredRecipes = allRecipes.filter(
                        (recipe) => Number(recipe.timeToCook) <= maxTime
                    );
                } else {
                    filteredRecipes = allRecipes;
                }
            }
        }

        dispatch({ type: "SET_RECIPES", payload: filteredRecipes });
    };

    // ------------------------------------------------- Recipes ---------------------------------------------------------

    const addRecipe = async (recipeData) => {
        const newRecipe = await recipeService.create(recipeData);
        navigate(`/recipes/details/${newRecipe.id}`);
    };

    const editRecipe = async (recipeId, recipeData) => {
        await recipeService.edit(recipeId, recipeData);

        const updatedRecipe = await recipeService.getOne(recipeId);
        dispatch({ type: "EDIT_RECIPE", recipeId, payload: updatedRecipe });

        navigate(`/recipes/all`);
    };

    const deleteRecipe = async (recipeId) => {
        await recipeService.del(recipeId);
        navigate("/recipes/all");
    };

    const selectRecipe = (recipeId) => {
        return recipes.find((recipe) => recipe.id === recipeId);
    };

    // ------------------------------------------------- Comments ---------------------------------------------------

    const addComment = async (recipeId, comment) => {
        try {
            await commentService.create(recipeId, comment);
        } catch (error) {
            console.log("Error adding comment:", error);
            alert("Failed to add comment. Please try again.");
        }
    };

    const editComment = async (recipeId, commentId, updatedComment) => {
        try {
            await commentService.edit(recipeId, commentId, updatedComment);
        } catch (error) {
            console.log("Error editing comment:", error);
            alert("Failed to edit comment. Please try again");
        }
    };

    const deleteComment = async (recipeId, commentId) => {
        try {
            commentService.del(recipeId, commentId);
        } catch (error) {
            console.log("Error deleting comment:", error);
            alert("Failed to delete comment. Please try again");
        }
    };

    const toggleLike = async (recipeId, user) => {
        const recipe = recipes.find((recipe) => recipe.id === recipeId);
        if (!recipe || !user) {
            alert("You need to be logged in to like this recipe.");
            return;
        }

        const likes = recipe.likes || {};
        const userHasLiked = likes[user.uid];

        if (userHasLiked) {
            delete likes[user.uid];
        } else {
            likes[user.uid] = true;
        }

        const likeCount = Object.keys(likes).length;

        try {
            const recipeRef = ref(database, `recipes/${recipeId}`);
            await update(recipeRef, { likes, likeCount });
            dispatch({
                type: "TOGGLE_LIKE",
                recipeId,
                payload: { likes, likeCount },
            });
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const rateRecipe = async (recipeId, user, ratingValue) => {
        const recipe = recipes.find((r) => r.id === recipeId);
        if (!recipe || !user) {
            alert("You must be logged in to rate this recipe.");
            return;
        }

        const updatedRatings = {
            ...(recipe.ratings || {}),
            [user.uid]: ratingValue,
        };

        const ratingCount = Object.keys(updatedRatings).length;
        const sumOfRatings = Object.values(updatedRatings).reduce(
            (acc, val) => acc + val,
            0
        );
        const averageRating = parseFloat(
            (sumOfRatings / ratingCount).toFixed(2)
        );

        try {
            const recipeRef = ref(database, `recipes/${recipeId}`);
            await update(recipeRef, {
                ratings: updatedRatings,
                ratingCount,
                averageRating,
            });

            dispatch({
                type: "RATE_RECIPE",
                recipeId,
                payload: {
                    ratings: updatedRatings,
                    ratingCount,
                    averageRating,
                },
            });
        } catch (error) {
            console.error("Error rating recipe:", error);
            alert("Failed to rate recipe. Please try again.");
        }
    };

    return (
        <RecipeContext.Provider
            value={{
                recipes,
                addRecipe,
                editRecipe,
                deleteRecipe,
                selectRecipe,
                addComment,
                editComment,
                deleteComment,
                toggleLike,
                filterRecipes,
                rateRecipe,
            }}
        >
            {children}
        </RecipeContext.Provider>
    );
};
