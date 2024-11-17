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
    // ------------------------------------------------------------------------------------- Language translate ---------------------------------------------------
    const [showTranslateButton, setShowTranslateButton] = useState(false);
    const [userLang, setUserLang] = useState("en");

    const translations = {
        en: "Translate",
        bg: "Преведи",
        es: "Traducir",
        fr: "Traduire",
        de: "Übersetzen",
        it: "Traduci",
        zh: "翻译",
        ja: "翻訳",
        // Add more languages as needed
    };

    useEffect(() => {
        const userLang = navigator.language || navigator.userLanguage;
        if (!userLang.toLowerCase().startsWith("en")) {
            setShowTranslateButton(true);
            setUserLang(userLang);
        }

        const addGoogleTranslateScript = () => {
            if (!window.google) {
                const script = document.createElement("script");
                script.src =
                    "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
                script.async = true;
                document.body.appendChild(script);
            }
        };

        // ----------------------- this keeps the translated page persistent, not sure if is better or not -----------------
        window.googleTranslateElementInit = () => {
            // const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    layout: google.translate.TranslateElement.InlineLayout
                        .SIMPLE,
                    // autoDisplay: isIOS,
                },

                "google_translate_element"
            );
        };
        // -------------------------------------------------------------------------------------------------------------------

        addGoogleTranslateScript();
    }, []);

    const handleTranslateClick = () => {
        if (window.google && window.google.translate) {
            const translateElement =
                new window.google.translate.TranslateElement({
                    pageLanguage: "en",
                    includedLanguages: userLang,
                    layout: google.translate.TranslateElement.InlineLayout
                        .SIMPLE,
                });
            translateElement.showBanner(true);
            const iframe = document.querySelector(
                "iframe.goog-te-banner-frame"
            );
            if (iframe) {
                iframe.contentWindow.document
                    .getElementById(":1.container")
                    .click();
            }
        } else {
            console.warn("Google Translate is not initialized yet.");
        }
    };

    // --------------------------------------------------------------------------------- end of lang translate ----------------------------------------------------

    return (
        <ErrorBoundary>
            <AuthProvider>
                <div className="body">
                    <Navigation />
                    {showTranslateButton && (
                        <>
                            <button
                                onClick={handleTranslateClick}
                                className="translate-button"
                            >
                                {translations[userLang] || translations["en"]}
                            </button>
                            <div id="google_translate_element"></div>
                        </>
                    )}

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
                            <Route
                                path="/auth/:userId/details"
                                element={<ProfileDetails />}
                            />

                            <Route path="/recipes" element={<RecipeList />} />
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

                            {/* redirect old paths back to home */}
                            <Route
                                path="/old-path"
                                element={<Navigate to="/" replace />}
                            />
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
