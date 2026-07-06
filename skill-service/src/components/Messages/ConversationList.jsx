import { useState, useEffect } from "react";
import { auth } from "../../config/firebase.config.js";
import { getUserById } from "../../services/user.service.js";
import { getMessages } from "../../services/message.service.js";

export default function ConversationList({ conversations, selectedConversation, setSelectedConversation }) {

    const [users, setUsers] = useState({});

    const [lastMessages, setLastMessages] = useState({});

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function loadUsersAndLastMessages() {
            const loadedUsers = {};
            const loadedLastMessages = {};

            for (const conversation of conversations) {
                const otherParticipant = conversation.participants.find(
                    participant => participant !== auth.currentUser.uid
                );

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

                try {
                    const messages = await getMessages(conversation._id);
                    loadedLastMessages[conversation._id] =
                        messages.length > 0 ? messages[messages.length - 1] : null;
                } catch (error) {
                    loadedLastMessages[conversation._id] = null;
                }
            }

            setUsers(loadedUsers);
            setLastMessages(loadedLastMessages);
        }

        if (conversations.length > 0) {
            loadUsersAndLastMessages();
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

    const formatConversationDate = (date) => {
        if (!date) return "";

        const messageDate = new Date(date);
        const today = new Date();

        const isToday =
            messageDate.toDateString() === today.toDateString();

        if (isToday) {
            return messageDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });
        }

        return messageDate.toLocaleDateString([], {
            weekday: "short"
        });
    };

    const filteredConversations = conversations.filter((conversation) => {
        const otherUser = getOtherUser(conversation);

        if (!otherUser) return true;

        const userName = otherUser?.username.toLowerCase() || "";
        const email = otherUser?.email.toLowerCase() || "";

        const search = searchTerm.toLowerCase().trim();

        return userName.includes(search) || email.includes(search);
    });

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-4">Conversations</h2>

            <input
                type="text"
                placeholder="Search conversations..."
                className="input input-bordered w-full mb-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {filteredConversations.length === 0 ? (
                <p className="text-gray-500">No matching conversations.</p>
            ) : (
                filteredConversations.map((conversation) => {
                    const otherUser = getOtherUser(conversation);

                    const displayName = otherUser
                        ? otherUser.username || otherUser.email
                        : "Loading...";

                    const profileImage = otherUser?.profileImage;
                    const avatarLetter = displayName.charAt(0).toUpperCase();
                    const lastMessage = lastMessages[conversation._id];

                    return (
                        <div
                            key={conversation._id}
                            onClick={() => setSelectedConversation(conversation)}
                            className={`flex items-center gap-3 p-3 mb-2 border rounded-lg cursor-pointer ${selectedConversation?._id === conversation._id
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

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between gap-2">
                                    <p className="font-medium truncate">{displayName}</p>

                                    <span className="text-xs text-gray-400">
                                        {formatConversationDate(lastMessage?.createdAt)}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500 truncate mt-1">
                                    {lastMessage ? lastMessage.text : "No messages yet"}
                                </p>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    )

}