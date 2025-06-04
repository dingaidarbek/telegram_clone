import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import type { Chat } from '../types/chat'
import NewChatModal from './NewChatModal'
import { themeClasses } from '../styles/theme'

interface ChatListProps {
    chats: Chat[]
    onAddChat: (chat: Chat) => void
}

function ChatList({ chats, onAddChat }: ChatListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAddChat = (name: string) => {
        const newChat: Chat = {
            id: Date.now().toString(),
            name,
            avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
            lastMessage: '',
            lastMessageTime: '',
            unreadCount: 0
        }
        onAddChat(newChat)
    }

    return (
        <div className={`${themeClasses.sidebar} border-r border-[var(--border-color)] h-full w-full flex flex-col`}>
            <div className="p-4 flex-shrink-0">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Chats</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[var(--primary-blue)] text-white px-4 py-2 rounded-lg hover:bg-[var(--dark-blue)] transition-colors"
                    >
                        New Chat
                    </button>
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name..."
                        className="w-full rounded-lg border border-[var(--border-color)] px-4 py-2 focus:outline-none focus:border-[var(--primary-blue)]"
                    />
                </div>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 space-y-2">
                {filteredChats.map((chat) => (
                    <NavLink
                        key={chat.id}
                        to={`/chat/${chat.id}`}
                        className={({ isActive }) =>
                            `block p-3 rounded-lg transition-colors ${isActive
                                ? 'bg-[var(--primary-blue)] text-white'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                            }`
                        }
                    >
                        <div className="flex items-center space-x-3">
                            <img
                                src={chat.avatar}
                                alt={chat.name}
                                className="w-12 h-12 rounded-full flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <p className="font-medium truncate">{chat.name}</p>
                                    <span className="text-sm flex-shrink-0 ml-2">{chat.lastMessageTime}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm truncate">{chat.lastMessage}</p>
                                    {chat.unreadCount > 0 && (
                                        <span className="bg-[var(--primary-blue)] text-white text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2">
                                            {chat.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </NavLink>
                ))}
                {filteredChats.length === 0 && (
                    <div className="text-center text-[var(--text-secondary)] py-4">
                        No chats found
                    </div>
                )}
            </nav>
            <NewChatModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddChat={handleAddChat}
            />
        </div>
    )
}

export default ChatList 