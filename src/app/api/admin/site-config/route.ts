import { NextRequest, NextResponse } from "next/server";
import { db } from "@/_lib/prisma";

// GET - Retorna todas as configurações do SiteConfig como um mapa key -> parsed value
export async function GET() {
  try {
    const configs = await db.siteConfig.findMany();

    const result: Record<string, any> = {};
    for (const cfg of configs) {
      let value: any = cfg.value;
      switch (cfg.type) {
        case "number":
          value = parseFloat(cfg.value);
          break;
        case "boolean":
          value = cfg.value === "true";
          break;
        case "array":
          try {
            value = JSON.parse(cfg.value);
          } catch {
            value = [];
          }
          break;
        default:
          value = cfg.value;
      }
      result[cfg.key] = value;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar site configs:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// PUT - Atualiza múltiplas configurações em uma única chamada
// Body pode ser:
// { configs: { key: { value, type? } } }
// ou um objeto chato { key: value }
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    let entries: Array<{ key: string; value: any; type?: string }> = [];

    if (body?.configs && typeof body.configs === "object") {
      entries = Object.entries(body.configs).map(([key, def]: any) => ({
        key,
        value: def?.value,
        type: def?.type,
      }));
    } else if (body && typeof body === "object") {
      entries = Object.entries(body).map(([key, value]) => ({ key, value }));
    }

    if (!entries.length) {
      return NextResponse.json(
        { error: "Nenhuma configuração para atualizar" },
        { status: 400 }
      );
    }

    await Promise.all(
      entries.map(async ({ key, value, type }) => {
        const normalizedType = type
          ? type
          : Array.isArray(value)
          ? "array"
          : typeof value === "boolean"
          ? "boolean"
          : typeof value === "number"
          ? "number"
          : "string";

        const stringValue = Array.isArray(value)
          ? JSON.stringify(value)
          : typeof value === "string" ? value : value?.toString?.() ?? "";

        await db.siteConfig.upsert({
          where: { key },
          update: { value: stringValue, type: normalizedType },
          create: { key, value: stringValue, type: normalizedType },
        });
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar site configs:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}



