// Setup verification script
// Run with: node check-setup.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 CloudPOS Backend Setup Verification\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

// Check 1: package.json exists
console.log('1. Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('   ✅ package.json found');
  console.log(`   📦 Dependencies: ${Object.keys(packageJson.dependencies || {}).length}`);
  console.log(`   🛠️  Dev Dependencies: ${Object.keys(packageJson.devDependencies || {}).length}`);
  checks.passed++;
} catch (e) {
  console.log('   ❌ package.json not found or invalid');
  checks.failed++;
}

// Check 2: node_modules exists
console.log('\n2. Checking node_modules...');
if (fs.existsSync('node_modules')) {
  console.log('   ✅ node_modules directory exists');
  checks.passed++;
} else {
  console.log('   ❌ node_modules not found - run: npm install');
  checks.failed++;
}

// Check 3: wrangler.toml exists and has database_id
console.log('\n3. Checking wrangler.toml...');
try {
  const wranglerContent = fs.readFileSync('wrangler.toml', 'utf8');
  console.log('   ✅ wrangler.toml found');

  if (wranglerContent.includes('database_id = ""')) {
    console.log('   ⚠️  Warning: database_id is empty in wrangler.toml');
    console.log('   📝 You need to create D1 database and update database_id');
    checks.warnings++;
  } else if (wranglerContent.match(/database_id = "[\w-]+"/)) {
    console.log('   ✅ database_id is configured');
    checks.passed++;
  } else {
    console.log('   ⚠️  Warning: Could not verify database_id');
    checks.warnings++;
  }
} catch (e) {
  console.log('   ❌ wrangler.toml not found');
  checks.failed++;
}

// Check 4: schema.sql exists
console.log('\n4. Checking schema.sql...');
if (fs.existsSync('schema.sql')) {
  const schemaContent = fs.readFileSync('schema.sql', 'utf8');
  const tableMatches = schemaContent.match(/CREATE TABLE/g);
  console.log('   ✅ schema.sql found');
  console.log(`   📊 Tables defined: ${tableMatches ? tableMatches.length : 0}`);
  checks.passed++;
} else {
  console.log('   ❌ schema.sql not found');
  checks.failed++;
}

// Check 5: Source files exist
console.log('\n5. Checking source files...');
const requiredFiles = [
  'src/index.js',
  'src/routes/auth.js',
  'src/routes/categories.js',
  'src/routes/products.js',
  'src/routes/orders.js',
  'src/middleware/auth.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`   ❌ Missing: ${file}`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('   ✅ All required source files exist');
  checks.passed++;
} else {
  console.log('   ❌ Some source files are missing');
  checks.failed++;
}

// Check 6: Hono dependency
console.log('\n6. Checking Hono installation...');
if (fs.existsSync('node_modules/hono')) {
  console.log('   ✅ Hono is installed');
  checks.passed++;
} else {
  console.log('   ❌ Hono not found - run: npm install');
  checks.failed++;
}

// Check 7: Wrangler dependency
console.log('\n7. Checking Wrangler installation...');
if (fs.existsSync('node_modules/wrangler')) {
  console.log('   ✅ Wrangler is installed');
  checks.passed++;
} else {
  console.log('   ❌ Wrangler not found - run: npm install');
  checks.failed++;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📋 SETUP SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Passed:   ${checks.passed}`);
console.log(`❌ Failed:   ${checks.failed}`);
console.log(`⚠️  Warnings: ${checks.warnings}`);
console.log('='.repeat(50));

if (checks.failed > 0) {
  console.log('\n⚠️  SETUP INCOMPLETE');
  console.log('\n📚 Next steps:');
  console.log('   1. Run: npm install');
  console.log('   2. Login to Cloudflare: npx wrangler login');
  console.log('   3. Create D1 database: npx wrangler d1 create pos-db');
  console.log('   4. Update wrangler.toml with database_id');
  console.log('   5. Run migrations: npm run db:migrate');
} else if (checks.warnings > 0) {
  console.log('\n⚠️  SETUP ALMOST COMPLETE');
  console.log('\n📚 Complete these steps:');
  console.log('   1. Create D1 database: npx wrangler d1 create pos-db');
  console.log('   2. Update wrangler.toml with database_id');
  console.log('   3. Run migrations: npm run db:migrate');
} else {
  console.log('\n✅ SETUP COMPLETE!');
  console.log('\n🚀 Ready to start development:');
  console.log('   npm run dev');
}

console.log('\n📖 For detailed instructions, see: DEPLOYMENT_SETUP.md\n');
