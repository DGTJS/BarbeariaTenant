import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

// POST /api/admin/logo - recebe multipart/form-data com:
// - logoFile: File (png/jpeg/webp)
// - width: number (opcional, mas recomendado)
// - height: number (opcional, mas recomendado)
// Armazena: base64 da imagem em SiteConfig (barbershop_logo_base64) e dimensões em barbershop_logo_width/height
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Content-Type inválido" }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("logoFile");
    const widthStr = formData.get("width");
    const heightStr = formData.get("height");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo de logo é obrigatório" }, { status: 400 });
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de imagem não permitido" }, { status: 400 });
    }

    const maxSizeBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: "Imagem excede 2MB" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const parsedWidth = widthStr ? Number(widthStr) : undefined;
    const parsedHeight = heightStr ? Number(heightStr) : undefined;
    if ((parsedWidth && parsedWidth <= 0) || (parsedHeight && parsedHeight <= 0)) {
      return NextResponse.json({ error: "Dimensões inválidas" }, { status: 400 });
    }

    // Persistir em SiteConfig
    await Promise.all([
      db.siteConfig.upsert({
        where: { key: "barbershop_logo_base64" },
        update: { value: dataUrl, type: "string" },
        create: { key: "barbershop_logo_base64", value: dataUrl, type: "string" },
      }),
      typeof parsedWidth === "number"
        ? db.siteConfig.upsert({
            where: { key: "barbershop_logo_width" },
            update: { value: String(parsedWidth), type: "number" },
            create: { key: "barbershop_logo_width", value: String(parsedWidth), type: "number" },
          })
        : Promise.resolve(),
      typeof parsedHeight === "number"
        ? db.siteConfig.upsert({
            where: { key: "barbershop_logo_height" },
            update: { value: String(parsedHeight), type: "number" },
            create: { key: "barbershop_logo_height", value: String(parsedHeight), type: "number" },
          })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no upload de logo:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}



