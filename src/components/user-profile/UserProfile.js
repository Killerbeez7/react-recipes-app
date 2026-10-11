import { useEffect, useState, useContext } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams, Link } from "react-router-dom";
import { UserX } from "lucide-react";
import { db } from "../../firebase/firebaseConfig";
import { RecipeContext } from "../../contexts/RecipeContext";
import { getAverageRating } from "../../utils/recipe";
import { RecipeGrid } from "../recipes/recipe-grid/RecipeGrid";
import { Avatar } from "../ui/Avatar";
import { PageLoader } from "../ui/Loader";
import { EmptyState } from "../ui/EmptyState";

export const UserProfile = () => {
    const { userId } = useParams();
    const { recipes } = useContext(RecipeContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;
        setLoading(true);
        getDoc(doc(db, "users", userId))
            .then(
                (snapshot) =>
                    !ignore &&
                    setUserData(snapshot.exists() ? snapshot.data() : null)
            )
            .catch((error) => console.error("Error fetching user data:", error))
            .finally(() => !ignore && setLoading(false));
        return () => {
            ignore = true;
        };
    }, [userId]);

    if (loading) return <PageLoader />;

    if (!userData) {
        return (
            <div className="page max-w-2xl">
                <EmptyState
                    icon={UserX}
                    title="User not found"
                    action={
                        <Link to="/" className="btn-primary">
                            Back to home
                        </Link>
                    }
                />
            </div>
        );
    }

    const userRecipes = recipes.filter((r) => r.authorId === userId);
    const totalLikes = userRecipes.reduce(
        (sum, r) => sum + (r.likeCount || 0),
        0
    );
    const rated = userRecipes.filter(
        (r) => Object.keys(r.ratings || {}).length
    );
    const avgRating = rated.length
        ? rated.reduce((sum, r) => sum + getAverageRating(r.ratings), 0) /
          rated.length
        : 0;
    const name = userData.username || userData.displayName || "Unknown user";

    const stats = [
        {
            value: userRecipes.length,
            label: userRecipes.length === 1 ? "Recipe" : "Recipes",
        },
        { value: totalLikes, label: totalLikes === 1 ? "Like" : "Likes" },
        { value: avgRating ? avgRating.toFixed(1) : "—", label: "Avg. rating" },
    ];

    return (
        <div>
            <div className="h-40 bg-gradient-to-r from-brand-500 via-brand-400 to-amber-300 dark:from-brand-700 dark:via-brand-600 dark:to-amber-600 sm:h-52" />

            <div className="container">
                <div className="-mt-16 flex flex-col items-center text-center sm:-mt-20">
                    <Avatar
                        src={userData.profilePicture}
                        name={name}
                        size="xl"
                        className="ring-4 ring-neutral-50 dark:ring-neutral-950"
                    />
                    <h1 className="page-title mt-4">{name}</h1>
                    {userData.bio && (
                        <p className="mt-2 max-w-xl text-neutral-600 dark:text-neutral-400">
                            {userData.bio}
                        </p>
                    )}

                    <dl className="card mt-8 grid w-full max-w-lg grid-cols-3 divide-x divide-neutral-200 dark:divide-neutral-800">
                        {stats.map(({ value, label }) => (
                            <div key={label} className="px-4 py-5">
                                <dt className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                                    {label}
                                </dt>
                                <dd className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
                                    {value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <section className="py-12">
                    <h2 className="section-title mb-6">Recipes by {name}</h2>
                    {userRecipes.length ? (
                        <RecipeGrid recipes={userRecipes} />
                    ) : (
                        <p className="text-neutral-600 dark:text-neutral-400">
                            No recipes published yet.
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
};
