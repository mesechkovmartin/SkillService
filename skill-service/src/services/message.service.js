const BASE_URL = "http://localhost:4000/messages";

// Create a new message
export async function sendMessage(data) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error("Failed to send message");
    }

    return res.json();
}

// Get all messages for a conversation
export async function getMessages(conversationId) {
    const res = await fetch(`${BASE_URL}/${conversationId}`);

    if (!res.ok) {
        throw new Error("Failed to fetch messages");
    }

    return res.json();
}
