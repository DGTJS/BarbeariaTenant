# Debug - Mercado Pago Connection

## 🔍 Checklist de Verificação

### 1. Variáveis de Ambiente
Verifique se estão configuradas no arquivo `.env.local`:

```env
MERCADOPAGO_CLIENT_ID=seu_client_id_aqui
MERCADOPAGO_CLIENT_SECRET=seu_client_secret_aqui
NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID=seu_client_id_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Aplicação no Mercado Pago
1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Vá em "Suas integrações" > "Criar aplicação"
3. Configure o **Redirect URI**: `http://localhost:3000/api/mercadopago/callback`
4. Copie o **Client ID** e **Client Secret**

### 3. Teste Manual da URL de Autorização
Teste a URL diretamente no navegador:
```
https://auth.mercadopago.com/authorization?client_id=SEU_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000/api/mercadopago/callback&platform_id=mp
```

### 4. Verificar Logs
Abra o console do navegador (F12) e verifique:
- Se o Client ID está sendo carregado
- Se a URL de autorização está correta
- Se há erros de CORS ou popup bloqueado

### 5. Verificar Logs do Servidor
No terminal onde está rodando o Next.js, verifique:
- Logs do callback recebido
- Erros na troca de token
- Erros no banco de dados

## 🚨 Problemas Comuns

### "Client ID não configurado"
- Verifique se `NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID` está no `.env.local`
- Reinicie o servidor após adicionar a variável

### "Popup bloqueado"
- Permita popups para localhost
- Ou use `window.location.href = authUrl` em vez de `window.open`

### "Erro 400/401 na troca de token"
- Verifique se `MERCADOPAGO_CLIENT_SECRET` está correto
- Verifique se o Redirect URI está exatamente igual no Mercado Pago
- Verifique se a aplicação está ativa no Mercado Pago

### "Erro no banco de dados"
- Verifique se o Prisma está configurado
- Verifique se a tabela `SiteConfig` existe
- Execute `npx prisma db push` se necessário

## 🔧 Teste de Debug

### 1. Teste da API de Token
```bash
curl -X GET http://localhost:3000/api/mercadopago/token
```

### 2. Teste do Callback
Acesse diretamente:
```
http://localhost:3000/api/mercadopago/callback?code=test&state=test
```

### 3. Verificar Configurações no Banco
```sql
SELECT * FROM SiteConfig WHERE key LIKE 'mercado_pago%';
```

## 📝 Logs Esperados

### Sucesso:
```
Conectando ao Mercado Pago: { clientId: "1234567890...", redirectUri: "http://localhost:3000/api/mercadopago/callback", authUrl: "https://auth.mercadopago.com/authorization?..." }
Callback Mercado Pago recebido: { code: true, error: null, state: null }
Trocando code por token: { client_id: "1234567890...", redirect_uri: "http://localhost:3000/api/mercadopago/callback", code: "TG-1234567890..." }
Token recebido com sucesso: { has_access_token: true, has_refresh_token: true, expires_in: 21600 }
Tokens salvos no banco com sucesso
```

### Erro:
```
Erro no OAuth Mercado Pago: access_denied
Erro ao trocar code por token: { status: 400, statusText: "Bad Request", error: "invalid_grant" }
```

## 🆘 Solução de Problemas

1. **Limpe o cache do navegador**
2. **Reinicie o servidor Next.js**
3. **Verifique se todas as variáveis estão corretas**
4. **Teste com uma nova aplicação no Mercado Pago**
5. **Verifique se o Redirect URI está exato (sem trailing slash)**

