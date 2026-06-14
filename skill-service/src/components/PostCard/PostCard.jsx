import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase.config.js";
import { deletePost } from "../../services/post.service.js";
import defaultPostImage from "../../assets/defaultPostImage.png";

export default function PostCard({ post, variant = "public", onEdit, onDelete }) {

    const navigate = useNavigate();

    const isPrivate = variant === "private";

    const user = auth.currentUser;

    const isOwner = user && user.uid === post.ownerId;

    const showActions = isPrivate && isOwner;

    const handleCardClick = () => {
        const user = auth.currentUser;

        if (!user) {
            navigate("/login");
            return;
        }
        navigate(`/posts/${post._id}`);
    }

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this service?");

        if (!confirmDelete) return;

        try {
            await deletePost(post._id);
            alert("Post deleted successfully");
            if (onDelete) onDelete(post._id);

        } catch (err) {
            console.error("Error deleting post", err);
            alert("Failed to delete service");
        }
    };

    return (
        <div className="card bg-base-100 shadow-md h-full cursor-pointer hover:shadow-xl transition"
            onClick={handleCardClick}>
            <div className="card-body flex flex-col">

                <img
                    src={post.images?.[0]?.url || defaultPostImage}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                />

                <h2 className="card-title">{post.title}</h2>

                <p className="line-clamp-3">{post.description}</p>

                <p>Category: {post.category}</p>

                <p>Location: {post.location}</p>

                {isPrivate && (
                    <>
                        <p>Phone: {post.ownerPhoneNumber}</p>

                        <p className="font-semibold">
                            Price: {post.price} EUR</p>

                    </>
                )}

                {showActions && (
                    <div className="card-actions justify-end mt-auto">
                        <button className="btn btn-sm btn-outline" onClick={(e) => {
                            e.stopPropagation();
                            onEdit(post);
                        }}>
                            Edit
                        </button>

                        <button className="btn btn-sm btn-error" onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();
                        }}>
                            Delete
                        </button>
                    </div>

                )}

            </div>
        </div>
    );

}