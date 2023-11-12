import { Link } from 'react-router-dom';

export const RecipeItem = ({ recipe }) => {
    return (
        <>
            <h3
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontStyle: 'italic',
                    marginBottom: 10,
                }}
            >
                Time to cook: {recipe.timeToCook} min
            </h3>
            <li
                className="recipe-list-item-wrapper"
                style={{ maxHeight: 200, maxWidth: 750 }}
            >
                <div
                    className="recipe-image-wrapper"
                    style={{ maxHeight: 150, maxWidth: 150 }}
                >
                    <img
                        alt=""
                        src={`/${recipe.imageUrl}`}
                        className="recipe-img"
                        style={{ maxHeight: 150, maxWidth: 150 }}
                    />
                </div>
                <div className="recipe-content-wrapper">
                    <div className="recipe-name-wrapper">
                        <h3>{recipe.name}</h3>
                    </div>
                    <div className="recipe-description-wrapper">
                        <h3>{recipe.description}</h3>
                    </div>
                    <div className="recipe-description-wrapper">
                        <h3>{recipe.ingredients}</h3>
                    </div>
                    <div className="recipe-description-wrapper">
                        <h4>Steps: {recipe.steps}</h4>
                    </div>
                </div>

                <Link
                    to={`/recipes/details/${recipe._id}`}
                    className="view-recipe-btn"
                >
                    view
                </Link>
            </li>
        </>
    );
};
