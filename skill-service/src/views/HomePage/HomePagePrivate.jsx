import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../store/app.context"
import NavBarPrivate from "../../components/NavBar/NavBarPrivate"
import { getAllPosts } from "../../services/post.service"
import PostCard from "../../components/PostCard/PostCard"

export default function HomePagePrivate() {
    const { user } = useContext(AppContext);

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getAllPosts()
            .then((data) => setPosts(data))
            .catch((error) => console.error("Error fetching posts:", error));
    }, []);

    return (
        <>
            <NavBarPrivate />

            <div className="p-6">

                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold">
                        Welcome, {user.firstName || user.email}
                    </h2>
                </div>

                {posts.length === 0 ? (
                    <p className="text-center">
                        No services available at the moment. Please check back later.
                    </p>
                ) : (
                    <div className="grid gap-5 md:grid-cols-5">
                        {posts.map((post) => (
                            <PostCard key={post._id} post={post} variant="public"/>
                        ))}
                    </div>
                )}

            </div>
        </>
    )
}