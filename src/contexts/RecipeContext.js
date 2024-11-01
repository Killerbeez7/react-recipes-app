import { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import * as recipeService from "../services/recipeService";
import * as commentService from "../services/commentService";
import { onValue, ref, update } from "firebase/database";
import { database } from "../firebase/firebaseConfig";


export const RecipeContext = createContext();

const recipeReducer = (state, action) => {
    switch (action.type) {
        case "ADD_RECIPES":
            return action.payload;
        case "EDIT_RECIPE":
            return state.map((recipe) =>
                recipe.id === action.recipeId ? { ...recipe, ...action.payload } : recipe
            );
        case "DELETE_RECIPE":
            return state.filter((recipe) => recipe.id !== action.recipeId);
        case "ADD_RECIPE":
            return [...state, action.payload];
        // case 'ADD_COMMENT':
        //     return state.map(recipe =>
        //         recipe.id === action.payload.recipeId
        //             ? { ...recipe, comments: [...(recipe.comments || []), action.payload.comment] }
        //             : recipe
        //     );
        case 'TOGGLE_LIKE':
            return state.map(recipe =>
                recipe.id === action.recipeId
                    ? {
                        ...recipe,
                        likes: action.payload.likes,
                        likeCount: action.payload.likeCount,
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
        const recipesRef = ref(database, 'recipes');

        const unsubscribe = onValue(recipesRef, (snapshot) => {
            const recipesData = snapshot.val();
            const recipesArray = recipesData
                ? Object.entries(recipesData).map(([id, data]) => ({ id, ...data }))
                : [];
            dispatch({ type: "ADD_RECIPES", payload: recipesArray });
        });

        return () => unsubscribe();
    }, []);

    // ------------------------------------------------- Recipes ---------------------------------------------------------

    const addRecipe = async (recipeData) => {
        const newRecipe = await recipeService.create(recipeData);
        navigate(`/recipes/details/${newRecipe.id}`);
    };

    const editRecipe = async (recipeId, recipeData) => {
        await recipeService.edit(recipeId, recipeData);

        const updatedRecipe = await recipeService.getOne(recipeId);
        dispatch({ type: "EDIT_RECIPE", recipeId, payload: updatedRecipe });

        navigate(`/recipes/list`);
    };


    const deleteRecipe = async (recipeId) => {
        await recipeService.del(recipeId);
        navigate("/recipes/list");
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
            await commentService.edit(recipeId, commentId, updatedComment)
        } catch (error) {
            console.log("Error editing comment:", error);
            alert("Failed to edit comment. Please try again")
        }

    };

    const deleteComment = async (recipeId, commentId) => {
        try {
            commentService.del(recipeId, commentId)
        } catch (error) {
            console.log("Error deleting comment:", error);
            alert("Failed to delete comment. Please try again")
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
            // Unlike the recipe
            delete likes[user.uid];
        } else {
            // Like the recipe
            likes[user.uid] = true;
        }

        const likeCount = Object.keys(likes).length;

        try {
            const recipeRef = ref(database, `recipes/${recipeId}`);
            await update(recipeRef, { likes, likeCount });
            dispatch({ type: 'TOGGLE_LIKE', recipeId, payload: { likes, likeCount } });
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    return (
        <RecipeContext.Provider
            value={{
                //recipes
                recipes,
                addRecipe,
                editRecipe,
                deleteRecipe,
                selectRecipe,
                //comments
                addComment,
                editComment,
                deleteComment,
                toggleLike,
            }}
        >
            {children}
        </RecipeContext.Provider>
    );
};
