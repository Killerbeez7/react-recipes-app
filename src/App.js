import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
// Services
import * as recipeService from "./services/recipeService";
// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { RecipeContext } from "./contexts/RecipeContext";
// Components
import { Navigation } from "./components/shared/navigation/Navigation";
import { Home } from "./components/home/Home";
import { About } from "./components/about/About";
import { Contacts } from "./components/contacts/Contacts";
import { Footer } from "./components/shared/footer/Footer";
import { NotFound } from "./components/not-found/NotFound";
import { Register } from "./components/auth/register/Register";
import { Login } from "./components/auth/login/Login";
import { Logout } from "./components/auth/logout/Logout";
import { RecipeList } from "./components/recipes/recipe-list/RecipeList";
import { RecipeAdd } from "./components/recipes/recipe-add/RecipeAdd";
import { RecipeEdit } from "./components/recipes/recipe-edit/RecipeEdit";
import { RecipeDetails } from "./components/recipes/recipe-details/RecipeDetails";
import "./App.css";

function App() {
    const [recipes, setRecipes] = useState([]);
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

    useEffect(() => {
        recipeService.getAll().then((result) => {
            setRecipes(Object.values(result));
        });
    }, []);

    return (
        <AuthProvider>
            <div className="body">
                <Navigation />

                {/* Main content */}
                <RecipeContext.Provider
                    value={{
                        recipes,
                        addRecipe,
                        editRecipe,
                        deleteRecipe,
                        addComment,
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contacts" element={<Contacts />} />

                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/logout" element={<Logout />} />

                        <Route
                            path="/recipes/list"
                            element={<RecipeList recipes={recipes} />}
                        />

                        <Route path="/recipes/add" element={<RecipeAdd />} />
                        <Route
                            path="/recipes/edit/:recipeId"
                            element={<RecipeEdit />}
                        />
                        <Route
                            path="/recipes/details/:recipeId"
                            element={<RecipeDetails recipes={recipes} />}
                        />

                        <Route path="/*" element={<NotFound />} />
                    </Routes>
                </RecipeContext.Provider>
                {/* End of main content */}

                <Footer />
            </div>
        </AuthProvider>
    );
}

export default App;
