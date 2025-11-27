# 🔧 Configuração do Banco de Dados no cPanel

## ⚠️ Erro Atual
```
Authentication failed against database server, the provided database credentials for `devanksi_barberboss` are not valid.
```

## ✅ Solução

### 1. Verificar Credenciais do Banco de Dados no cPanel

1. Acesse o **cPanel** → **MySQL Databases**
2. Verifique:
   - **Nome do banco**: `devanksi_barberboss` (ou o nome que você criou)
   - **Usuário do banco**: `devanksi_usuario` (geralmente começa com seu prefixo)
   - **Senha**: A senha que você definiu

### 2. Formato Correto da DATABASE_URL

A `DATABASE_URL` deve estar no formato:

```
mysql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO
```

**Exemplo:**
```
mysql://devanksi_usuario:senha123@localhost:3306/devanksi_barberboss
```

### 3. Configurar no cPanel

1. Acesse **cPanel** → **Node.js App** → Sua aplicação
2. Vá em **Environment Variables**
3. Adicione/Edite a variável `DATABASE_URL`:

```
mysql://devanksi_usuario:SUA_SENHA@localhost:3306/devanksi_barberboss
```

**⚠️ IMPORTANTE:**
- Substitua `devanksi_usuario` pelo seu usuário real do MySQL
- Substitua `SUA_SENHA` pela senha real (pode conter caracteres especiais, então pode precisar de URL encoding)
- Substitua `devanksi_barberboss` pelo nome real do seu banco
- Se a senha contém caracteres especiais, use URL encoding:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`
  - `+` → `%2B`
  - `=` → `%3D`
  - `?` → `%3F`
  - Espaço → `%20`

### 4. Verificar Conexão via SSH

Após configurar, teste a conexão via SSH:

```bash
# Conectar ao MySQL
mysql -u devanksi_usuario -p devanksi_barberboss

# Ou testar com a URL completa
mysql -h localhost -u devanksi_usuario -p devanksi_barberboss
```

### 5. Regenerar Prisma Client

Após corrigir a `DATABASE_URL`, execute:

```bash
npx prisma generate
npx prisma migrate deploy
```

### 6. Reiniciar a Aplicação

No cPanel, reinicie a aplicação Node.js.

## 🔍 Como Encontrar as Credenciais Corretas

### Opção 1: Via cPanel MySQL Databases
1. **cPanel** → **MySQL Databases**
2. Na seção **Current Databases**, você verá:
   - Nome do banco: `devanksi_nome_banco`
   - Usuário associado: `devanksi_usuario`

### Opção 2: Via phpMyAdmin
1. **cPanel** → **phpMyAdmin**
2. O nome do banco aparece na lista à esquerda
3. Para ver usuários: **phpMyAdmin** → **User accounts**

### Opção 3: Via Arquivo de Configuração
Se você tem acesso a arquivos PHP antigos, pode verificar em:
- `wp-config.php` (WordPress)
- `config.php` (outros sistemas)
- Arquivos `.env` antigos

## 📝 Exemplo Completo

Se suas credenciais são:
- **Usuário**: `devanksi_barberboss_user`
- **Senha**: `MinhaSenh@123`
- **Banco**: `devanksi_barberboss`
- **Host**: `localhost`
- **Porta**: `3306`

A `DATABASE_URL` seria:
```
mysql://devanksi_barberboss_user:MinhaSenh%40123@localhost:3306/devanksi_barberboss
```

Note que `@` na senha foi convertido para `%40`.

## 🚨 Troubleshooting

### Erro: "Access denied for user"
- Verifique se o usuário tem permissões no banco
- No cPanel, vá em **MySQL Databases** → **Add User To Database**
- Certifique-se de que o usuário está associado ao banco

### Erro: "Unknown database"
- Verifique se o nome do banco está correto
- Certifique-se de que o banco foi criado

### Erro: "Connection refused"
- Verifique se o host está correto (geralmente `localhost` no cPanel)
- Verifique se a porta está correta (geralmente `3306`)

