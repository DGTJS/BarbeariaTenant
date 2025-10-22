import { NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function GET() {
  try {
    const services = await db.barberShopService.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(services);
  } catch (e) {
    return NextResponse.json({ error: "Erro ao listar serviços" }, { status: 500 });
  }
}



