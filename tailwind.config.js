const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx}", "./public/index.html"],
    darkMode: "class",
    theme: {
        container: {
            center: true,
            padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
            screens: { "2xl": "1280px" },
        },
        extend: {
            colors: {
                // Brand accent: warm orange used for links, buttons and highlights
                brand: colors.orange,
                // Neutral surface/text scale (warm grey suits food imagery)
                neutral: colors.stone,
            },
            fontFamily: {
                sans: ["Roboto", ...defaultTheme.fontFamily.sans],
                display: [
                    '"Playfair Display"',
                    ...defaultTheme.fontFamily.serif,
                ],
            },
            boxShadow: {
                card: "0 1px 2px 0 rgb(28 25 23 / 0.04), 0 4px 16px -4px rgb(28 25 23 / 0.08)",
                "card-hover":
                    "0 2px 4px 0 rgb(28 25 23 / 0.06), 0 12px 28px -6px rgb(28 25 23 / 0.16)",
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
