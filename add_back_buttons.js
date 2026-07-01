const fs = require('fs');
const path = require('path');

const root = path.join('c:\\Users\\DJCVM\\Desktop\\мой сайт', '8 kl');
const files = fs.readdirSync(root).filter((name) => name.toLowerCase().endsWith('.html'));

const snippet = `\n<script>\n(function(){\n  if (document.getElementById('ma8-back-btn')) return;\n  const btn = document.createElement('a');\n  btn.id = 'ma8-back-btn';\n  btn.href = '../8kl.html';\n  btn.textContent = '← Назад';\n  btn.style.cssText = 'position:fixed;top:14px;left:14px;z-index:9999;display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:999px;background:rgba(10,42,102,0.95);color:white;text-decoration:none;font:600 14px/1.2 Noto Sans,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.18);';\n  document.body.appendChild(btn);\n})();\n</script>\n`;

let updated = 0;
for (const file of files) {
  const fullPath = path.join(root, file);
  let text = fs.readFileSync(fullPath, 'utf8');
  if (text.includes('ma8-back-btn') || !text.includes('</body>')) continue;
  text = text.replace('</body>', snippet + '</body>', 1);
  fs.writeFileSync(fullPath, text, 'utf8');
  updated += 1;
}

console.log(`updated ${updated}`);
