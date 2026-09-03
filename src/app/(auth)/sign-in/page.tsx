"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import bg from "@/public/assets/authBg.png"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { signIn, getSession } from "next-auth/react"  // ✅ getSession import karein
import { useRouter } from "next/navigation"
import axios from "axios"
import { loginSchema } from "@/lib/schemas/user.schema"

type FormData = z.infer<typeof loginSchema>

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showResend, setShowResend] = useState(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 🔐 LOGIN
  const onSubmit = async (data: FormData) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (res?.error) {
      if (res.error === "VERIFY_EMAIL") {
        toast.error("Please verify your email first 📩")
        setShowResend(true)
      }
      else if (res.error === "INVALID_CREDENTIALS") {
        toast.error("Invalid email or password")
      }
      else {
        toast.error("Something went wrong")
      }

    } else {
      toast.success("Login successful 🎉")
      
      // ✅ YAHAN CHANGE - Assistant Page pe redirect
      try {
        const session = await getSession()
        const assistantName = session?.user?.assistantName || "default"
        
        // ✅ Dynamic assistant page pe redirect
        router.push(`/assistant/${assistantName}`)
        
      } catch (error) {
        // Agar koi error ho toh default par redirect
        router.push("/assistant/default")
      }
    }
  }

  // 📩 RESEND EMAIL
  const handleResend = async () => {
    try {
      const email = getValues("email")

      if (!email) {
        toast.error("Please enter your email first")
        return
      }

      await axios.post("/api/auth/resend-verification", { email })

      toast.success("Verification email sent 📩")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error sending email")
    }
  }

  return (
    <div
      className="w-full min-h-screen bg-cover flex justify-center items-center p-4"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[450px] bg-[#00000069] backdrop-blur-md shadow-2xl shadow-black flex flex-col rounded-2xl px-8 py-10 gap-6"
      >
        <h1 className="text-gray-50 text-3xl font-semibold text-center">
          Login to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        {/* EMAIL */}
        <div className="space-y-2">
          <Label className="text-gray-50">Email</Label>
          <Input
            type="email"
            placeholder="Enter Email"
            {...register("email")}
            className="text-gray-50 placeholder:text-gray-400"
          />
          {errors.email && (
            <p className="text-red-400 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <Label className="text-gray-50">Password</Label>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              {...register("password")}
              className="pr-10 text-gray-50 placeholder:text-gray-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-400 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* FORGOT PASSWORD */}
        <p className="text-sm text-gray-400 text-right">
          <Link href="/forgot-password" className="text-blue-400">
            Forgot Password?
          </Link>
        </p>

        {/* LOGIN BUTTON */}
        <Button disabled={isSubmitting} className="w-full bg-gray-200 text-black">
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>

        {/* RESEND VERIFICATION */}
        {showResend && (
          <p className="text-sm text-gray-400 text-center mt-2">
            Didn&apos;t get email?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-blue-400 underline"
            >
              Resend
            </button>
          </p>
        )}

        {/* SIGNUP LINK */}
        <p className="text-gray-50/80 text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-blue-400">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage