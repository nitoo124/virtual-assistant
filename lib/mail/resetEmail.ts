import { transporter } from "./transporter"

export const sendResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`

  await transporter.sendMail({
    from: `Virtual Assistant <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <div style="margin:0;padding:0;background:#0f172a;font-family:Arial">

        <div style="max-width:500px;margin:40px auto;background:rgba(255,255,255,0.05);
        padding:30px;border-radius:16px;text-align:center">

          <h1 style="color:#f8fafc">Reset Your Password 🔐</h1>

          <p style="color:#cbd5f5">
            Click below to reset your password
          </p>

          <a href="${resetUrl}"
            style="display:inline-block;padding:12px 24px;background:#e5e7eb;
            color:#000;border-radius:10px;text-decoration:none">
            Reset Password
          </a>

        </div>
      </div>
    `,
  })
}