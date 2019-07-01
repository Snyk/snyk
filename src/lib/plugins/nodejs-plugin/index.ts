import * as modulesParser from './npm-modules-parser';
import * as lockParser from './npm-lock-parser';
import * as types from '../types';
import { MissingTargetFileError } from '../../errors/missing-targetfile-error';
import {
  isMultiSubProject, SingleSubprojectInspectOptions, SinglePackageResult,
} from '@snyk/cli-interface/dist/legacy/plugin';

export function pluginName(): string {
  return 'node.js';
}

export async function inspect(
    root: string,
    targetFile: string,
    options: types.Options & SingleSubprojectInspectOptions = {},
  ): Promise<SinglePackageResult> {
  if (isMultiSubProject(options)) {
    throw new Error('Returning multiple sub-projects is not supported for Node.js');
  }
  if (!targetFile) {
    throw MissingTargetFileError(root);
  }
  const isLockFileBased = (targetFile.endsWith('package-lock.json') || targetFile.endsWith('yarn.lock'));

  const getLockFileDeps = isLockFileBased && !options.traverseNodeModules;
  return {
    plugin: {
      name: 'snyk-nodejs-lockfile-parser',
      runtime: process.version,
    },
    package: getLockFileDeps ?
      await lockParser.parse(root, targetFile, options) :
      await modulesParser.parse(root, targetFile, options),
  };
}
