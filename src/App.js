import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// context
import { AuthProvider } from "./contexts/AuthContext";
import { RecipeProvider } from "./contexts/RecipeContext";
// common
import { Home } from "./components/home/Home";
import { About } from "./components/about/About";
import { Forum } from "./components/forum/Forum";
import { Gallery } from "./components/gallery/Gallery";
import { Footer } from "./components/shared/footer/Footer";
import { Navigation } from "./components/shared/navigation/Navigation";
// auth
import { Logout } from "./components/auth/logout/Logout";
import { SignIn } from "./components/auth/sign-in/SignIn";
import { SignUp } from "./components/auth/sign-up/SignUp";
import { ProfileDetails } from "./components/auth/profile-details/ProfileDetails";
import { AccountManagement } from "./components/auth/account-management/AccountManagement";
// utils
import { DarkMode } from "./components/utils/DarkMode";
import { NotFound } from "./components/not-found/NotFound";
import { Settings } from "./components/utils/settings/settings";
import { PrivateRoute } from "./components/common/PrivateRoute";
import { AdminPanel } from "./components/admin-panel/AdminPanel";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { UserProfile } from "./components/user-profile/UserProfile";
import { ScrollToTopButton } from "./components/utils/scroll-to-top-button/ScrollToTopButton";
// recipes CRUD
import { RecipeAdd } from "./components/recipes/recipe-add/RecipeAdd";
import { RecipeEdit } from "./components/recipes/recipe-edit/RecipeEdit";
import { RecipeList } from "./components/recipes/recipe-list/RecipeList";
import { RecipeDetails } from "./components/recipes/recipe-details/RecipeDetails";
// saved recipes
import { SavedRecipes } from "./components/recipes/saved-recipes/SavedRecipes";
// seasonal recipes
import { FallRecipes } from "./components/seasonal-recipes/fall-recipes/FallRecipes";
import { SpringRecipes } from "./components/seasonal-recipes/spring-recipes/SpringRecipes";
import { SummerRecipes } from "./components/seasonal-recipes/summer-recipes/SummerRecipes";
import { WinterRecipes } from "./components/seasonal-recipes/winter-recipes/WinterRecipes";
// news
import { FoodAndNutrition } from "./components/news/food-and-nutrition/FoodAndNutrition";
import { FoodCultureAndTravel } from "./components/news/food-culture-and-travel/FoodCultureAndTravel";
import { CookingTipsAndTricks } from "./components/news/cooking-tips-and-tricks/CookingTipsAndTricks";
import { InterviewsAndSpotlight } from "./components/news/interviews-and-spotlight/InterviewsAndSpotlight";
// styles
import "./App.css";

function App() {
    const { darkMode, toggleTheme } = DarkMode();

    // hide Navigation and Footer on sign in/out
    const currentLocation = useLocation();
    const hideNavigationAndFooter = ["/auth/sign-in", "/auth/sign-up"];
    const isHidden = hideNavigationAndFooter.includes(currentLocation.pathname);

    return (
        <ErrorBoundary>
            <AuthProvider>
                <div className="body">
                    <RecipeProvider>
                        {/* conditionally render Navigation */}
                        {!isHidden && <Navigation />}
                        {/* main content */}
                        <Routes>
                            {/* admin panel*/}
                            <Route
                                path="/admin-panel"
                                element={<AdminPanel />}
                            />

                            {/* common */}
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/forum" element={<Forum />} />
                            <Route path="/gallery" element={<Gallery />} />

                            {/* auth */}
                            <Route path="/auth/logout" element={<Logout />} />
                            <Route path="/auth/sign-in" element={<SignIn />} />
                            <Route path="/auth/sign-up" element={<SignUp />} />
                            <Route
                                path="/auth/settings"
                                element={<Settings />}
                            />
                            <Route
                                path="/auth/:userId/edit-profile"
                                element={<ProfileDetails />}
                            />
                            <Route
                                path="/auth/:userId/account-management"
                                element={
                                    <AccountManagement
                                        toggleTheme={toggleTheme}
                                        darkMode={darkMode}
                                    />
                                }
                            />
                            <Route
                                path="/recipes/saved-recipes/:userId"
                                element={<SavedRecipes />}
                            />
                            {/* recipes */}
                            <Route
                                path="/recipes/all"
                                element={<RecipeList />}
                            />
                            <Route
                                path="/recipes/:category"
                                element={<RecipeList />}
                            />
                            <Route
                                path="/recipes/details/:recipeId"
                                element={<RecipeDetails />}
                            />

                            {/* seasonal */}
                            <Route
                                path="/recipes/seasonal/fall"
                                element={<FallRecipes />}
                            />
                            <Route
                                path="/recipes/seasonal/spring"
                                element={<SpringRecipes />}
                            />
                            <Route
                                path="/recipes/seasonal/summer"
                                element={<SummerRecipes />}
                            />
                            <Route
                                path="/recipes/seasonal/winter"
                                element={<WinterRecipes />}
                            />

                            {/* news */}
                            <Route
                                path="/news/food-and-nutrition"
                                element={<FoodAndNutrition />}
                            />
                            <Route
                                path="/news/food-culture-and-travel"
                                element={<FoodCultureAndTravel />}
                            />
                            <Route
                                path="/news/cooking-tips-and-tricks"
                                element={<CookingTipsAndTricks />}
                            />
                            <Route
                                path="/news/interviews-and-spotlights"
                                element={<InterviewsAndSpotlight />}
                            />

                            {/* CRUD */}
                            <Route element={<PrivateRoute />}>
                                <Route
                                    path="/recipes/add"
                                    element={<RecipeAdd />}
                                />
                                <Route
                                    path="/recipes/edit/:recipeId"
                                    element={<RecipeEdit />}
                                />
                            </Route>
                            <Route
                                path="/recipes/details/:recipeId"
                                element={<RecipeDetails />}
                            />
                            <Route
                                path="/profile/:userId"
                                element={<UserProfile />}
                            />

                            {/* redirect old paths back to home */}
                            <Route
                                path="/old-path"
                                element={<Navigate to="/" replace />}
                            />
                            <Route path="/*" element={<NotFound />} />
                        </Routes>
                    </RecipeProvider>
                    <ScrollToTopButton />
                    {/* end of main content */}
                    <ScrollToTopButton />
                    {/* Conditionally render Footer */}
                    {!isHidden && <Footer />}
                </div>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
