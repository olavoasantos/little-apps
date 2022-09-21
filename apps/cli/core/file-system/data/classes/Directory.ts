import glob from 'fast-glob';
import {pathExistsSync, lstatSync, readdirSync} from 'fs-extra';
import {basename, join} from 'path';
import type {
  Directory as IDirectory,
  DirectoryProperties,
  FileProperties,
} from '../../types';
import {File} from './File';

export class Directory implements IDirectory {
  static find(path: string): Directory {
    if (Directory.isDirectory(path)) {
      return new Directory({path});
    } else {
      throw new Error(`"${path}" is not a directory`);
    }
  }

  static findAll(path: string): Directory[] {
    return glob
      .sync([path])
      .map((dirpath) =>
        Directory.isDirectory(dirpath)
          ? new Directory({path: dirpath})
          : undefined,
      )
      .filter(Boolean) as Directory[];
  }

  static isDirectory(path: string): boolean {
    return lstatSync(path).isDirectory();
  }

  static exists(path: string): boolean {
    return pathExistsSync(path);
  }

  #path: string;
  #files!: File[];
  #directories!: Directory[];

  get files(): File[] {
    if (!this.#files) {
      this.#files = readdirSync(this.#path, {withFileTypes: true})
        .filter((dirent) => dirent.isFile())
        .map((dirent) => new File({path: join(this.#path, dirent.name)}));
    }

    return this.#files;
  }

  get allFiles(): File[] {
    return glob
      .sync([join(this.#path, '*', '**'), join(this.#path, '*')])
      .map((path) => new File({path}));
  }

  get directories(): Directory[] {
    if (!this.#directories) {
      this.#directories = readdirSync(this.#path, {withFileTypes: true})
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => new Directory({path: dirent.name}));
    }

    return this.#directories;
  }

  get path(): string {
    return this.#path;
  }

  get exists(): boolean {
    return pathExistsSync(this.#path);
  }

  get name(): string {
    return basename(this.#path);
  }

  constructor({path = ''}: Partial<DirectoryProperties> = {}) {
    this.#path = path;
  }

  save(): this {
    throw new Error('Method not implemented.');
  }

  delete(): this {
    throw new Error('Method not implemented.');
  }

  createFile(options: FileProperties): File {
    return new File({
      ...options,
      path: join(this.#path, options.path),
    });
  }
}
