import { transporter } from "./transporter"

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`

  await transporter.sendMail({
    from: `Virtual Assistant <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <div style="margin:0;padding:0;background:#0f172a;font-family:Arial">

        <div style="max-width:500px;margin:40px auto;background:rgba(255,255,255,0.05);
        padding:30px;border-radius:16px;text-align:center">

          <h1 style="color:#f8fafc">Welcome to <span style="color:#60a5fa">Virtual Assistant</span></h1>

          <p style="color:#cbd5f5">
            Click below to verify your email
          </p>

          <a href="${verifyUrl}"
            style="display:inline-block;padding:12px 24px;background:#e5e7eb;
            color:#000;border-radius:10px;text-decoration:none">
            Verify Email
          </a>

        </div>
      </div>
    `,
  })
}