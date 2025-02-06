import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { RecipeContext } from "../../../contexts/RecipeContext";
import * as recipeService from "../../../services/recipeService";
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { storage } from "../../../firebase/firebaseConfig";

import styles from "./RecipeEdit.module.css";

export const RecipeEdit = () => {
    const { editRecipe } = useContext(RecipeContext);
    const { recipeId } = useParams();
    const navigate = useNavigate();

    const [currentRecipe, setCurrentRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    // For categories
    const [selectedCategories, setSelectedCategories] = useState([]);

    // For a possible new uploaded file
    const [uploadedImage, setUploadedImage] = useState(null);

    // Same categories as in RecipeAdd
    const availableCategories = [
        "breakfast",
        "lunch",
        "appetizers",
        "dinner",
        "dessert",
        "drinks",
        "side-dish",
        "grilling",
        "microwave",
        "easy",
        "slow",
        "fryer",
        "instant-pot",
        "baking",
        "vegetarian",
    ];

    const handleCategoryClick = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((cat) => cat !== category)
                : [...prev, category]
        );
    };

    // -----------------------------------------
    // Load recipe data on mount
    // -----------------------------------------
    useEffect(() => {
        (async () => {
            try {
                const recipeData = await recipeService.getOne(recipeId);
                if (recipeData) {
                    setCurrentRecipe({ id: recipeId, ...recipeData });
                    if (recipeData.categories) {
                        // If stored as a string, convert to array
                        if (typeof recipeData.categories === "string") {
                            setSelectedCategories(
                                recipeData.categories
                                    .split(",")
                                    .map((cat) => cat.trim())
                            );
                        } else {
                            setSelectedCategories(recipeData.categories);
                        }
                    }
                } else {
                    alert("Recipe not found");
                    navigate("/recipes/all");
                }
            } catch (error) {
                console.error("Error fetching recipe details:", error);
                alert(
                    "There was an error fetching the recipe details. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        })();
    }, [recipeId, navigate]);

    // Optional helper for verifying URLs (only if user doesn't upload a file)
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch {
            return false;
        }
    };

    // -----------------------------------------
    // Handle form submission
    // -----------------------------------------
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!currentRecipe) return;

        // Get all text fields via FormData
        const formData = new FormData(e.target);
        const updatedData = Object.fromEntries(formData);

        // Convert categories array back into a string
        updatedData.categories = selectedCategories.join(", ");

        // If the user does NOT upload a new file, we keep the old imageUrl
        // So let's store the existing one first:
        let finalImageUrl = currentRecipe.imageUrl;

        // Basic validation
        if (
            !updatedData.title ||
            !updatedData.description ||
            !updatedData.timeToCook ||
            !updatedData.servings ||
            !updatedData.cuisine ||
            !updatedData.difficulty ||
            !updatedData.ingredients ||
            !updatedData.steps ||
            !updatedData.categories
        ) {
            alert("Please fill in all required fields");
            return;
        }

        // Validate numeric fields
        if (
            isNaN(updatedData.timeToCook) ||
            Number(updatedData.timeToCook) <= 0
        ) {
            alert("Time to cook must be a positive number");
            return;
        }
        if (isNaN(updatedData.servings) || Number(updatedData.servings) <= 0) {
            alert("Number of servings must be a positive number");
            return;
        }

        // If we have a newly uploaded file, we upload it
        if (uploadedImage) {
            try {
                const imgRef = storageRef(
                    storage,
                    `recipes/${Date.now()}-${uploadedImage.name}`
                );
                await uploadBytes(imgRef, uploadedImage);
                finalImageUrl = await getDownloadURL(imgRef);
            } catch (uploadError) {
                console.error("Error uploading new image:", uploadError);
                alert(
                    "There was an error uploading the image. Please try again."
                );
                return;
            }
        } else {
            // If NO new file is uploaded, we rely on the "imageUrl" text field
            // If the user typed a new imageUrl, we can override finalImageUrl
            if (
                updatedData.imageUrl &&
                updatedData.imageUrl !== currentRecipe.imageUrl
            ) {
                if (!isValidUrl(updatedData.imageUrl)) {
                    alert("Please provide a valid URL for the image.");
                    return;
                }
                finalImageUrl = updatedData.imageUrl.trim();
            }
        }

        // Build final object to update
        const recipeToUpdate = {
            title: updatedData.title.trim(),
            description: updatedData.description.trim(),
            imageUrl: finalImageUrl.trim(),
            timeToCook: updatedData.timeToCook.trim(),
            servings: updatedData.servings.trim(),
            cuisine: updatedData.cuisine.trim(),
            difficulty: updatedData.difficulty.trim(),
            ingredients: updatedData.ingredients.trim(),
            steps: updatedData.steps.trim(),
            categories: updatedData.categories.trim(),
        };

        // Update in DB
        try {
            await recipeService.edit(recipeId, recipeToUpdate);
            // Update local context
            editRecipe(recipeId, recipeToUpdate);
            navigate(`/recipes/details/${recipeId}`);
        } catch (error) {
            console.error("Error updating the recipe:", error);
            alert("There was an error updating the recipe. Please try again.");
        }
    };

    // -----------------------------------------
    // UI Renders
    // -----------------------------------------
    if (loading) return <p>Loading...</p>;
    if (!currentRecipe) return <p>Recipe not found.</p>;

    return (
        <div className={styles["edit-form-container"]}>
            <h1 className={styles["edit-recipe-title"]}>Edit Recipe</h1>

            <form id="edit" onSubmit={onSubmit}>
                {/* Title */}
                <div className={styles["edit-form-group"]}>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        defaultValue={currentRecipe.title}
                    />
                </div>

                {/* Description */}
                <div className={styles["edit-form-group"]}>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        defaultValue={currentRecipe.description}
                    />
                </div>

                {/* Cuisine */}
                <div className={styles["edit-form-group"]}>
                    <input
                        type="text"
                        id="cuisine"
                        name="cuisine"
                        placeholder="Cuisine"
                        defaultValue={currentRecipe.cuisine || ""}
                    />
                </div>

                {/* Difficulty */}
                <div className={styles["edit-form-group"]}>
                    <input
                        type="text"
                        id="difficulty"
                        name="difficulty"
                        placeholder="Difficulty (e.g., Easy, Medium, Hard)"
                        defaultValue={currentRecipe.difficulty || ""}
                    />
                </div>

                {/* Servings */}
                <div className={styles["edit-form-group"]}>
                    <input
                        type="text"
                        id="servings"
                        name="servings"
                        placeholder="Servings"
                        defaultValue={currentRecipe.servings}
                    />
                </div>

                {/* Time to Cook */}
                <div className={styles["edit-form-group"]}>
                    <input
                        type="number"
                        id="timeToCook"
                        name="timeToCook"
                        placeholder="Time to Cook (min)"
                        defaultValue={currentRecipe.timeToCook}
                    />
                </div>

                {/* Ingredients */}
                <div className={styles["edit-form-group"]}>
                    <input
                        type="text"
                        id="ingredients"
                        name="ingredients"
                        placeholder="Ingredients (comma separated)"
                        defaultValue={currentRecipe.ingredients}
                    />
                </div>

                {/* Steps */}
                <div className={styles["edit-form-group"]}>
                    <input
                        type="text"
                        id="steps"
                        name="steps"
                        placeholder="Steps"
                        defaultValue={currentRecipe.steps}
                    />
                </div>

                {/* Existing or new image URL */}
                <div className={styles["edit-form-group"]}>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        placeholder="Image URL"
                        defaultValue={currentRecipe.imageUrl}
                    />
                </div>

                {/* Either Image URL or File Upload */}
                <div className={styles["form-group"]}>
                    <label
                        htmlFor="file-upload"
                        className={styles.fileUploadWrapper}
                    >
                        <i className="fa-solid fa-upload" />
                        <span style={{ marginLeft: "8px" }}>
                            Choose Image File
                        </span>

                        {/* The hidden native file input */}
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className={styles.fileInput}
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setUploadedImage(e.target.files[0]);
                                } else {
                                    setUploadedImage(null);
                                }
                            }}
                        />

                        {/* Show chosen file name (if any) */}
                        {uploadedImage && (
                            <span className={styles.fileName}>
                                {uploadedImage.name}
                            </span>
                        )}
                    </label>
                </div>

                {/* Categories (tag-style) */}
                <div className={styles["edit-form-group"]}>
                    <h4>Select Categories:</h4>
                    <div className={styles["tags-container"]}>
                        {availableCategories.map((category) => (
                            <span
                                key={category}
                                className={`${styles.tag} ${
                                    selectedCategories.includes(category)
                                        ? styles.selected
                                        : ""
                                }`}
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category}
                            </span>
                        ))}
                    </div>
                    <input
                        type="text"
                        name="categories"
                        placeholder="Selected Categories"
                        readOnly
                        value={selectedCategories.join(", ")}
                    />
                </div>

                {/* Buttons */}
                <div className={styles["edit-buttons-form"]}>
                    <button type="submit" className={styles["edit-btn"]}>
                        Submit
                    </button>
                    <Link
                        className={styles["edit-btn"]}
                        to={`/recipes/details/${recipeId}`}
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};
