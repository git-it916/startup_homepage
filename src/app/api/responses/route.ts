import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "responses.json");

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// GET - Retrieve all responses
export async function GET() {
  try {
    ensureDataDir();
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const responses = JSON.parse(data);
    return NextResponse.json(responses);
  } catch (error) {
    console.error("Error reading responses:", error);
    return NextResponse.json({ error: "Failed to read responses" }, { status: 500 });
  }
}

// POST - Save a new response
export async function POST(request: NextRequest) {
  try {
    ensureDataDir();
    const body = await request.json();

    const newResponse = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...body,
    };

    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const responses = JSON.parse(data);
    responses.push(newResponse);

    fs.writeFileSync(DATA_FILE, JSON.stringify(responses, null, 2));

    return NextResponse.json(newResponse, { status: 201 });
  } catch (error) {
    console.error("Error saving response:", error);
    return NextResponse.json({ error: "Failed to save response" }, { status: 500 });
  }
}
