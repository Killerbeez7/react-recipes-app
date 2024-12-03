import React, { useState, useEffect } from "react";
import { getComments, postComment } from "../../services/commentService";
import styles from "./Comments.module.css";

export const Comments = ({ recipeId, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        if (recipeId) {
            getComments(recipeId).then((data) => {
                setComments(data || []);
            });
        }
    }, [recipeId]);

    const handlePostComment = async () => {
        if (!newComment.trim()) return;

        const commentData = {
            text: newComment,
            user: currentUser.displayName,
            photoURL: currentUser.photoURL,
            timestamp: new Date().toISOString(),
        };

        try {
            await postComment(recipeId, commentData);
            setComments((prevComments) => [...prevComments, commentData]);
            setNewComment("");
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
