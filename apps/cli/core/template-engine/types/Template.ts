/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TemplateProperties {
  readonly path: string;
  readonly content: string;
}

export interface Template extends TemplateProperties {
  readonly extension: string;
  readonly name: string;
  save(
    path: string,
    context?: Record<string, any>,
    onSave?: (path: string) => void,
  ): this;
}

export interface StaticTemplate {
  new (partial?: Partial<TemplateProperties>): Template;
  find(path: string): Template;
}
