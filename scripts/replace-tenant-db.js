const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Substituir import
    if (content.includes('getTenantDatabase')) {
      // Remover getTenantDatabase do import de auth
      content = content.replace(
        /import\s*{\s*([^}]*getTenantDatabase[^}]*)\s*}\s*from\s*["']@\/_lib\/auth["']/g,
        (match, imports) => {
          const newImports = imports
            .split(',')
            .map(i => i.trim())
            .filter(i => !i.includes('getTenantDatabase'))
            .join(', ');
          return newImports 
            ? `import { ${newImports} } from "@/_lib/auth"`
            : '';
        }
      );

      // Adicionar import de db se não existir
      if (!content.includes('from "@/_lib/prisma"') && !content.includes("from '@/_lib/prisma'")) {
        const lines = content.split('\n');
        let lastImportIndex = -1;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('import ')) {
            lastImportIndex = i;
          }
        }
        if (lastImportIndex >= 0) {
          lines.splice(lastImportIndex + 1, 0, 'import { db } from "@/_lib/prisma";');
          content = lines.join('\n');
        }
      }

      // Substituir chamadas
      content = content.replace(
        /const\s+db\s*=\s*await\s+getTenantDatabase\([^)]*\);/g,
        '// Usando banco único'
      );

      content = content.replace(
        /await\s+getTenantDatabase\([^)]*\)/g,
        'db'
      );

      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      count += processDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      if (replaceInFile(filePath)) {
        count++;
      }
    }
  }

  return count;
}

console.log('🔄 Substituindo getTenantDatabase por db...\n');
const count = processDirectory(srcDir);
console.log(`\n✅ ${count} arquivos atualizados!`);

