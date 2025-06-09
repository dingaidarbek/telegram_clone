import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Message, ChatData } from '../types/chat'
import { formatMessageTime } from '../utils/date'

interface AIChatWindowProps {
    chat: ChatData
    messages: Message[]
    onSendMessage: (message: Message | string) => void
    onToggleStats: () => void
}

function AIChatWindow({ chat, messages, onSendMessage }: AIChatWindowProps) {
    const [newMessage, setNewMessage] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const now = new Date()
            const formattedTime = formatMessageTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

            onSendMessage({
                id: Date.now().toString(),
                chatId: chat.id,
                text: newMessage.trim(),
                time: formattedTime,
                isOutgoing: true
            })
            setNewMessage('')
            setIsProcessing(true)

            // Simulate AI response after a delay
            setTimeout(() => {
                const responseTime = formatMessageTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
                onSendMessage({
                    id: (Date.now() + 1).toString(),
                    chatId: chat.id,
                    text: "I'm an AI assistant. How can I help you today?",
                    time: responseTime,
                    isOutgoing: false
                })
                setIsProcessing(false)
            }, 1000)
        }
    }

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
                <div className="flex items-center space-x-3">
                    <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{chat.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {chat.isOnline ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={message.id}
                        className={`flex ${message.isOutgoing ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${message.isOutgoing
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                }`}
                        >
                            <p className="text-sm">{message.text}</p>
                            <p className="text-xs mt-1 opacity-75">
                                {formatMessageTime(message.time)}
                            </p>
                        </div>
                    </div>
                ))}
                {isProcessing && (
                    <div className="flex justify-start">
                        <div className="max-w-[70%] rounded-lg p-3 bg-gray-100 dark:bg-gray-700">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isProcessing}
                        className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AIChatWindow 