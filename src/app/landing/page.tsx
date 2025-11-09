"use client";

import { useState, useEffect } from "react";
import { Button } from "@/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Badge } from "@/_components/ui/badge";
import {
  Calendar,
  Users,
  BarChart3,
  Shield,
  Smartphone,
  Zap,
  Star,
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
  Clock,
  Scissors,
  DollarSign,
  Settings,
  Bell,
  Palette,
  Image as ImageIcon,
  TrendingUp,
  Filter,
  StarIcon,
  Heart,
  MessageSquare,
  CalendarDays,
  CheckCircle,
  AlertCircle,
  CreditCard,
  QrCode,
  MessageCircle,
  FileText,
  Sparkles,
  Globe,
  Lock,
  Database,
  Server,
  Code,
  Eye,
  Layers,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Building2,
  Rocket,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Rotação automática de depoimentos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const coreFeatures = [
    {
      icon: Calendar,
      title: "Agendamento Inteligente",
      description:
        "Sistema completo em 3 passos: escolha do serviço com opções personalizadas, seleção de data/hora com disponibilidade em tempo real, e confirmação com resumo completo. Bloqueio automático de horários ocupados.",
      color: "from-blue-500 to-cyan-500",
      details: [
        "Calendário visual interativo",
        "Horários disponíveis em tempo real",
        "Seleção de barbeiro e serviço",
        "Opções de serviço com preços variados",
        "Confirmação instantânea",
      ],
    },
    {
      icon: Users,
      title: "Gestão Completa de Barbeiros",
      description:
        "Controle total sobre sua equipe: horários personalizados por dia da semana, pausas configuráveis, especialidades, avaliações, fotos e permissões granulares. Sistema de permissões por barbeiro.",
      color: "from-purple-500 to-pink-500",
      details: [
        "Horários individuais por barbeiro",
        "Pausas configuráveis (almoço, intervalo)",
        "Sistema de permissões granulares",
        "Avaliações e comentários",
        "Especialidades e categorias",
      ],
    },
    {
      icon: Scissors,
      title: "Serviços com Opções Personalizadas",
      description:
        "Crie serviços ilimitados com múltiplas opções. Cada opção tem preço e duração próprios. Sistema de categorias para organização. Preços flexíveis e gestão completa.",
      color: "from-orange-500 to-red-500",
      details: [
        "Serviços ilimitados",
        "Opções personalizadas por serviço",
        "Preços e durações flexíveis",
        "Categorias organizadas",
        "Imagens e descrições",
      ],
    },
    {
      icon: BarChart3,
      title: "Dashboard & Analytics Avançado",
      description:
        "Dashboard completo com métricas em tempo real: receita, agendamentos, performance de barbeiros, distribuição de serviços, gráficos interativos e relatórios detalhados por período.",
      color: "from-green-500 to-emerald-500",
      details: [
        "KPIs em tempo real",
        "Gráficos de receita e tendências",
        "Performance por barbeiro",
        "Distribuição de serviços",
        "Relatórios exportáveis",
      ],
    },
    {
      icon: DollarSign,
      title: "Sistema de Pagamentos Integrado",
      description:
        "Múltiplas formas de pagamento: PIX com redirecionamento automático para WhatsApp, pagamento em dinheiro presencial. Controle de status de pagamento e expiração automática.",
      color: "from-yellow-500 to-amber-500",
      details: [
        "Pagamento via PIX",
        "Pagamento em dinheiro",
        "Redirecionamento WhatsApp",
        "Controle de status",
        "Expiração automática",
      ],
    },
    {
      icon: Palette,
      title: "Personalização Total",
      description:
        "Customize completamente a aparência: cores do tema, logo, favicon, banners personalizados, temas pré-configurados. Tudo salvo no banco de dados para acesso rápido.",
      color: "from-pink-500 to-rose-500",
      details: [
        "Cores personalizáveis",
        "Upload de logo e favicon",
        "Banners personalizados",
        "Temas pré-configurados",
        "Preview em tempo real",
      ],
    },
    {
      icon: Bell,
      title: "Sistema de Notificações",
      description:
        "Notificações multi-canal: email, WhatsApp e push notifications. Templates personalizáveis, configurações individuais por usuário e notificações automáticas de agendamentos.",
      color: "from-indigo-500 to-blue-500",
      details: [
        "Email, WhatsApp e Push",
        "Templates personalizáveis",
        "Configurações por usuário",
        "Notificações automáticas",
        "Histórico de notificações",
      ],
    },
    {
      icon: Clock,
      title: "Horários Flexíveis",
      description:
        "Configure horários de trabalho por dia da semana, pausas personalizadas, exceções (feriados, férias), múltiplos horários e disponibilidade em tempo real.",
      color: "from-teal-500 to-cyan-500",
      details: [
        "Horários por dia da semana",
        "Pausas configuráveis",
        "Exceções de agenda",
        "Múltiplos horários",
        "Disponibilidade em tempo real",
      ],
    },
    {
      icon: StarIcon,
      title: "Avaliações e Comentários",
      description:
        "Sistema completo de avaliações com estrelas e comentários. Média de avaliações por barbeiro, histórico de avaliações e feedback dos clientes.",
      color: "from-amber-500 to-yellow-500",
      details: [
        "Avaliações com estrelas",
        "Comentários detalhados",
        "Média por barbeiro",
        "Histórico completo",
        "Feedback estruturado",
      ],
    },
    {
      icon: Heart,
      title: "Barbeiros Favoritos",
      description:
        "Clientes podem marcar barbeiros como favoritos para acesso rápido e agendamento preferencial. Gestão de favoritos e recomendações.",
      color: "from-red-500 to-pink-500",
      details: [
        "Marcar barbeiros favoritos",
        "Acesso rápido",
        "Agendamento preferencial",
        "Lista de favoritos",
        "Recomendações",
      ],
    },
    {
      icon: Filter,
      title: "Busca e Filtros Avançados",
      description:
        "Sistema de busca inteligente por serviços, barbeiros e categorias. Filtros por data, status, barbeiro e período. Busca em tempo real.",
      color: "from-violet-500 to-purple-500",
      details: [
        "Busca por serviços",
        "Filtros por data e status",
        "Busca por barbeiro",
        "Filtros avançados",
        "Busca em tempo real",
      ],
    },
    {
      icon: Shield,
      title: "Segurança e Confiabilidade",
      description:
        "Dados protegidos com criptografia, backup automático, autenticação segura, controle de acesso e conformidade com LGPD.",
      color: "from-gray-700 to-gray-900",
      details: [
        "Criptografia de dados",
        "Backup automático",
        "Autenticação segura",
        "Controle de acesso",
        "Conformidade LGPD",
      ],
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: "R$ 97",
      period: "/mês",
      description: "Perfeito para começar",
      popular: false,
      features: [
        "Até 3 barbeiros",
        "Agendamentos ilimitados",
        "Dashboard básico",
        "2 opções por serviço",
        "Notificações por email",
        "Suporte por email",
        "1 barbearia",
        "Personalização básica",
      ],
      cta: "Começar agora",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Profissional",
      price: "R$ 197",
      period: "/mês",
      description: "Para barbearias em crescimento",
      popular: true,
      features: [
        "Até 10 barbeiros",
        "Agendamentos ilimitados",
        "Dashboard completo com analytics",
        "Opções ilimitadas por serviço",
        "Notificações multi-canal",
        "Suporte prioritário",
        "Múltiplas barbearias",
        "Personalização avançada",
        "Relatórios detalhados",
        "Integração WhatsApp",
        "Sistema de avaliações",
        "Barbeiros favoritos",
      ],
      cta: "Mais popular",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Enterprise",
      price: "Personalizado",
      period: "",
      description: "Solução completa para redes",
      popular: false,
      features: [
        "Barbeiros ilimitados",
        "Agendamentos ilimitados",
        "Analytics avançado",
        "Opções ilimitadas",
        "Notificações personalizadas",
        "Suporte dedicado 24/7",
        "Barbearias ilimitadas",
        "Personalização total",
        "API personalizada",
        "White-label",
        "Treinamento dedicado",
        "Gerente de conta",
        "Customizações exclusivas",
      ],
      cta: "Falar com vendas",
      color: "from-orange-500 to-red-500",
    },
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Proprietário - Barbearia Moderna",
      avatar: "CS",
      content:
        "Implementamos o sistema há 3 meses e nossa receita aumentou 45%. Os clientes adoram a facilidade do agendamento online e nós economizamos horas de trabalho administrativo. O dashboard é incrível!",
      rating: 5,
      stats: "45% aumento de receita",
    },
    {
      name: "Maria Santos",
      role: "Gerente - Corte & Estilo",
      avatar: "MS",
      content:
        "A gestão ficou muito mais simples. Conseguimos organizar melhor os horários dos barbeiros, reduzir cancelamentos em 60% e aumentar a satisfação dos clientes. O sistema de notificações é perfeito!",
      rating: 5,
      stats: "60% menos cancelamentos",
    },
    {
      name: "João Pereira",
      role: "CEO - Rede Barbershop",
      avatar: "JP",
      content:
        "Perfeito para nossa rede de 5 unidades. O sistema centralizado facilita muito o controle, análises e tomada de decisão. A personalização permite que cada unidade tenha sua identidade.",
      rating: 5,
      stats: "5 unidades conectadas",
    },
    {
      name: "Ana Costa",
      role: "Proprietária - Estilo & Cia",
      avatar: "AC",
      content:
        "O sistema de opções de serviço revolucionou nosso atendimento. Agora podemos oferecer variações de preço e duração sem complicação. Os clientes adoram a transparência!",
      rating: 5,
      stats: "100% satisfação dos clientes",
    },
  ];

  const stats = [
    { value: "500+", label: "Barbearias Ativas" },
    { value: "50k+", label: "Agendamentos/mês" },
    { value: "4.9/5", label: "Avaliação Média" },
    { value: "98%", label: "Taxa de Sucesso" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-xl border-b border-border/50 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                BarberBoss
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Funcionalidades
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Planos
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Depoimentos
              </Link>
              <Button variant="ghost" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-primary to-purple-600"
              >
                <Link href="#pricing">
                  Começar Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-6 space-y-4 border-t border-border">
              <Link
                href="#features"
                className="block text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Funcionalidades
              </Link>
              <Link
                href="#pricing"
                className="block text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Planos
              </Link>
              <Link
                href="#testimonials"
                className="block text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Depoimentos
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-primary to-purple-600"
                >
                  <Link href="#pricing">Começar Grátis</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-600/5" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600 text-white border-0">
                <Rocket className="h-3 w-3 mr-2" />
                Sistema Completo de Gestão
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Transforme sua{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Barbearia
                </span>{" "}
                em um Negócio Digital
              </h1>
              <p className="text-xl md:text-2xl text-foreground-muted leading-relaxed max-w-2xl">
                Sistema completo de agendamento, gestão de barbeiros, analytics
                avançado e muito mais. Tudo que você precisa para
                profissionalizar e escalar seu negócio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="text-lg px-8 h-14 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  <Link href="#pricing">
                    Começar Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-lg px-8 h-14"
                >
                  <Link href="#features">Ver Funcionalidades</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-foreground-muted mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border bg-gradient-to-br from-primary/10 to-purple-600/10">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-r from-primary to-purple-600 mb-4">
                      <Calendar className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      Sistema Completo
                    </h3>
                    <p className="text-foreground-muted">
                      Dashboard, Agendamentos, Analytics e muito mais
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600 text-white border-0">
              Funcionalidades
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Tudo que você precisa para{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                gerenciar sua barbearia
              </span>
            </h2>
            <p className="text-xl text-foreground-muted max-w-3xl mx-auto">
              Sistema completo com funcionalidades reais desenvolvidas
              especialmente para barbearias modernas. Cada detalhe foi pensado
              para facilitar sua gestão.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card
                key={index}
                className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl group"
              >
                <CardHeader>
                  <div
                    className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <ul className="space-y-2 pt-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li
                        key={detailIndex}
                        className="flex items-start text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground-muted">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600 text-white border-0">
              Planos
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Escolha o plano{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                ideal para você
              </span>
            </h2>
            <p className="text-xl text-foreground-muted max-w-3xl mx-auto">
              Planos flexíveis que crescem com o seu negócio. Sem taxas
              escondidas, cancele quando quiser. 14 dias grátis para testar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-2 transition-all duration-300 ${
                  plan.popular
                    ? "border-primary shadow-2xl scale-105 bg-gradient-to-br from-primary/5 to-purple-600/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 px-4 py-1">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-foreground-muted ml-2 text-lg">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button
                    className={`w-full h-12 ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    <Link
                      href={
                        plan.price === "Personalizado" ? "/contact" : "/signup"
                      }
                    >
                      {plan.cta}
                    </Link>
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-foreground-muted">
              Todos os planos incluem 14 dias grátis para testar.{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Ver termos
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600 text-white border-0">
              Depoimentos
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              O que nossos{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                clientes dizem
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`border-border hover:border-primary/50 transition-all duration-300 ${
                  index === currentTestimonial ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-base italic leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-foreground-muted">
                        {testimonial.role}
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        {testimonial.stats}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 via-purple-600/10 to-primary/10">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-4xl md:text-5xl mb-4">
                Pronto para transformar sua barbearia?
              </CardTitle>
              <CardDescription className="text-xl">
                Comece hoje mesmo e tenha 14 dias grátis para testar todas as
                funcionalidades do sistema completo.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  asChild
                  className="text-lg px-8 h-14 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  <Link href="/signup">
                    Começar Grátis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-lg px-8 h-14"
                >
                  <Link href="/contact">Falar com Vendas</Link>
                </Button>
              </div>
              <p className="text-sm text-foreground-muted">
                Sem cartão de crédito necessário • Cancele a qualquer momento
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <Scissors className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  BarberBoss
                </h3>
              </div>
              <p className="text-foreground-muted">
                Sistema completo de gestão para barbearias modernas. Transforme
                seu negócio em um negócio digital profissional.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Produto</h4>
              <ul className="space-y-2 text-foreground-muted">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-primary transition"
                  >
                    Funcionalidades
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="hover:text-primary transition"
                  >
                    Planos
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-primary transition">
                    Demonstração
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-2 text-foreground-muted">
                <li>
                  <Link href="/about" className="hover:text-primary transition">
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-primary transition"
                  >
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary transition">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-foreground-muted">
                <li>
                  <Link href="/terms" className="hover:text-primary transition">
                    Termos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-primary transition"
                  >
                    Privacidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-foreground-muted">
            <p>
              &copy; {new Date().getFullYear()} BarberBoss. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
