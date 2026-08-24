// app/customize2/page.jsx (your assistant creation page)
"use client"

import axios from "axios"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation" // ✅ Add this
import { useAssistant } from "@/src/context/AssistantContext"

function Page() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const { assistantData } = useAssistant()
  const router = useRouter() // ✅ Initialize router

  const handleCreate = async () => {
    if (!name || !assistantData?.image || !assistantData?.type) {
      toast.error("Missing required fields")
      return
    }

    try {
      setLoading(true)

      const { data } = await axios.post("/api/assistant/create", {
        name,
        image: assistantData.image,
        type: assistantData.type,
      })

      if (data.success) {
        toast.success("Assistant Created ✅")
        // ✅ Redirect to assistant page
        router.push(`/assistant/${encodeURIComponent(name)}`)
        // Or if you want to use a dynamic route without params:
        // router.push("/assistant")
      } else {
        toast.error(data.message)
      }

    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        "Something went wrong"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#020236] py-10 px-4 flex justify-center items-center flex-col">
      <h1 className="text-gray-50 text-4xl md:text-5xl font-bold pb-8 text-center">
        Create Your
        <span className="text-blue-400"> Assistant</span>
      </h1>

      <input
        type="text"
        placeholder="Enter assistant name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border-2 border-gray-50 rounded-full outline-none w-full md:w-[70%] py-3 px-4 text-gray-300 bg-transparent"
      />

      {name.trim().length > 0 && (
        <Button
          onClick={handleCreate}
          disabled={loading}
          className="bg-gray-50 text-black w-full md:w-[30%] mt-8"
        >
          {loading ? "Creating..." : "Create Assistant"}
        </Button>
      )}
    </div>
  )
}

export default Page