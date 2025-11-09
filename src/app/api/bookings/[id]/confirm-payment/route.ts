import { NextRequest, NextResponse } from "next/server";
import { getTenantDatabase, getSession } from "@/_lib/auth";
import { requireAdmin } from "@/_lib/admin-auth";

// PATCH /api/bookings/[id]/confirm-payment
// Confirma o pagamento de um agendamento (muda status de "Aguardando Pagamento" para "Confirmado")
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // CRÍTICO: Verificar permissão usando sistema customizado
    const session = await getSession(request);
    
    try {
      await requireAdmin(session, request);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Acesso negado. Apenas administradores e barbeiros podem confirmar pagamentos.",
        },
        { status: 403 }
      );
    }

    // CRÍTICO: Obter banco do tenant correto
    const db = await getTenantDatabase(request);
    const hostname = request.headers.get("host") || "";
    console.log(`🔍 [CONFIRM-PAYMENT] Confirmando pagamento no tenant: ${hostname}`);

    const { id } = await params;

    // Buscar agendamento atual
    const currentBooking = await db.booking.findUnique({
      where: { id },
      include: {
        service: true,
        barber: true,
        user: true,
      },
    });

    if (!currentBooking) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o status atual permite confirmação de pagamento
    const currentStatus = (currentBooking.status || "").toLowerCase();
    if (
      currentStatus !== "aguardando pagamento" &&
      currentStatus !== "aguardandopagamento"
    ) {
      return NextResponse.json(
        {
          error: `Não é possível confirmar pagamento. Status atual: ${currentBooking.status}`,
        },
        { status: 400 }
      );
    }

    // Atualizar status para "Confirmado"
    const updatedBooking = await db.booking.update({
      where: { id },
      data: {
        status: "Confirmado",
        updatedAt: new Date(),
      },
      include: {
        service: {
          select: { id: true, name: true, imageUrl: true },
        },
        barber: { select: { id: true, name: true, photo: true } },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
      },
    });

    console.log(`✅ [CONFIRM-PAYMENT] Pagamento confirmado com sucesso no tenant: ${hostname}`, updatedBooking.id);

    return NextResponse.json({
      ...updatedBooking,
      totalPrice: Number(updatedBooking.totalPrice ?? 0),
    });
  } catch (error) {
    console.error("Erro ao confirmar pagamento:", error);
    return NextResponse.json(
      {
        error: "Erro ao confirmar pagamento",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
