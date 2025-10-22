import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/_providers/auth-options";
import { disconnectMercadoPago } from "@/_lib/mercadopago";

// DELETE /api/mercadopago/disconnect - Desconecta Mercado Pago do usuário
export async function DELETE(request: NextRequest) {
  try {
    // Verificar se usuário está logado
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'Usuário não autenticado' 
      }, { status: 401 });
    }

    // Desconectar Mercado Pago do usuário
    const success = await disconnectMercadoPago(session.user.id);
    
    if (!success) {
      return NextResponse.json({ 
        error: 'Erro ao desconectar Mercado Pago' 
      }, { status: 500 });
    }

    console.log(`Mercado Pago desconectado para usuário ${session.user.id}`);

    return NextResponse.json({
      success: true,
      message: 'Mercado Pago desconectado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao desconectar Mercado Pago:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

