import { Component } from "react";

export class ErrorBoundary extends Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Unhandled error:", error, errorInfo);
    }

    render() {
        if (this.state.error) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
                    <h1 className="page-title">Something went wrong</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        An unexpected error occurred. Please try reloading the
                        page.
                    </p>
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={() => window.location.assign("/")}
                    >
                        Back to home
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
