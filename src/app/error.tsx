"use client";

import { useEffect } from "react";
import { Button } from "@/_components/ui/button";
import { Card, CardContent } from "@/_components/ui/card";
import {
  Home,
  RefreshCw,
  AlertTriangle,
  ArrowLeft,
  Bug,
  Shield,
} from "lucide-react";
import Link from "next/link";
import DynamicLogo from "@/_components/dynamic-logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro capturado:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <div className="text-center space-y-6">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full"></div>
                  <DynamicLogo
                    width={80}
                    height={80}
                    className="relative z-10"
                  />
                </div>
              </div>

              {/* Ícone de Erro */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full"></div>
                  <div className="relative z-10 bg-destructive/10 p-6 rounded-full">
                    <AlertTriangle className="h-20 w-20 text-destructive animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Mensagem */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Algo deu errado!
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Desculpe, ocorreu um erro inesperado. Nossa equipe foi
                  notificada e estamos trabalhando para resolver.
                </p>
              </div>

              {/* Detalhes do Erro (somente em desenvolvimento) */}
              {process.env.NODE_ENV === "development" && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-xl mx-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <Bug className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-semibold text-destructive">
                      Detalhes do Erro (Modo Desenvolvimento)
                    </span>
                  </div>
                  <p className="text-xs text-left text-muted-foreground font-mono break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-left text-muted-foreground/60 mt-2">
                      Digest: {error.digest}
                    </p>
                  )}
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  onClick={reset}
                  size="lg"
                  className="gap-2 shadow-lg shadow-primary/20"
                >
                  <RefreshCw className="h-5 w-5" />
                  Tentar Novamente
                </Button>

                <Button variant="outline" size="lg" className="gap-2" asChild>
                  <Link href="/">
                    <Home className="h-5 w-5" />
                    Ir para Início
                  </Link>
                </Button>
              </div>

              {/* Dicas */}
              <div className="pt-8 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                  O que você pode fazer?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 rounded-lg border border-border bg-background text-left">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 mt-1">
                        <RefreshCw className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm mb-1">
                          Recarregue a Página
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Tente atualizar a página para resolver o problema.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-background text-left">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10 text-green-500 mt-1">
                        <ArrowLeft className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm mb-1">
                          Volte e Tente Outra Vez
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Retorne à página anterior e tente novamente.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-background text-left">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 mt-1">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm mb-1">
                          Limpe o Cache
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Limpe o cache do navegador e cookies.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-background text-left">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 mt-1">
                        <Home className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm mb-1">
                          Volte ao Início
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Retorne à página inicial e comece de novo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 text-xs text-muted-foreground">
                Se o problema persistir, entre em contato com o suporte.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Elementos Decorativos */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-destructive/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
