const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const backupsDir = path.join(rootDir, "backups");
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
const targetDir = path.join(backupsDir, `backup-${timestamp}`);
fs.mkdirSync(targetDir, { recursive: true });

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    const baseName = path.basename(src);
    if (baseName === "node_modules" || baseName === "backups" || baseName === ".git") return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log(`Creating snapshot in backups/backup-${timestamp}...`);
for (const item of fs.readdirSync(rootDir)) {
  if (item === "node_modules" || item === "backups" || item === ".git") continue;
  copyRecursive(path.join(rootDir, item), path.join(targetDir, item));
}
console.log("✅ Backup completed successfully in backups/ folder!");
