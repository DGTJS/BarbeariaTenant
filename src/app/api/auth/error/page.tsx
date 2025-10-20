"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "Há um problema com a configuração do servidor.";
      case "AccessDenied":
        return "Acesso negado. Você não tem permissão para entrar.";
      case "Verification":
        return "O token de verificação expirou ou já foi usado.";
      default:
        return "Ocorreu um erro inesperado durante a autenticação.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-red-600">
            Erro de Autenticação
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-foreground-muted">
            {getErrorMessage(error)}
          </p>
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/api/auth/signin">
                Tentar Novamente
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                Voltar ao Início
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
