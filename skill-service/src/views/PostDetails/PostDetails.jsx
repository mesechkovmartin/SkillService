import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBarPrivate from "../../components/NavBar/NavBarPrivate";
import { getPostById } from "../../services/post.service.js";
import defaultPostImage from "../../assets/defaultPostImage.png";
import { createOrGetConversation } from "../../services/conversation.service.js";
import { auth } from "../../config/firebase.config.js";
import Footer from "../../components/Footer/Footer.jsx";
import PostComments from "../../components/Comments/PostComments.jsx";
import ServiceLocationMap from "../../components/Map/ServiceLocationMap.jsx";

export default function PostDetails() {
    const { id } = useParams();

    const [post, setPost] = useState(null);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const displayImages = post?.images?.length > 0 ? post.images : [{ url: defaultPostImage }];

    const navigate = useNavigate();

    useEffect(() => {

        getPostById(id)
            .then((data) => {
                setPost(data);
                setSelectedImageIndex(0);
            })
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

    const handleMessageOwner = async () => {
        if (auth.currentUser.uid === post.ownerId) {
            return;
        }
        try {
            const conversation = await createOrGetConversation(
                auth.currentUser.uid,
                post.ownerId
            );

            navigate("/messages", {
                state: { conversationId: conversation._id },
            })

        } catch (error) {
            console.error("Failed to create conversation:", error);
        }
    };

    return (
        <>
            <NavBarPrivate />

            <div className="pt-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <img
                                src={displayImages[selectedImageIndex].url}
                                alt={post.title}
                                className="w-full h-[520px] object-cover rounded-2xl"
                            />

                            {displayImages.length > 1 && (
                                <>
                                    <button
                                        className="btn btn-circle absolute left-4 top-1/2 -translate-y-1/2"
                                        onClick={() =>
                                            setSelectedImageIndex((prev) =>
                                                prev === 0 ? displayImages.length - 1 : prev - 1
                                            )
                                        }
                                    >
                                        ❮
                                    </button>

                                    <button
                                        className="btn btn-circle absolute right-4 top-1/2 -translate-y-1/2"
                                        onClick={() =>
                                            setSelectedImageIndex((prev) =>
                                                prev === displayImages.length - 1 ? 0 : prev + 1
                                            )
                                        }
                                    >
                                        ❯
                                    </button>
                                </>
                            )}

                            {displayImages.length > 1 && (
                                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                    {selectedImageIndex + 1} / {displayImages.length}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-4">
                            {displayImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={`${post.title} ${index + 1}`}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`h-28 w-full object-cover rounded-xl cursor-pointer border-2 ${selectedImageIndex === index
                                        ? "border-primary"
                                        : "border-transparent"
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="mt-8">
                            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                            <p className="mb-4">{post.description}</p>
                            
                        </div>

                        <ServiceLocationMap location={post.location} />

                        <PostComments postId={post._id} />
                    </div>

                    <div className="lg:col-span-1">
                        <div className="card bg-base-100 shadow-md p-6 sticky top-24">
                            <p className="text-3xl font-bold mb-4">
                                {post.price} EUR
                            </p>
                            <p>Category: {post.category}</p>
                            <p>Location: {post.location?.city}</p>
                            <p>Phone: {post.ownerPhoneNumber}</p>

                            {auth.currentUser.uid !== post.ownerId && (
                                <button
                                    className="btn btn-primary w-full"
                                    onClick={handleMessageOwner}
                                >
                                    Message owner
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )

}