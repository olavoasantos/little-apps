/* eslint-disable @typescript-eslint/no-explicit-any */
import * as prettierOptions from '@micra/eslint-config/prettier';
import ejs from 'ejs';
import fg from 'fast-glob';
import {lstatSync, outputFileSync, readFileSync} from 'fs-extra';
import {join} from 'path';
import prettier from 'prettier';
import type {TemplateEngine} from '../../types';
import {_} from '../utilities/template-context';

export function cwd(...paths: string[]) {
  return join(process.cwd(), ...paths);
}

export function isDir(path: string) {
  return lstatSync(path).isDirectory();
}

export class EjsTemplateEngine implements TemplateEngine {
  constructor(private print: Application.Print) {}
  render(template: string, options?: Record<string, any> | undefined): string {
    return ejs.render(template, {...options, _});
  }

  renderFromFile(
    path: string,
    options?: Record<string, any> | undefined,
  ): string {
    const template = readFileSync(cwd(path), 'utf-8');
    return this.render(template, options);
  }

  generate(
    template: string,
    to: string,
    options?: Record<string, any> | undefined,
  ): void {
    const filepath = cwd(this.render(to, options));
    outputFileSync(filepath, this.render(template, options));
    this.print.success(filepath);
  }

  generateFromFile(
    from: string,
    to: string,
    options?: Record<string, any> | undefined,
  ): void {
    const absolutePath = cwd(from);
    if (isDir(absolutePath)) {
      return fg
        .sync([join(absolutePath, '*', '**'), join(absolutePath, '*')])
        .forEach((file) => {
          const template = readFileSync(file, 'utf-8');
          const relative = file.replace(absolutePath, '');

          const filepath = this.render(cwd(to, relative), options);
          outputFileSync(
            filepath,
            prettier.format(this.render(template, options), {
              ...(prettierOptions as prettier.Options),
              filepath,
            }),
          );
          this.print.success(filepath);
        });
    }

    const template = readFileSync(absolutePath, 'utf-8');
    const filepath = this.render(cwd(to), options);
    outputFileSync(
      filepath,
      prettier.format(this.render(template, options), {
        ...(prettierOptions as prettier.Options),
        filepath,
      }),
    );
    this.print.success(filepath);
  }
}
