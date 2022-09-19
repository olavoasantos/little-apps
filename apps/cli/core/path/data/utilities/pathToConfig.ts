import {join} from 'path';
export function pathToConfig(...paths: string[]) {
  return join(process.cwd(), '.config', ...paths);
}
