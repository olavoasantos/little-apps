/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TemplateEngine {
  render(template: string, options?: Record<string, any>): string;
  renderFromFile(
    path: string,
    options?: Record<string, any> | undefined,
  ): string;
  generate(template: string, to: string, options?: Record<string, any>): void;
  generateFromFile(
    from: string,
    to: string,
    options?: Record<string, any>,
  ): void;
  appendOnce(template: string, to: string, options?: Record<string, any>): void;
  appendOnceTo(
    template: string,
    to: string,
    options?: Record<string, any>,
  ): void;
}
export * from './Template';
export * from './TemplateGroup';
