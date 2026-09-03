"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import axios from "axios"
import bg from "@/public/assets/authBg.png"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Agar yeh component hai toh

interface Message {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

function VerifyEmailForm() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token")

  const [message, setMessage] = useState("Verifying...")
  const [success, setSuccess] = useState(false)
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // Email verification logic
  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          `/api/auth/verify-email?token=${token}`
        )

        setMessage(res.data.message)
        setSuccess(true)
        setIsVerified(true)

        // Add AI welcome message after verification
        setTimeout(() => {
          setChatMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              text: "✅ Email verified successfully! How can I help you today?",
              sender: "ai",
              timestamp: new Date(),
            },
          ])
        }, 1000)

        // Auto redirect
        setTimeout(() => {
          router.push("/sign-in")
        }, 30000) // Extended time for chat interaction
      } catch (error: any) {
        setMessage(
          error.response?.data?.message ||
            "Verification failed ❌"
        )
        setSuccess(false)
        setIsVerified(false)

        // Add AI error message
        setChatMessages([
          {
            id: Date.now(),
            text: "❌ Verification failed. Please try again or contact support.",
            sender: "ai",
            timestamp: new Date(),
          },
        ])
      }
    }

    if (token) {
      verify()
    } else {
      // If no token, show initial AI message
      setChatMessages([
        {
          id: 1,
          text: "👋 Please check your email for the verification link.",
          sender: "ai",
          timestamp: new Date(),
        },
      ])
    }
  }, [token, router])

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: generateAIResponse(inputMessage),
        sender: "ai",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, aiResponse])
    }, 500 + Math.random() * 1000)
  }

  // Simple AI response generator
  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return "Hello! 👋 How can I assist you with your email verification?"
    } else if (lowerInput.includes("help")) {
      return "I'm here to help! You can ask me about your verification status, or any issues you're facing."
    } else if (lowerInput.includes("status") || lowerInput.includes("verify")) {
      return success 
        ? "✅ Your email is verified! You can now proceed to sign in." 
        : "⏳ Your email is being verified. Please wait a moment."
    } else if (lowerInput.includes("thank")) {
      return "You're welcome! 😊 Anything else I can help with?"
    } else if (lowerInput.includes("bye") || lowerInput.includes("goodbye")) {
      return "Goodbye! 👋 Redirecting you to the login page..."
    } else if (lowerInput.includes("problem") || lowerInput.includes("issue")) {
      return "I understand you're having issues. Please contact our support team at support@example.com for assistance."
    } else {
      return `I'm not sure about that, but I'm here to help! You can ask about verification, sign-in, or any issues.`
    }
  }

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div
      className="w-full min-h-screen bg-cover flex justify-center items-center p-4"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <div className="w-full max-w-[600px] bg-[#00000069] backdrop-blur-md shadow-2xl shadow-black flex flex-col rounded-2xl px-6 py-8 gap-4 min-h-[500px] max-h-[700px]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-600 pb-3">
          <h1 className="text-2xl font-semibold text-gray-50">
            Email Verification
          </h1>
          {success && (
            <span className="text-green-400 text-sm bg-green-900/30 px-3 py-1 rounded-full">
              ✅ Verified
            </span>
          )}
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-3 p-2 min-h-[300px] max-h-[400px]">
          {chatMessages.length === 0 ? (
            <div className="text-gray-400 text-center mt-10">
              Loading...
            </div>
          ) : (
            chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-700/80 text-gray-100 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm break-words">{msg.text}</p>
                  <span className="text-[10px] opacity-60 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Status Message */}
        <div className="text-center">
          <p
            className={`text-sm ${
              success ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        </div>

        {/* Input Area */}
        <div className="flex gap-2 items-center border-t border-gray-600 pt-3">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!isVerified && success === false}
            className="flex-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!isVerified && success === false}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4"
          >
            Send
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {!success ? (
            <Button
              onClick={() => router.push("/sign-up")}
              className="w-full bg-gray-200 text-black hover:bg-gray-300"
            >
              Go Back
            </Button>
          ) : (
            <Button
              onClick={() => router.push("/sign-in")}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Sign In →
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  )
}