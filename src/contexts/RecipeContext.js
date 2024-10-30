import { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import * as recipeService from "../services/recipeService";
import { onValue, ref, push, set, update, remove } from "firebase/database";
import { database } from "../firebase/firebaseConfig";
// import { useAuth } from "./AuthContext";



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
        case 'ADD_COMMENT':
            return state.map(recipe =>
                recipe.id === action.payload.recipeId
                    ? { ...recipe, comments: [...(recipe.comments || []), action.payload.comment] }
                    : recipe
            );
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
    // const { currentUser } = useAuth
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

    const addComment = async (recipeId, comment) => {
        try {
            const commentsRef = ref(database, `recipes/${recipeId}/comments`);
            const newCommentRef = push(commentsRef);

            await set(newCommentRef, comment);

            console.log("Comment added successfully with unique ID:", newCommentRef.key);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const editComment = async (recipeId, commentId, updatedComment) => {
        try {
            const commentRef = ref(database, `recipes/${recipeId}/comments/${commentId}`);
            await update(commentRef, updatedComment);
        } catch (error) {
            console.error("Error editing comment:", error);
        }
    };

    const deleteComment = async (recipeId, commentId) => {
        try {
            const commentRef = ref(database, `recipes/${recipeId}/comments/${commentId}`);
            await remove(commentRef);
        } catch (error) {
            console.error("Error deleting comment:", error);
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
                recipes,
                addRecipe,
                editRecipe,
                deleteRecipe,
                selectRecipe,
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
