import {join} from 'path';

export function pathToApps(...paths: string[]) {
  return join(process.cwd(), 'apps', ...paths);
}
