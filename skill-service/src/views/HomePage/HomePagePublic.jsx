import { useEffect, useState } from 'react';
import NavBarPublic from '../../components/NavBar/NavBarPublic';
import { getAllPosts } from '../../services/post.service';
import PostCard from '../../components/PostCard/PostCard';
import { categories } from '../../constants/categories';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import HeroSearch from '../../components/HeroSearch/HeroSearch';
import HowItWorks from '../../components/HowItWorks/HowItWorks';

export default function HomePagePublic() {

    const [posts, setPosts] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);

//CityInput only for the select.
// cityResult for filtering.
    const [searchInput, setSearchInput] = useState("");
    const [searchResult, setSearchResult] = useState("");
    const [cityInput, setCityInput] = useState("");
    const [cityResult, setCityResult] = useState("");

    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        getAllPosts()
            .then((data) => setPosts(data))
            .catch((error) => console.error("Error fetching posts:", error));
    }, []);

    const searchFilteredPosts = posts.filter((post) => {
        const search = searchResult.trim().toLowerCase();

        const matchesSearch = search
            ? post.title.toLowerCase().includes(search) ||
            post.description.toLowerCase().includes(search) ||
            post.category.toLowerCase().includes(search)
            : true;

        const matchesCity = cityResult
            ? post.location === cityResult
            : true;

        return matchesSearch && matchesCity;
    });

    const categoryFilteredPosts = selectedCategory
        ? posts.filter((post) => post.category === selectedCategory)
        : [];

    // Until i make rating system
    const featuredPosts = posts.slice(0, 5);

    return (
        <>
            <NavBarPublic />

            <div className="pt-24 p-6">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-4">
                        Skill Service
                    </h1>

                    <p className="text-lg text-gray-500">
                        Connect with local experts and find the help you need
                    </p>
                </div>

                <HeroSearch
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    cityInput={cityInput}
                    setCityInput={setCityInput}
                    onSearch={(value) => {
                        setSearchResult(value);
                        setCityResult(cityInput);
                        setHasSearched(true);
                        setSelectedCategory(null);
                    }}
                />

                {hasSearched && (
                    <>
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-bold mb-4">
                                Search Results
                            </h1>
                        </div>

                        {searchFilteredPosts.length === 0 ? (
                            <p className="text-center">
                                No services found.
                            </p>
                        ) : (
                            <div className="grid gap-5 md:grid-cols-5 mb-10">
                                {searchFilteredPosts.map((post) => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        variant="public"
                                    />
                                ))}
                            </div>
                        )}

                        <div className="divider"></div>
                    </>
                )}

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

                                setSearchInput("");
                                setSearchResult("");
                                setCityInput("");
                                setHasSearched(false);
                            }}
                        />
                    ))}
                </div>

                {selectedCategory && (
                    <>
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-bold mb-4">
                                {selectedCategory} Services
                            </h1>
                        </div>

                        {categoryFilteredPosts.length === 0 ? (
                            <p className="text-center">
                                No services available in this category.
                            </p>
                        ) : (
                            <div className="grid gap-5 md:grid-cols-5 mb-10">
                                {categoryFilteredPosts.map((post) => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        variant="public"
                                    />
                                ))}
                            </div>
                        )}

                        <div className="divider"></div>
                    </>
                )}

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-4">
                        Featured Services
                    </h1>

                    <p className="text-lg text-gray-500">
                        Top-rated professionals right now
                    </p>
                </div>

                {featuredPosts.length === 0 ? (
                    <p className="text-center">
                        No featured services available yet.
                    </p>
                ) : (
                    <div className="grid gap-5 md:grid-cols-5">
                        {featuredPosts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                variant="public"
                            />
                        ))}
                    </div>
                )}

            </div>

            <HowItWorks />

        </>
    );
}