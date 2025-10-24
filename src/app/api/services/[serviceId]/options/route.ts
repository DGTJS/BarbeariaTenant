import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const serviceId = params.serviceId;

    const options = await db.serviceOption.findMany({
      where: {
        serviceId: serviceId,
        status: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Converter Decimal para number
    const formattedOptions = options.map(option => ({
      ...option,
      price: Number(option.price)
    }));

    return NextResponse.json(formattedOptions);

  } catch (error) {
    console.error('Erro ao buscar opções do serviço:', error);
    return NextResponse.json(
      { error: "Erro ao buscar opções do serviço" },
      { status: 500 }
    );
  }
}
