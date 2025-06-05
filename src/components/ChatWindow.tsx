import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Message, ChatData } from '../types/chat'
import { themeClasses } from '../styles/theme'
import CachedAvatar from './CachedAvatar'
import MessageGroup from './MessageGroup'
import { getMessageDate } from '../utils/date'

interface ChatWindowProps {
    chat: ChatData
    messages: Message[]
    onSendMessage: (text: string) => void
}

function ChatWindow({ chat, messages, onSendMessage }: ChatWindowProps) {
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (newMessage.trim()) {
            onSendMessage(newMessage)
            setNewMessage('')
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    const handleBack = () => {
        navigate('/chat')
    }

    // Group messages by date
    const groupedMessages = messages.reduce<Message[][]>((groups, message) => {
        const messageDate = getMessageDate(message.time)
        const lastGroup = groups[groups.length - 1]

        if (!lastGroup || getMessageDate(lastGroup[0].time).getDate() !== messageDate.getDate()) {
            groups.push([message])
        } else {
            lastGroup.push(message)
        }

        return groups
    }, [])

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Chat Header */}
            <div className={`${themeClasses.chatHeader} bg-white dark:bg-gray-900`}>
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
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{chat.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {chat.isOnline ? 'Online' : 'Offline'}
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                {groupedMessages.map((group, index) => (
                    <MessageGroup key={index} messages={group} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex items-end">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className={`${themeClasses.messageInput} resize-none min-h-[40px] max-h-[120px] py-2`}
                        rows={1}
                    />
                    <button
                        onClick={handleSubmit}
                        className={themeClasses.sendButton}
                        disabled={!newMessage.trim()}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatWindow 