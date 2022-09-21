/* eslint-disable @typescript-eslint/no-explicit-any */
import glob from 'fast-glob';
import {lstatSync} from 'fs-extra';
import {basename, join} from 'path';
import type {
  TemplateEngine,
  TemplateGroup as ITemplateGroup,
  TemplateGroupProperties,
} from '../../types';
import {Template} from './Template';

export class TemplateGroup implements ITemplateGroup {
  static find(path: string): TemplateGroup {
    if (lstatSync(path).isDirectory()) {
      return new TemplateGroup({path});
    } else {
      throw new Error(`"${path}" is not a directory`);
    }
  }

  #path: string;
  #templates!: Template[];
  #templateEngine: TemplateEngine = use('template-engine');

  get templates(): Template[] {
    if (!this.#templates) {
      this.#templates = glob
        .sync([join(this.#path, '*', '**'), join(this.#path, '*')])
        .map((path) => new Template({path}));
    }

    return this.#templates;
  }

  get path(): string {
    return this.#path;
  }

  get name(): string {
    return basename(this.#path);
  }

  constructor({path = ''}: Partial<TemplateGroupProperties> = {}) {
    this.#path = path;
  }

  save(
    path: string,
    context?: Record<string, any> | undefined,
    onSave?: (path: string) => void,
  ): this {
    this.templates.forEach((template) => {
      const destination = this.#templateEngine.render(
        join(path, template.path.replace(this.#path, '')),
        context,
      );
      template.save(destination, context);

      onSave?.(destination);
    });

    return this;
  }
}
