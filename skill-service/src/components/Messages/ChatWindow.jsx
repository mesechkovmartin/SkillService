import { useEffect, useState, useRef } from "react";
import { getMessages, sendMessage } from "../../services/message.service.js";
import { getUserById } from "../../services/user.service.js";
import { auth } from "../../config/firebase.config.js";

export default function ChatWindow({ selectedConversation }) {

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [otherUser, setOtherUser] = useState(null);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        async function loadMessages() {
            if (!selectedConversation) return;

            try {
                const data = await getMessages(selectedConversation._id);
                setMessages(data);
            } catch (error) {
                console.error(error);
            }
        }

        loadMessages();
    }, [selectedConversation]);

    useEffect(() => {
        async function loadOtherUser() {
            if (!selectedConversation) return;

            const otherParticipant = selectedConversation.participants.find(participant => participant !== auth.currentUser.uid);

            try {
                const user = await getUserById(otherParticipant);
                setOtherUser(user);
            } catch (error) {
                setOtherUser({
                    username: "Unknown user",
                    email: "",
                    profileImage: ""
                });
            }
        }
        loadOtherUser();
    }, [selectedConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!text.trim() || !selectedConversation) return;

        try {
            const newMessage = await sendMessage({
                conversationId: selectedConversation._id,
                senderId: auth.currentUser.uid,
                text: text.trim()
            });

            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setText("");
        } catch (error) {
            console.error(error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatMessageTime = (date) => {
        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (!selectedConversation) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-bold text-center">Select a conversation</h2>
            </div>
        );
    }

    const displayName = otherUser
        ? otherUser.username || otherUser.email
        : "Loading...";

    const avatarLetter = displayName.charAt(0).toUpperCase();

    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="h-20 px-6 flex items-center gap-3 border-b bg-white">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center overflow-hidden">
                    {otherUser?.profileImage ? (
                        <img
                            src={otherUser.profileImage}
                            alt={displayName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="font-bold">{avatarLetter}</span>
                    )}
                </div>

                <div>
                    <h2 className="font-bold text-lg">{displayName}</h2>
                    <p className="text-sm text-gray-400">Online</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
                {messages.map((message) => {
                    const isMine = message.senderId === auth.currentUser.uid;

                    return (
                        <div
                            key={message._id}
                            className={`mb-5 flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                            {!isMine && (
                                <div className="w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center overflow-hidden mr-3 mt-1">
                                    {otherUser?.profileImage ? (
                                        <img
                                            src={otherUser.profileImage}
                                            alt={displayName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs font-bold">{avatarLetter}</span>
                                    )}
                                </div>
                            )}

                            <div className={`max-w-[70%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                                <div
                                    className={`px-4 py-3 rounded-2xl shadow-sm ${isMine
                                            ? "bg-blue-600 text-white rounded-br-md"
                                            : "bg-white text-gray-900 border rounded-bl-md"
                                        }`}
                                >
                                    {message.text}
                                </div>

                                <span className="text-xs text-gray-400 mt-1">
                                    {formatMessageTime(message.createdAt)}
                                </span>
                            </div>
                        </div>
                    );
                })}

                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-white">
                <div className="flex gap-3">
                    <input
                        className="input input-bordered flex-1 rounded-2xl bg-gray-50"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <button
                        className="btn btn-primary rounded-2xl px-6"
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-2">
                    Press Enter to send
                </p>
            </div>
        </div>
    );
}