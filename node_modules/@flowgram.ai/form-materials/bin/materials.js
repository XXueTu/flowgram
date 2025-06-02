import fs from 'fs';
import path from 'path';

const _types = ['components', 'effects', 'utils', 'typings'];

export function listAllMaterials() {
  const _materials = [];

  for (const _type of _types) {
    const materialsPath = path.join(import.meta.dirname, '..', 'src', _type);
    _materials.push(
      ...fs
        .readdirSync(materialsPath)
        .map((_path) => {
          if (_path === 'index.ts') {
            return null;
          }

          const config = fs.readFileSync(path.join(materialsPath, _path, 'config.json'), 'utf8');
          return {
            ...JSON.parse(config),
            type: _type,
            path: path.join(materialsPath, _path),
          };
        })
        .filter(Boolean)
    );
  }

  return _materials;
}

export function bfsMaterials(material, _materials = []) {
  function findConfigByName(name) {
    return _materials.find(
      (_config) => _config.name === name || `${_config.type}/${_config.name}` === name
    );
  }

  const queue = [material];
  const allMaterials = new Set();
  const allPackages = new Set();

  while (queue.length > 0) {
    const _material = queue.shift();
    if (allMaterials.has(_material)) {
      continue;
    }
    allMaterials.add(_material);

    if (_material.depPackages) {
      for (const _package of _material.depPackages) {
        allPackages.add(_package);
      }
    }

    if (_material.depMaterials) {
      for (const _materialName of _material.depMaterials) {
        queue.push(findConfigByName(_materialName));
      }
    }
  }

  return {
    allMaterials: Array.from(allMaterials),
    allPackages: Array.from(allPackages),
  };
}

export const copyMaterial = (material, projectInfo) => {
  const sourceDir = material.path;
  const materialRoot = path.join(
    projectInfo.projectPath,
    'src',
    'form-materials',
    `${material.type}`
  );
  const targetDir = path.join(materialRoot, material.name);
  fs.cpSync(sourceDir, targetDir, { recursive: true });

  let materialRootIndexTs = '';
  if (fs.existsSync(path.join(materialRoot, 'index.ts'))) {
    materialRootIndexTs = fs.readFileSync(path.join(materialRoot, 'index.ts'), 'utf8');
  }
  if (!materialRootIndexTs.includes(material.name)) {
    fs.writeFileSync(
      path.join(materialRoot, 'index.ts'),
      `${materialRootIndexTs}${materialRootIndexTs.endsWith('\n') ? '' : '\n'}export * from './${
        material.name
      }';\n`
    );
  }
};
