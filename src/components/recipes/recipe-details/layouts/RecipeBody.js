import { ClassicLayout } from "./ClassicLayout";
import { CookModeLayout } from "./CookModeLayout";
import { PrepBoardLayout } from "./PrepBoardLayout";

const layouts = {
    classic: ClassicLayout,
    cook: CookModeLayout,
    board: PrepBoardLayout,
};

// Ingredients + steps, rendered in the chosen layout
export const RecipeBody = ({ layout, ...props }) => {
    const Layout = layouts[layout] || ClassicLayout;
    return <Layout {...props} />;
};
