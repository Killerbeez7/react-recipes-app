import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { createContext } from "react";
import * as recipeService from "../services/recipeService";

export const RecipeContext = createContext();

const recipeReducer = (state, action) => {
    switch (action.type) {
        case "ADD_RECIPES":
            return action.payload;
        case "ADD_RECIPE":
            return [...state, action.payload];
        case "EDIT_RECIPE":
            return state.map((x) =>
                x._id === action.recipeId ? action.payload : x
            );
        case "DELETE_RECIPE":
            return state.filter((x) => x._id !== action.payload);
        default:
            return state;
    }
};

export const RecipeProvider = ({ children }) => {
    const navigate = useNavigate();
    const [recipes, dispatch] = useReducer(recipeReducer, []);

    useEffect(() => {
        recipeService.getAll().then((result) => {
            dispatch({
                type: "ADD_RECIPES",
                payload: result,
            });
        });
    }, []);

    const addComment = (recipeId, comment) => {
        // setRecipes((state) => {
        //     const recipe = state.find((x) => x._id === recipeId);
        //     const comments = recipe.comments || [];
        //     comments.push(comment);
        //     return [
        //         ...state.filter((x) => x._id !== recipeId),
        //         { ...recipe, comments },
        //     ];
        // });
    };

    const addRecipe = (recipeData) => {
        dispatch({
            type: "ADD_RECIPE",
            payload: recipeData,
        });

        navigate("/recipes/list");
    };

    const editRecipe = (recipeId, recipeData) => {
        dispatch({
            type: "EDIT_RECIPE",
            payload: recipeData,
            recipeId,
        });
    };

    const deleteRecipe = (recipeId) => {
        dispatch({
            type: "DELETE_RECIPE",
            payload: recipeId,
        });

        navigate("/recipes/list");
    };
    return (
        <RecipeContext.Provider
            value={{
                recipes,
                addRecipe,
                editRecipe,
                deleteRecipe,
                addComment,
            }}
        >
            {children}
        </RecipeContext.Provider>
    );
};
