import type { Message } from '../types/chat'
import { themeClasses } from '../styles/theme'
import { formatMessageDate, formatMessageTime } from '../utils/date'

interface MessageGroupProps {
    messages: Message[]
}

function MessageGroup({ messages }: MessageGroupProps) {
    if (messages.length === 0) return null

    const messageDate = new Date()
    const formattedDate = formatMessageDate(messageDate)

    return (
        <div className="space-y-4">
            <div className="flex justify-center">
                <span className="text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full">
                    {formattedDate}
                </span>
            </div>
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${message.isOutgoing ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`max-w-[70%] rounded-lg p-3 ${message.isOutgoing ? themeClasses.messageOut : themeClasses.messageIn}`}
                    >
                        <p className="whitespace-pre-wrap">{message.text}</p>
                        <span className={`text-xs mt-1 block ${message.isOutgoing
                            ? 'text-white opacity-90'
                            : 'text-[var(--text-primary)] opacity-80'
                            }`}>
                            {formatMessageTime(message.time)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MessageGroup 