const fs = require('fs');
const path = require('path');

const root = __dirname;
const variants = [
  { folder: '8 kl/1 вариант', output: '8 kl/1 вариант/images.json' },
  { folder: '8 kl/2 вариант', output: '8 kl/2 вариант/images.json' },
  { folder: '8 kl/3 вариант', output: '8 kl/3 вариант/images.json' }
];

const SUPPORTED = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

variants.forEach(({ folder, output }) => {
  const absFolder = path.join(root, folder);
  if (!fs.existsSync(absFolder)) {
    fs.mkdirSync(absFolder, { recursive: true });
  }

  const files = fs.readdirSync(absFolder)
    .filter((file) => SUPPORTED.includes(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'ru', { numeric: true }))
    .map((file, index) => ({
      id: `${index + 1}`,
      title: `Задача ${index + 1}`,
      taskNumber: index + 1,
      path: `${folder}/${file}`.replace(/\\/g, '/'),
      source: file
    }));

  fs.writeFileSync(path.join(root, output), JSON.stringify(files, null, 2));
  console.log(`Generated ${output} with ${files.length} images`);
});
