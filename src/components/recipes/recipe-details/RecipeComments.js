import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import { MessageCircle, Pencil, Trash2 } from "lucide-react";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { Avatar } from "../../ui/Avatar";

const timeAgo = (iso) => {
    try {
        return formatDistanceToNow(parseISO(iso), { addSuffix: true });
    } catch {
        return "";
    }
};

export const RecipeComments = ({ recipeId, comments }) => {
    const { currentUser } = useAuth();
    const { addComment, editComment, deleteComment } =
        useContext(RecipeContext);

    const [text, setText] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const sorted = Object.entries(comments || {}).sort(([, a], [, b]) =>
        (a.createdAt || "").localeCompare(b.createdAt || "")
    );

    const reset = () => {
        setText("");
        setEditingId(null);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const value = text.trim();
        if (!value) return;

        setIsSaving(true);
        setError("");
        try {
            if (editingId) {
                await editComment(recipeId, editingId, { text: value });
            } else {
                await addComment(recipeId, {
                    text: value,
                    userId: currentUser.uid,
                    username: currentUser.displayName || currentUser.email,
                    userPhoto: currentUser.photoURL || "",
                });
            }
            reset();
        } catch (error) {
            console.error("Error saving comment:", error);
            setError("Couldn't save your comment. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const onDelete = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?"))
            return;
        setError("");
        try {
            await deleteComment(recipeId, commentId);
            if (editingId === commentId) reset();
        } catch (error) {
            console.error("Error deleting comment:", error);
            setError("Couldn't delete the comment. Please try again.");
        }
    };

    return (
        <section aria-labelledby="comments-title">
            <h2
                id="comments-title"
                className="section-title flex items-center gap-2"
            >
                Comments
                <span className="badge bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    {sorted.length}
                </span>
            </h2>

            {currentUser ? (
                <form onSubmit={onSubmit} className="mt-6 flex gap-3">
                    <Avatar
                        src={currentUser.photoURL}
                        name={currentUser.displayName || currentUser.email}
                        size="sm"
                        className="mt-1 hidden sm:inline-flex"
                    />
                    <div className="flex-1">
                        <label htmlFor="comment" className="sr-only">
                            {editingId
                                ? "Edit your comment"
                                : "Write a comment"}
                        </label>
                        <textarea
                            id="comment"
                            rows={3}
                            className="input resize-y"
                            placeholder="Made it? Share how it went, or a tip for others..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div className="mt-3 flex items-center justify-end gap-2">
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="btn-ghost"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={!text.trim() || isSaving}
                            >
                                {editingId ? "Update comment" : "Post comment"}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <p className="mt-4 rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
                    <Link
                        to="/auth/sign-in"
                        state={{ from: `/recipes/details/${recipeId}` }}
                        className="link"
                    >
                        Sign in
                    </Link>{" "}
                    to join the conversation.
                </p>
            )}

            {error && <p className="alert-error mt-4">{error}</p>}

            {sorted.length === 0 ? (
                <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-neutral-300 px-6 py-10 text-center dark:border-neutral-700">
                    <MessageCircle
                        className="h-6 w-6 text-neutral-400"
                        aria-hidden="true"
                    />
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        No comments yet — be the first to share your thoughts!
                    </p>
                </div>
            ) : (
                <ul className="mt-8 divide-y divide-neutral-200 dark:divide-neutral-800">
                    {sorted.map(([key, comment]) => (
                        <li
                            key={key}
                            className="group flex gap-3 py-5 first:pt-0"
                        >
                            <Link
                                to={`/profile/${comment.userId}`}
                                className="shrink-0"
                            >
                                <Avatar
                                    src={comment.userPhoto}
                                    name={comment.username}
                                    size="sm"
                                />
                            </Link>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start gap-2">
                                    <div className="min-w-0 flex-1">
                                        <Link
                                            to={`/profile/${comment.userId}`}
                                            className="text-sm font-semibold text-neutral-900 hover:text-brand-600 dark:text-neutral-100 dark:hover:text-brand-400"
                                        >
                                            {comment.username || "Anonymous"}
                                        </Link>
                                        {comment.createdAt && (
                                            <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                                                {timeAgo(comment.createdAt)}
                                                {comment.updatedAt &&
                                                    " · edited"}
                                            </span>
                                        )}
                                    </div>
                                    {currentUser?.uid === comment.userId && (
                                        <span className="-mt-1 flex shrink-0 gap-0.5 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                                            <button
                                                type="button"
                                                className="btn-icon h-8 w-8"
                                                aria-label="Edit comment"
                                                onClick={() => {
                                                    setEditingId(key);
                                                    setText(comment.text);
                                                    document
                                                        .getElementById(
                                                            "comment"
                                                        )
                                                        ?.focus();
                                                }}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-icon h-8 w-8 hover:text-red-600 dark:hover:text-red-400"
                                                aria-label="Delete comment"
                                                onClick={() => onDelete(key)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1 whitespace-pre-line break-words text-sm leading-6 text-neutral-700 dark:text-neutral-300">
                                    {comment.text}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};
