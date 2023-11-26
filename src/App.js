// import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { RecipeProvider } from "./contexts/RecipeContext";
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

// const Register = lazy(() => import("./components/auth/register/Register"));

function App() {
    return (
        <AuthProvider>
            <div className="body">
                <Navigation />

                {/* Main content */}
                <RecipeProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/register" element={<Register />} />
                        {/* <Route
                            path="/register"
                            element={
                                <Suspense fallback={<span>Loading...</span>}>
                                    <Register />
                                </Suspense>
                            }
                        /> */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/logout" element={<Logout />} />

                        <Route path="/recipes/list" element={<RecipeList />} />

                        <Route path="/recipes/add" element={<RecipeAdd />} />
                        <Route
                            path="/recipes/edit/:recipeId"
                            element={<RecipeEdit />}
                        />
                        <Route
                            path="/recipes/details/:recipeId"
                            element={<RecipeDetails />}
                        />

                        <Route path="/*" element={<NotFound />} />
                    </Routes>
                </RecipeProvider>
                {/* End of main content */}

                <Footer />
            </div>
        </AuthProvider>
    );
}

export default App;
