import {pathExistsSync, readFileSync} from 'fs-extra';
import {basename, extname} from 'path';
import type {
  Template as ITemplate,
  TemplateEngine,
  TemplateProperties,
} from '../../types';

export class Template implements ITemplate {
  static find(path: string): Template {
    if (pathExistsSync(path)) {
      return new Template({path});
    }

    throw new Error(`Template "${path}" doesn't exist`);
  }

  #templateEngine: TemplateEngine = use('template-engine');
  #path: string;
  #content: string;

  get path(): string {
    return this.#path;
  }

  get extension(): string {
    return extname(this.#path);
  }

  get content(): string {
    return this.#content;
  }

  get name(): string {
    return basename(this.#path, this.extension);
  }

  constructor({path = '', content}: Partial<TemplateProperties> = {}) {
    this.#path = path;
    this.#content = content ?? '';
    const fileExists = Boolean(this.#path) && pathExistsSync(path);
    if (!this.#content && fileExists) {
      this.#content = readFileSync(this.#path, 'utf-8');
    }
  }

  save(path: string, context = {}, onSave?: (path: string) => void): this {
    this.#templateEngine.generate(this.#content, path, context);
    onSave?.(path);
    return this;
  }
}
