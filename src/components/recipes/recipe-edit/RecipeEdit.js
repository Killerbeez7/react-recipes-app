import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { RecipeContext } from "../../../contexts/RecipeContext";
import * as recipeService from "../../../services/recipeService";
import styles from "./RecipeEdit.module.css";

export const RecipeEdit = () => {
  const { editRecipe } = useContext(RecipeContext);
  const { recipeId } = useParams();
  const navigate = useNavigate();

  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  // Manage selected categories as tag-style selections.
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Use the same available categories as in RecipeAdd.
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

  useEffect(() => {
    (async () => {
      try {
        const recipeData = await recipeService.getOne(recipeId);
        if (recipeData) {
          setCurrentRecipe({ id: recipeId, ...recipeData });
          if (recipeData.categories) {
            if (typeof recipeData.categories === "string") {
              setSelectedCategories(
                recipeData.categories.split(",").map((cat) => cat.trim())
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
        alert("There was an error fetching the recipe details. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, [recipeId, navigate]);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let recipeData = Object.fromEntries(formData);

    // Use selectedCategories for categories.
    recipeData.categories = selectedCategories.join(", ");

    // Require all fields.
    if (
      !recipeData.title ||
      !recipeData.description ||
      !recipeData.imageUrl ||
      !recipeData.timeToCook ||
      !recipeData.servings ||
      !recipeData.cuisine ||
      !recipeData.difficulty ||
      !recipeData.ingredients ||
      !recipeData.steps ||
      !recipeData.categories
    ) {
      alert("Please fill in all required fields");
      return;
    }

    recipeData = {
      title: recipeData.title.trim(),
      description: recipeData.description.trim(),
      imageUrl: recipeData.imageUrl.trim(),
      timeToCook: recipeData.timeToCook.trim(),
      servings: recipeData.servings.trim(),
      cuisine: recipeData.cuisine.trim(),
      difficulty: recipeData.difficulty.trim(),
      ingredients: recipeData.ingredients.trim(),
      steps: recipeData.steps.trim(),
      categories: recipeData.categories.trim(),
    };

    if (isNaN(recipeData.timeToCook) || Number(recipeData.timeToCook) <= 0) {
      alert("Time to cook must be a positive number");
      return;
    }
    if (isNaN(recipeData.servings) || Number(recipeData.servings) <= 0) {
      alert("Number of servings must be a positive number");
      return;
    }
    if (!isValidUrl(recipeData.imageUrl)) {
      alert("Please provide a valid URL for the image");
      return;
    }

    try {
      await recipeService.edit(recipeId, { ...recipeData });
      editRecipe(recipeId, recipeData);
      navigate(`/recipes/details/${recipeId}`);
    } catch (error) {
      console.error("Error updating the recipe:", error);
      alert("There was an error updating the recipe. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!currentRecipe) return <p>Recipe not found.</p>;

  return (
    <div className={styles["edit-form-container"]}>
      <h1 className={styles["edit-recipe-title"]}>Edit Recipe</h1>
      <form id="edit" onSubmit={onSubmit}>
        {/* Basic Info */}
        <div className={styles["edit-form-group"]}>
          <input  
            type="text"
            id="title"
            name="title"
            placeholder="Title"
            defaultValue={currentRecipe.title}
          />
        </div>
        <div className={styles["edit-form-group"]}>
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            defaultValue={currentRecipe.description}
          />
        </div>
        {/* Additional Fields */}
        <div className={styles["edit-form-group"]}>
          <input  
            type="text"
            id="cuisine"
            name="cuisine"
            placeholder="Cuisine"
            defaultValue={currentRecipe.cuisine || ""}
          />
        </div>
        <div className={styles["edit-form-group"]}>
          <input  
            type="text"
            id="difficulty"
            name="difficulty"
            placeholder="Difficulty (e.g., Easy, Medium, Hard)"
            defaultValue={currentRecipe.difficulty || ""}
          />
        </div>
        <div className={styles["edit-form-group"]}>
          <input
            type="text"
            id="servings"
            name="servings"
            placeholder="Servings"
            defaultValue={currentRecipe.servings}
          />
        </div>
        <div className={styles["edit-form-group"]}>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            placeholder="Image URL"
            defaultValue={currentRecipe.imageUrl}
          />
        </div>
        <div className={styles["edit-form-group"]}>
          <input
            type="number"
            id="timeToCook"
            name="timeToCook"
            placeholder="Time to Cook (min)"
            defaultValue={currentRecipe.timeToCook}
          />
        </div>
        <div className={styles["edit-form-group"]}>
          <input
            type="text"
            id="ingredients"
            name="ingredients"
            placeholder="Ingredients (comma separated)"
            defaultValue={currentRecipe.ingredients}
          />
        </div>
        <div className={styles["edit-form-group"]}>
          <input
            type="text"
            id="steps"
            name="steps"
            placeholder="Steps"
            defaultValue={currentRecipe.steps}
          />
        </div>
        {/* Categories as Tag-Style Selection */}
        <div className={styles["edit-form-group"]}>
          <h4>Select Categories:</h4>
          <div className={styles["tags-container"]}>
            {availableCategories.map((category) => (
              <span
                key={category}
                className={`${styles.tag} ${
                  selectedCategories.includes(category) ? styles.selected : ""
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
          <Link className={styles["edit-btn"]} to={`/recipes/details/${recipeId}`}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};
