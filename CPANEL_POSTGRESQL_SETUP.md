# 🔧 Configuração PostgreSQL no cPanel

## ⚠️ IMPORTANTE

**Nem todos os provedores de hospedagem cPanel oferecem PostgreSQL!**

Antes de continuar, verifique se o PostgreSQL está disponível no seu cPanel:
1. Acesse **cPanel** → **PostgreSQL Databases**
2. Se você não ver essa opção, seu provedor pode não oferecer PostgreSQL
3. Nesse caso, você precisará usar MySQL ou considerar outro provedor

## 📋 Passo a Passo: Configurar PostgreSQL no cPanel

### 1. Criar Banco de Dados PostgreSQL

1. Acesse **cPanel** → **PostgreSQL Databases**
2. Na seção **Create Database**:
   - Digite o nome do banco (ex: `barberboss`)
   - Clique em **Create Database**
3. O nome completo será: `devanksi_barberboss` (com seu prefixo)

### 2. Criar Usuário PostgreSQL

1. Na seção **Add User**:
   - Digite o nome do usuário (ex: `barberboss_user`)
   - Digite a senha (ex: `jake0707`)
   - Clique em **Create User**
2. O nome completo será: `devanksi_barberboss_user` (com seu prefixo)

### 3. Associar Usuário ao Banco

1. Na seção **Add User To Database**:
   - Selecione o usuário: `devanksi_barberboss_user`
   - Selecione o banco: `devanksi_barberboss`
   - Clique em **Add**
2. Marque todas as permissões (ALL PRIVILEGES)
3. Clique em **Make Changes**

### 4. Configurar DATABASE_URL

**Formato PostgreSQL:**
```
postgresql://USUARIO:SENHA@HOST:PORTA/BANCO
```

**Exemplo:**
```
postgresql://devanksi_barberboss_user:jake0707@localhost:5432/devanksi_barberboss
```

**No cPanel:**
1. **Node.js App** → Sua aplicação → **Environment Variables**
2. Adicione/Edite: `DATABASE_URL`
3. Cole a URL PostgreSQL

### 5. Regenerar Prisma Client

Após configurar, execute via SSH:

```bash
npx prisma generate
npx prisma migrate deploy
```

### 6. Reiniciar Aplicação

No cPanel, reinicie a aplicação Node.js.

## 🔍 Verificar PostgreSQL no cPanel

### Verificar se PostgreSQL está disponível:

1. **cPanel** → Procure por "PostgreSQL" na busca
2. Se não encontrar, verifique:
   - **cPanel** → **Software** → **PostgreSQL**
   - Ou entre em contato com seu provedor

### Verificar versão do PostgreSQL:

Via SSH:
```bash
psql --version
```

## 📝 Diferenças MySQL vs PostgreSQL

### 1. Arrays Nativos

**PostgreSQL suporta arrays nativos:**
```prisma
phones String[]  // ✅ Funciona no PostgreSQL
```

**MySQL NÃO suporta:**
```prisma
phones String?   // ❌ MySQL precisa ser String? ou usar JSON
```

### 2. Porta Padrão

- **MySQL:** `3306`
- **PostgreSQL:** `5432`

### 3. Protocolo na URL

- **MySQL:** `mysql://`
- **PostgreSQL:** `postgresql://` ou `postgres://`

### 4. Case Sensitivity

- **MySQL:** Geralmente não diferencia maiúsculas/minúsculas
- **PostgreSQL:** Diferencia maiúsculas/minúsculas (use aspas duplas para nomes com maiúsculas)

## 🚨 Troubleshooting

### Erro: "PostgreSQL Databases não encontrado no cPanel"

**Solução:**
- Seu provedor pode não oferecer PostgreSQL
- Entre em contato com o suporte
- Considere usar MySQL ou migrar para um provedor que ofereça PostgreSQL

### Erro: "psql: command not found"

**Solução:**
- PostgreSQL pode não estar instalado no servidor
- Entre em contato com o suporte do provedor

### Erro: "password authentication failed"

**Solução:**
- Verifique se a senha está correta
- Verifique se o usuário tem permissões no banco
- No cPanel: **PostgreSQL Databases** → Verificar associação usuário/banco

### Erro: "database does not exist"

**Solução:**
- Verifique se o banco foi criado
- No cPanel: **PostgreSQL Databases** → Ver lista de bancos

## 📚 Referências

- [Prisma PostgreSQL Documentation](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)

