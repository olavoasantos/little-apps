import {join} from 'path';

export function cwd(...paths: string[]) {
  return join(process.cwd(), ...paths);
}
