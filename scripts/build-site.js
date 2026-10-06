const fs = require('node:fs/promises');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'dist');

async function buildSite() {
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });

  await fs.copyFile(
    path.join(projectRoot, 'index.html'),
    path.join(outputDir, 'index.html'),
  );

  for (const [source, destination] of [
    ['css/custom.css', 'css/custom.css'],
    ['css/tailwind.min.css', 'css/tailwind.min.css'],
  ]) {
    const target = path.join(outputDir, destination);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(path.join(projectRoot, source), target);
  }

  for (const directory of ['js', 'assets']) {
    await fs.cp(
      path.join(projectRoot, directory),
      path.join(outputDir, directory),
      { recursive: true },
    );
  }
}

buildSite().catch((error) => {
  console.error('Failed to assemble the static site:', error);
  process.exitCode = 1;
});
