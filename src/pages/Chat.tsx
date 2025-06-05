import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ChatList from '../components/ChatList'
import ChatWindow from '../components/ChatWindow'
import { chats as mockChats, messages as mockMessages } from '../data/mockData'
import type { Message, ChatData } from '../types/chat'
import { storage } from '../utils/storage'
import { formatMessageTime } from '../utils/date'

function Chat() {
    const { chatId } = useParams<{ chatId: string }>()
    const navigate = useNavigate()
    const [selectedChat, setSelectedChat] = useState<ChatData | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [chats, setChats] = useState<ChatData[]>(() => {
        const storedChats = storage.getChats()
        return storedChats || mockChats
    })

    // Function to update chat's last message
    const updateChatLastMessage = (chatId: string, messages: Message[]) => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1]
            const updatedChats = chats.map(chat =>
                chat.id === chatId
                    ? {
                        ...chat,
                        lastMessage: lastMessage.text,
                        lastMessageTime: lastMessage.time
                    }
                    : chat
            )
            setChats(updatedChats)
            storage.setChats(updatedChats)
        }
    }

    useEffect(() => {
        if (chatId) {
            const chat = chats.find((c: ChatData) => c.id === chatId)
            if (chat) {
                setSelectedChat(chat)
                // Load messages from cache or mock data
                const cachedMessages = storage.getMessages()[chatId]
                if (cachedMessages) {
                    setMessages(cachedMessages)
                    updateChatLastMessage(chatId, cachedMessages)
                } else {
                    const chatMessages = mockMessages[chatId] || []
                    setMessages(chatMessages)
                    storage.setMessages({ ...storage.getMessages(), [chatId]: chatMessages })
                    updateChatLastMessage(chatId, chatMessages)
                }

                // Clear unread count when opening a chat
                if (chat.unreadCount > 0) {
                    const updatedChats = chats.map(c =>
                        c.id === chatId ? { ...c, unreadCount: 0 } : c
                    )
                    setChats(updatedChats)
                    storage.setChats(updatedChats)
                }
            } else {
                navigate('/chat')
            }
        } else {
            setSelectedChat(null)
            setMessages([])
        }
    }, [chatId, navigate])

    const handleChatSelect = (chat: ChatData) => {
        navigate(`/chat/${chat.id}`)
    }

    const handleSendMessage = (text: string) => {
        if (selectedChat) {
            const trimmedText = text.trim()
            if (!trimmedText) return // Don't send empty messages

            const now = new Date()
            const formattedTime = formatMessageTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

            const newMessage: Message = {
                id: Date.now().toString(),
                chatId: selectedChat.id,
                text: trimmedText,
                time: formattedTime,
                isOutgoing: true
            }

            // Update messages
            const updatedMessages = [...messages, newMessage]
            setMessages(updatedMessages)

            // Update storage with new messages
            const allMessages = storage.getMessages()
            storage.setMessages({ ...allMessages, [selectedChat.id]: updatedMessages })

            // Update chat list with new last message
            updateChatLastMessage(selectedChat.id, updatedMessages)
        }
    }

    return (
        <div className="h-[100dvh] flex overflow-hidden">
            {/* Chat List - Always visible on desktop, conditionally on mobile */}
            <div className={`${selectedChat ? 'hidden md:block' : 'block'} md:w-80 flex-shrink-0`}>
                <ChatList
                    chats={chats}
                    selectedChat={selectedChat}
                    onChatSelect={handleChatSelect}
                />
            </div>

            {/* Chat Window - Only shown when chat is selected */}
            {selectedChat ? (
                <div className="flex-1 min-w-0">
                    <ChatWindow
                        chat={selectedChat}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                    />
                </div>
            ) : (
                // Show message on desktop when no chat is selected
                <div className="hidden md:flex items-center justify-center flex-1 bg-[var(--background-secondary)]">
                    <p className="text-[var(--text-secondary)]">Select a chat to start messaging</p>
                </div>
            )}
        </div>
    )
}

export default Chat 