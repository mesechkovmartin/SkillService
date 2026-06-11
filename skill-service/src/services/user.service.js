const BASE_URL = "http://localhost:4000/auth";

// Update user profile
export  async function updateProfile(profileData, token) {
    const res = await fetch(`${BASE_URL}/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
    });

    if (!res.ok) {
        throw new Error("Failed to update  profile");
    }
    return res.json();

}