import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

import * as recipeService from "../services/recipeService";

export const RecipeContext = createContext();

const recipeReducer = (state, action) => {
    switch (action.type) {
        case "ADD_RECIPES":
            return action.payload.map((x) =>
                !x.comments ? { ...x, comments: [] } : x
            );
        // return action.payload.map((x) => ({ ...x, comments: [] }));
        case "ADD_RECIPE":
            return [...state, action.payload];
        case "FETCH_RECIPE_DETAILS":
        case "EDIT_RECIPE":
            return state.map((x) =>
                x._id === action.recipeId ? action.payload : x
            );
        case "DELETE_RECIPE":
            return state.filter((x) => x._id !== action.recipeId);
        case "ADD_COMMENT":
            return state.map((x) =>
                x._id === action.recipeId
                    ? { ...x, comments: [...x.comments, action.payload] }
                    : x
            );

        default:
            return state;
    }
};

export const RecipeProvider = ({ children }) => {
    const navigate = useNavigate();
    const [recipes, dispatch] = useReducer(recipeReducer, []);
    //search
    const [filteredRecipes, setFilteredRecipes] = useState([]);

    useEffect(() => {
        recipeService.getAll().then((result) => {
            dispatch({
                type: "ADD_RECIPES",
                payload: result,
            });
            //search
            setFilteredRecipes(result);
        });
    }, []);

    const selectRecipe = (recipeId) => {
        return recipes.find((x) => x._id === recipeId) || {};
    };

    const fetchRecipeDetails = (recipeId, recipeDetails) => {
        dispatch({
            type: "FETCH_RECIPE_DETAILS",
            payload: recipeDetails,
            recipeId,
        });
    };

    const addComment = (recipeId, comment) => {
        dispatch({
            type: "ADD_COMMENT",
            payload: comment,
            recipeId,
        });
    };

    const addRecipe = (recipeData) => {
        dispatch({
            type: "ADD_RECIPE",
            payload: recipeData,
        });
        setFilteredRecipes(recipes);
        navigate("/recipes/list");
        // to fix problem with state not updating 
        window.location.reload();
    };

    const editRecipe = (recipeId, recipeData) => {
        dispatch({
            type: "EDIT_RECIPE",
            payload: recipeData,
            recipeId,
        });
        setFilteredRecipes(recipes);
        navigate(`/recipes/list`);
        // to fix problem with state not updating 
        window.location.reload();
    };

    const deleteRecipe = (recipeId) => {
        dispatch({
            type: "DELETE_RECIPE",
            recipeId,
        });
        setFilteredRecipes(recipes);
        navigate("/recipes/list");
        // to fix problem with state not updating 
        window.location.reload();
    };

    //search
    const filterRecipes = (text, criteria = "all") => {
        if (criteria === "all") {
            setFilteredRecipes(recipes);
        } else {
            setFilteredRecipes(
                recipes.filter((x) =>
                    x[criteria].toLowerCase().includes(text.toLowerCase())
                )
            );
        }
    };

    return (
        <RecipeContext.Provider
            value={{
                //with search use "filteredRecipes"
                recipes: filteredRecipes,
                // without search use "recipes"
                addRecipe,
                editRecipe,
                deleteRecipe,
                addComment,
                selectRecipe,
                fetchRecipeDetails,
                //search
                filterRecipes,
            }}
        >
            {children}
        </RecipeContext.Provider>
    );
};
