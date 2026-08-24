"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import bg from "@/public/assets/authBg.png"
import Link from "next/link"
import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { registerSchema } from "@/lib/schemas/user.schema"

type FormData = z.infer<typeof registerSchema>

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post("/api/auth/sign-up", data)
      toast.success(res.data.message || "User registered successfully")
      reset()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong")
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
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        {/* Name */}
        <div className="space-y-2">
          <Label className="text-gray-50">Name</Label>
          <Input placeholder="Enter Your Name" {...register("name")} className=" text-gray-50 placeholder:text-gray-400" />
          {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label className="text-gray-50">Email</Label>
          <Input type="email" placeholder="Enter Email" {...register("email")} className=" text-gray-50 placeholder:text-gray-400" />
          {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
        </div>

        {/* Password */}
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

        <Button disabled={isSubmitting} className="w-full bg-gray-200 text-black">
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </Button>

        <p className="text-gray-50/80 text-sm text-center">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-400 ">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default SignupPage