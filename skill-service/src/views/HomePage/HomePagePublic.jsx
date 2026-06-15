import { useEffect, useState } from 'react';
import NavBarPublic from '../../components/NavBar/NavBarPublic';
import { getAllPosts } from '../../services/post.service';
import PostCard from '../../components/PostCard/PostCard';
import { categories } from '../../constants/categories';
import CategoryCard from '../../components/CategoryCard/CategoryCard';

export default function HomePagePublic() {

    const [posts, setPosts] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const filteredPosts = selectedCategory ? posts.filter(post => post.category === selectedCategory) : posts;

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

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-4">
                        Browse Categories
                    </h1>

                    <p className="text-lg text-gray-500">
                        Find professionals for every need
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category}
                            category={category}
                            selectedCategory={selectedCategory}
                            onSelect={(category) => {
                                if (selectedCategory === category) {
                                    setSelectedCategory(null);
                                } else {
                                    setSelectedCategory(category);
                                }
                            }}
                        />
                    ))}
                </div>

                 <div className="divider"></div>

                 <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-4">
                        Featured Services
                    </h1>

                    <p className="text-lg text-gray-500">
                        Top-rated professionals rigth now
                    </p>
                </div>

                {filteredPosts.length === 0 ? (
                    <p className="text-center">
                        No services available in this category.
                    </p>
                ) : (
                    <div className="grid gap-5 md:grid-cols-5">
                        {filteredPosts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                variant="public"
                            />
                        ))}
                    </div>
                )}

            </div>

        </>
    );
}