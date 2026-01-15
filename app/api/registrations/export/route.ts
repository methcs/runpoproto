import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const raceId = request.nextUrl.searchParams.get("raceId")
    const format = request.nextUrl.searchParams.get("format") || "csv"

    if (!raceId) {
      return NextResponse.json({ error: "Missing raceId parameter" }, { status: 400 })
    }

    // Get race with registrations
    const race = await prisma.race.findUnique({
      where: { externalId: parseInt(raceId) },
      include: {
        registrations: {
          orderBy: { registrationDate: "asc" },
        },
      },
    })

    if (!race) {
      return NextResponse.json({ error: "Race not found" }, { status: 404 })
    }

    if (format === "json") {
      return NextResponse.json(race)
    }

    // Generate CSV
    const headers = ["Sıra", "Ad", "Soyad", "E-Mail", "Kayıt Tarihi"]
    const rows = race.registrations.map((reg, index) => [
      index + 1,
      reg.name,
      reg.surname,
      reg.email,
      new Date(reg.registrationDate).toLocaleDateString("tr-TR"),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    // Add UTF-8 BOM for proper Turkish character display in Excel
    const BOM = "\uFEFF"
    const csvWithBOM = BOM + csvContent

    return new NextResponse(csvWithBOM, {
      status: 200,
      headers: {
        "Content-Type": "text/csv;charset=utf-8",
        "Content-Disposition": `attachment; filename="${race.title.replace(
          /\s+/g,
          "_"
        )}_Katilimcilar_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json(
      { error: "Failed to export registrations" },
      { status: 500 }
    )
  }
}
