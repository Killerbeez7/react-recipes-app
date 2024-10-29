import { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import * as recipeService from "../services/recipeService";
import { onValue, ref } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

export const RecipeContext = createContext();

const recipeReducer = (state, action) => {
    switch (action.type) {
        case "ADD_RECIPES":
            return action.payload; // New reference each time new recipes are added
        case "EDIT_RECIPE":
            return state.map((recipe) =>
                recipe.id === action.recipeId ? { ...recipe, ...action.payload } : recipe
            ); // Ensures a new object reference for updated recipe
        case "DELETE_RECIPE":
            return state.filter((recipe) => recipe.id !== action.recipeId); // Creates a new filtered array
        case "ADD_RECIPE":
            return [...state, action.payload]; // New array with the new recipe added
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
        // const newRecipe = await recipeService.create(recipeData);
        // dispatch({ type: 'ADD_RECIPE', payload: newRecipe });
        // return newRecipe;
    };

    const editRecipe = async (recipeId, recipeData) => {
        await recipeService.edit(recipeId, recipeData);
        
        // Fetch the updated recipe after successful edit
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

    return (
        <RecipeContext.Provider
            value={{
                recipes,
                addRecipe,
                editRecipe,
                deleteRecipe,
                selectRecipe,  // Provide `selectRecipe` to the context consumers
            }}
        >
            {children}
        </RecipeContext.Provider>
    );
};
