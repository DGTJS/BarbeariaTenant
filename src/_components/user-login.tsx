"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/_components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/card";
import { Chrome, Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function UserLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "/profile" });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-border/50 bg-card/95 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <LogIn className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Bem-vindo!
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Faça login para acessar sua conta e gerenciar seus agendamentos
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium hover:bg-accent hover:border-primary transition-all duration-300 group"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <Chrome className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Entrar com Google
                </>
              )}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Rápido e seguro
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Ao fazer login, você concorda com nossos
              <br />
              <span className="text-primary hover:underline cursor-pointer">Termos de Uso</span>
              {" e "}
              <span className="text-primary hover:underline cursor-pointer">Política de Privacidade</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Decoração de fundo */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

