import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { ChatData } from '../types/chat'
import { themeClasses } from '../styles/theme'

interface ChatListProps {
    chats: ChatData[]
}

function ChatList({ chats }: ChatListProps) {
    const { chatId } = useParams()
    const [searchQuery, setSearchQuery] = useState('')

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className={`${themeClasses.sidebar} h-full w-full flex flex-col`}>
            <div className="p-4 border-b border-gray-200">
                <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredChats.map((chat) => (
                    <Link
                        key={chat.id}
                        to={`/chat/${chat.id}`}
                        className={`block p-4 hover:bg-gray-50 transition-colors ${chatId === chat.id ? 'bg-gray-50' : ''}`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <img
                                    src={chat.avatar}
                                    alt={chat.name}
                                    className="w-12 h-12 rounded-full"
                                />
                                {chat.isOnline && (
                                    <div className={`${themeClasses.onlineIndicator} absolute bottom-0 right-0`} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-medium text-[var(--text-primary)] truncate">
                                        {chat.name}
                                    </h3>
                                    <span className="text-sm text-[var(--text-secondary)]">
                                        {chat.lastMessageTime}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-[var(--text-secondary)] truncate">
                                        {chat.lastMessage}
                                    </p>
                                    {chat.unreadCount > 0 && (
                                        <span className="ml-2 bg-[var(--primary-blue)] text-white text-xs px-2 py-1 rounded-full">
                                            {chat.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default ChatList 