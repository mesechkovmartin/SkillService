const BASE_URL = "http://localhost:4000/posts";

// Get all posts
export async function getAllPosts() {
    const res = await fetch(BASE_URL);

    if (!res.ok) {
        throw new Error("Failed to fetch posts");
    }

    return res.json();
}

// Create post 
export async function createPost(postData) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    })

    if (!res.ok) {
        throw new Error("Failed to create post");
    }

    return res.json();
}

//Get logged user posts
export async function getLoggedUserPosts(ownerEmail) {
    const res = await fetch(
        `${BASE_URL}/my-posts?ownerEmail=${ownerEmail}`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch my posts");
    }

    return res.json();
}

export async function updatePost(postId, postData) {
    const res = await fetch(`${BASE_URL}/${postId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    });

    if (!res.ok) {
        throw new Error("Failed to update post");
    }

    return res.json();
}