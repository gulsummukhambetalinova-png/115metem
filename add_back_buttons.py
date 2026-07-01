from pathlib import Path
root = Path(r'c:\Users\DJCVM\Desktop\мой сайт\8 kl')
updated = 0
snippet = '''<script>
(function(){
  if (document.getElementById('ma8-back-btn')) return;
  const btn = document.createElement('a');
  btn.id = 'ma8-back-btn';
  btn.href = '../8kl.html';
  btn.textContent = '← Назад';
  btn.style.cssText = 'position:fixed;top:14px;left:14px;z-index:9999;display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:999px;background:rgba(10,42,102,0.95);color:white;text-decoration:none;font:600 14px/1.2 Noto Sans,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.18);';
  document.body.appendChild(btn);
})();
</script>
'''
for path in sorted(root.glob('*.html')):
    text = path.read_text(encoding='utf-8')
    if 'ma8-back-btn' in text or '</body>' not in text:
        continue
    text = text.replace('</body>', snippet + '</body>', 1)
    path.write_text(text, encoding='utf-8')
    updated += 1
print(f'updated {updated}')
