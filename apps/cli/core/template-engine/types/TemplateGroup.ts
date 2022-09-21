import type {Template} from './Template';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TemplateGroupProperties {
  readonly path: string;
}

export interface TemplateGroup extends TemplateGroupProperties {
  readonly name: string;
  readonly templates: Template[];
  save(
    path: string,
    context?: Record<string, any>,
    onSave?: (path: string) => void,
  ): this;
}

export interface StaticTemplateGroup {
  new (partial?: Partial<TemplateGroupProperties>): TemplateGroup;
  find(path: string): TemplateGroup;
}
