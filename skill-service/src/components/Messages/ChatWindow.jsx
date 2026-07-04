import { useEffect, useState, useRef } from "react";
import { getMessages, sendMessage } from "../../services/message.service.js";
import { auth } from "../../config/firebase.config.js";

export default function ChatWindow({ selectedConversation }) {

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

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

    if (!selectedConversation) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-bold">Select a conversation</h2>
            </div>
        );
    }

    return (
        <div className="p-4 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4">Chat Window</h2>

            <div className="flex-1 border rounded p-4 mb-4 overflow-y-auto">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`mb-2 ${message.senderId === auth.currentUser.uid
                            ? "text-right"
                            : "text-left"}`}
                    >
                        <span
                            className={`inline-block px-3 py-2 rounded ${message.senderId === auth.currentUser.uid
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-black"}`}
                        >
                            {message.text}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            <div className="flex gap-2">
                <input
                    className="input input-bordered flex-1"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button
                    className="btn btn-primary"
                    onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div >
    );
}