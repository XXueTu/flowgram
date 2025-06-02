import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export function getProjectInfo() {
  // get nearest package.json
  let projectPath = process.cwd();

  while (projectPath !== '/' && !fs.existsSync(path.join(projectPath, 'package.json'))) {
    projectPath = path.join(projectPath, '..');
  }

  if (projectPath === '/') {
    throw new Error('Please run this command in a valid project');
  }

  const packageJsonPath = path.join(projectPath, 'package.json');

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // fixed layout or free layout
  const flowgramVersion =
    packageJson.dependencies['@flowgram.ai/fixed-layout-editor'] ||
    packageJson.dependencies['@flowgram.ai/free-layout-editor'] ||
    packageJson.dependencies['@flowgram.ai/editor'];

  if (!flowgramVersion) {
    throw new Error(
      'Please install @flowgram.ai/fixed-layout-editor or @flowgram.ai/free-layout-editor'
    );
  }

  return {
    projectPath,
    packageJsonPath,
    packageJson,
    flowgramVersion,
  };
}

export function findRushJson(startPath) {
  let currentPath = startPath;
  while (currentPath !== '/' && !fs.existsSync(path.join(currentPath, 'rush.json'))) {
    currentPath = path.join(currentPath, '..');
  }
  if (fs.existsSync(path.join(currentPath, 'rush.json'))) {
    return path.join(currentPath, 'rush.json');
  }
  return null;
}

export function installDependencies(packages, projectInfo) {
  if (fs.existsSync(path.join(projectInfo.projectPath, 'yarn.lock'))) {
    execSync(`yarn add ${packages.join(' ')}`, { stdio: 'inherit' });
    return;
  }

  if (fs.existsSync(path.join(projectInfo.projectPath, 'pnpm-lock.yaml'))) {
    execSync(`pnpm add ${packages.join(' ')}`, { stdio: 'inherit' });
    return;
  }

  //  rush monorepo
  if (findRushJson(projectInfo.projectPath)) {
    execSync(`rush add ${packages.map((pkg) => `--package ${pkg}`).join(' ')}`, {
      stdio: 'inherit',
    });
    return;
  }

  execSync(`npm install ${packages.join(' ')}`, { stdio: 'inherit' });
}
