import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function GET() {
  try {
    // Buscar configuração do sistema de barbearias
    const config = await db.siteConfig.findUnique({
      where: { key: "barbershop_system_enabled" }
    });

    const isEnabled = config?.value === "true";

    return NextResponse.json({ 
      enabled: isEnabled,
      message: isEnabled ? "Sistema de barbearias individuais ativado" : "Sistema de barbearias unificado ativado"
    });
  } catch (error) {
    console.error("Erro ao buscar configuração do sistema de barbearias:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { enabled } = await request.json();

    if (typeof enabled !== "boolean") {
      return NextResponse.json(
        { error: "Parâmetro 'enabled' deve ser um boolean" },
        { status: 400 }
      );
    }

    // Atualizar ou criar configuração
    await db.siteConfig.upsert({
      where: { key: "barbershop_system_enabled" },
      update: { 
        value: enabled.toString(),
        type: "boolean"
      },
      create: {
        key: "barbershop_system_enabled",
        value: enabled.toString(),
        type: "boolean"
      }
    });

    // Se desabilitando o sistema, mover todos os barbeiros e serviços para a barbearia global
    if (!enabled) {
      await moveToGlobalBarberShop();
    } else {
      // Se ativando o sistema, remover todas as barbearias e deixar barbeiros/serviços sem associação
      await removeAllBarberShops();
    }

    return NextResponse.json({ 
      success: true,
      enabled,
      message: enabled 
        ? "Sistema de barbearias individuais ativado - todas as barbearias foram removidas do sistema" 
        : "Sistema de barbearias unificado ativado - todos os barbeiros e serviços foram movidos para a barbearia global"
    });
  } catch (error) {
    console.error("Erro ao atualizar configuração do sistema de barbearias:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

async function moveToGlobalBarberShop() {
  try {
    // Buscar ou criar barbearia global
    let globalBarberShop = await db.barberShop.findFirst({
      where: { name: "Serviços" }
    });

    if (!globalBarberShop) {
      globalBarberShop = await db.barberShop.create({
        data: {
          name: "Serviços",
          address: "Sistema Unificado",
          status: true
        }
      });
    }

    // Mover todos os barbeiros para a barbearia global
    await db.barber.updateMany({
      where: {},
      data: { barberShopId: globalBarberShop.id }
    });

    // Mover todos os serviços para a barbearia global
    await db.barberShopService.updateMany({
      where: {},
      data: { barberShopId: globalBarberShop.id }
    });

    console.log("Todos os barbeiros e serviços foram movidos para a barbearia global");
  } catch (error) {
    console.error("Erro ao mover barbeiros e serviços para barbearia global:", error);
    throw error;
  }
}

async function removeAllBarberShops() {
  try {
    // Primeiro, remover associações de barbeiros com barbearias
    await db.barber.updateMany({
      where: {},
      data: { barberShopId: undefined }
    });

    // Remover associações de serviços com barbearias
    await db.barberShopService.updateMany({
      where: {},
      data: { barberShopId: undefined }
    });

    // Remover todas as barbearias
    await db.barberShop.deleteMany({
      where: {}
    });

    console.log("Todas as barbearias foram removidas do sistema");
  } catch (error) {
    console.error("Erro ao remover barbearias do sistema:", error);
    throw error;
  }
}
