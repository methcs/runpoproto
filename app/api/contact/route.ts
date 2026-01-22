import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { name, instagram, message } = await request.json()

    console.log("=== EMAIL GÖNDERME İŞLEMİ ===")
    console.log("Form verisi:", { name, instagram, messageLength: message?.length })

    // Validate required fields
    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json({ success: false, message: "Ad soyad ve mesaj alanları zorunludur." }, { status: 400 })
    }

    // Check environment variables
    const emailUser = process.env.EMAIL_USER // info@runpocoaching.com
    const emailPass = process.env.EMAIL_PASS // Email şifreniz
    const smtpHost = process.env.SMTP_HOST // hosting.com.tr SMTP sunucusu
    const smtpPort = process.env.SMTP_PORT || "587"

    if (!emailUser || !emailPass) {
      console.error("Email environment variables missing")
      return NextResponse.json(
        { success: false, message: "Email yapılandırması eksik. Lütfen yöneticiye başvurun." },
        { status: 500 },
      )
    }

    console.log("Email user:", emailUser)
    console.log("SMTP host:", smtpHost)
    console.log("SMTP port:", smtpPort)

    // hosting.com.tr SMTP ayarları
    const transporter = nodemailer.createTransport({
      host: smtpHost || "mail.runpocoaching.com", // hosting.com.tr genellikle mail.domain.com formatı kullanır
      port: Number.parseInt(smtpPort),
      secure: smtpPort === "465", // SSL için 465, TLS için 587
      auth: {
        user: emailUser, // info@runpocoaching.com
        pass: emailPass, // Email şifreniz
      },
      // hosting.com.tr için önerilen ayarlar
      tls: {
        rejectUnauthorized: false, // Self-signed sertifikalar için
        ciphers: "SSLv3", // Eski SSL desteği
      },
      // Bağlantı timeout ayarları
      connectionTimeout: 60000, // 60 saniye
      greetingTimeout: 30000, // 30 saniye
      socketTimeout: 60000, // 60 saniye
    })

    console.log("Transporter oluşturuldu (hosting.com.tr)")

    // Verify transporter
    try {
      await transporter.verify()
      console.log("✅ hosting.com.tr SMTP bağlantısı doğrulandı")
    } catch (verifyError) {
      console.error("❌ SMTP doğrulama hatası:", verifyError)

      // hosting.com.tr için özel hata mesajları
      let errorMsg = "Email sunucusuna bağlanılamadı."
      if (verifyError instanceof Error) {
        if (verifyError.message.includes("ECONNREFUSED")) {
          errorMsg = "hosting.com.tr SMTP sunucusuna bağlanılamadı. Port ve host ayarlarını kontrol edin."
        } else if (verifyError.message.includes("authentication")) {
          errorMsg = "Email şifresi hatalı. hosting.com.tr panel şifrenizi kontrol edin."
        }
      }

      return NextResponse.json(
        {
          success: false,
          message: errorMsg,
          debug: verifyError instanceof Error ? verifyError.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    // Email content - hosting.com.tr için optimize edilmiş
    const mailOptions = {
      from: `"Runpo Coaching Website" <${emailUser}>`, // info@runpocoaching.com
      to: emailUser, // Mesajlar aynı adrese gelecek
      subject: `🏃‍♂️ Web Sitesi Mesajı: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Runpo Coaching - Yeni Mesaj</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              margin: 0; 
              padding: 0; 
              background-color: #f4f4f4;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .header { 
              background: linear-gradient(135deg, #facc15, #f97316); 
              color: white; 
              padding: 30px 20px; 
              text-align: center; 
              border-radius: 10px 10px 0 0; 
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
              font-weight: bold;
            }
            .header p { 
              margin: 10px 0 0 0; 
              opacity: 0.9; 
              font-size: 16px;
            }
            .content { 
              background: white; 
              padding: 30px; 
              border-radius: 0 0 10px 10px; 
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .field { 
              margin-bottom: 25px; 
              border-bottom: 1px solid #eee;
              padding-bottom: 15px;
            }
            .field:last-child {
              border-bottom: none;
              margin-bottom: 0;
            }
            .label { 
              font-weight: bold; 
              color: #555; 
              margin-bottom: 8px; 
              display: block; 
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .value { 
              background: #f8f9fa; 
              padding: 15px; 
              border-radius: 8px; 
              border-left: 4px solid #facc15;
              font-size: 16px;
              line-height: 1.5;
            }
            .message-content {
              background: #fff;
              border: 2px solid #facc15;
              padding: 20px;
              border-radius: 8px;
              white-space: pre-wrap;
              font-family: Georgia, serif;
              line-height: 1.6;
              font-size: 15px;
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              padding: 20px;
              color: #666; 
              font-size: 12px; 
              background: #f8f9fa;
              border-radius: 8px;
            }
            .footer strong { 
              color: #f97316; 
              font-weight: bold;
            }
            .timestamp { 
              color: #888; 
              font-size: 14px; 
              font-style: italic;
            }
            .hosting-info {
              background: #e3f2fd;
              padding: 10px;
              border-radius: 5px;
              font-size: 11px;
              color: #1976d2;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏃‍♂️ Runpo Coaching</h1>
              <p>Yeni Web Sitesi Mesajı</p>
            </div>
            
            <div class="content">
              <div class="field">
                <span class="label">👤 Gönderen Kişi</span>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <span class="label">📱 Instagram Hesabı</span>
                <div class="value">${instagram ? `@${instagram.replace("@", "")}` : "Belirtilmemiş"}</div>
              </div>
              
              <div class="field">
                <span class="label">📅 Gönderim Tarihi</span>
                <div class="value timestamp">${new Date().toLocaleString("tr-TR", {
                  timeZone: "Europe/Istanbul",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  weekday: "long",
                })}</div>
              </div>
              
              <div class="field">
                <span class="label">💬 Mesaj İçeriği</span>
                <div class="message-content">${message}</div>
              </div>
            </div>
            
            <div class="footer">
              <p>Bu mesaj <strong>runpo-coaching.com</strong> web sitesinden otomatik olarak gönderilmiştir.</p>
              <p><strong>Aerobic Power, Smart Pacing 🏃‍♂️</strong></p>
              <p style="margin-top: 15px; font-size: 11px; color: #999;">
                Mesaja yanıt vermek için doğrudan bu email adresini kullanabilirsiniz.
              </p>
              <div class="hosting-info">
                📧 Email hosting: hosting.com.tr | 🌐 Web: runpo-coaching.com
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
🏃‍♂️ RUNPO COACHING - YENİ WEB SİTESİ MESAJI

👤 Gönderen: ${name}
📱 Instagram: ${instagram ? `@${instagram.replace("@", "")}` : "Belirtilmemiş"}
📅 Tarih: ${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}

💬 MESAJ:
${message}

---
Bu mesaj runpo-coaching.com web sitesinden gönderilmiştir.
Email hosting: hosting.com.tr
Aerobic Power, Smart Pacing 🏃‍♂️
      `,
      replyTo: emailUser,
      // hosting.com.tr için ek headers
      headers: {
        "X-Mailer": "Runpo Coaching Website",
        "X-Priority": "3",
      },
    }

    console.log("Email gönderiliyor (hosting.com.tr)...")

    // Send email
    const info = await transporter.sendMail(mailOptions)

    console.log("✅ Email başarıyla gönderildi!")
    console.log("Message ID:", info.messageId)
    console.log("Response:", info.response)

    return NextResponse.json({
      success: true,
      message: "Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.",
    })
  } catch (error) {
    console.error("❌ Email gönderme hatası:", error)

    let errorMessage = "Email gönderilirken bir hata oluştu."

    if (error instanceof Error) {
      // hosting.com.tr için özel hata mesajları
      if (error.message.includes("Invalid login") || error.message.includes("authentication")) {
        errorMessage = "Email şifresi hatalı. hosting.com.tr panelindeki email şifrenizi kontrol edin."
      } else if (error.message.includes("Connection timeout") || error.message.includes("ECONNREFUSED")) {
        errorMessage = "hosting.com.tr email sunucusuna bağlanılamadı. SMTP ayarlarını kontrol edin."
      } else if (error.message.includes("DNS") || error.message.includes("ENOTFOUND")) {
        errorMessage = "Email sunucusu bulunamadı. SMTP host adresini kontrol edin (mail.runpocoaching.com)."
      } else if (error.message.includes("ETIMEDOUT")) {
        errorMessage = "Bağlantı zaman aşımı. hosting.com.tr sunucuları yavaş yanıt veriyor."
      } else {
        errorMessage = `hosting.com.tr email hatası: ${error.message}`
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        debug: error instanceof Error ? error.message : "Unknown error",
        provider: "hosting.com.tr",
      },
      { status: 500 },
    )
  }
}
