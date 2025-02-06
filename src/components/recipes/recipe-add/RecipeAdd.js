import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { storage } from "../../../firebase/firebaseConfig";

import styles from "./RecipeAdd.module.css";

export const RecipeAdd = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { addRecipe } = useContext(RecipeContext);

    // The usual form values
    const [values, setValues] = useState({
        title: "",
        description: "",
        ingredients: "",
        steps: "",
        authorId: currentUser.uid,
        authorName: currentUser.displayName,
        imageUrl: "", // We'll keep this for optional direct URL
        likes: 0,
        timeToCook: "",
        servings: "",
        cuisine: "",
        difficulty: "",
    });

    // The new file upload state
    const [uploadedImage, setUploadedImage] = useState(null);

    // Categories
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // For your tag-style categories
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

    const changeHandler = (e) => {
        setValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCategoryClick = (category) => {
        setCategories((prevCategories) =>
            prevCategories.includes(category)
                ? prevCategories.filter((cat) => cat !== category)
                : [...prevCategories, category]
        );
    };

    // Optional helper for URL validation (only if no file is uploaded)
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch {
            return false;
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Basic required fields check
        if (
            !values.title ||
            !values.description ||
            (!uploadedImage && !values.imageUrl) || // must have EITHER an upload or URL
            !values.timeToCook ||
            !values.servings ||
            !values.cuisine ||
            !values.difficulty ||
            !values.ingredients ||
            !values.steps ||
            categories.length === 0
        ) {
            alert("Please fill in all required fields (including an image).");
            return;
        }

        // Validate numeric fields
        if (isNaN(values.timeToCook) || Number(values.timeToCook) <= 0) {
            alert("Time to cook must be a positive number.");
            return;
        }
        if (isNaN(values.servings) || Number(values.servings) <= 0) {
            alert("Number of servings must be a positive number.");
            return;
        }

        // If no file uploaded, ensure the URL is valid
        if (!uploadedImage && !isValidUrl(values.imageUrl)) {
            alert("Please provide a valid image URL or upload a file.");
            return;
        }

        setIsSubmitting(true);

        try {
            let finalImageUrl = values.imageUrl;

            // If user chose a file, upload it to Firebase Storage
            if (uploadedImage) {
                const fileRef = storageRef(
                    storage,
                    `recipesPictures/${currentUser.uid}/${Date.now()}-${
                        uploadedImage.name
                    }`
                );
                await uploadBytes(fileRef, uploadedImage);
                finalImageUrl = await getDownloadURL(fileRef);
            }

            // Now call addRecipe with final image URL
            await addRecipe({ ...values, categories, imageUrl: finalImageUrl });

            navigate(`/recipes/all`);
        } catch (error) {
            console.error("Error adding recipe:", error);
            alert("There was an error adding the recipe. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles["form-container"]}>
            <h1 className={styles["add-recipe-title"]}>Add Recipe</h1>
            <form id="create" onSubmit={onSubmit}>
                {/* Basic Fields */}
                <div className={styles["form-group"]}>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Recipe title *"
                        value={values.title}
                        onChange={changeHandler}
                    />
                </div>
                <div className={styles["form-group"]}>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Description *"
                        value={values.description}
                        onChange={changeHandler}
                    />
                </div>
                <div className={styles["form-group"]}>
                    <input
                        type="text"
                        id="timeToCook"
                        name="timeToCook"
                        placeholder="Preparation time (min) *"
                        value={values.timeToCook}
                        onChange={changeHandler}
                    />
                </div>
                <div className={styles["form-group"]}>
                    <input
                        type="text"
                        id="servings"
                        name="servings"
                        placeholder="Number of servings *"
                        value={values.servings}
                        onChange={changeHandler}
                    />
                </div>

                <div className={styles["form-group"]}>
                    <input
                        type="text"
                        id="cuisine"
                        name="cuisine"
                        placeholder="Cuisine (e.g., Italian) *"
                        value={values.cuisine}
                        onChange={changeHandler}
                    />
                </div>
                <div className={styles["form-group"]}>
                    <select
                        id="difficulty"
                        name="difficulty"
                        value={values.difficulty}
                        onChange={changeHandler}
                    >
                        <option value="">Select difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                <div className={styles["form-group"]}>
                    <input
                        type="text"
                        id="ingredients"
                        name="ingredients"
                        placeholder="Ingredients (comma separated) *"
                        value={values.ingredients}
                        onChange={changeHandler}
                    />
                </div>
                <div className={styles["form-group"]}>
                    <input
                        type="text"
                        id="steps"
                        name="steps"
                        placeholder="Preparation steps *"
                        value={values.steps}
                        onChange={changeHandler}
                    />
                </div>

                {/* Either Image URL or File Upload */}
                <div className={styles["form-group"]}>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        placeholder="Image URL (optional if uploading a file):"
                        value={values.imageUrl}
                        onChange={changeHandler}
                    />
                </div>
                <div className={styles["form-group"]}>
                    <label>Upload Image File:</label>
                    <div className={styles.fileUploadWrapper}>
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
                        <label
                            htmlFor="file-upload"
                            className={styles.fileUploadLabel}
                        >
                            <i className="fa-solid fa-upload" />
                            <span> Choose Image File</span>
                        </label>
                        {uploadedImage && (
                            <span className={styles.fileName}>
                                {uploadedImage.name}
                            </span>
                        )}
                    </div>
                </div>

                {/* <div className={styles["form-group"]}>
                    <label>Or Upload Image File:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setUploadedImage(e.target.files[0]);
                            } else {
                                setUploadedImage(null);
                            }
                        }}
                    />
                </div> */}

                {/* Categories as Tag-Style Selection */}
                <div className={styles["form-group"]}>
                    <h4>Select Categories:</h4>
                    <div className={styles["tags-container"]}>
                        {availableCategories.map((category) => (
                            <span
                                key={category}
                                className={`${styles.tag} ${
                                    categories.includes(category)
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
                        className={styles["form-input"]}
                        readOnly
                        value={categories.join(", ")}
                    />
                </div>

                {/* Buttons */}
                <div className={styles["buttons-form"]}>
                    <button
                        type="submit"
                        className={styles.btn}
                        disabled={isSubmitting}
                    >
                        Submit
                    </button>
                    <Link className={styles.btn} to={`/recipes/all`}>
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};
