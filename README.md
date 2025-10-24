# 🪒 Sistema de Barbearia SaaS

Sistema completo de gerenciamento para barbearias com configurações dinâmicas, horários personalizados e SEO otimizado.

## 🚀 Funcionalidades

### ⚙️ Configurações Dinâmicas
- ✅ Nome, endereço, email, telefone da barbearia
- ✅ Descrição personalizada
- ✅ Cores do tema configuráveis
- ✅ Todas as configurações salvas no banco de dados

### 🖼️ Logo e Favicon
- ✅ Upload de logo com preview em tempo real
- ✅ Conversão automática de qualquer imagem para favicon
- ✅ Análise de qualidade automática
- ✅ Logo dinâmica exibida em todo o sistema
- ✅ Suporte a: PNG, JPEG, WebP, GIF, SVG, BMP, TIFF, ICO

### 🕒 Horários Personalizados
- ✅ Configuração individual por dia da semana
- ✅ Horários diferentes para cada dia
- ✅ Dias abertos/fechados
- ✅ Interface com abas e cards colapsáveis
- ✅ Botão "Copiar" para replicar horários

### 🔍 SEO Dinâmico
- ✅ Título da página configurável
- ✅ Meta descrição personalizada
- ✅ Meta keywords
- ✅ Favicon dinâmico
- ✅ Atualização automática em tempo real

### 🎨 Interface Melhorada
- ✅ Design moderno e responsivo
- ✅ Preview de imagens em tempo real
- ✅ Componentes shadcn/ui
- ✅ Feedback visual completo
- ✅ UX otimizada para muitas configurações

## 📦 Instalação

```bash
# Clonar repositório
git clone [url-do-repositorio]

# Instalar dependências
npm install

# Configurar banco de dados
# Criar arquivo .env com DATABASE_URL

# Sincronizar schema
npx prisma db push

# Inicializar configurações
node scripts/init-site-config.js

# Iniciar aplicação
npm run dev
```

## 🔧 Configuração

### 1. Acessar Painel Admin
```
http://localhost:3000/admin/settings
```

### 2. Configurar Informações
- **Aba Geral**: Nome, endereço, email, telefone
- **Aba Marca**: Logo e favicon
- **Aba Horários**: Dias e horários de funcionamento
- **Aba SEO**: Título, descrição, keywords
- **Aba Tema**: Cores personalizadas

### 3. Salvar Configurações
Clique em "Salvar Configurações" no final da página

## 📚 Documentação Completa

Consulte [DOCUMENTACAO_COMPLETA.md](./DOCUMENTACAO_COMPLETA.md) para:
- Guia completo de uso
- Referência de API
- Troubleshooting detalhado
- Exemplos de código
- Comandos úteis

## 🛠️ Tecnologias

- **Next.js 15**: Framework React
- **Prisma 6.18**: ORM PostgreSQL
- **Sharp**: Processamento de imagens
- **Shadcn/ui**: Componentes de interface
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização

## 📝 Comandos Úteis

### Desenvolvimento
```bash
npm run dev          # Iniciar desenvolvimento
npm run build        # Build para produção
npm start           # Iniciar produção
```

### Banco de Dados
```bash
npx prisma studio                    # Interface visual do banco
npx prisma generate                  # Gerar cliente Prisma
node scripts/test-db-connection.js  # Testar conexão
```

### Debug
```bash
node scripts/init-site-config.js    # Inicializar configurações
curl http://localhost:3000/api/debug/config  # Debug de configurações
```

## 🔍 Troubleshooting

### Logo não aparece?
1. Limpar cache do navegador (Ctrl+Shift+R)
2. Verificar debug em `/admin/settings`
3. Executar: `node scripts/test-db-connection.js`

### Erro de conexão PostgreSQL?
1. Atualizar Prisma: `npm i --save-dev prisma@latest`
2. Regenerar cliente: `npx prisma generate`
3. Testar: `node scripts/test-db-connection.js`

### Mais informações?
Consulte [DOCUMENTACAO_COMPLETA.md](./DOCUMENTACAO_COMPLETA.md)

## 📄 Licença

Este projeto é privado e proprietário.

---

**Sistema 100% funcional e pronto para uso!** 🎉