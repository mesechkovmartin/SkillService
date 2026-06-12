import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBarPrivate from "../../components/NavBar/NavBarPrivate";
import { getPostById } from "../../services/post.service.js";
import defaultPostImage from "../../assets/defaultPostImage.png";

export default function PostDetails() {
    const { id } = useParams();

    const [post, setPost] = useState(null);

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {

        getPostById(id)
            .then((data) => setPost(data))
            .catch((error) => console.error("Error fetching post:", error));
    }, [id]);

    if (!post) {
        return (
            <>
                <NavBarPrivate />
                <div className="p-6 text-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </>
        );
    }

    return (
        <>
            <NavBarPrivate />

            <div className="p-6 max-w-3xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-9">
                    {(post.images?.length > 0 ? post.images : [{ url: defaultPostImage }]).map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt={`${post.title} ${index + 1}`}
                            className="w-full h-48 object-cover cursor-pointer transition-all duration-300 hover:scale-110 hover:brightness-110 rounded"
                            onClick={() => setSelectedImage(image.url)}
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

            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={selectedImage}
                        alt="Full size"
                        className="max-w-[90vw] max-h-[90vh] rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    )

}