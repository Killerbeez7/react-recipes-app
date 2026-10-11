import { Link } from "react-router-dom";
import { BookOpen, Heart, Users } from "lucide-react";

const values = [
    {
        icon: BookOpen,
        title: "A shared library",
        text: "Every recipe is written by a home cook and free for everyone to read.",
    },
    {
        icon: Users,
        title: "A friendly community",
        text: "Rate, comment and swap tips to help each other cook better.",
    },
    {
        icon: Heart,
        title: "Made with love",
        text: "Eat & Amare — eat and love — is about the joy of good food.",
    },
];

export const About = () => (
    <div className="page max-w-4xl">
        <h1 className="page-title">About Eat &amp; Amare</h1>
        <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
            Eat &amp; Amare is a recipe library built by and for people who love
            to cook. Discover new dishes, save your favourites and share the
            recipes that make your kitchen special.
        </p>

        <ul className="mt-12 grid gap-6 sm:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
                <li key={title} className="card p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                        <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 font-semibold">{title}</h2>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        {text}
                    </p>
                </li>
            ))}
        </ul>

        <div className="mt-12 flex flex-wrap gap-3">
            <Link to="/recipes/all" className="btn-primary">
                Browse recipes
            </Link>
            <Link to="/auth/sign-up" className="btn-secondary">
                Join the community
            </Link>
        </div>
    </div>
);
