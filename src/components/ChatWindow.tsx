import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Message, Chat } from '../types/chat'
import { themeClasses } from '../styles/theme'

interface ChatWindowProps {
    chat: Chat
    messages: Message[]
    onSendMessage: (text: string) => void
}

function ChatWindow({ chat, messages, onSendMessage }: ChatWindowProps) {
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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

    return (
        <div className="h-full flex flex-col md:w-full">
            <div className={`${themeClasses.chatHeader} flex-shrink-0`}>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleBack}
                        className="md:hidden text-[var(--text-primary)] hover:text-[var(--primary-blue)] transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="relative flex-shrink-0">
                        <img
                            src={chat.avatar}
                            alt={chat.name}
                            className="w-10 h-10 rounded-full"
                        />
                        {chat.isOnline && (
                            <div className={`${themeClasses.onlineIndicator} absolute bottom-0 right-0`} />
                        )}
                    </div>
                    <div>
                        <h2 className="font-medium text-[var(--text-primary)]">{chat.name}</h2>
                        <p className="text-sm text-[var(--text-secondary)]">
                            {chat.isOnline ? 'online' : chat.lastSeen}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.isOutgoing ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${message.isOutgoing ? themeClasses.messageOut : themeClasses.messageIn
                                }`}
                        >
                            <p className="whitespace-pre-wrap">{message.text}</p>
                            <span className="text-xs text-[var(--text-secondary)] mt-1 block">
                                {message.time}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className={`${themeClasses.inputArea} flex-shrink-0`}>
                <div className="flex items-end gap-2">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message... (Shift + Enter for new line)"
                        className="flex-1 bg-transparent outline-none resize-none min-h-[40px] max-h-[120px]"
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-[var(--primary-blue)] text-white px-4 py-2 rounded-lg hover:bg-[var(--dark-blue)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChatWindow 