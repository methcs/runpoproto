import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST() {
  try {
    console.log("=== hosting.com.tr EMAIL CONFIGURATION TEST ===")

    const emailUser = process.env.EMAIL_USER // info@runpocoaching.com
    const emailPass = process.env.EMAIL_PASS
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT || "587"

    // Check environment variables
    const hasEmailUser = !!emailUser
    const hasEmailPass = !!emailPass
    const hasSmtpHost = !!smtpHost
    const emailUserLength = emailUser?.length || 0
    const emailPassLength = emailPass?.length || 0

    console.log("Email user exists:", hasEmailUser)
    console.log("Email pass exists:", hasEmailPass)
    console.log("SMTP host exists:", hasSmtpHost)
    console.log("Email user:", emailUser)
    console.log("SMTP host:", smtpHost)
    console.log("SMTP port:", smtpPort)

    if (!emailUser || !emailPass) {
      return NextResponse.json({
        success: false,
        error: "Environment variables missing",
        details: {
          hasEmailUser,
          hasEmailPass,
          hasSmtpHost,
          emailUser: emailUser || "missing",
          smtpHost: smtpHost || "missing (try: mail.runpocoaching.com)",
          smtpPort,
          emailUserLength,
          emailPassLength,
          provider: "hosting.com.tr",
        },
      })
    }

    // hosting.com.tr SMTP test
    const transporter = nodemailer.createTransport({
      host: smtpHost || "mail.runpocoaching.com", // hosting.com.tr default
      port: Number.parseInt(smtpPort),
      secure: smtpPort === "465",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: "SSLv3",
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    })

    console.log("Testing hosting.com.tr SMTP connection...")

    try {
      await transporter.verify()
      console.log("✅ hosting.com.tr SMTP connection successful")

      return NextResponse.json({
        success: true,
        message: "hosting.com.tr email configuration is working correctly",
        details: {
          provider: "hosting.com.tr",
          emailUser,
          smtpHost: smtpHost || "mail.runpocoaching.com (default)",
          smtpPort,
          smtpSecure: smtpPort === "465",
          connectionStatus: "successful",
          recommendations: ["SMTP ayarları doğru görünüyor", "Email gönderimi hazır", "Test mesajı gönderebilirsiniz"],
        },
      })
    } catch (smtpError) {
      console.error("❌ hosting.com.tr SMTP connection failed:", smtpError)

      // hosting.com.tr için özel hata analizi
      let errorAnalysis = "Bilinmeyen SMTP hatası"
      let suggestions: string[] = []

      if (smtpError instanceof Error) {
        if (smtpError.message.includes("ECONNREFUSED")) {
          errorAnalysis = "Bağlantı reddedildi"
          suggestions = [
            "SMTP_HOST=mail.runpocoaching.com deneyin",
            "SMTP_PORT=465 veya 587 deneyin",
            "hosting.com.tr panelinde SMTP'nin açık olduğunu kontrol edin",
          ]
        } else if (smtpError.message.includes("authentication")) {
          errorAnalysis = "Kimlik doğrulama hatası"
          suggestions = [
            "Email şifrenizi hosting.com.tr panelinden kontrol edin",
            "Email hesabının aktif olduğunu doğrulayın",
            "SMTP kimlik doğrulamasının açık olduğunu kontrol edin",
          ]
        } else if (smtpError.message.includes("ETIMEDOUT")) {
          errorAnalysis = "Bağlantı zaman aşımı"
          suggestions = [
            "hosting.com.tr sunucuları yavaş yanıt veriyor",
            "Birkaç dakika sonra tekrar deneyin",
            "Farklı SMTP port deneyin (587 veya 465)",
          ]
        }
      }

      return NextResponse.json({
        success: false,
        error: "hosting.com.tr SMTP connection failed",
        details: {
          provider: "hosting.com.tr",
          emailUser,
          smtpHost: smtpHost || "mail.runpocoaching.com (default)",
          smtpPort,
          smtpSecure: smtpPort === "465",
          errorAnalysis,
          smtpError: smtpError instanceof Error ? smtpError.message : "Unknown SMTP error",
          suggestions,
          commonHostingSettings: {
            "hosting.com.tr SMTP ayarları": {
              host: "mail.runpocoaching.com",
              port: "587 veya 465",
              secure: "465 için true, 587 için false",
              auth: "Email adresi ve şifresi",
            },
          },
        },
      })
    }
  } catch (error) {
    console.error("hosting.com.tr configuration test error:", error)
    return NextResponse.json({
      success: false,
      error: "hosting.com.tr configuration test failed",
      details: {
        provider: "hosting.com.tr",
        systemError: error instanceof Error ? error.message : "Unknown system error",
      },
    })
  }
}
