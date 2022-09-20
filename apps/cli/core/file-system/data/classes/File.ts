import glob from 'fast-glob';
import prettier, {type Options} from 'prettier';
import {default as prettierOptions} from '@micra/eslint-config/prettier';
import {
  pathExistsSync,
  unlinkSync,
  outputFileSync,
  readFileSync,
} from 'fs-extra';
import {basename, dirname, extname} from 'path';
import type {Directory, File as IFile, FileProperties} from '../../types';

export class File implements IFile {
  static find(path: string): File {
    if (pathExistsSync(path)) {
      return new File({path});
    }

    throw new Error(`Path ${path} doesn't exist`);
  }

  static findAll(path: string): File[] {
    return glob.sync([path]).map((filepath) => new File({path: filepath}));
  }

  #path: string;
  #content: string;
  #isDirty = false;

  get path(): string {
    return this.#path;
  }

  get extension(): string {
    return extname(this.#path);
  }

  get content(): string {
    return this.#content;
  }

  get isDirty(): boolean {
    return this.#isDirty;
  }

  get name(): string {
    return basename(this.#path, this.extension);
  }

  get directory(): string {
    return dirname(this.#path);
  }

  get exists(): boolean {
    return pathExistsSync(this.#path);
  }

  constructor({path = '', content}: Partial<FileProperties> = {}) {
    this.#path = path;
    this.#content = content ?? '';
    const fileExists = Boolean(this.#path) && pathExistsSync(path);
    if (!this.#content && fileExists) {
      this.#content = readFileSync(this.#path, 'utf-8');
    }
  }

  pathFrom(pathOrDir: string | Directory): string {
    return this.#path.replace(
      typeof pathOrDir === 'string' ? pathOrDir : pathOrDir.path,
      '',
    );
  }

  append(content: string): this {
    this.#content = this.#content + content;
    this.#isDirty = true;
    return this;
  }

  prepend(content: string): this {
    this.#content = content + this.#content;
    this.#isDirty = true;
    return this;
  }

  save(): this {
    outputFileSync(
      this.#path,
      prettier.format(this.#content, {
        ...(prettierOptions as Options),
        filepath: this.#path,
      }),
    );

    this.#isDirty = false;
    return this;
  }

  delete(): this {
    unlinkSync(this.#path);
    this.#isDirty = true;
    return this;
  }

  set(partial: Partial<FileProperties>): this {
    if (partial.path) {
      this.#path = partial.path;
    }

    if (partial.content) {
      this.#content = partial.content;
    }

    this.#isDirty = true;
    return this;
  }
}
