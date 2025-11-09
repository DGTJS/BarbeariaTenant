"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Badge } from "@/_components/ui/badge";
import {
  BookOpen,
  Users,
  Scissors,
  Tag,
  Image as ImageIcon,
  Settings,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Clock,
  DollarSign,
  Shield,
  Mail,
  Phone,
} from "lucide-react";

export default function HelpPage() {
  const sections = [
    {
      id: "overview",
      title: "Visão Geral do Sistema",
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Bem-vindo ao sistema de gestão da barbearia! Este painel permite
            gerenciar todos os aspectos do seu negócio de forma centralizada.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2">Principais Funcionalidades</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Gerenciamento de agendamentos</li>
                <li>• Controle de barbeiros e permissões</li>
                <li>• Configuração de serviços e preços</li>
                <li>• Relatórios e análises</li>
                <li>• Personalização visual</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2">Níveis de Acesso</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  • <strong>Admin (1)</strong>: Acesso total
                </li>
                <li>
                  • <strong>Barbeiro (2)</strong>: Acesso limitado
                </li>
                <li>
                  • <strong>Cliente (3)</strong>: Apenas agendamentos
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "categories",
      title: "Como Criar Especialidades (Categorias)",
      icon: Tag,
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Passo a Passo:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>
                  Acesse a página <strong>Serviços</strong> no menu lateral
                </li>
                <li>
                  Clique na aba <strong>"Categorias"</strong>
                </li>
                <li>
                  Clique no botão <strong>"Adicionar Categoria"</strong>
                </li>
                <li>
                  Preencha os campos:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>
                      <strong>Nome</strong>: Ex: "Cabelo", "Barba",
                      "Sobrancelha"
                    </li>
                    <li>
                      <strong>Ícone</strong>: Selecione um ícone visual (ex:
                      Scissors, Wind, Eye)
                    </li>
                    <li>
                      <strong>Cor do Ícone</strong>: Escolha a cor em
                      hexadecimal
                    </li>
                    <li>
                      <strong>Descrição</strong>: Descrição opcional da
                      categoria
                    </li>
                  </ul>
                </li>
                <li>
                  Clique em <strong>"Salvar"</strong>
                </li>
              </ol>
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/20">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>💡 Dica:</strong> As categorias organizam seus serviços e
              facilitam a navegação dos clientes. Exemplos: Cabelo, Barba,
              Sobrancelha, Massagem, Hidratação.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "barbers",
      title: "Como Criar Barbeiros",
      icon: Users,
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Passo a Passo:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>
                  Acesse a página <strong>Barbeiros</strong> no menu lateral
                </li>
                <li>
                  Clique no botão <strong>"Adicionar Barbeiro"</strong>
                </li>
                <li>
                  Preencha os dados obrigatórios:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>
                      <strong>Nome Completo</strong>: Nome do barbeiro
                    </li>
                    <li>
                      <strong>Telefone</strong>: Número de contato
                    </li>
                    <li>
                      <strong>E-mail</strong>: Email do barbeiro (será usado
                      para criar o usuário)
                    </li>
                    <li>
                      <strong>Foto</strong>: Upload da foto do barbeiro
                    </li>
                    <li>
                      <strong>Especialidades</strong>: Selecione as categorias
                      que o barbeiro domina
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Horários de Trabalho</strong>: Configure os dias e
                  horários disponíveis
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>
                      Clique em <strong>"Horários"</strong> no card do barbeiro
                      após criar
                    </li>
                    <li>Configure horários para cada dia da semana</li>
                    <li>Adicione pausas (intervalos) se necessário</li>
                  </ul>
                </li>
                <li>
                  <strong>Permissões</strong>: Configure login e permissões
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>
                      Clique em <strong>"Permissões"</strong> no card do
                      barbeiro
                    </li>
                    <li>
                      Defina um <strong>email</strong> para login (pode ser
                      diferente do email do usuário)
                    </li>
                    <li>
                      Defina uma <strong>senha</strong> para o barbeiro fazer
                      login
                    </li>
                    <li>
                      Ative <strong>"Permissões de Administrador"</strong> se o
                      barbeiro precisar de acesso total
                    </li>
                  </ul>
                </li>
                <li>
                  Clique em <strong>"Salvar Barbeiro"</strong>
                </li>
              </ol>
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>✅ Importante:</strong> Após criar o barbeiro, configure
              os horários de trabalho e as permissões para que ele possa acessar
              o sistema e ter sua agenda configurada corretamente.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "services",
      title: "Como Criar Serviços",
      icon: Scissors,
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Passo a Passo:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>
                  Acesse a página <strong>Serviços</strong> no menu lateral
                </li>
                <li>
                  Clique na aba <strong>"Serviços"</strong> (se não estiver
                  selecionada)
                </li>
                <li>
                  Clique no botão <strong>"Adicionar Serviço"</strong>
                </li>
                <li>
                  Preencha os campos:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>
                      <strong>Nome</strong>: Ex: "Corte de Cabelo", "Barba",
                      "Sobrancelha"
                    </li>
                    <li>
                      <strong>Descrição</strong>: Descrição detalhada do serviço
                    </li>
                    <li>
                      <strong>Preço Base</strong>: Preço padrão do serviço (em
                      R$)
                    </li>
                    <li>
                      <strong>Duração</strong>: Tempo estimado em minutos
                    </li>
                    <li>
                      <strong>Categoria</strong>: Selecione a especialidade
                      correspondente
                    </li>
                    <li>
                      <strong>Imagem</strong>: URL ou caminho da imagem do
                      serviço
                    </li>
                    <li>
                      <strong>Status</strong>: Ativo/Inativo
                    </li>
                  </ul>
                </li>
                <li>
                  Clique em <strong>"Salvar"</strong>
                </li>
              </ol>
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950/20">
            <p className="text-sm text-purple-800 dark:text-purple-200">
              <strong>💡 Dica:</strong> O preço base pode ser ajustado
              individualmente por barbeiro através das configurações de cada
              barbeiro.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "service-options",
      title: "Como Criar Opções de Serviço",
      icon: Tag,
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Passo a Passo:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>
                  Acesse a página <strong>Serviços</strong> no menu lateral
                </li>
                <li>Na lista de serviços, encontre o serviço desejado</li>
                <li>
                  Clique no botão <strong>"Opções"</strong> ou no ícone de
                  opções
                </li>
                <li>
                  No modal que abrir, clique em{" "}
                  <strong>"Adicionar Opção"</strong>
                </li>
                <li>
                  Preencha os campos da opção:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>
                      <strong>Nome</strong>: Ex: "Degradê", "Social", "Militar",
                      "Navalhado"
                    </li>
                    <li>
                      <strong>Descrição</strong>: Descrição da opção (opcional)
                    </li>
                    <li>
                      <strong>Preço</strong>: Preço adicional ou valor total da
                      opção
                    </li>
                    <li>
                      <strong>Duração</strong>: Tempo adicional em minutos
                    </li>
                    <li>
                      <strong>Status</strong>: Ativo/Inativo
                    </li>
                  </ul>
                </li>
                <li>
                  Clique em <strong>"Salvar"</strong>
                </li>
              </ol>
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-indigo-50 dark:bg-indigo-950/20">
            <p className="text-sm text-indigo-800 dark:text-indigo-200">
              <strong>📝 Exemplo:</strong> Para o serviço "Corte de Cabelo",
              você pode criar opções como: "Degradê" (+R$10, +5min), "Social"
              (R$0, +0min), "Militar" (+R$5, +0min). O cliente escolherá uma
              opção ao agendar.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "banner",
      title: "Como Criar Banners",
      icon: ImageIcon,
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Passo a Passo:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>
                  Acesse a página <strong>Banner</strong> no menu lateral
                </li>
                <li>
                  Clique no botão <strong>"Adicionar Banner"</strong>
                </li>
                <li>
                  Preencha os campos:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>
                      <strong>Título</strong>: Título principal do banner
                    </li>
                    <li>
                      <strong>Subtítulo</strong>: Texto secundário
                    </li>
                    <li>
                      <strong>URL da Imagem</strong>: Link ou caminho da imagem
                      do banner
                    </li>
                    <li>
                      <strong>Cor do Texto</strong>: Cor em hexadecimal (ex:
                      #FFFFFF para branco)
                    </li>
                    <li>
                      <strong>Ordem</strong>: Posição do banner (menor número
                      aparece primeiro)
                    </li>
                    <li>
                      <strong>Status</strong>: Ativo/Inativo
                    </li>
                  </ul>
                </li>
                <li>
                  Clique em <strong>"Salvar"</strong>
                </li>
              </ol>
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-pink-50 dark:bg-pink-950/20">
            <p className="text-sm text-pink-800 dark:text-pink-200">
              <strong>🎨 Dica:</strong> Use cores contrastantes entre texto e
              imagem para melhor legibilidade. Exemplo: texto branco (#FFFFFF)
              sobre imagem escura.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "logo",
      title: "Como Configurar Logo e Personalização",
      icon: Settings,
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Passo a Passo:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>
                  Acesse a página <strong>Configurações</strong> no menu lateral
                </li>
                <li>
                  Na seção de <strong>"Aparência"</strong> ou{" "}
                  <strong>"Geral"</strong>:
                </li>
                <li>
                  Configure:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>
                      <strong>Logo</strong>: URL ou upload da logo da barbearia
                    </li>
                    <li>
                      <strong>Cores do Tema</strong>: Personalize cores
                      principais
                    </li>
                    <li>
                      <strong>Nome da Barbearia</strong>: Nome que aparece no
                      site
                    </li>
                    <li>
                      <strong>Telefone</strong>: Número para WhatsApp
                    </li>
                    <li>
                      <strong>Endereço</strong>: Localização da barbearia
                    </li>
                  </ul>
                </li>
                <li>
                  Acesse <strong>Temas</strong> para personalização avançada de
                  cores
                </li>
                <li>
                  Clique em <strong>"Salvar"</strong> após cada alteração
                </li>
              </ol>
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              <strong>🎨 Dica:</strong> Use o editor de temas para criar
              esquemas de cores personalizados que reflitam a identidade visual
              da sua barbearia.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "permissions",
      title: "Gerenciamento de Permissões de Barbeiros",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Sistema de Permissões:
              </p>
              <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                <div>
                  <strong>1. Acesse as Permissões:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>
                      Vá para a página <strong>Barbeiros</strong>
                    </li>
                    <li>
                      Clique no botão <strong>"Permissões"</strong> no card do
                      barbeiro
                    </li>
                  </ul>
                </div>
                <div>
                  <strong>2. Configure Login do Barbeiro:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>
                      <strong>Email para Login</strong>: Email único que o
                      barbeiro usará para fazer login
                    </li>
                    <li>
                      <strong>Nova Senha</strong>: Defina uma senha segura
                      (deixe vazio para não alterar)
                    </li>
                  </ul>
                </div>
                <div>
                  <strong>3. Níveis de Permissão:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>
                      <strong>Barbeiro Limitado</strong>: Apenas gerencia seus
                      próprios agendamentos
                    </li>
                    <li>
                      <strong>Barbeiro com Acesso Admin</strong>: Pode acessar
                      todas as áreas administrativas
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>⚠️ Atenção:</strong> Dar permissões de admin a um barbeiro
              permite acesso total ao sistema. Use com cuidado e apenas para
              barbeiros de confiança.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "bookings",
      title: "Gerenciamento de Agendamentos",
      icon: Clock,
      content: (
        <div className="space-y-4">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <strong className="text-foreground">
                Status de Agendamentos:
              </strong>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>
                  <strong>Pendente/Agendado</strong>: Agendamento recém-criado
                </li>
                <li>
                  <strong>Confirmado</strong>: Agendamento confirmado
                </li>
                <li>
                  <strong>Aguardando Pagamento</strong>: Aguardando confirmação
                  de pagamento (PIX)
                </li>
                <li>
                  <strong>Cancelada</strong>: Agendamento cancelado
                </li>
                <li>
                  <strong>Concluída</strong>: Serviço realizado
                </li>
              </ul>
            </div>
            <div className="mt-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <strong className="text-blue-900 dark:text-blue-100">
                Ações Disponíveis:
              </strong>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-blue-800 dark:text-blue-200">
                <li>
                  <strong>Confirmar</strong>: Confirma um agendamento pendente
                </li>
                <li>
                  <strong>Confirmar Pagamento</strong>: Confirma pagamento de
                  agendamentos PIX
                </li>
                <li>
                  <strong>Cancelar</strong>: Cancela um agendamento
                </li>
                <li>
                  <strong>Reagendar</strong>: Permite alterar data/hora do
                  agendamento
                </li>
                <li>
                  <strong>WhatsApp</strong>: Abre conversa no WhatsApp com o
                  cliente
                </li>
                <li>
                  <strong>Email</strong>: Abre cliente de email para contato
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "pricing",
      title: "Sistema de Preços",
      icon: DollarSign,
      content: (
        <div className="space-y-4">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <strong className="text-foreground">Como Funciona:</strong>
              <p className="mt-2">
                O sistema calcula o preço final considerando:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>
                  <strong>Preço Base do Serviço</strong>: Preço padrão definido
                  no serviço
                </li>
                <li>
                  <strong>Ajuste por Barbeiro</strong>: Alguns barbeiros podem
                  ter preços diferentes
                </li>
                <li>
                  <strong>Opção Selecionada</strong>: Se o cliente escolher uma
                  opção, seu preço é usado
                </li>
              </ul>
            </div>
            <div className="mt-4 p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
              <p className="text-green-800 dark:text-green-200">
                <strong>💡 Exemplo:</strong> Se o serviço "Corte" custa R$ 30 e
                o cliente escolhe a opção "Degradê" que custa R$ 40, o preço
                final será R$ 40.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Central de Ajuda
              </h1>
              <p className="text-muted-foreground">
                Guia completo de como usar o sistema
              </p>
            </div>
          </div>
        </div>

        {/* Índice */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Índice de Conteúdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <Badge variant="outline" className="flex-shrink-0">
                    {index + 1}
                  </Badge>
                  <section.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    {section.title}
                  </span>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seções de Ajuda */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={section.id} id={section.id} className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span>
                    {index + 1}. {section.title}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>{section.content}</CardContent>
            </Card>
          ))}
        </div>

        {/* Contato e Suporte */}
        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Precisa de Mais Ajuda?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Se você não encontrou a resposta que procura, entre em contato
                com o suporte técnico.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">suporte@barbearia.com</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">(11) 99999-9999</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
