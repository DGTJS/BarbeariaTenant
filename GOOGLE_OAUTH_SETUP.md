# Configuração do Google OAuth

## ⚠️ Problema: Google Cloud Console não aceita subdomínios locais

O Google Cloud Console **NÃO aceita** URLs de redirecionamento com subdomínios locais como:
- ❌ `http://santos.localhost:3000/api/auth/callback/google`
- ❌ `http://teste.localhost:3000/api/auth/callback/google`

## ✅ Solução Implementada

O código foi ajustado para **sempre usar `localhost:3000`** para OAuth em desenvolvimento local, independente do subdomínio usado para acessar a aplicação.

## 📝 Configuração no Google Cloud Console

### Passo 1: Acesse o Google Cloud Console
1. Acesse: https://console.cloud.google.com/apis/credentials
2. Selecione seu projeto
3. Clique no **OAuth 2.0 Client ID**

### Passo 2: Configure as URLs de Redirecionamento

Em **"URIs de redirecionamento autorizados"**, adicione **APENAS**:

```
http://localhost:3000/api/auth/callback/google
```

⚠️ **IMPORTANTE:**
- ✅ Use `http://` (não `https://`) para localhost
- ✅ Não adicione trailing slash (`/`) no final
- ✅ Não adicione subdomínios como `santos.localhost:3000`
- ❌ O Google não aceita subdomínios locais

### Passo 3: Configure as Origens JavaScript Autorizadas

Em **"Origens JavaScript autorizadas"**, adicione:

```
http://localhost:3000
```

### Passo 4: Salvar e Aguardar
1. Clique em **"Save"**
2. Aguarde **2-5 minutos** para as mudanças propagarem

## 🔧 Como Funciona

1. **Em desenvolvimento local:**
   - Você pode acessar a aplicação via `http://santos.localhost:3000` ou qualquer subdomínio
   - Quando clicar em "Login com Google", o código automaticamente normaliza para `localhost:3000`
   - O Google redireciona para `http://localhost:3000/api/auth/callback/google`
   - O callback funciona corretamente, mesmo que você tenha iniciado o login de um subdomínio

2. **Em produção:**
   - Use o domínio real configurado no Google Cloud Console
   - Exemplo: `https://seudominio.com/api/auth/callback/google`

## 🧪 Testar a Configuração

Execute o script de teste:

```bash
node scripts/test-google-oauth-flow.js
```

Este script verifica:
- ✅ Variáveis de ambiente configuradas
- ✅ Servidor rodando
- ✅ CSRF token funcionando
- ✅ URLs de callback corretas

## 🐛 Troubleshooting

### Erro: "Redirecionamento inválido"

**Causa:** URL não está configurada corretamente no Google Cloud Console

**Solução:**
1. Verifique se a URL está **exatamente** como: `http://localhost:3000/api/auth/callback/google`
2. Certifique-se de que não há trailing slash
3. Use `http://` (não `https://`) para localhost
4. Aguarde alguns minutos após salvar

### Erro: "OAuthAccountNotLinked"

**Causa:** Tentativa de vincular conta Google a um email que já existe com outro método de login

**Solução:**
- Use outro email do Google
- Ou faça login com email/senha primeiro

### Login funciona em `localhost:3000` mas não em subdomínios

**Isso é esperado!** O Google OAuth sempre redireciona para `localhost:3000` em desenvolvimento, mas o login deve funcionar normalmente mesmo se você iniciou de um subdomínio.

## 📚 Referências

- [NextAuth.js - Google Provider](https://next-auth.js.org/providers/google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

