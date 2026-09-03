import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import User from "@/models/user.model"
import connectDB from "@/lib/db/connectDB"
import { loginSchema } from "@/lib/schemas/user.schema"

// ✅ EXTEND TYPES - Assistant Name Add Karein
declare module "next-auth" {
  interface User {
    id: string
    name?: string | null
    email?: string | null
    assistantName?: string | null  // ✅ ADD
  }
  
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      assistantName?: string | null  // ✅ ADD
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    assistantName?: string | null  // ✅ ADD
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const result = loginSchema.safeParse(credentials)

          if (!result.success) {
            throw new Error("INVALID_CREDENTIALS")
          }

          const { email, password } = result.data

          await connectDB()

          const user = await User.findOne({ email }).select("+password")

          if (!user) {
            throw new Error("INVALID_CREDENTIALS")
          }

          if (!user.isVerified) {
            throw new Error("VERIFY_EMAIL")
          }

          const isMatch = await bcrypt.compare(password, user.password)

          if (!isMatch) {
            throw new Error("INVALID_CREDENTIALS")
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            assistantName: user.assistantName || "default",  // ✅ ADD
          }
        } catch (error: any) {
          throw new Error(error.message)
        }
      }
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.assistantName = user.assistantName  // ✅ ADD
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.assistantName = token.assistantName  // ✅ ADD
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }