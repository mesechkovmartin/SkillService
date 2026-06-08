import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBarPrivate from "../../components/NavBar/NavBarPrivate";
import { getPostById } from "../../services/post.service.js";
import defaultPostImage from "../../assets/defaultPostImage.png";

export default function PostDetails() {
    const { id } = useParams();

    const [post, setPost] = useState(null);

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
                <img
                    src={post.imageUrl || defaultPostImage}
                    alt={post.title}
                    className="w-full h-80 object-cover rounded-xl mb-6"
                />

                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

                <p classsName="mb-4">{post.description}</p>

                <p>Category: {post.category}</p>
                <p>Location: {post.location}</p>
                <p>Phone: {post.ownerPhoneNumber}</p>
                <p className="font-semibold">Price: {post.price} EUR</p>
            </div>

        </>
    )


}