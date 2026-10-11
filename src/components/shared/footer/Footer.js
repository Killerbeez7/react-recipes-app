import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Logo } from "../../ui/Logo";

const quickLinks = [
    { to: "/recipes/all", label: "Recipes" },
    { to: "/gallery", label: "Gallery" },
    { to: "/forum", label: "Forum" },
    { to: "/about", label: "About us" },
];

const socialLinks = [
    { href: "https://facebook.com", label: "Facebook" },
    { href: "https://instagram.com", label: "Instagram" },
    { href: "https://pinterest.com", label: "Pinterest" },
    { href: "https://x.com", label: "X (Twitter)" },
];

const headingClass =
    "text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-white";
const linkClass =
    "text-sm text-neutral-600 transition-colors hover:text-brand-600 dark:text-neutral-400 dark:hover:text-brand-400";

export const Footer = () => {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const onSubscribe = (e) => {
        e.preventDefault();
        setSubscribed(true);
        setEmail("");
    };

    return (
        <footer className="mt-16 border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 print:hidden">
            <div className="container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
                <div className="lg:col-span-1">
                    <Logo />
                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                        Your recipe library. Discover, share and save the dishes
                        you love.
                    </p>
                </div>

                <div>
                    <h2 className={headingClass}>Quick links</h2>
                    <ul className="mt-4 space-y-2.5">
                        {quickLinks.map(({ to, label }) => (
                            <li key={to}>
                                <Link to={to} className={linkClass}>
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className={headingClass}>Follow us</h2>
                    <ul className="mt-4 space-y-2.5">
                        {socialLinks.map(({ href, label }) => (
                            <li key={href}>
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={linkClass}
                                >
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className={headingClass}>Newsletter</h2>
                    <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                        Get our latest recipes and updates in your inbox.
                    </p>
                    {subscribed ? (
                        <p className="alert-success mt-4">
                            Thanks for subscribing!
                        </p>
                    ) : (
                        <form
                            onSubmit={onSubscribe}
                            className="mt-4 flex gap-2"
                        >
                            <label
                                htmlFor="newsletter-email"
                                className="sr-only"
                            >
                                Email address
                            </label>
                            <input
                                id="newsletter-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="input min-w-0 flex-1"
                            />
                            <button
                                type="submit"
                                className="btn-primary shrink-0"
                            >
                                Subscribe
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800">
                <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-neutral-500 dark:text-neutral-400 sm:flex-row">
                    <p>
                        © {new Date().getFullYear()} Eat &amp; Amare. All rights
                        reserved.
                    </p>
                    <p className="flex items-center gap-1">
                        Made with
                        <Heart
                            className="h-3.5 w-3.5 fill-red-500 text-red-500"
                            aria-label="love"
                        />
                        — enjoy your meal!
                    </p>
                </div>
            </div>
        </footer>
    );
};
