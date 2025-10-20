import { NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function GET() {
  try {
    const activeTheme = await db.theme.findFirst({
      where: { isActive: true },
    });

    if (!activeTheme) {
      return NextResponse.json({ colors: {} });
    }

    return NextResponse.json(activeTheme.colors);
  } catch (error) {
    console.error("Error fetching active theme:", error);
    return NextResponse.json({ colors: {} });
  }
}

