"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import bg from "@/public/assets/authBg.png"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token")

  const [message, setMessage] = useState("Verifying...")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`/api/auth/verify-email?token=${token}`)
        setMessage(res.data.message)
        setSuccess(true)

        // auto redirect
        setTimeout(() => {
          router.push("/sign-in")
        }, 3000)

      } catch (error: any) {
        setMessage(error.response?.data?.message || "Verification failed ❌")
        setSuccess(false)
      }
    }

    if (token) verify()
  }, [token, router])

  return (
    <div
      className="w-full min-h-screen bg-cover flex justify-center items-center p-4"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <div className="w-full max-w-[450px] bg-[#00000069] backdrop-blur-md shadow-2xl shadow-black flex flex-col rounded-2xl px-8 py-10 gap-6 text-center">
        
        <h1 className="text-3xl font-semibold text-gray-50">
          Email Verification
        </h1>

        <p
          className={`text-lg ${
            success ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>

        {success ? (
          <p className="text-gray-400 text-sm">
            Redirecting to login page...
          </p>
        ) : (
          <Button
            onClick={() => router.push("/sign-up")}
            className="bg-gray-200 text-black"
          >
            Go Back
          </Button>
        )}
      </div>
    </div>
  )
}