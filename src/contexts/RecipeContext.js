import { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import * as recipeService from "../services/recipeService";
import { onValue, ref, push, set } from "firebase/database";
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
        case 'ADD_COMMENT':
            return state.map(recipe =>
                recipe.id === action.payload.recipeId
                    ? { ...recipe, comments: [...(recipe.comments || []), action.payload.comment] }
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

    return (
        <RecipeContext.Provider
            value={{
                recipes,
                addRecipe,
                editRecipe,
                deleteRecipe,
                selectRecipe,
                addComment,
            }}
        >
            {children}
        </RecipeContext.Provider>
    );
};
