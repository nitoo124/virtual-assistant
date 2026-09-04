import mongoose from "mongoose"

type ConnectionObject = {
  isConnected?: number
}

const connection: ConnectionObject = {}

async function connectDB(): Promise<void> {
  if (connection.isConnected === 1) {
    console.log("Already connected to database")
    return
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "")

    connection.isConnected = db.connections[0].readyState

    console.log("DB connected successfully")
  } catch (error) {
    console.error("Database connection failed:", error)
    throw error
  }
}

export default connectDB