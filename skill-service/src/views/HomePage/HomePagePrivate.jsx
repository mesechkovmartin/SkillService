import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../store/app.context"
import NavBarPrivate from "../../components/NavBar/NavBarPrivate"
import { getAllPosts } from "../../services/post.service"
import PostCard from "../../components/PostCard/PostCard"
import { categories } from "../../constants/categories"
import CategoryCard from "../../components/CategoryCard/CategoryCard"

export default function HomePagePrivate() {
    const { user } = useContext(AppContext);

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
            <NavBarPrivate />

            <div className="pt-24 p-6">

                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold">
                        Welcome, {user.firstName || user.email}
                    </h2>
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
    )
}