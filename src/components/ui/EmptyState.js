export const EmptyState = ({ icon: Icon, title, children, action }) => (
    <div className="card flex flex-col items-center px-6 py-16 text-center">
        {Icon && (
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                <Icon className="h-7 w-7" aria-hidden="true" />
            </div>
        )}
        <h2 className="text-lg font-semibold">{title}</h2>
        {children && (
            <p className="mt-2 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
                {children}
            </p>
        )}
        {action && <div className="mt-6">{action}</div>}
    </div>
);
