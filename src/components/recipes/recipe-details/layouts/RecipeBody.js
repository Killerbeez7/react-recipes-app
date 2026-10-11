import { ClassicLayout } from "./ClassicLayout";
import { CookModeLayout } from "./CookModeLayout";
import { CookbookLayout } from "./CookbookLayout";
import { PrepBoardLayout } from "./PrepBoardLayout";

const layouts = {
    classic: ClassicLayout,
    cook: CookModeLayout,
    cookbook: CookbookLayout,
    board: PrepBoardLayout,
};

// Ingredients + steps, rendered in the chosen layout
export const RecipeBody = ({ layout, ...props }) => {
    const Layout = layouts[layout] || ClassicLayout;
    return <Layout {...props} />;
};
