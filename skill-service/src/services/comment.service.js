const BASE_URL = "http://localhost:4000/comments";

// Create comment
export async function createComment(data) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error("Failed to create comment");
    }

    return res.json();
}

// Get comments for a specific post
export async function getCommentsByPostId(postId) {
    const res = await fetch(`${BASE_URL}/post/${postId}`);
    if (!res.ok) {
        throw new Error("Failed to fetch comments");
    }

    return res.json();
}