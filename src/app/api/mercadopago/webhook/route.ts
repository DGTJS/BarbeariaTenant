import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

// POST /api/mercadopago/webhook - Webhook para notificações do Mercado Pago
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'payment') {
      const paymentId = data.id;
      
      // Obter token válido para consultar o pagamento
      const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/token`);
      if (!tokenResponse.ok) {
        console.error('Token inválido para consultar pagamento');
        return NextResponse.json({ error: 'Token inválido' }, { status: 400 });
      }

      const { access_token } = await tokenResponse.json();

      // Consultar detalhes do pagamento
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      if (!paymentResponse.ok) {
        console.error('Erro ao consultar pagamento:', await paymentResponse.text());
        return NextResponse.json({ error: 'Falha ao consultar pagamento' }, { status: 400 });
      }

      const payment = await paymentResponse.json();
      const { status, external_reference, transaction_amount } = payment;

      console.log(`Pagamento ${paymentId} atualizado:`, {
        status,
        external_reference,
        transaction_amount
      });

      // Aqui você pode atualizar o status do agendamento no banco de dados
      // baseado no external_reference e status do pagamento
      
      if (status === 'approved') {
        // Pagamento aprovado - confirmar agendamento
        console.log(`Agendamento ${external_reference} confirmado via pagamento ${paymentId}`);
        
        // TODO: Atualizar status do agendamento no banco de dados
        // await db.booking.update({
        //   where: { id: external_reference },
        //   data: { status: 'confirmed', paymentId: paymentId }
        // });
      } else if (status === 'rejected' || status === 'cancelled') {
        // Pagamento rejeitado/cancelado - cancelar agendamento
        console.log(`Agendamento ${external_reference} cancelado via pagamento ${paymentId}`);
        
        // TODO: Atualizar status do agendamento no banco de dados
        // await db.booking.update({
        //   where: { id: external_reference },
        //   data: { status: 'cancelled', paymentId: paymentId }
        // });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erro no webhook Mercado Pago:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

