import type {File, FileProperties} from './File';

/* eslint-disable @typescript-eslint/no-misused-new */
export interface DirectoryProperties {
  readonly path: string;
}

export interface Directory extends DirectoryProperties {
  readonly exists: boolean;
  readonly name: string;
  readonly files: File[];
  readonly allFiles: File[];
  readonly directories: Directory[];
  save(): this;
  delete(): this;
  createFile(options: FileProperties): File;
}

export interface StaticDirectory {
  new (partial?: Partial<DirectoryProperties>): Directory;
  find(path: string): Directory;
  findAll(path: string): Directory[];
  isDirectory(path: string): boolean;
}
