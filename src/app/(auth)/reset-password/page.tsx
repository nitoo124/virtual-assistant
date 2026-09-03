"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import axios from "axios"
import { toast } from "sonner"
import bg from "@/public/assets/authBg.png"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

function ResetPasswordForm() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token")

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  const onSubmit = async (data: any) => {
    try {
      if (!token) {
        toast.error("Invalid or missing reset token")
        return
      }

      const res = await axios.post("/api/auth/reset-password", {
        token,
        password: data.password,
      })

      toast.success(res.data.message)

      setTimeout(() => {
        router.push("/sign-in")
      }, 2000)
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error resetting password"
      )
    }
  }

  return (
    <div
      className="w-full min-h-screen bg-cover flex justify-center items-center p-4"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[450px] bg-[#00000069] backdrop-blur-md shadow-2xl shadow-black rounded-2xl px-8 py-10 flex flex-col gap-6"
      >
        <h1 className="text-3xl text-gray-50 text-center font-semibold">
          Reset Password 🔑
        </h1>

        <div className="space-y-2">
          <Label className="text-gray-50">
            New Password
          </Label>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              {...register("password")}
              className="pr-10 text-gray-50 placeholder:text-gray-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gray-200 text-black"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}