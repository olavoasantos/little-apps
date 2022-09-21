import {Directory} from './Directory';

/* eslint-disable @typescript-eslint/no-misused-new */
export interface FileProperties {
  readonly path: string;
  readonly content: string;
}

export interface File extends FileProperties {
  readonly exists: boolean;
  readonly directory: string;
  readonly extension: string;
  readonly name: string;
  readonly isDirty: boolean;
  append(content: string): this;
  prepend(content: string): this;
  save(): this;
  delete(): this;
  set(partial: Partial<FileProperties>): this;
  pathFrom(path: string | Directory): string;
}

export interface StaticFile {
  new (partial?: Partial<FileProperties>): File;
  find(path: string): File;
  findAll(path: string): File[];
  exists(path: string): boolean;
}
