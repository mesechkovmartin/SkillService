import { auth } from "../../conFig/firebase.config.js";

export default function ConversationList({ conversations, selectedConversation, setSelectedConversation }) {

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

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Conversations</h2>

            {conversations.map((conversation) => {
                const otherParticipant = conversation.participants.find(
                    participant => participant !== auth.currentUser.uid
                );

                return (
                    <div
                        key={conversation._id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`p-3 mb-2 border rounded cursor-pointer ${selectedConversation?._id === conversation._id
                                ? "bg-blue-100"
                                : "hover:bg-gray-100"
                            }`}
                    >
                        <p>{otherParticipant}</p>
                    </div>
                );
            })}
        </div>
    )

}