import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      name,
      year,
      month,
      day,
      hour,
      minute,
      gender,
      characterName,
      characterElement,
      compatibility,
      sajuMessage,
      dailyFortune,
      luckyItem,
      luckyColor,
      luckyNumber,
    } = data;

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const csvPath = path.join(dataDir, "user_results.csv");
    const timestamp = new Date().toISOString();

    // CSV header
    const header = "timestamp,name,birthYear,birthMonth,birthDay,birthHour,birthMinute,gender,characterName,characterElement,compatibility,sajuMessage,dailyFortune,luckyItem,luckyColor,luckyNumber\n";

    // Escape CSV values (handle commas and quotes)
    const escapeCSV = (value: string | number) => {
      const str = String(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // CSV row
    const row = [
      timestamp,
      name,
      year,
      month,
      day,
      hour,
      minute,
      gender,
      characterName,
      characterElement,
      compatibility,
      sajuMessage,
      dailyFortune,
      luckyItem,
      luckyColor,
      luckyNumber,
    ].map(escapeCSV).join(",") + "\n";

    // Check if file exists, if not create with header
    if (!fs.existsSync(csvPath)) {
      fs.writeFileSync(csvPath, header + row, "utf8");
    } else {
      fs.appendFileSync(csvPath, row, "utf8");
    }

    return NextResponse.json({ success: true, message: "Data saved successfully" });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save data" },
      { status: 500 }
    );
  }
}
