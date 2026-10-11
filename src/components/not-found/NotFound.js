import { Link } from "react-router-dom";

export const NotFound = () => (
    <div className="page flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="font-display text-7xl font-bold text-brand-600">404</p>
        <h1 className="page-title mt-4">Page not found</h1>
        <p className="page-subtitle">
            The page you are looking for does not exist.
        </p>
        <Link to="/" className="btn-primary mt-8">
            Go back home
        </Link>
    </div>
);
