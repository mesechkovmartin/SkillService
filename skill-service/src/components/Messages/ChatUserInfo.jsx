import { useEffect, useState } from "react";
import { auth } from "../../config/firebase.config.js";
import { getUserById } from "../../services/user.service.js";

export default function ChatUserInfo({ selectedConversation }) {
    const [otherUser, setOtherUser] = useState(null);

    useEffect(() => {
        async function loadOtherUser() {
            if (!selectedConversation) {
                setOtherUser(null);
                return;
            }

            const otherParticipant = selectedConversation.participants.find(participant => participant !== auth.currentUser.uid);

            try {
                const user = await getUserById(otherParticipant);
                setOtherUser(user);
            } catch (error) {
                setOtherUser(null);
            }
        }
        loadOtherUser();
    }, [selectedConversation]);

    if (!otherUser) {
        return (
            <div className="p-6 text-gray-400">
                Loading user info...
            </div>
        )
    }

    const displayName = otherUser.username || otherUser.email;
    const avatarLetter = displayName.charAt(0).toUpperCase();


    return (
        <div className="p-6">
            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center overflow-hidden mb-4">
                    {otherUser.profileImage ? (
                        <img
                            src={otherUser.profileImage}
                            alt={displayName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-3xl font-bold">
                            {avatarLetter}
                        </span>
                    )}
                </div>

                <h2 className="text-xl font-bold">{displayName}</h2>
                <p className="text-sm text-gray-500 mt-1">{otherUser.email}</p>
            </div>

            <div className="mt-8 space-y-4">
                <div>
                    <p className="text-xs text-gray-400">UserName</p>
                    <p>{otherUser.username || "No username yet"}</p>
                </div>

                <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p>{otherUser.email}</p>
                </div>

                <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p>{otherUser.phoneNumber || "No phone number"}</p>
                </div>

                <div>
                    <p className="text-xs text-gray-400">Bio</p>
                    <p>{otherUser.bio || "No bio yet"}</p>
                </div>

                <button className="btn btn-primary w-full mt-8">
                    View profile
                </button>

            </div>

        </div>

    )
}