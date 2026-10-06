const fs = require('node:fs/promises');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'dist');
const requiredFiles = [
  'index.html',
  'css/tailwind.min.css',
  'css/custom.css',
  'js/app.js',
  'js/animations.js',
  'js/charts.js',
  'js/data.js',
  'assets/resume.pdf',
  'assets/ypk.jfif',
];

async function checkBuild() {
  for (const relativePath of requiredFiles) {
    const filePath = path.join(outputDir, relativePath);
    const stat = await fs.stat(filePath).catch(() => null);
    if (!stat?.isFile() || stat.size === 0) {
      throw new Error(`Missing or empty build output: ${relativePath}`);
    }
  }

  const html = await fs.readFile(path.join(outputDir, 'index.html'), 'utf8');
  const assetReferences = html.matchAll(
    /(?:src|href)=["']((?:\.?\/?(?:css|js|assets)\/)[^"']+)["']/g,
  );

  for (const [, reference] of assetReferences) {
    const localPath = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
    const filePath = path.resolve(outputDir, localPath);
    if (!filePath.startsWith(`${outputDir}${path.sep}`)) {
      throw new Error(`Build reference escapes output directory: ${reference}`);
    }

    const stat = await fs.stat(filePath).catch(() => null);
    if (!stat?.isFile() || stat.size === 0) {
      throw new Error(`Broken local asset reference in index.html: ${reference}`);
    }
  }

  console.log(`Build output looks complete (${requiredFiles.length} required files).`);
}

checkBuild().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
