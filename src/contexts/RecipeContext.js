import { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import * as recipeService from "../services/recipeService";
import { onValue, ref } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

export const RecipeContext = createContext();

const recipeReducer = (state, action) => {
    switch (action.type) {
        case "ADD_RECIPES":
            return action.payload;
        case "EDIT_RECIPE":
            return state.map((x) => (x.id === action.recipeId ? action.payload : x));
        case "DELETE_RECIPE":
            return state.filter((x) => x.id !== action.recipeId);
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
            const recipesArray = recipesData ? Object.values(recipesData) : [];
            dispatch({ type: "ADD_RECIPES", payload: recipesArray });
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    const addRecipe = async (recipeData) => {
        await recipeService.create(recipeData);
        navigate("/recipes/list"); // Navigate after adding the recipe
    };

    const editRecipe = async (recipeId, recipeData) => {
        await recipeService.edit(recipeId, recipeData);
        navigate(`/recipes/list`);
    };

    const deleteRecipe = async (recipeId) => {
        await recipeService.del(recipeId);
        navigate("/recipes/list");
    };

    return (
        <RecipeContext.Provider
            value={{
                recipes,
                addRecipe,
                editRecipe,
                deleteRecipe,
            }}
        >
            {children}
        </RecipeContext.Provider>
    );
};
