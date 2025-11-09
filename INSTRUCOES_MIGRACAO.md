# ⚠️ Instruções para Resolver o Erro

## Problema

O Prisma Client precisa ser regenerado após as mudanças no schema, mas está bloqueado porque o servidor Next.js está rodando.

## Solução

### 1. Pare o servidor de desenvolvimento

- Pressione `Ctrl+C` no terminal onde o `npm run dev` está rodando
- Ou feche a janela do terminal

### 2. Regenerar o Prisma Client

```bash
npx prisma generate
```

### 3. Executar a Migration no Banco de Dados

```bash
npx prisma migrate deploy
```

**OU**, se estiver em desenvolvimento local:

```bash
npx prisma migrate dev
```

### 4. Converter Roles Existentes (Opcional mas Recomendado)

```bash
npm run fix:roles
```

Este script converte todos os roles de string para número:

- "Admin" / "administrador" → 1
- "Barbeiro" / "barber" → 2
- Outros → 3 (Cliente)

### 5. Reiniciar o Servidor

```bash
npm run dev
```

## ⚡ Solução Rápida (Se o erro persistir)

Se ainda der erro de permissão:

1. **Feche completamente o VS Code/Cursor**
2. **Regenere o Prisma Client** em um terminal externo:
   ```bash
   cd C:\Users\joaod\OneDrive\Documentos\Barbearia\barbearia-app
   npx prisma generate
   ```
3. **Execute a migration**:
   ```bash
   npx prisma migrate deploy
   ```
4. **Reabra o VS Code/Cursor e reinicie o servidor**

## 🔍 Verificação

Após seguir os passos, verifique se está funcionando:

1. O servidor deve iniciar sem erros
2. Tente acessar `/admin/barbers`
3. Clique em "Permissões" de um barbeiro
4. Deve abrir o modal sem erros

## 📝 Nota Importante

**NUNCA execute `prisma generate` ou `prisma migrate` enquanto o servidor Next.js estiver rodando!**

O Prisma Client é gerado em tempo de build, e arquivos podem ficar bloqueados no Windows se o servidor estiver usando-os.
