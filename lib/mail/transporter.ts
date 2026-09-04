import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP ERROR:", error)
    } else {
        console.log("SMTP server is ready")
    }
})