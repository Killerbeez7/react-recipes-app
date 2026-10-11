import { useContext } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
// context
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { RecipeContext, RecipeProvider } from "./contexts/RecipeContext";
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
import { SavedRecipes } from "./components/recipes/saved-recipes/SavedRecipes";
import { SeasonalRecipes } from "./components/seasonal-recipes/SeasonalRecipes";
// news
import { FoodAndNutrition } from "./components/news/food-and-nutrition/FoodAndNutrition";
import { FoodCultureAndTravel } from "./components/news/food-culture-and-travel/FoodCultureAndTravel";
import { CookingTipsAndTricks } from "./components/news/cooking-tips-and-tricks/CookingTipsAndTricks";
import { InterviewsAndSpotlight } from "./components/news/interviews-and-spotlight/InterviewsAndSpotlight";

const MainLayout = () => {
    const { error } = useContext(RecipeContext);

    return (
        <div className="flex min-h-screen flex-col">
            <Navigation />
            {error && (
                <div
                    role="alert"
                    className="border-b border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
                >
                    <p className="container flex items-center gap-2 py-3 text-sm">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        We couldn't reach the recipe database. Recipes may be
                        missing — please try again later.
                    </p>
                </div>
            )}
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <ScrollToTopButton />
        </div>
    );
};

function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <AuthProvider>
                    <RecipeProvider>
                        <Routes>
                            {/* auth pages render without navigation & footer */}
                            <Route path="/auth/sign-in" element={<SignIn />} />
                            <Route path="/auth/sign-up" element={<SignUp />} />
                            <Route path="/auth/logout" element={<Logout />} />

                            <Route element={<MainLayout />}>
                                {/* common */}
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/forum" element={<Forum />} />
                                <Route path="/gallery" element={<Gallery />} />

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
                                <Route
                                    path="/recipes/seasonal/:season"
                                    element={<SeasonalRecipes />}
                                />
                                <Route
                                    path="/profile/:userId"
                                    element={<UserProfile />}
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

                                {/* signed-in users only */}
                                <Route element={<PrivateRoute />}>
                                    <Route
                                        path="/recipes/add"
                                        element={<RecipeAdd />}
                                    />
                                    <Route
                                        path="/recipes/edit/:recipeId"
                                        element={<RecipeEdit />}
                                    />
                                    <Route
                                        path="/recipes/saved-recipes/:userId"
                                        element={<SavedRecipes />}
                                    />
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
                                        element={<AccountManagement />}
                                    />
                                    <Route
                                        path="/admin-panel"
                                        element={<AdminPanel />}
                                    />
                                </Route>

                                <Route path="*" element={<NotFound />} />
                            </Route>
                        </Routes>
                    </RecipeProvider>
                </AuthProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
