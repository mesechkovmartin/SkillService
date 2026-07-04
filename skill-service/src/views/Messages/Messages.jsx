import { useEffect, useState } from "react";
import { auth } from "../../config/firebase.config.js";
import NavBarPrivate from "../../components/NavBar/NavBarPrivate";
import ConversationList from "../../components/Messages/ConversationList";
import ChatWindow from "../../components/Messages/ChatWindow";
import { getUserConversations } from "../../services/conversation.service";

export default function Messages() {

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);

    useEffect(() => {

        async function loadConversations() {
            try {
                const data = await getUserConversations(auth.currentUser.uid);

                setConversations(data);
            } catch (error) {
                console.error(error);
            }
        }

        loadConversations();
    }, []);

    return (
        <>
            <NavBarPrivate />

            <main className="pt-16 h-screen">
                <div className="flex h-full">
                    <div className="w-80 border-r border-gray-300">
                        <ConversationList
                            conversations={conversations}
                            selectedConversation={selectedConversation}
                            setSelectedConversation={setSelectedConversation}
                        />
                    </div>

                    <div className="flex-1">
                        <ChatWindow
                            selectedConversation={selectedConversation}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
