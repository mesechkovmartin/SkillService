import { useState, useEffect } from "react";
import { auth } from "../../config/firebase.config.js";
import { createComment, getCommentsByPostId } from "../../services/comment.service.js";
import SingleCommentView from "./SingleCommentView.jsx";

export default function PostComments({ postId }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        async function loadComments() {
            try {
                const data = await getCommentsByPostId(postId);
                setComments(data);
            } catch (error) {
                console.error("Failed to load comments:", error);
            }
        }

        loadComments();
    }, [postId]);

    const handleCreateComment = async () => {
        if (!text.trim()) return;

        try {
            const newComment = await createComment({
                postId,
                authorId: auth.currentUser.uid,
                text:text.trim()
            });

            setComments((prevComments) => [newComment, ...prevComments]);
            setText("");
        } catch (error) {
            console.error("Failed to create comment:", error);
        }
    };

    return (
        <section className="mt-12">
            <h2 className="text-3xl font-bold mb-6">Comments</h2>

            <div className="card bg-base-100 shadow-sm border border-base-200 p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Write a Comment</h3>

                <textarea
                    className="textarea textarea-bordered w-full min-h-28"
                    placeholder="Share your experience with this service..." 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <div className="flex justify-end mt-4">
                    <button
                        className="btn btn-primary"
                        onClick={handleCreateComment}
                        disabled={!text.trim()}
                    >
                        Post Comment
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className="text-gray-500">
                        No comments yet. Be the first to comment.
                    </p>
                ) : (
                    comments.map((comment) => (
                        <SingleCommentView
                            key={comment._id}
                            comment={comment}
                        />
                    ))
                )}
            </div>
        </section>
    )
}