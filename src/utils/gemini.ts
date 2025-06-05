import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Gemini API
const apiKey = import.meta.env.VITE_GEMINI_API_KEY
console.log('API Key available:', !!apiKey) // Log whether API key exists (without exposing the key)

const genAI = new GoogleGenerativeAI(apiKey)

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function generateAIResponse(prompt: string): Promise<string> {
    const maxRetries = 3
    let retryCount = 0

    while (retryCount < maxRetries) {
        try {
            // For text-only input, use the gemini-2.0-flash model
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

            const result = await model.generateContent(prompt)
            const response = await result.response
            return response.text()
        } catch (error: any) {
            // Log the full error details
            console.error(`Attempt ${retryCount + 1} failed:`, {
                name: error?.name,
                message: error?.message,
                stack: error?.stack
            })

            // Check if it's an API key error
            if (error?.message?.includes('API key')) {
                return 'Error: Invalid or missing API key. Please check your .env file.'
            }

            // Check if it's a network error
            if (error?.message?.includes('network')) {
                return 'Error: Network connection issue. Please check your internet connection.'
            }

            // Check if it's an overload error
            if (error?.message?.includes('overloaded') || error?.message?.includes('503')) {
                retryCount++
                if (retryCount < maxRetries) {
                    // Wait for 2 seconds before retrying
                    await sleep(2000)
                    continue
                }
                return 'Error: The AI service is currently busy. Please try again in a few moments.'
            }

            return `Error: ${error?.message || 'Unknown error occurred'}`
        }
    }

    return 'Error: Maximum retry attempts reached. Please try again later.'
} 