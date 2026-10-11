import { Link } from "react-router-dom";

const items = [
    {
        image: "/assets/salad.jpg",
        label: "Green salad",
        to: "/recipes/vegetarian",
    },
    { image: "/assets/steak.jpg", label: "Steak", to: "/recipes/grilling" },
    { image: "/assets/fish.jpg", label: "Fish", to: "/recipes/dinner" },
    { image: "/assets/pasta.jpg", label: "Pasta", to: "/recipes/dinner" },
    { image: "/assets/cake.jpeg", label: "Cake", to: "/recipes/baking" },
    {
        image: "/assets/icecream.jpg",
        label: "Ice cream",
        to: "/recipes/dessert",
    },
    { image: "/assets/pizza.jpg", label: "Pizza", to: "/recipes/dinner" },
    { image: "/assets/juice.jpg", label: "Juice", to: "/recipes/drinks" },
    { image: "/assets/wine.jpg", label: "Wines", to: "/recipes/drinks" },
];

export const Gallery = () => (
    <div className="page">
        <div className="mx-auto mb-10 max-w-2xl text-center">
            <h1 className="page-title">Gallery</h1>
            <p className="page-subtitle">
                Find the meal you want and learn how to cook it.
            </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ image, label, to }) => (
                <li key={label}>
                    <Link
                        to={to}
                        className="group relative block aspect-[4/3] overflow-hidden rounded-2xl shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                    >
                        <img
                            src={image}
                            alt={label}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/10 to-transparent" />
                        <span className="absolute bottom-4 left-5 font-display text-2xl font-bold text-white">
                            {label}
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);
