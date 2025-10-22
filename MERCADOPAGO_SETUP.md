# Configuração do Mercado Pago

## 1. Criar Aplicação no Mercado Pago

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Faça login com sua conta Mercado Pago
3. Vá em "Suas integrações" > "Criar aplicação"
4. Preencha os dados da aplicação:
   - Nome: "Barbearia SaaS"
   - Descrição: "Sistema de agendamento para barbearias"
   - Categoria: "E-commerce"
5. Anote o **Client ID** e **Client Secret**

## 2. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis no seu arquivo `.env.local`:

```env
# Mercado Pago
MERCADOPAGO_CLIENT_ID=seu_client_id_aqui
MERCADOPAGO_CLIENT_SECRET=seu_client_secret_aqui
NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID=seu_client_id_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Configurar Redirect URI

No painel do Mercado Pago, configure o Redirect URI:
- **Redirect URI**: `http://localhost:3000/api/mercadopago/callback` (desenvolvimento)
- **Redirect URI**: `https://seudominio.com/api/mercadopago/callback` (produção)

## 4. Configurar Webhook (Opcional)

Para receber notificações de pagamento:
- **Webhook URL**: `https://seudominio.com/api/mercadopago/webhook`
- **Eventos**: `payment`

## 5. Como Funciona

### Fluxo OAuth
1. Usuário clica em "Conectar Mercado Pago"
2. Redireciona para autorização do Mercado Pago
3. Usuário autoriza a aplicação
4. Mercado Pago redireciona de volta com código
5. Sistema troca código por access_token
6. Tokens são salvos no banco de dados

### Criação de Pagamento
1. Sistema obtém token válido (renova se necessário)
2. Cria pagamento via API do Mercado Pago
3. Retorna QR Code PIX ou link de pagamento
4. Cliente paga via PIX/cartão
5. Webhook recebe notificação de status

### Renovação de Token
- Tokens expiram em 6 horas
- Sistema renova automaticamente usando refresh_token
- Se refresh falhar, usuário precisa reconectar

## 6. Testes

### Modo Sandbox
- Use credenciais de teste do Mercado Pago
- Pagamentos de teste não cobram taxas
- Use cartões de teste para simular pagamentos

### Modo Produção
- Use credenciais de produção
- Pagamentos reais serão processados
- Configure webhook para receber notificações

## 7. Segurança

- **NUNCA** exponha o Client Secret no frontend
- Use HTTPS em produção
- Valide todas as notificações do webhook
- Implemente rate limiting nas APIs
- Criptografe tokens sensíveis no banco

## 8. Troubleshooting

### Erro "Token inválido"
- Verifique se Client ID/Secret estão corretos
- Confirme se Redirect URI está configurado
- Verifique se a aplicação está ativa

### Erro "Falha ao renovar token"
- Refresh token pode ter expirado
- Usuário precisa reconectar conta
- Verifique logs do servidor

### Webhook não recebe notificações
- Confirme se URL está acessível publicamente
- Verifique se está usando HTTPS
- Teste com ngrok em desenvolvimento

