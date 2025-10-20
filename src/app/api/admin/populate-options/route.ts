import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Iniciando população das opções de serviços...');

    // Buscar todos os serviços
    const services = await db.barberShopService.findMany({
      where: { status: true }
    });

    console.log(`📋 Encontrados ${services.length} serviços`);

    // Mapear opções por nome do serviço
    const serviceOptionsMap: { [key: string]: any[] } = {
      "Corte de Cabelo": [
        { name: "Degradê", description: "Corte com degradê nas laterais", price: 25, duration: 30 },
        { name: "Social", description: "Corte social clássico", price: 20, duration: 25 },
        { name: "Militar", description: "Corte militar curto", price: 18, duration: 20 },
        { name: "Moicano", description: "Corte moicano moderno", price: 30, duration: 35 },
        { name: "Undercut", description: "Corte undercut moderno", price: 28, duration: 32 },
        { name: "Pompadour", description: "Corte pompadour clássico", price: 32, duration: 35 }
      ],
      "Barba": [
        { name: "Barba Completa", description: "Aparar e modelar barba completa", price: 15, duration: 20 },
        { name: "Bigode", description: "Aparar e modelar bigode", price: 10, duration: 15 },
        { name: "Barba + Bigode", description: "Barba e bigode completos", price: 20, duration: 25 },
        { name: "Barba Riscada", description: "Barba com riscos e desenhos", price: 25, duration: 30 },
        { name: "Barba Longa", description: "Modelagem de barba longa", price: 18, duration: 25 }
      ],
      "Sobrancelha": [
        { name: "Design Simples", description: "Design básico das sobrancelhas", price: 12, duration: 15 },
        { name: "Design Completo", description: "Design completo com modelagem", price: 18, duration: 20 },
        { name: "Henna", description: "Design com henna para realçar", price: 25, duration: 25 },
        { name: "Microblading", description: "Técnica de microblading", price: 35, duration: 45 }
      ],
      "Pézinho": [
        { name: "Pézinho Simples", description: "Acabamento básico do pézinho", price: 15, duration: 15 },
        { name: "Pézinho Detalhado", description: "Acabamento detalhado e preciso", price: 20, duration: 20 },
        { name: "Pézinho + Nuca", description: "Acabamento completo da nuca", price: 25, duration: 25 }
      ],
      "Massagem": [
        { name: "Massagem Relaxante", description: "Massagem para relaxamento total", price: 40, duration: 30 },
        { name: "Massagem Terapêutica", description: "Massagem para alívio de tensões", price: 50, duration: 40 },
        { name: "Massagem Facial", description: "Massagem facial revitalizante", price: 35, duration: 25 },
        { name: "Massagem Capilar", description: "Massagem no couro cabeludo", price: 25, duration: 20 }
      ],
      "Hidratação": [
        { name: "Hidratação Básica", description: "Hidratação simples do cabelo", price: 20, duration: 20 },
        { name: "Hidratação Profunda", description: "Hidratação profunda e nutritiva", price: 30, duration: 30 },
        { name: "Hidratação + Barba", description: "Hidratação completa cabelo e barba", price: 35, duration: 35 },
        { name: "Tratamento Premium", description: "Tratamento premium com queratina", price: 45, duration: 45 }
      ]
    };

    let totalCreated = 0;

    for (const service of services) {
      const options = serviceOptionsMap[service.name];
      
      if (options) {
        console.log(`🔧 Criando opções para: ${service.name}`);
        
        for (const option of options) {
          // Verificar se a opção já existe
          const existingOption = await db.serviceOption.findFirst({
            where: {
              serviceId: service.id,
              name: option.name
            }
          });

          if (!existingOption) {
            await db.serviceOption.create({
              data: {
                serviceId: service.id,
                name: option.name,
                description: option.description,
                price: option.price,
                duration: option.duration,
                status: true
              }
            });
            totalCreated++;
            console.log(`  ✅ Criada opção: ${option.name}`);
          } else {
            console.log(`  ⚠️  Opção já existe: ${option.name}`);
          }
        }
      } else {
        // Criar opção padrão para serviços sem opções específicas
        const existingDefault = await db.serviceOption.findFirst({
          where: {
            serviceId: service.id,
            name: "Padrão"
          }
        });

        if (!existingDefault) {
          await db.serviceOption.create({
            data: {
              serviceId: service.id,
              name: "Padrão",
              description: "Serviço padrão",
              price: service.price,
              duration: service.duration,
              status: true
            }
          });
          totalCreated++;
          console.log(`  ✅ Criada opção padrão para: ${service.name}`);
        }
      }
    }

    console.log(`🎉 População concluída! ${totalCreated} opções criadas.`);

    return NextResponse.json({
      success: true,
      message: `População concluída! ${totalCreated} opções criadas.`,
      totalCreated
    });

  } catch (error) {
    console.error('❌ Erro na população:', error);
    return NextResponse.json(
      { success: false, error: "Erro ao popular opções de serviços", details: error },
      { status: 500 }
    );
  }
}
