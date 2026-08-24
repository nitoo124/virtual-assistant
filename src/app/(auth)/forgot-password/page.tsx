"use client"

import { useForm } from "react-hook-form"
import axios from "axios"
import { toast } from "sonner"
import bg from "@/public/assets/authBg.png"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()

  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post("/api/auth/forgot-password", data)
      toast.success(res.data.message)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error")
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
          Forgot Password 🔐
        </h1>

        <div className="space-y-2">
          <Label className="text-gray-50">Email</Label>
          <Input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className="text-gray-50 placeholder:text-gray-400"
          />
        </div>

        <Button disabled={isSubmitting} className="bg-gray-200 text-black">
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>

        <p className="text-center text-gray-400 text-sm">
          Remember your password?{" "}
          <Link href="/sign-in" className="text-blue-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}