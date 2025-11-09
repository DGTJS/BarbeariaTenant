"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/_components/ui/button";
import { Card, CardContent } from "@/_components/ui/card";
import {
  Home,
  ArrowLeft,
  Search,
  Calendar,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import DynamicLogo from "@/_components/dynamic-logo";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Atualizar countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Redirecionar quando countdown chegar a 0
  useEffect(() => {
    if (countdown === 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Usar setTimeout para garantir que a navegação aconteça após a renderização
      const timeout = setTimeout(() => {
        router.push("/");
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <div className="text-center space-y-8">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                  <DynamicLogo
                    width={100}
                    height={100}
                    className="relative z-10"
                  />
                </div>
              </div>

              {/* 404 Grande */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-3xl"></div>
                <h1 className="text-9xl md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/50 leading-none relative z-10">
                  404
                </h1>
              </div>

              {/* Ícone de Alerta */}
              <div className="flex justify-center -mt-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full"></div>
                  <AlertCircle className="h-16 w-16 text-yellow-500 relative z-10 animate-pulse" />
                </div>
              </div>

              {/* Mensagem */}
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Página Não Encontrada
                </h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Ops! Parece que você se perdeu. A página que você está
                  procurando não existe ou foi removida.
                </p>
              </div>

              {/* Contador */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 max-w-sm mx-auto">
                <p className="text-sm text-muted-foreground mb-2">
                  Redirecionando automaticamente em
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-4xl font-bold text-primary">
                    {countdown}
                  </div>
                  <span className="text-muted-foreground">segundos</span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={() => router.push("/")}
                  size="lg"
                  className="gap-2 shadow-lg shadow-primary/20"
                >
                  <Home className="h-5 w-5" />
                  Ir para Início
                </Button>

                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Voltar
                </Button>
              </div>

              {/* Links Úteis */}
              <div className="pt-8 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                  Páginas Úteis
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Link
                    href="/"
                    className="group p-4 rounded-lg border border-border bg-background hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <Home className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground text-sm">
                          Página Inicial
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Voltar ao início
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/bookings"
                    className="group p-4 rounded-lg border border-border bg-background hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground text-sm">
                          Agendamentos
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ver seus horários
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/barbers"
                    className="group p-4 rounded-lg border border-border bg-background hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground text-sm">
                          Barbeiros
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Conheça a equipe
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 text-xs text-muted-foreground">
                Se você acredita que isso é um erro, entre em contato com o
                suporte.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Elementos Decorativos */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
