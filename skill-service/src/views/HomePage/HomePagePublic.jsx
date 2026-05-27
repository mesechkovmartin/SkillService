import { useEffect, useState } from 'react';
import NavBarPublic from '../../components/NavBar/NavBarPublic';
import { getAllPosts } from '../../services/post.service';
import PostCard from '../../components/PostCard/PostCard';

export default function HomePagePublic() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getAllPosts()
            .then((data) => setPosts(data))
            .catch((error) => console.error("Error fetching posts:", error));
    }, []);

    return (
        <>
            <NavBarPublic />

            <div className="p-6">

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-4">
                        Skill Service
                    </h1>

                    <p className="text-lg text-gray-500">
                        Connect with local experts and find the help you need
                    </p>
                </div>

                {posts.length === 0 ? (
                    <p className="text-center">
                        No services available at the moment. Please check back later.
                    </p>
                ) : (
                    <div className="grid gap6 md:grid-cols-5">
                        {posts.map((post) => (
                            <PostCard key={post._id} post={post} variant="public" />
                        ))}
                    </div>
                )}

            </div>
        </>
    );
}