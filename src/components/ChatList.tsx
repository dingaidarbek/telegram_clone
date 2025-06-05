import { useState } from 'react'
import type { ChatData } from '../types/chat'
import { themeClasses } from '../styles/theme'
import { useTheme } from '../context/ThemeContext'
import CachedAvatar from './CachedAvatar'

interface ChatListProps {
    chats: ChatData[]
    selectedChat: ChatData | null
    onChatSelect: (chat: ChatData) => void
}

function ChatList({ chats, selectedChat, onChatSelect }: ChatListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const { theme, toggleTheme } = useTheme()

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Chats</h1>
                    <button
                        onClick={toggleTheme}
                        className={themeClasses.themeToggle}
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        )}
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={themeClasses.searchInput}
                />
            </div>
            <div className="flex-1 overflow-y-auto">
                {filteredChats.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => onChatSelect(chat)}
                        className={`${themeClasses.chatItem} ${selectedChat?.id === chat.id ? themeClasses.chatItemActive : ''}`}
                    >
                        <div className="relative mr-3">
                            <CachedAvatar
                                src={chat.avatar}
                                alt={chat.name}
                                className={themeClasses.avatar}
                            />
                            {chat.isOnline && (
                                <div className={themeClasses.onlineIndicator} />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className={themeClasses.chatItemName}>{chat.name}</h3>
                                <span className={themeClasses.chatItemTime}>{chat.lastMessageTime}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className={themeClasses.chatItemLastMessage}>{chat.lastMessage}</p>
                                {chat.unreadCount > 0 && (
                                    <span className={themeClasses.chatItemUnread}>
                                        {chat.unreadCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChatList 