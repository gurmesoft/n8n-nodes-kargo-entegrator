import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tomlPath = path.resolve(__dirname, '../shopify.app.toml');
const tomlContent = fs.readFileSync(tomlPath, 'utf8');

const applicationUrlMatch = tomlContent.match(/application_url\s*=\s*"([^"]+)"/);
if (!applicationUrlMatch) {
    console.error('shopify.app.toml dosyasında application_url bulunamadı !');
    process.exit(1);
}

const applicationUrl = applicationUrlMatch[1];
const targetPath = path.resolve(__dirname, '.env');

let envContent = '';
if (fs.existsSync(targetPath)) {
    envContent = fs.readFileSync(targetPath, 'utf8');
}

const appUrlRegex = /^APP_URL=.*$/m;
const newAppUrlLine = `APP_URL=${applicationUrl}`;

if (appUrlRegex.test(envContent)) {
    envContent = envContent.replace(appUrlRegex, newAppUrlLine);
} else {
    envContent = envContent.trim();
    envContent += envContent ? `\n${newAppUrlLine}\n` : `${newAppUrlLine}\n`;
}

fs.writeFileSync(targetPath, envContent);

console.log(`APP_URL updated: ${applicationUrl}`);
