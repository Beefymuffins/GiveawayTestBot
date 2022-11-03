const { glob } = require('glob');
const { promisify } = require('util');
const promiseGlob = promisify(glob);

async function loadFiles(dirName) {
  const Files = await promiseGlob(
    `${process.cwd().replace(/\\/g, '/')}/${dirName}/**/*.js`
  );
  Files.forEach((file) => delete require.cache[require.resolve(file)]);
  return Files;
}

module.exports = { loadFiles };
