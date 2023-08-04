import chalk from "chalk";
import util from "util";
import fs from "fs";
import path from "path";

import devkit from '@nx/devkit';
const { readCachedProjectGraph } = devkit;

const [, , name] = process.argv;

const graph = readCachedProjectGraph();
const project = graph.nodes[name];
const copyFilePromise = util.promisify(fs.copyFile);

function invariant(condition, message) {
  if (!condition) {
    console.error(chalk.bold.red(message));
    process.exit(1);
  }
}


function copyFiles(srcDir, destDir, files) {
  return Promise.all(files.map(f => {
    return copyFilePromise(path.join(srcDir, f), path.join(destDir, f));
  }));
}

invariant(
  project,
  `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`
);

const outputPath = path.resolve(project.data?.targets?.build?.options?.outputPath);
const basePath = path.resolve('./');

try {
  await copyFiles(`${basePath}/`, `${outputPath}/`, ['.npmrc']);
  console.log(
    chalk.bold.blue(`Copy.npmrc to ${basePath} from ${outputPath}`)
  );
} catch (e) {
  console.error(
    chalk.bold.red(`Error ${e.message}.`)
  );
}
