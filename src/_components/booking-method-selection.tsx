"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Scissors, User } from "lucide-react";

/**
 * Componente para escolher o método de agendamento
 * - Por Serviço: usuário escolhe o serviço primeiro
 * - Por Barbeiro: usuário escolhe o barbeiro primeiro
 */
export function BookingMethodSelection() {
  const router = useRouter();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Como você prefere agendar?</h1>
        <p className="text-muted-foreground">
          Escolha a forma mais conveniente para você
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Opção 1: Por Serviço */}
        <Card 
          className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
          onClick={() => router.push("/booking/by-service")}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Scissors className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Por Serviço</CardTitle>
            <CardDescription className="text-base">
              Escolha o que você quer fazer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Veja todos os serviços disponíveis</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Compare preços entre barbeiros</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Escolha o profissional depois</p>
              </div>
            </div>
            <Button className="w-full mt-6" size="lg">
              Escolher Serviço
            </Button>
          </CardContent>
        </Card>

        {/* Opção 2: Por Barbeiro */}
        <Card 
          className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
          onClick={() => router.push("/booking/by-barber")}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Por Barbeiro</CardTitle>
            <CardDescription className="text-base">
              Escolha seu barbeiro favorito
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Veja perfis completos dos barbeiros</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Confira avaliações e especialidades</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p>Escolha o serviço depois</p>
              </div>
            </div>
            <Button className="w-full mt-6" size="lg">
              Escolher Barbeiro
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Não sabe qual escolher? Ambas as opções levam ao mesmo resultado!</p>
      </div>
    </div>
  );
}

