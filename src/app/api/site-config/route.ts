import { NextRequest, NextResponse } from "next/server";
import { getTenantDatabase } from "@/_lib/auth";

// Rota pública para buscar configurações do site
export async function GET(request: NextRequest) {
  try {
    // CRÍTICO: Obter banco do tenant correto
    const db = await getTenantDatabase(request);
    const hostname = request.headers.get("host") || "";
    
    console.log(`🔄 [SITE-CONFIG PUBLIC] Buscando configurações no banco do tenant: ${hostname}`);
    
    const configs = await db.siteConfig.findMany({
      where: {
        key: {
          in: [
            'barbershop_name',
            'barbershop_street',
            'barbershop_number',
            'barbershop_complement',
            'barbershop_neighborhood',
            'barbershop_city',
            'barbershop_state',
            'barbershop_zipcode',
            'barbershop_phone',
            'barbershop_email',
            'barbershop_description',
            'barbershop_logo_url',
            'barbershop_favicon_ico'
          ]
        }
      }
    });

    // Mapear para formato mais simples (remover prefixo "barbershop_")
    const configObj: Record<string, string> = {};
    configs.forEach(config => {
      const key = config.key.replace('barbershop_', '');
      configObj[key] = config.value;
    });

    // Montar endereço completo formatado
    const addressParts = [];
    if (configObj.street) {
      let streetLine = configObj.street;
      if (configObj.number) streetLine += `, ${configObj.number}`;
      if (configObj.complement) streetLine += ` - ${configObj.complement}`;
      addressParts.push(streetLine);
    }
    if (configObj.neighborhood) addressParts.push(configObj.neighborhood);
    if (configObj.city && configObj.state) {
      addressParts.push(`${configObj.city} - ${configObj.state}`);
    } else if (configObj.city) {
      addressParts.push(configObj.city);
    }
    if (configObj.zipcode) addressParts.push(`CEP: ${configObj.zipcode}`);

    // Adicionar endereço formatado
    configObj.address = addressParts.join(', ');

    // Garantir que sempre retorna name e address (mesmo que vazios)
    if (!configObj.name) configObj.name = '';
    if (!configObj.address) configObj.address = '';

    console.log('✅ [SITE-CONFIG PUBLIC] Retornando configurações:', {
      name: configObj.name || '(vazio)',
      address: configObj.address || '(vazio)',
      addressLength: configObj.address?.length || 0,
      street: configObj.street || '(vazio)',
      city: configObj.city || '(vazio)'
    });

    return NextResponse.json(configObj);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: "Erro ao buscar configurações" },
      { status: 500 }
    );
  }
}

