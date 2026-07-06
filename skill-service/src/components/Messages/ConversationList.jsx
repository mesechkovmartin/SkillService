import { useState, useEffect } from "react";
import { auth } from "../../config/firebase.config.js";
import { getUserById } from "../../services/user.service.js";

export default function ConversationList({ conversations, selectedConversation, setSelectedConversation }) {

    const [users, setUsers] = useState({});

    useEffect(() => {
        async function loadUsers() {
            const loadedUsers = {};

            for (const conversation of conversations) {
                const otherParticipant = conversation.participants.find(participant => participant !== auth.currentUser.uid);

                if (otherParticipant && !loadedUsers[otherParticipant]) {
                    try {
                        loadedUsers[otherParticipant] = await getUserById(otherParticipant);
                    } catch (error) {
                        loadedUsers[otherParticipant] = {
                            username: "Unknown user",
                            email: "",
                            profileImage: ""
                        };
                    }
                }
            }
            setUsers(loadedUsers);
        }

        if (conversations.length > 0) {
            loadUsers();
        }
    }, [conversations]);

    if (conversations.length === 0) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">
                    Conversations
                </h2>

                <p>No conversations yet.</p>
            </div>
        );
    }

    const getOtherUser = (conversation) => {
        const otherParticipant = conversation.participants.find(
            participant => participant !== auth.currentUser.uid
        );

        return users[otherParticipant];
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Conversations</h2>

            {conversations.map((conversation) => {
                const otherUser = getOtherUser(conversation);

                const displayName = otherUser
                    ? otherUser.username || otherUser.email
                    : "Loading...";

                const profileImage = otherUser?.profileImage;

                const avatarLetter = displayName.charAt(0).toUpperCase();

                return (
                    <div
                        key={conversation._id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`flex items-center gap-3 p-3 mb-2 border rounded cursor-pointer ${selectedConversation?._id === conversation._id
                                ? "bg-blue-100"
                                : "hover:bg-gray-100"
                            }`}
                    >
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center overflow-hidden">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={displayName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-sm font-bold">
                                    {avatarLetter}
                                </span>
                            )}
                        </div>

                        <p className="font-medium">{displayName}</p>
                    </div>
                );
            })}
        </div>
    )

}