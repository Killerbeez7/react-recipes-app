import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logo } from "../../ui/Logo";

export const AuthLayout = ({ title, subtitle, backTo = "/", children }) => {
    const navigate = useNavigate();

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* Image panel */}
            <div className="relative hidden lg:block">
                <img
                    src="/assets/background/bg.png"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/30 to-neutral-950/80" />
                <div className="relative flex h-full flex-col justify-between p-12 text-white">
                    <Logo onDark />
                    <div>
                        <p className="font-display text-4xl font-bold leading-tight text-white">
                            Welcome to Eat &amp; Amare
                        </p>
                        <p className="mt-3 max-w-md text-lg text-white/80">
                            Discover, share and save the recipes you love.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form panel */}
            <div className="flex flex-col bg-white px-4 py-8 dark:bg-neutral-900 sm:px-8">
                <button
                    type="button"
                    onClick={() => navigate(backTo)}
                    className="btn-ghost -ml-3 self-start px-3"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </button>

                <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
                    <h1 className="page-title">{title}</h1>
                    {subtitle && <p className="page-subtitle">{subtitle}</p>}
                    <div className="mt-8">{children}</div>
                </div>
            </div>
        </div>
    );
};
