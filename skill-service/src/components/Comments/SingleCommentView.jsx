import { useState, useEffect } from "react";
import { getUserById } from "../../services/user.service.js";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

export default function SingleCommentView({ comment }) {
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        async function loadAuthor() {
            try {
                const user = await getUserById(comment.authorId);
                setAuthor(user);
            } catch (error) {
                setAuthor({
                    username: "Unknown User",
                    email: "",
                    profileImage: ""
                });

            }
        }

        loadAuthor();
    }, [comment.authorId]);

    const displayName = author
        ? author.username || author.email
        : "Loading...";

    const avatarLetter = displayName.charAt(0).toUpperCase();

    const formattedDate = new Date(comment.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });

    return (
        <div className="card bg-base-100 shadow-sm border border-base-200 p-6">
            <div className="flex items-start mb-4 gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center overflow-hidden shrink-0">
                    {author?.profileImage ? (
                        <img
                            src={author.profileImage}
                            alt={displayName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="font-bold">
                            {avatarLetter}
                        </span>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="font-semibold">
                                {displayName}
                            </h3>

                            <p className="text-sm text-gray-400">
                                {formattedDate}
                            </p>
                        </div>
                        <button className="btn btn-ghost btn-sm btn-circle">
                            <HiOutlineDotsHorizontal size={18} />
                        </button>
                    </div>

                    <p className="mt-2 text-gray-700 leading-relaxed">
                        {comment.text}
                    </p>
                </div>
            </div>
        </div>
    );
}