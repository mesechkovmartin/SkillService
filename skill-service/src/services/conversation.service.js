const BASE_URL = "http://localhost:4000/conversations";

// Get or create a conversation between two users
export async function createOrGetConversation(currentUserID, receiverId) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ currentUserEmail, receiverId })
    });

    if (!res.ok) {
        throw new Error("Failed to create or get conversation");
    }

    return res.json();
}

// Get all conversations for a user
export async function getUserConversations(userId) {
    const res = await fetch(`${BASE_URL}/user/${userId}`);

    if (!res.ok) {
        throw new Error("Failed to fetch user conversations");
    }

    return res.json();
}