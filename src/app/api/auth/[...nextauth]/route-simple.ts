/**
 * Implementação SIMPLIFICADA do NextAuth seguindo a documentação oficial
 * Esta é uma versão limpa que deve funcionar corretamente
 */

import NextAuth, { type NextAuthOptions } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { db as defaultDb } from "@/_lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

// Função para criar opções do NextAuth
async function getAuthOptions(req: NextRequest): Promise<NextAuthOptions> {
  const dbToUse = defaultDb;

  const providers: any[] = [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
        name: { label: "Nome", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        try {
          const email = credentials.email.trim().toLowerCase();
          let user = await dbToUse.user.findUnique({
            where: { email },
            include: { barber: true },
          });

          if (!user) {
            const barber = await dbToUse.barber.findUnique({
              where: { email },
              include: { user: { include: { barber: true } } },
            });

            if (barber?.user) {
              user = barber.user;
              if (credentials.password && barber.password) {
                const passwordMatch = await bcrypt.compare(
                  credentials.password,
                  barber.password
                );
                if (!passwordMatch) {
                  return null;
                }
              }
            }
          }

          if (!user && credentials.name) {
            const isAdminEmail =
              email.includes("admin@") ||
              email === "admin@barbearia.com" ||
              email.endsWith("@admin.com");

            try {
              user = await dbToUse.user.create({
                data: {
                  email,
                  name: credentials.name.trim() || "Usuário",
                  role: isAdminEmail ? 1 : 3,
                },
                include: { barber: true },
              });
            } catch (createError: any) {
              if (createError?.code === "P2002") {
                user = await dbToUse.user.findUnique({
                  where: { email },
                  include: { barber: true },
                });
              } else {
                throw createError;
              }
            }
          }

          if (user && credentials.password && user.password) {
            const passwordMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (!passwordMatch) {
              return null;
            }
          }

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.role,
            };
          }

          return null;
        } catch (error: any) {
          console.error("[NextAuth Authorize] Erro:", error);
          return null;
        }
      },
    }),
  ];

  // Adicionar Google Provider
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    );
  }

  return {
    secret: process.env.NEXTAUTH_SECRET,
    providers,
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/api/auth/signin",
      error: "/api/auth/error",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.role = user.role;
          token.sub = user.id;
        } else if (token.sub) {
          token.id = token.sub;
          if (!token.role) {
            try {
              const dbUser = await dbToUse.user.findUnique({
                where: { id: token.sub as string },
                select: { role: true },
              });
              if (dbUser) {
                token.role = dbUser.role;
              }
            } catch (error) {
              console.error("[NextAuth JWT] Erro ao buscar role:", error);
            }
          }
        }
        return token;
      },
      async session({ session, token }) {
        if (token && token.id) {
          session.user.id = token.id as string;
          session.user.role = (token.role as number | string | null) ?? null;
        }
        return session;
      },
      async signIn({ user, account }) {
        if (account?.provider === "google" && user?.email) {
          try {
            const existingUser = await dbToUse.user.findUnique({
              where: { email: user.email },
            });

            if (!existingUser) {
              await dbToUse.user.create({
                data: {
                  email: user.email,
                  name: user.name || "Usuário",
                  image: user.image,
                  role: 3,
                },
              });
            }

            return true;
          } catch (error: any) {
            console.error("[NextAuth SignIn] Erro ao processar Google OAuth:", error);
            return true;
          }
        }
        return true;
      },
    },
  };
}

// Handler GET - Formato oficial do NextAuth v4 App Router
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ nextauth: string[] }> }
) {
  const authOptions = await getAuthOptions(req);
  const handler = NextAuth(authOptions);

  const resolvedParams = await params;
  const url = new URL(req.url);
  
  // Construir query params no formato esperado pelo NextAuth
  const query: Record<string, string | string[]> = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });
  query.nextauth = resolvedParams.nextauth || [];

  // Criar request no formato esperado pelo NextAuth
  const compatibleReq = {
    method: "GET",
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    query,
  } as any;

  // Criar response mock simples
  let responseStatus = 200;
  let responseBody: any = null;
  const responseHeaders: Record<string, string | string[]> = {};
  const setCookieArray: string[] = [];

  const mockRes = {
    status: (status: number) => {
      responseStatus = status;
      return mockRes;
    },
    json: (body: any) => {
      responseBody = body;
      return mockRes;
    },
    send: (body: any) => {
      responseBody = body;
      return mockRes;
    },
    redirect: (url: string) => {
      responseStatus = 302;
      responseHeaders.Location = url;
      return mockRes;
    },
    setHeader: (name: string, value: string | string[]) => {
      if (name.toLowerCase() === "set-cookie") {
        if (Array.isArray(value)) {
          setCookieArray.push(...value);
        } else {
          setCookieArray.push(value);
        }
      } else {
        responseHeaders[name] = Array.isArray(value)
          ? value.join(", ")
          : value;
      }
      return mockRes;
    },
    getHeader: (name: string) => responseHeaders[name],
    getHeaders: () => responseHeaders,
    end: () => mockRes,
  } as any;

  try {
    await handler(compatibleReq, mockRes);

    // Processar resposta
    const locationHeader = Array.isArray(responseHeaders.Location)
      ? responseHeaders.Location[0]
      : responseHeaders.Location;

    if (locationHeader && typeof locationHeader === "string") {
      const redirectResponse = NextResponse.redirect(
        locationHeader,
        responseStatus
      );
      setCookieArray.forEach((cookie) => {
        redirectResponse.headers.append("Set-Cookie", cookie);
      });
      return redirectResponse;
    }

    const filteredHeaders: Record<string, string> = {};
    Object.entries(responseHeaders).forEach(([key, value]) => {
      if (
        key.toLowerCase() !== "set-cookie" &&
        key.toLowerCase() !== "location"
      ) {
        filteredHeaders[key] =
          typeof value === "string" ? value : String(value);
      }
    });

    const response =
      responseBody !== null
        ? NextResponse.json(responseBody, {
            status: responseStatus,
            headers: filteredHeaders,
          })
        : NextResponse.json({}, { status: responseStatus, headers: filteredHeaders });

    setCookieArray.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });

    return response;
  } catch (error: any) {
    console.error("[NextAuth GET] Erro:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error?.message },
      { status: 500 }
    );
  }
}

// Handler POST - Formato oficial do NextAuth v4 App Router
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ nextauth: string[] }> }
) {
  const authOptions = await getAuthOptions(req);
  const handler = NextAuth(authOptions);

  const resolvedParams = await params;
  const url = new URL(req.url);

  const query: Record<string, string | string[]> = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });
  query.nextauth = resolvedParams.nextauth || [];

  // Ler body
  let body: any = null;
  const contentType = req.headers.get("content-type") || "";

  try {
    const bodyText = await req.text();

    if (contentType.includes("application/json")) {
      body = JSON.parse(bodyText);
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      url.pathname.includes("/callback")
    ) {
      const formData = new URLSearchParams(bodyText);
      body = Object.fromEntries(formData.entries());
    }
  } catch (error) {
    console.error("[NextAuth POST] Erro ao ler body:", error);
  }

  const compatibleReq = {
    method: "POST",
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    query,
    body,
  } as any;

  let responseStatus = 200;
  let responseBody: any = null;
  const responseHeaders: Record<string, string | string[]> = {};
  const setCookieArray: string[] = [];

  const mockRes = {
    status: (status: number) => {
      responseStatus = status;
      return mockRes;
    },
    json: (body: any) => {
      responseBody = body;
      return mockRes;
    },
    send: (body: any) => {
      responseBody = body;
      return mockRes;
    },
    redirect: (url: string) => {
      responseStatus = 302;
      responseHeaders.Location = url;
      return mockRes;
    },
    setHeader: (name: string, value: string | string[]) => {
      if (name.toLowerCase() === "set-cookie") {
        if (Array.isArray(value)) {
          setCookieArray.push(...value);
        } else {
          setCookieArray.push(value);
        }
      } else {
        responseHeaders[name] = Array.isArray(value)
          ? value.join(", ")
          : value;
      }
      return mockRes;
    },
    getHeader: (name: string) => responseHeaders[name],
    getHeaders: () => responseHeaders,
    end: () => mockRes,
  } as any;

  try {
    await handler(compatibleReq, mockRes);

    const locationHeader = Array.isArray(responseHeaders.Location)
      ? responseHeaders.Location[0]
      : responseHeaders.Location;

    if (locationHeader && typeof locationHeader === "string") {
      const redirectResponse = NextResponse.redirect(
        locationHeader,
        responseStatus
      );
      setCookieArray.forEach((cookie) => {
        redirectResponse.headers.append("Set-Cookie", cookie);
      });
      return redirectResponse;
    }

    const filteredHeaders: Record<string, string> = {};
    Object.entries(responseHeaders).forEach(([key, value]) => {
      if (
        key.toLowerCase() !== "set-cookie" &&
        key.toLowerCase() !== "location"
      ) {
        filteredHeaders[key] =
          typeof value === "string" ? value : String(value);
      }
    });

    const response =
      responseBody !== null
        ? NextResponse.json(responseBody, {
            status: responseStatus,
            headers: filteredHeaders,
          })
        : NextResponse.json({}, { status: responseStatus, headers: filteredHeaders });

    setCookieArray.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });

    return response;
  } catch (error: any) {
    console.error("[NextAuth POST] Erro:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error?.message },
      { status: 500 }
    );
  }
}

