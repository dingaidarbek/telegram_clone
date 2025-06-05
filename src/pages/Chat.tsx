import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ChatList from '../components/ChatList'
import ChatWindow from '../components/ChatWindow'
import AIChatWindow from '../components/AIChatWindow'
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
                        lastMessageTime: formatMessageTime(new Date(lastMessage.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
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

    const handleSendMessage = (messageOrText: Message | string) => {
        if (selectedChat) {
            let newMessage: Message

            if (typeof messageOrText === 'string') {
                const trimmedText = messageOrText.trim()
                if (!trimmedText) return // Don't send empty messages

                const now = new Date()
                const formattedTime = formatMessageTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

                newMessage = {
                    id: Date.now().toString(),
                    chatId: selectedChat.id,
                    text: trimmedText,
                    time: formattedTime,
                    isOutgoing: true
                }
            } else {
                newMessage = messageOrText
            }

            // Update messages by appending the new message
            setMessages(prevMessages => [...prevMessages, newMessage])

            // Update storage with new messages
            const allMessages = storage.getMessages()
            const updatedMessages = [...(allMessages[selectedChat.id] || []), newMessage]
            storage.setMessages({ ...allMessages, [selectedChat.id]: updatedMessages })

            // Update chat list with new last message
            updateChatLastMessage(selectedChat.id, updatedMessages)
        }
    }

    const handleAddChat = (name: string) => {
        const newChat: ChatData = {
            id: Date.now().toString(),
            name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            lastMessage: '',
            lastMessageTime: '',
            unreadCount: 0,
            isOnline: false
        }

        const updatedChats = [...chats, newChat]
        setChats(updatedChats)
        storage.setChats(updatedChats)
        navigate(`/chat/${newChat.id}`)
    }

    // Add AI chat if it doesn't exist
    useEffect(() => {
        const aiChatExists = chats.some(chat => chat.id === 'ai')
        if (!aiChatExists) {
            const aiChat: ChatData = {
                id: 'ai',
                name: 'AI Assistant',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai',
                lastMessage: 'Hello! How can I help you today?',
                lastMessageTime: formatMessageTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
                unreadCount: 0,
                isOnline: true
            }
            const updatedChats = [...chats, aiChat]
            setChats(updatedChats)
            storage.setChats(updatedChats)
        }
    }, [])

    return (
        <div className="min-h-[100dvh] w-full flex flex-col md:flex-row bg-white dark:bg-gray-900">
            {/* Chat List - Hidden on mobile when chat is selected */}
            <div className={`h-full w-full md:w-80 flex-shrink-0 ${selectedChat ? 'hidden md:block' : 'block'}`}>
                <ChatList
                    chats={chats}
                    selectedChat={selectedChat}
                    onChatSelect={handleChatSelect}
                    onAddChat={handleAddChat}
                />
            </div>

            {/* Chat Window - Full width on mobile */}
            <div className={`h-full w-full flex-grow ${selectedChat ? 'block' : 'hidden md:block'}`}>
                {selectedChat ? (
                    selectedChat.id === 'ai' ? (
                        <AIChatWindow
                            chat={selectedChat}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                        />
                    ) : (
                        <ChatWindow
                            chat={selectedChat}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                        />
                    )
                ) : (
                    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                        <p className="text-gray-500 dark:text-gray-400">Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Chat 