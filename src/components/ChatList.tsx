import { useState } from 'react'
import type { ChatData } from '../types/chat'
import { themeClasses } from '../styles/theme'
import { useTheme } from '../context/ThemeContext'
import NewChatModal from './NewChatModal'

interface ChatListProps {
    chats: ChatData[]
    selectedChat: ChatData | null
    onChatSelect: (chat: ChatData) => void
    onAddChat: (name: string) => void
    onToggleStats: () => void
}

function ChatList({ chats, selectedChat, onChatSelect, onAddChat, onToggleStats }: ChatListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false)
    const { theme, toggleTheme } = useTheme()

    // Separate AI chats from regular chats
    const aiChats = chats.filter(chat => chat.id === 'ai')
    const regularChats = chats.filter(chat => chat.id !== 'ai')

    return (
        <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
            <div className={`${themeClasses.chatHeader} bg-white dark:bg-gray-900 w-full px-4 flex-shrink-0`}>
                <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between w-full">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Chats</h1>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setIsNewChatModalOpen(true)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                title="New Chat"
                            >
                                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                            <button
                                onClick={onToggleStats}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                title="Statistics"
                            >
                                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </button>
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
                    </div>
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`${themeClasses.searchInput} w-full`}
                        />
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto w-full">
                {/* AI Chats Section */}
                {aiChats.length > 0 && (
                    <div className="w-full px-4 py-2">
                        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            AI Assistant
                        </h2>
                        <div className="mt-2 space-y-1 w-full">
                            {aiChats.map(chat => (
                                <button
                                    key={chat.id}
                                    onClick={() => onChatSelect(chat)}
                                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${selectedChat?.id === chat.id
                                        ? 'bg-blue-50 dark:bg-blue-900/20'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <img
                                        src={chat.avatar}
                                        alt={chat.name}
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {chat.name}
                                            </h3>
                                            {chat.lastMessageTime && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {chat.lastMessageTime}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                {chat.lastMessage || 'No messages yet'}
                                            </p>
                                            {chat.unreadCount > 0 && (
                                                <div className="ml-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                                    {chat.unreadCount}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Regular Chats Section */}
                {regularChats.length > 0 && (
                    <div className="w-full px-4 py-2">
                        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            People
                        </h2>
                        <div className="mt-2 space-y-1 w-full">
                            {regularChats.map(chat => (
                                <button
                                    key={chat.id}
                                    onClick={() => onChatSelect(chat)}
                                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${selectedChat?.id === chat.id
                                        ? 'bg-blue-50 dark:bg-blue-900/20'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <img
                                        src={chat.avatar}
                                        alt={chat.name}
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {chat.name}
                                            </h3>
                                            {chat.lastMessageTime && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {chat.lastMessageTime}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                {chat.lastMessage || 'No messages yet'}
                                            </p>
                                            {chat.unreadCount > 0 && (
                                                <div className="ml-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                                    {chat.unreadCount}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <NewChatModal
                isOpen={isNewChatModalOpen}
                onClose={() => setIsNewChatModalOpen(false)}
                onAddChat={onAddChat}
            />
        </div>
    )
}

export default ChatList 