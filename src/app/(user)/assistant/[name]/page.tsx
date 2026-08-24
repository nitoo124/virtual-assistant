// app/assistant/[name]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { ArrowLeft, LogOut, Settings } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

interface Assistant {
  assistantName: string
  assistantImage: string
}

interface ApiResponse {
  success: boolean
  message?: string
  assistant?: Assistant
}

function AssistantPage() {
  const router = useRouter()

  const [assistant, setAssistant] = useState<Assistant | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [logoutLoading, setLogoutLoading] = useState(false)

  useEffect(() => {
    fetchAssistant()
  }, [])

  const fetchAssistant = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const { data } = await axios.get<ApiResponse>("/api/assistant/get")

      if (data.success && data.assistant) {
        setAssistant(data.assistant)
      } else {
        setError(data.message || "No assistant found")
      }
    } catch (err: unknown) {
      console.error("Fetch error:", err)

      if (err instanceof AxiosError) {
        setError(
          err?.response?.data?.message || "Failed to fetch assistant"
        )
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  // LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      setLogoutLoading(true)

      // agar backend logout api hai
      await axios.post("/api/logout")

      // localStorage cleanup
      localStorage.removeItem("token")

      router.push("/sign-in")
    } catch (error) {
      console.error("Logout Error:", error)
    } finally {
      setLogoutLoading(false)
    }
  }

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-black via-[#050544] to-[#020236] flex justify-center items-center">
        <div className="text-white text-3xl font-bold animate-pulse">
          Loading your assistant...
        </div>
      </div>
    )
  }

  // ERROR SCREEN
  if (error || !assistant) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-black via-[#050544] to-[#020236] flex justify-center items-center flex-col gap-5 px-4">
        <div className="text-white text-2xl font-semibold text-center">
          {error || "No assistant found"}
        </div>

        <Button
          onClick={() => router.push("/customize")}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-5"
        >
          Create Assistant
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-[#050544] to-[#020236] text-white overflow-hidden">

      {/* NAVBAR */}
      <div className="w-full flex items-center justify-between px-5 md:px-10 py-6 border-b border-white/10 backdrop-blur-md">

        {/* LEFT */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 hover:text-blue-400 transition duration-300"
        >
          <ArrowLeft size={30} />
        </button>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          <Button
            onClick={() => router.push("/customize")}
            className="bg-white/10 border border-white/20 hover:bg-white/20 text-white backdrop-blur-xl rounded-xl"
          >
            <Settings className="mr-2 h-4 w-4" />
            Customize
          </Button>

          <Button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
          >
            <LogOut className="mr-2 h-4 w-4" />

            {logoutLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-5 py-14 flex flex-col items-center">

        {/* IMAGE CARD */}
        <div className="relative group">

          {/* Glow */}
          <div className="absolute inset-0 bg-blue-500 blur-[90px] opacity-30 group-hover:opacity-50 transition duration-500"></div>

          {/* Card */}
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 shadow-[0_0_80px_rgba(59,130,246,0.25)]">

            <Image
              src={assistant.assistantImage}
              alt={assistant.assistantName}
              width={350}
              height={350}
              priority
              className="rounded-2xl object-cover w-[280px] h-[350px] md:w-[350px] md:h-[430px]"
            />
          </div>
        </div>

        {/* NAME */}
        <h1 className="text-4xl md:text-6xl font-extrabold mt-12 text-center bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
          I'm {assistant.assistantName}
        </h1>

      </div>
    </div>
  )
}

export default AssistantPage