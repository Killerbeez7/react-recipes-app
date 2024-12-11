/* global google */

// react imports
import { Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { RecipeProvider } from "./contexts/RecipeContext";
// Components
import { Navigation } from "./components/shared/navigation/Navigation";
import { Home } from "./components/home/Home";
import { About } from "./components/about/About";
import { Gallery } from "./components/gallery/Gallery";
import { Forum } from "./components/forum/Forum";
import { Footer } from "./components/shared/footer/Footer";
import { NotFound } from "./components/not-found/NotFound";
import { UserProfile } from "./components/user-profile/UserProfile";
// auth components
import { SignUp } from "./components/auth/sign-up/SignUp";
import { SignIn } from "./components/auth/sign-in/SignIn";
import { Logout } from "./components/auth/logout/Logout";
import { ProfileDetails } from "./components/auth/profile-details/ProfileDetails";
// recipes components
import { RecipeList } from "./components/recipes/recipe-list/RecipeList";
import { RecipeAdd } from "./components/recipes/recipe-add/RecipeAdd";
import { RecipeEdit } from "./components/recipes/recipe-edit/RecipeEdit";
import { RecipeDetails } from "./components/recipes/recipe-details/RecipeDetails";
import { PrivateRoute } from "./components/common/PrivateRoute";
import "./App.css";
// Error Boundary
import { ErrorBoundary } from "./components/common/ErrorBoundary";

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <div className="body">
                    <Navigation />
                    {/* Main content */}
                    <RecipeProvider>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/gallery" element={<Gallery />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/forum" element={<Forum />} />

                            <Route path="/auth/sign-up" element={<SignUp />} />
                            <Route path="/auth/sign-in" element={<SignIn />} />
                            <Route path="/auth/logout" element={<Logout />} />
                            <Route path="/auth/:userId/details" element={<ProfileDetails />} />

                            <Route path="/recipes/all" element={<RecipeList />} />
                            <Route path="/recipes/:category" element={<RecipeList />} />
                            <Route path="/recipes/details/:recipeId" element={<RecipeDetails />} />

                            <Route element={<PrivateRoute />}>
                                <Route path="/recipes/add" element={<RecipeAdd />} />
                                <Route path="/recipes/edit/:recipeId" element={<RecipeEdit />} />
                            </Route>
                            <Route path="/recipes/details/:recipeId" element={<RecipeDetails />} />
                            <Route path="/user/:userId" element={<UserProfile />} />

                            {/* redirect old paths back to home */}
                            <Route path="/old-path" element={<Navigate to="/" replace />} />
                            <Route path="/*" element={<NotFound />} />
                        </Routes>
                    </RecipeProvider>
                    {/* End of main content */}

                    <Footer />
                </div>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
