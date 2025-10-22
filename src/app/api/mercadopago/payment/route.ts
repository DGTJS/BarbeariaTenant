import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

// POST /api/mercadopago/payment - Criar pagamento via Mercado Pago
export async function POST(request: NextRequest) {
  try {
    const { amount, description, external_reference, notification_url } = await request.json();

    if (!amount || !description) {
      return NextResponse.json({ error: 'Amount e description são obrigatórios' }, { status: 400 });
    }

    // Obter token válido
    const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/token`);
    if (!tokenResponse.ok) {
      return NextResponse.json({ error: 'Mercado Pago não conectado ou token inválido' }, { status: 400 });
    }

    const { access_token } = await tokenResponse.json();

    // Criar pagamento no Mercado Pago
    const paymentData = {
      transaction_amount: parseFloat(amount),
      description: description,
      payment_method_id: "pix", // PIX por padrão
      external_reference: external_reference || `booking_${Date.now()}`,
      notification_url: notification_url || `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhook`,
      payer: {
        email: "customer@example.com" // Será preenchido com dados reais do cliente
      }
    };

    const paymentResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.text();
      console.error('Erro ao criar pagamento:', errorData);
      return NextResponse.json({ error: 'Falha ao criar pagamento no Mercado Pago' }, { status: 400 });
    }

    const payment = await paymentResponse.json();

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      payment_method_id: payment.payment_method_id,
      transaction_amount: payment.transaction_amount,
      external_reference: payment.external_reference,
      point_of_interaction: payment.point_of_interaction,
      init_point: payment.point_of_interaction?.transaction_data?.qr_code,
      qr_code: payment.point_of_interaction?.transaction_data?.qr_code_base64,
    });
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

