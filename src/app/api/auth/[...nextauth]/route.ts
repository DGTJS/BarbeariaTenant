// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/_lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    // Provider de credenciais para login simples
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Nome", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        try {
          // Verificar se o usuário já existe
          let user = await db.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            // Criar novo usuário se não existir
            user = await db.user.create({
              data: {
                email: credentials.email,
                name: credentials.name || "Usuário",
              },
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Erro ao autenticar usuário:", error);
          return null;
        }
      },
    }),
    // GoogleProvider só será usado se as variáveis de ambiente estiverem configuradas
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/api/auth/signin',
    error: '/api/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      } else if (token.sub) {
        // Se não temos user mas temos sub (ID do Google), usar o sub
        token.id = token.sub;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && token.id) {
        session.user.id = token.id as string;
      }
      
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Verificar se o usuário já existe
          const existingUser = await db.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Criar novo usuário se não existir
            const newUser = await db.user.create({
              data: {
                id: user.id,
                email: user.email!,
                name: user.name,
                image: user.image,
              },
            });
            // Atualizar o user.id com o ID do banco
            user.id = newUser.id;
          } else {
            // Atualizar o user.id com o ID do banco
            user.id = existingUser.id;
          }
        } catch (error) {
          console.error("Erro ao criar/verificar usuário:", error);
        }
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
