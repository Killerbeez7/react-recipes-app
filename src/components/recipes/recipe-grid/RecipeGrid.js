import { RecipeItem } from "../recipe-item/RecipeItem";

export const RecipeGrid = ({ recipes, children }) => (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {children}
        {recipes.map((recipe) => (
            <li key={recipe.id}>
                <RecipeItem recipe={recipe} />
            </li>
        ))}
    </ul>
);
