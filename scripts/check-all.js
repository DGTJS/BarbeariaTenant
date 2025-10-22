#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue('🔍 Executando verificação completa do projeto...\n'));

const checks = [
  {
    name: 'TypeScript Type Check',
    command: 'npm run type-check',
    description: 'Verificando tipos TypeScript'
  },
  {
    name: 'ESLint',
    command: 'npm run lint',
    description: 'Verificando qualidade do código'
  },
  {
    name: 'Prettier Format Check',
    command: 'npm run format:check',
    description: 'Verificando formatação do código'
  },
  {
    name: 'Next.js Build',
    command: 'npm run build',
    description: 'Verificando build de produção'
  }
];

let hasErrors = false;

for (const check of checks) {
  try {
    console.log(chalk.yellow(`⏳ ${check.description}...`));
    execSync(check.command, { stdio: 'pipe' });
    console.log(chalk.green(`✅ ${check.name} - OK\n`));
  } catch (error) {
    console.log(chalk.red(`❌ ${check.name} - ERRO\n`));
    console.log(chalk.red(error.stdout?.toString() || error.message));
    hasErrors = true;
  }
}

if (hasErrors) {
  console.log(chalk.red('🚨 Verificação falhou! Corrija os erros antes de fazer commit.'));
  process.exit(1);
} else {
  console.log(chalk.green('🎉 Todas as verificações passaram! Projeto pronto para commit.'));
}
