import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";
import { convertToFavicon, validateFaviconImage, createIcoFavicon } from "@/_lib/image-converter";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const faviconFile = formData.get("faviconFile") as File;

    if (!faviconFile) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Validar se é uma imagem
    if (!faviconFile.type.startsWith('image/')) {
      return NextResponse.json({ 
        error: "Arquivo deve ser uma imagem válida" 
      }, { status: 400 });
    }

    // Validar tamanho (máximo 5MB para permitir imagens maiores)
    if (faviconFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: "Arquivo muito grande. Máximo 5MB" 
      }, { status: 400 });
    }

    // Converter arquivo para buffer
    const bytes = await faviconFile.arrayBuffer();
    const imageBuffer = Buffer.from(bytes);

    // Validar imagem
    const validation = await validateFaviconImage(imageBuffer);
    
    // Converter para favicon otimizado
    const convertedFavicon = await convertToFavicon(imageBuffer, {
      size: 32,
      format: 'png',
      quality: 90
    });

    // Criar também um ICO para compatibilidade
    const icoFavicon = await createIcoFavicon(imageBuffer);

    // Salvar no banco de dados
    await Promise.all([
      db.siteConfig.upsert({
        where: { key: "barbershop_favicon_base64" },
        update: { 
          value: convertedFavicon.dataUrl, 
          type: "string",
          updatedAt: new Date()
        },
        create: {
          key: "barbershop_favicon_base64",
          value: convertedFavicon.dataUrl,
          type: "string"
        }
      }),
      db.siteConfig.upsert({
        where: { key: "barbershop_favicon_ico" },
        update: { 
          value: icoFavicon, 
          type: "string",
          updatedAt: new Date()
        },
        create: {
          key: "barbershop_favicon_ico",
          value: icoFavicon,
          type: "string"
        }
      }),
      db.siteConfig.upsert({
        where: { key: "barbershop_favicon_width" },
        update: { 
          value: String(convertedFavicon.width), 
          type: "number",
          updatedAt: new Date()
        },
        create: {
          key: "barbershop_favicon_width",
          value: String(convertedFavicon.width),
          type: "number"
        }
      }),
      db.siteConfig.upsert({
        where: { key: "barbershop_favicon_height" },
        update: { 
          value: String(convertedFavicon.height), 
          type: "number",
          updatedAt: new Date()
        },
        create: {
          key: "barbershop_favicon_height",
          value: String(convertedFavicon.height),
          type: "number"
        }
      })
    ]);

    return NextResponse.json({ 
      success: true,
      warnings: validation.warnings,
      suggestions: validation.suggestions,
      metadata: {
        width: convertedFavicon.width,
        height: convertedFavicon.height,
        format: convertedFavicon.format,
        size: convertedFavicon.size
      }
    });
  } catch (error) {
    console.error("Erro no upload de favicon:", error);
    return NextResponse.json({ 
      error: "Erro interno na conversão da imagem" 
    }, { status: 500 });
  }
}
