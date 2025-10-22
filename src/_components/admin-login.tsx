"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Alert, AlertDescription } from "@/_components/ui/alert";
import { 
  Scissors, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Loader2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface AdminLoginProps {
  onSuccess?: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("admin@barbearia.com");
  const [name, setName] = useState("Administrador");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Email é obrigatório");
      return;
    }

    if (!name.trim()) {
      setError("Nome é obrigatório");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        name: name.trim(),
        redirect: false,
      });

      if (result?.error) {
        setError("Erro ao fazer login. Tente novamente.");
      } else if (result?.ok) {
        // Verificar se a sessão foi criada
        const session = await getSession();
        if (session) {
          setError("");
          onSuccess?.();
          router.push("/admin/settings");
        } else {
          setError("Erro ao criar sessão. Tente novamente.");
        }
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setError("Erro interno. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-xl">
            <Scissors className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Barbearia SaaS
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Sistema de Gerenciamento
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Painel Administrativo
          </p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">
              Acesso Administrativo
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              Credenciais pré-configuradas para demonstração
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo Nome */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Scissors className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Botão de Login */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Entrar
                  </>
                )}
              </Button>
            </form>

            {/* Credenciais de Admin */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                🔑 Credenciais de Administrador
              </h4>
              <div className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
                <p><strong>Nome:</strong> Administrador</p>
                <p><strong>Email:</strong> admin@barbearia.com</p>
                <p className="text-blue-600 dark:text-blue-400">
                  Clique em "Entrar" para acessar o painel
                </p>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sistema de gerenciamento para barbearias
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2024 Barbearia SaaS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
