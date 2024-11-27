import React, { useState, useEffect } from "react";
import { getComments, postComment } from "../../services/commentService"; // Adjust path if necessary
import styles from "./Comments.module.css";

export const Comments = ({ recipeId, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    // Fetch comments when the component mounts or recipeId changes
    useEffect(() => {
        if (recipeId) {
            getComments(recipeId).then((data) => {
                setComments(data || []); // Ensure we handle null or undefined gracefully
            });
        }
    }, [recipeId]);

    // Handle posting a new comment
    const handlePostComment = async () => {
        if (!newComment.trim()) return; // Prevent empty comments

        const commentData = {
            text: newComment,
            user: currentUser.displayName,
            photoURL: currentUser.photoURL,
            timestamp: new Date().toISOString(),
        };

        try {
            await postComment(recipeId, commentData); // Add comment to database
            setComments((prevComments) => [...prevComments, commentData]); // Update local state
            setNewComment(""); // Clear input field
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    return (
        <div className={styles.commentsSection}>
            <h3>Comments</h3>
            <div className={styles.commentInput}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                />
                <button onClick={handlePostComment}>Post</button>
            </div>
            <div className={styles.commentList}>
                {comments.map((comment, index) => (
                    <div key={index} className={styles.comment}>
                        <img
                            src={comment.photoURL || "/default-avatar.png"}
                            alt={`${comment.user}'s avatar`}
                            className={styles.avatar}
                        />
                        <div>
                            <strong>{comment.user}</strong>
                            <p>{comment.text}</p>
                            <small>{new Date(comment.timestamp).toLocaleString()}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
