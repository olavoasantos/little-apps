/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TemplateEngine {
  render(template: string, options?: Record<string, any>): string;
  generate(template: string, to: string, options?: Record<string, any>): void;
  generateFromFile(
    from: string,
    to: string,
    options?: Record<string, any>,
  ): void;
}
