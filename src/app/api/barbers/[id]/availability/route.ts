import { NextRequest, NextResponse } from "next/server";
import { calculateBarberAvailability } from "@/_lib/availability";
import { getTenantDatabase } from "@/_lib/auth";
import { parse } from "date-fns";

/**
 * GET /api/barbers/{id}/availability
 * Retorna disponibilidade de um barbeiro para um serviço
 * 
 * Query params:
 * - serviceId: ID do serviço (obrigatório)
 * - from: Data inicial no formato YYYY-MM-DD (obrigatório)
 * - to: Data final no formato YYYY-MM-DD (obrigatório)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: barberId } = await params;
    const searchParams = request.nextUrl.searchParams;

    // Validar parâmetros
    const serviceId = searchParams.get("serviceId");
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");

    if (!serviceId) {
      return NextResponse.json(
        { error: "serviceId é obrigatório" },
        { status: 400 }
      );
    }

    if (!fromStr || !toStr) {
      return NextResponse.json(
        { error: "from e to são obrigatórios (formato: YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    // Parsear datas
    const fromDate = parse(fromStr, "yyyy-MM-dd", new Date());
    const toDate = parse(toStr, "yyyy-MM-dd", new Date());

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return NextResponse.json(
        { error: "Formato de data inválido. Use: YYYY-MM-DD" },
        { status: 400 }
      );
    }

    if (fromDate > toDate) {
      return NextResponse.json(
        { error: "'from' não pode ser maior que 'to'" },
        { status: 400 }
      );
    }

    // CRÍTICO: Obter banco do tenant correto
    const db = await getTenantDatabase(request);
    
    // Calcular disponibilidade
    const availability = await calculateBarberAvailability(
      barberId,
      serviceId,
      fromDate,
      toDate,
      db
    );

    return NextResponse.json(availability);
  } catch (error: any) {
    console.error("Erro ao calcular disponibilidade:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao calcular disponibilidade" },
      { status: 500 }
    );
  }
}

