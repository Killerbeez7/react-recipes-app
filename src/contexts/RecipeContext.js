import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createContext } from "react";
import * as recipeService from "../services/recipeService";

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        recipeService.getAll().then((result) => {
            setRecipes(Object.values(result));
        });
    }, []);

    const navigate = useNavigate();

    const addComment = (recipeId, comment) => {
        setRecipes((state) => {
            const recipe = state.find((x) => x._id === recipeId);

            const comments = recipe.comments || [];
            comments.push(comment);

            return [
                ...state.filter((x) => x._id !== recipeId),
                { ...recipe, comments },
            ];
        });
    };

    const addRecipe = (recipeData) => {
        setRecipes((state) => [...state, recipeData]);
        navigate("/recipes/list");
        // console.log("adding...");
        // console.log(`recipe: ${recipeData._id}`);
    };

    const editRecipe = (recipeId, recipeData) => {
        setRecipes(
            (state) => state.map((x) => (x._id === recipeId ? recipeData : x))
            // console.log("editing...");
            // console.log(`recipe: ${recipeId}`);
        );
    };

    const deleteRecipe = (recipeId) => {
        setRecipes((state) => state.filter((x) => x._id !== recipeId));
        navigate("/recipes/list");
        // console.log("deleting...");
        // console.log(`recipe: ${recipeId}`);
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
