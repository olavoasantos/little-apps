import {join} from 'path';

export function pathToTemplates(...paths: string[]) {
  return join(process.cwd(), '.config/templates', ...paths);
}
