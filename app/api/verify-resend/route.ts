import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST() {
  try {
    console.log("=== RESEND API KEY VERIFICATION ===")

    const apiKey = process.env.RESEND_API_KEY

    // Check if API key exists
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "RESEND_API_KEY environment variable not found",
        details: {
          hasApiKey: false,
          keyLength: 0,
          keyFormat: "missing",
        },
      })
    }

    // Check API key format
    const isValidFormat = apiKey.startsWith("re_") && apiKey.length >= 40
    const keyLength = apiKey.length
    const keyPrefix = apiKey.substring(0, 10)

    console.log("API Key exists:", !!apiKey)
    console.log("API Key length:", keyLength)
    console.log("API Key prefix:", keyPrefix)
    console.log("Valid format:", isValidFormat)

    if (!isValidFormat) {
      return NextResponse.json({
        success: false,
        error: "Invalid API key format",
        details: {
          hasApiKey: true,
          keyLength,
          keyPrefix: keyPrefix + "...",
          keyFormat: "invalid",
          expectedFormat: "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
          actualFormat: `${keyPrefix}... (${keyLength} chars)`,
        },
      })
    }

    // Test API key by initializing Resend
    const resend = new Resend(apiKey)

    // Try to get domains (this will validate the API key)
    try {
      const { data: domains, error: domainError } = await resend.domains.list()

      if (domainError) {
        console.log("Domain list error:", domainError)
        return NextResponse.json({
          success: false,
          error: "API key authentication failed",
          details: {
            hasApiKey: true,
            keyLength,
            keyPrefix: keyPrefix + "...",
            keyFormat: "valid_format_but_auth_failed",
            authError: domainError.message,
          },
        })
      }

      console.log("API key verified successfully")
      const domainsList = (domains as unknown as any[]) || []
      console.log("Available domains:", domainsList.length)

      return NextResponse.json({
        success: true,
        message: "API key is valid and working",
        details: {
          hasApiKey: true,
          keyLength,
          keyPrefix: keyPrefix + "...",
          keyFormat: "valid",
          domainsCount: domainsList.length,
          availableDomains: domainsList.map((d: any) => d.name) || [],
        },
      })
    } catch (resendError) {
      console.error("Resend API error:", resendError)
      return NextResponse.json({
        success: false,
        error: "Failed to connect to Resend API",
        details: {
          hasApiKey: true,
          keyLength,
          keyPrefix: keyPrefix + "...",
          keyFormat: "unknown",
          connectionError: resendError instanceof Error ? resendError.message : "Unknown error",
        },
      })
    }
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({
      success: false,
      error: "Verification process failed",
      details: {
        systemError: error instanceof Error ? error.message : "Unknown system error",
      },
    })
  }
}
