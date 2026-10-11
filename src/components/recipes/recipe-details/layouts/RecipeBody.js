import { ClassicLayout } from "./ClassicLayout";
import { CookModeLayout } from "./CookModeLayout";

const layouts = {
    classic: ClassicLayout,
    cook: CookModeLayout,
};

// Ingredients + steps: the classic view, or cook mode on desktop
export const RecipeBody = ({ layout, ...props }) => {
    const Layout = layouts[layout] || ClassicLayout;
    return <Layout {...props} />;
};
