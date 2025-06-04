import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ChatList from '../components/ChatList'
import ChatWindow from '../components/ChatWindow'
import { chats as initialChats, messages as initialMessages } from '../data/mockData'
import type { Chat, Message } from '../types/chat'

function Chat() {
    const { chatId } = useParams()
    const [chats, setChats] = useState<Chat[]>(initialChats)
    const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages)
    const currentChat = chats.find(chat => chat.id === chatId)

    const handleAddChat = (newChat: Chat) => {
        setChats(prevChats => [...prevChats, newChat])
        setMessages(prevMessages => ({
            ...prevMessages,
            [newChat.id]: []
        }))
    }

    const handleSendMessage = (text: string) => {
        if (!chatId) return

        const newMessage: Message = {
            id: Date.now().toString(),
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOutgoing: true
        }

        setMessages(prevMessages => ({
            ...prevMessages,
            [chatId]: [...(prevMessages[chatId] || []), newMessage]
        }))

        // Update last message in chat list
        setChats(prevChats => prevChats.map(chat =>
            chat.id === chatId
                ? { ...chat, lastMessage: text, lastMessageTime: newMessage.time }
                : chat
        ))
    }

    // Clear unread count when opening a chat
    useEffect(() => {
        if (chatId) {
            setChats(prevChats => prevChats.map(chat =>
                chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
            ))
        }
    }, [chatId])

    return (
        <div className="min-h-[100dvh] w-full flex">
            {/* Chat List - Always visible on desktop, conditionally visible on mobile */}
            <div className={`${chatId ? 'hidden md:block' : 'block'} w-full md:w-80`}>
                <ChatList chats={chats} onAddChat={handleAddChat} />
            </div>

            {/* Chat Window - Only visible when a chat is selected */}
            {chatId && currentChat ? (
                <div className="flex-1">
                    <ChatWindow
                        chat={currentChat}
                        messages={messages[chatId] || []}
                        onSendMessage={handleSendMessage}
                    />
                </div>
            ) : (
                <div className="hidden md:flex flex-1 items-center justify-center text-[var(--text-secondary)]">
                    Select a chat to start messaging
                </div>
            )}
        </div>
    )
}

export default Chat 