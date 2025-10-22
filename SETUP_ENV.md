# 🔧 Configuração Automática do Ambiente

## 🚀 Métodos de Configuração

### **Método 1: Script Automático (Recomendado)**

```bash
# Execute este comando na raiz do projeto
npm run setup:env
```

Este comando irá:
- ✅ Criar o arquivo `.env.local` automaticamente
- ✅ Gerar um NextAuth Secret aleatório
- ✅ Mostrar instruções detalhadas

### **Método 2: Script Interativo**

```bash
# Para configuração passo a passo
npm run setup:env:interactive
```

Este comando irá:
- ✅ Fazer perguntas interativas
- ✅ Validar as informações
- ✅ Criar o arquivo com suas respostas

### **Método 3: Manual**

1. **Crie o arquivo** `.env.local` na raiz do projeto
2. **Copie e cole** o conteúdo abaixo:

```env
# Mercado Pago Configuration
MERCADOPAGO_CLIENT_ID=SEU_CLIENT_ID_AQUI
MERCADOPAGO_CLIENT_SECRET=SEU_CLIENT_SECRET_AQUI
NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID=SEU_CLIENT_ID_AQUI

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET=GERADO_AUTOMATICAMENTE
NEXTAUTH_URL=http://localhost:3000
```

## 🔑 Como Obter Credenciais do Mercado Pago

### **Passo 1: Acesse o Mercado Pago Developers**
- URL: https://www.mercadopago.com.br/developers
- Faça login com sua conta Mercado Pago

### **Passo 2: Criar Aplicação**
1. Vá em **"Suas integrações"**
2. Clique em **"Criar aplicação"**
3. Preencha:
   - **Nome**: Barbearia SaaS
   - **Descrição**: Sistema de agendamento para barbearias
   - **Categoria**: E-commerce

### **Passo 3: Configurar Redirect URI**
- **Redirect URI**: `http://localhost:3000/api/mercadopago/callback`
- **Para produção**: `https://seudominio.com/api/mercadopago/callback`

### **Passo 4: Copiar Credenciais**
- Copie o **Client ID**
- Copie o **Client Secret**

## 📝 Substituir Valores no .env.local

### **Valores a Substituir:**

```env
# ❌ ANTES (template)
MERCADOPAGO_CLIENT_ID=SEU_CLIENT_ID_AQUI
MERCADOPAGO_CLIENT_SECRET=SEU_CLIENT_SECRET_AQUI

# ✅ DEPOIS (seus valores)
MERCADOPAGO_CLIENT_ID=1234567890abcdef
MERCADOPAGO_CLIENT_SECRET=abcdef1234567890
```

## 🔄 Reiniciar Servidor

**IMPORTANTE**: Após criar/editar o `.env.local`:

```bash
# Pare o servidor (Ctrl+C)
# Execute novamente:
npm run dev
```

## ✅ Verificar Configuração

1. **Acesse**: http://localhost:3000/admin/settings
2. **Clique**: "Testar Configuração"
3. **Verifique**: Se retorna `"hasClientId": true`

### **Resultado Esperado:**
```json
{
    "config": {
        "hasClientId": true,
        "hasClientSecret": true,
        "hasPublicClientId": true,
        "hasAppUrl": true,
        "appUrl": "http://localhost:3000",
        "clientIdPrefix": "1234567890..."
    },
    "status": "ok"
}
```

## 🚨 Problemas Comuns

### **"hasClientId": false**
- ❌ Arquivo `.env.local` não existe
- ❌ Variáveis não estão configuradas
- ❌ Servidor não foi reiniciado

### **"hasAppUrl": false**
- ❌ `NEXT_PUBLIC_APP_URL` não configurado
- ❌ URL incorreta

### **Popup bloqueado**
- ❌ Navegador bloqueando popups
- ❌ Permita popups para localhost

## 📁 Estrutura de Arquivos

```
barbearia-app/
├── .env.local          ← Arquivo de configuração
├── .env.template       ← Template (se existir)
├── scripts/
│   ├── setup-env.js   ← Script interativo
│   └── quick-setup.js ← Script rápido
├── package.json
└── ...
```

## 🎯 Próximos Passos

Após configurar o `.env.local`:

1. ✅ **Reinicie o servidor**
2. ✅ **Teste a configuração**
3. ✅ **Conecte o Mercado Pago**
4. ✅ **Configure métodos de pagamento**
5. ✅ **Teste o fluxo completo**

---

**💡 Dica**: Use `npm run setup:env` para configuração automática!

