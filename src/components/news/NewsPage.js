import { NavLink } from "react-router-dom";
import { NEWS } from "../../constants/categories";

export const NewsPage = ({ title, intro, articles }) => (
    <div className="page max-w-5xl">
        <nav
            aria-label="News sections"
            className="-mx-1 mb-8 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
            {NEWS.map(({ path, label }) => (
                <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                        `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                            isActive
                                ? "bg-brand-600 text-white"
                                : "bg-white text-neutral-700 shadow-sm ring-1 ring-neutral-200 hover:text-brand-700 dark:bg-neutral-900 dark:text-neutral-300 dark:ring-neutral-800 dark:hover:text-brand-300"
                        }`
                    }
                >
                    {label}
                </NavLink>
            ))}
        </nav>

        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle max-w-2xl">{intro}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
            {articles.map(({ title: heading, text, tag }) => (
                <article key={heading} className="card flex flex-col p-6">
                    {tag && (
                        <span className="badge self-start bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                            {tag}
                        </span>
                    )}
                    <h2 className="mt-3 text-xl font-semibold leading-snug">
                        {heading}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                        {text}
                    </p>
                    <p className="mt-6 text-xs font-medium uppercase tracking-wide text-neutral-400">
                        Full story coming soon
                    </p>
                </article>
            ))}
        </div>
    </div>
);
