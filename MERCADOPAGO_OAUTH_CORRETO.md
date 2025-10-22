# 🔧 Integração OAuth Mercado Pago - Implementação Correta

## 📚 Baseado na Documentação Oficial

### ✅ **Correções Implementadas:**

#### **1. URL de Autorização Correta**
```javascript
// ❌ ANTES (incorreto - para marketplace)
https://auth.mercadopago.com/authorization?client_id=APP_ID&response_type=code&redirect_uri=REDIRECT_URI&platform_id=mp

// ✅ DEPOIS (correto - para aplicações)
https://auth.mercadopago.com/authorization?client_id=APP_ID&response_type=code&redirect_uri=REDIRECT_URI
```

#### **2. Headers Corretos para API**
```javascript
// ❌ ANTES (incorreto)
headers: {
  'Content-Type': 'application/json',
}
body: JSON.stringify(payload)

// ✅ DEPOIS (correto)
headers: {
  'accept': 'application/json',
  'content-type': 'application/x-www-form-urlencoded',
}
body: new URLSearchParams(payload)
```

#### **3. Formato de Dados Correto**
```javascript
// ❌ ANTES (JSON)
{
  "client_id": "APP_ID",
  "client_secret": "SECRET",
  "grant_type": "authorization_code",
  "code": "AUTH_CODE",
  "redirect_uri": "CALLBACK_URL"
}

// ✅ DEPOIS (Form Data)
client_id=APP_ID&client_secret=SECRET&grant_type=authorization_code&code=AUTH_CODE&redirect_uri=CALLBACK_URL
```

## 🚀 **Fluxo OAuth Correto**

### **Passo 1: Configurar Aplicação no Mercado Pago**
1. Acesse: https://www.mercadopago.com.br/developers
2. Vá em "Suas integrações" > "Criar aplicação"
3. **NÃO** selecione "Marketplace" - use aplicação simples
4. Configure Redirect URI: `http://localhost:3000/api/mercadopago/callback`

### **Passo 2: URL de Autorização**
```
https://auth.mercadopago.com/authorization?
  client_id=SEU_CLIENT_ID&
  response_type=code&
  redirect_uri=http://localhost:3000/api/mercadopago/callback
```

### **Passo 3: Trocar Code por Token**
```bash
curl -X POST \
  -H 'accept: application/json' \
  -H 'content-type: application/x-www-form-urlencoded' \
  'https://api.mercadopago.com/oauth/token' \
  -d 'client_id=SEU_CLIENT_ID' \
  -d 'client_secret=SEU_CLIENT_SECRET' \
  -d 'grant_type=authorization_code' \
  -d 'code=CODIGO_RECEBIDO' \
  -d 'redirect_uri=http://localhost:3000/api/mercadopago/callback'
```

## 🔧 **Implementação no Código**

### **1. Callback API Corrigida**
```typescript
// src/app/api/mercadopago/callback/route.ts
const tokenPayload = new URLSearchParams({
  client_id: process.env.MERCADOPAGO_CLIENT_ID!,
  client_secret: process.env.MERCADOPAGO_CLIENT_SECRET!,
  grant_type: 'authorization_code',
  code: code,
  redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/callback`,
});

const tokenResponse = await fetch('https://api.mercadopago.com/oauth/token', {
  method: 'POST',
  headers: {
    'accept': 'application/json',
    'content-type': 'application/x-www-form-urlencoded',
  },
  body: tokenPayload,
});
```

### **2. URL de Autorização Corrigida**
```typescript
// src/app/admin/settings/page.tsx
const authUrl = `https://auth.mercadopago.com/authorization?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
```

## 🎯 **Diferenças Importantes**

### **OAuth para Aplicações vs Marketplace**

| Aspecto | Aplicação Simples | Marketplace |
|---------|------------------|-------------|
| URL | `auth.mercadopago.com/authorization` | `auth.mercadopago.com/authorization?platform_id=mp` |
| Uso | Integração direta | Gerenciar vendas de terceiros |
| Headers | `application/x-www-form-urlencoded` | `application/x-www-form-urlencoded` |
| Body | `URLSearchParams` | `URLSearchParams` |

## ✅ **Teste da Integração**

### **1. Verificar Configuração**
```bash
curl -X GET http://localhost:3000/api/mercadopago/test
```

### **2. Testar Autorização**
1. Acesse: `http://localhost:3000/admin/settings`
2. Clique: "Conectar Mercado Pago"
3. Autorize no site do Mercado Pago
4. Verifique se retorna conectado

### **3. Logs Esperados**
```
🚀 Iniciando conexão com Mercado Pago: { clientId: "1234567890...", redirectUri: "http://localhost:3000/api/mercadopago/callback" }
Callback Mercado Pago recebido: { code: true, error: null }
Trocando code por token: { client_id: "1234567890...", redirect_uri: "http://localhost:3000/api/mercadopago/callback", code: "TG-1234567890..." }
Token recebido com sucesso: { has_access_token: true, has_refresh_token: true, expires_in: 21600 }
Tokens salvos no banco com sucesso
```

## 🚨 **Problemas Comuns Resolvidos**

### **1. "Invalid grant"**
- ✅ **Causa**: Headers incorretos
- ✅ **Solução**: Usar `application/x-www-form-urlencoded`

### **2. "Invalid client"**
- ✅ **Causa**: Client ID/Secret incorretos
- ✅ **Solução**: Verificar variáveis de ambiente

### **3. "Redirect URI mismatch"**
- ✅ **Causa**: URI não configurado no Mercado Pago
- ✅ **Solução**: Configurar exatamente: `http://localhost:3000/api/mercadopago/callback`

### **4. "Authorization failed"**
- ✅ **Causa**: Usar OAuth de marketplace
- ✅ **Solução**: Remover `platform_id=mp`

## 📋 **Checklist Final**

- ✅ URL de autorização sem `platform_id=mp`
- ✅ Headers corretos: `application/x-www-form-urlencoded`
- ✅ Body usando `URLSearchParams`
- ✅ Redirect URI configurado no Mercado Pago
- ✅ Client ID e Secret corretos
- ✅ Aplicação criada como "Aplicação Simples" (não Marketplace)

Agora a integração está seguindo exatamente a documentação oficial do Mercado Pago! 🚀

