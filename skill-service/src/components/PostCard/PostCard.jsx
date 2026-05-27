import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase.config.js";

export default function PostCard({ post, variant = "public", onEdit}) {

    const navigate = useNavigate();

    const isPrivate = variant === "private";

    const user = auth.currentUser;

    const isOwner = user && user.uid === post.ownerId;

    const showActions = isPrivate && isOwner;

    const handleDetailsClick = () => {
    
        if (!user) {
            navigate("/login");
            return;
        }

        navigate(`/posts/${posts._id}`);
    };

    return (
        <div className="card bg-base-100 shadow-md">
            <div className="card-body">

                <h2 className="card-title">{post.title}</h2>

                <p>{post.description}</p>

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
                    <div className="card-actions justify-end mt-4">
                        <button className="btn btn-sm btn-outline" onClick={() => onEdit(post)}>
                            Edit
                        </button>

                        <button className="btn btn-sm btn-error">
                            Delete
                        </button>
                    </div>

                )}

                {!isPrivate && (
                    <button className="btn btn-primary btn-sm mt-4"
                        onClick={handleDetailsClick}
                    >
                        View Details
                    </button>
                )}

            </div>
        </div>
    );

}