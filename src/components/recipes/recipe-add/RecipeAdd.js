import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "./RecipeAdd.module.css";

export const RecipeAdd = () => {
  const { currentUser } = useAuth();
  const [values, setValues] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    authorId: currentUser.uid,
    imageUrl: "",
    likes: 0,
    timeToCook: "",
    servings: "",
    cuisine: "",
    difficulty: "",
  });

  // Manage chosen categories as tag-style selections.
  const [categories, setCategories] = useState([]);
  const { addRecipe } = useContext(RecipeContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setValues((state) => ({
      ...state,
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
    if (isSubmitting) return;

    // Check that every required field has a value.
    if (
      !values.title ||
      !values.description ||
      !values.imageUrl ||
      !values.timeToCook ||
      !values.servings ||
      !values.cuisine ||
      !values.difficulty ||
      !values.ingredients ||
      !values.steps ||
      categories.length === 0
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (isNaN(values.timeToCook) || Number(values.timeToCook) <= 0) {
      alert("Time to cook must be a positive number");
      return;
    }
    if (isNaN(values.servings) || Number(values.servings) <= 0) {
      alert("Number of servings must be a positive number");
      return;
    }
    if (!isValidUrl(values.imageUrl)) {
      alert("Please provide a valid URL for the image");
      return;
    }

    setIsSubmitting(true);

    try {
      await addRecipe({ ...values, categories });
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
            placeholder="Recipe title"
            value={values.title}
            onChange={changeHandler}
          />
        </div>
        <div className={styles["form-group"]}>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="Description"
            value={values.description}
            onChange={changeHandler}
          />
        </div>
        <div className={styles["form-group"]}>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            placeholder="Image URL"
            value={values.imageUrl}
            onChange={changeHandler}
          />
        </div>
        <div className={styles["form-group"]}>
          <input
            type="text"
            id="timeToCook"
            name="timeToCook"
            placeholder="Time to Cook (min)"
            value={values.timeToCook}
            onChange={changeHandler}
          />
        </div>
        <div className={styles["form-group"]}>
          <input
            type="text"
            id="servings"
            name="servings"
            placeholder="Number of servings"
            value={values.servings}
            onChange={changeHandler}
          />
        </div>
        {/* Additional Fields */}
        <div className={styles["form-group"]}>
          <input
            type="text"
            id="cuisine"
            name="cuisine"
            placeholder="Cuisine (e.g., Italian)"
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
            placeholder="Ingredients (comma separated)"
            value={values.ingredients}
            onChange={changeHandler}
          />
        </div>
        <div className={styles["form-group"]}>
          <input
            type="text"
            id="steps"
            name="steps"
            placeholder="Preparation steps"
            value={values.steps}
            onChange={changeHandler}
          />
        </div>
        {/* Categories as Tag-Style Selection */}
        <div className={styles["form-group"]}>
          <h4>Select Categories:</h4>
          <div className={styles["tags-container"]}>
            {availableCategories.map((category) => (
              <span
                key={category}
                className={`${styles.tag} ${
                  categories.includes(category) ? styles.selected : ""
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
          <button type="submit" className={styles.btn} disabled={isSubmitting}>
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
