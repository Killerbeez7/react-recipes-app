import { Link } from "react-router-dom";
import { MessagesSquare } from "lucide-react";
import { EmptyState } from "../ui/EmptyState";

export const Forum = () => (
    <div className="page max-w-2xl">
        <EmptyState
            icon={MessagesSquare}
            title="The forum is coming soon!"
            action={
                <Link to="/recipes/all" className="btn-primary">
                    Browse recipes
                </Link>
            }
        >
            Soon you'll be able to ask questions, swap tips and chat with other
            cooks. Until then, join the conversation in the recipe comments.
        </EmptyState>
    </div>
);
