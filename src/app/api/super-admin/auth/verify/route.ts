import { NextRequest, NextResponse } from "next/server";
import { getSuperAdminSession } from "@/_lib/super-admin-auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSuperAdminSession();

    if (session) {
      return NextResponse.json({
        authenticated: true,
        email: session.email,
      });
    }

    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}

