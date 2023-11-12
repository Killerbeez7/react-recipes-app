import { Link } from 'react-router-dom';
import { RecipeItem } from '../recipe-item/RecipeItem';

export const RecipeList = ({ recipes }) => {
    return (
        <>
            <form style={{ marginLeft: '3%' }}>
                <Link to="/recipes/add" className="add-btn">
                    Add recipe
                </Link>
            </form>
            <ul className="recipe-list-wrapper" style={{ width: `${100}%` }}>
                {recipes.length > 0 ? (
                    recipes.map((x) => <RecipeItem key={x._id} recipe={x} />)
                ) : (
                    <h1>No recipes yet!</h1>
                )}
            </ul>
        </>
    );
};
