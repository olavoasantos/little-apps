/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from 'ejs';
import fg from 'fast-glob';
import {lstatSync, outputFileSync, readFileSync} from 'fs-extra';
import {join} from 'path';
import prettier from 'prettier';
import * as prettierOptions from '@micra/eslint-config/prettier';
import type {TemplateEngine} from '../../types';
import {_} from '../utilities/template-context';

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
    const template = readFileSync(path, 'utf-8');
    return this.render(template, options);
  }

  generate(
    template: string,
    to: string,
    options?: Record<string, any> | undefined,
  ): void {
    const filepath = this.render(to, options);
    outputFileSync(filepath, this.render(template, options));
    this.print.success(filepath);
  }

  generateFromFile(
    from: string,
    to: string,
    options?: Record<string, any> | undefined,
  ): void {
    const absolutePath = from;
    if (isDir(absolutePath)) {
      return fg
        .sync([join(absolutePath, '*', '**'), join(absolutePath, '*')])
        .forEach((file) => {
          const template = readFileSync(file, 'utf-8');
          const relative = file.replace(absolutePath, '');

          const filepath = this.render(join(to, relative), options);
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
    const filepath = this.render(to, options);
    outputFileSync(
      filepath,
      prettier.format(this.render(template, options), {
        ...(prettierOptions as prettier.Options),
        filepath,
      }),
    );
    this.print.success(filepath);
  }

  appendOnce(
    template: string,
    filepath: string,
    options?: Record<string, any> | undefined,
  ): void {
    const content = readFileSync(filepath, 'utf-8');
    const newContent = prettier.format(this.render(template, options), {
      ...(prettierOptions as prettier.Options),
      filepath,
    });

    outputFileSync(filepath, content + newContent);

    this.print.success(filepath);
  }

  appendOnceTo(
    template: string,
    filepath: string,
    options?: Record<string, any> | undefined,
  ): void {
    const content = readFileSync(filepath, 'utf-8');
    const newContent = prettier.format(this.render(template, options), {
      ...(prettierOptions as prettier.Options),
      filepath,
    });

    if (!content.includes(newContent)) {
      outputFileSync(filepath, content + newContent);
      this.print.success(filepath);
    }
  }
}
