import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBarPrivate from "../../components/NavBar/NavBarPrivate";
import { getPostById } from "../../services/post.service.js";
import defaultPostImage from "../../assets/defaultPostImage.png";

export default function PostDetails() {
    const { id } = useParams();

    const [post, setPost] = useState(null);

    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const displayImages = post?.images?.length > 0 ? post.images : [{ url: defaultPostImage }];

    useEffect(() => {

        getPostById(id)
            .then((data) => setPost(data))
            .catch((error) => console.error("Error fetching post:", error));
    }, [id]);

    if (!post) {
        return (
            <>
                <NavBarPrivate />
                <div className="pt-24 p-6 text-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </>
        );
    }

    return (
        <>
            <NavBarPrivate />

            <div className="pt-24 p-6 max-w-3xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-9">
                    {displayImages.map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt={`${post.title} ${index + 1}`}
                            className="w-full h-48 object-cover cursor-pointer transition-all duration-300 hover:scale-110 hover:brightness-110 rounded"
                            onClick={() => setSelectedImageIndex(index)}
                        />
                    ))}

                </div>

                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

                <p className="mb-4">{post.description}</p>

                <p>Category: {post.category}</p>
                <p>Location: {post.location}</p>
                <p>Phone: {post.ownerPhoneNumber}</p>
                <p className="font-semibold">Price: {post.price} EUR</p>
            </div>

            {selectedImageIndex !== null && (
                <div
                    className="fixed inset-0 bg-neutral/70 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setSelectedImageIndex(null)}
                >
                    {displayImages.length > 1 && (
                        <button
                            className="btn btn-circle absolute left-6"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImageIndex((oldIndex) =>
                                    oldIndex === 0 ? displayImages.length - 1 : oldIndex - 1
                                );
                            }}
                        >
                            ❮
                        </button>
                    )}

                    <img
                        src={displayImages[selectedImageIndex].url}
                        alt="Full size"
                        className="max-w-[90vw] max-h-[90vh] rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {displayImages.length > 1 && (
                        <button
                            className="btn btn-circle absolute right-6"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImageIndex((oldIndex) =>
                                    oldIndex === displayImages.length - 1 ? 0 : oldIndex + 1
                                );
                            }}
                        >
                            ❯
                        </button>
                    )}
                </div>
            )}
        </>
    )

}