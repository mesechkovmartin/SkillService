import NavBarPrivate from "../../components/NavBar/NavBarPrivate"
import AddPostForm from "../../components/AddPostForm/AddPostForm"
import { useEffect, useState } from "react"
import PostCard from "../../components/PostCard/PostCard"
import { auth } from "../../config/firebase.config.js"
import  { getLoggedUserPosts } from "../../services/post.service"

export default function MyServices() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const user = auth.currentUser;

        if(!user) return;

        getLoggedUserPosts(user.email)
        .then((data) => setPosts(data))
        .catch((error) => console.error("Error fetching my posts:", error));   
    }, []);


    return (
        <>
            <NavBarPrivate />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">My Services</h1>

                    <button className="btn btn-primary"
                        onClick={() => document.getElementById("add-post-modal").showModal()

                        }
                    >
                        Add Service
                    </button>
                </div>

                {posts.length === 0 ? (
                    <p>You have no services yet.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cold-3">
                        {posts.map((post) => (
                            <PostCard key={post._id} post={post} variant="private" />
                        ))}
                    </div>
                )}

                <dialog id="add-post-modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Add Service</h3>

                        <AddPostForm />

                        <div className="modal-action">
                            <form method="dialog">
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
        </>
    )
}