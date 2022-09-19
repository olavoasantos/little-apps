import {join} from 'path';

export function pathToPackages(...paths: string[]) {
  return join(process.cwd(), 'packages', ...paths);
}
