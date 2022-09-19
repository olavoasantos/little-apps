/* eslint-disable @typescript-eslint/no-explicit-any */
import {Route, RouteOptions} from '@micra/router';

export interface CliOption<T = any> {
  name: string;
  description?: string;
  default?: T;
  type?(value: any): T;
}

export interface CliArgument<T = any> {
  name: string;
  description?: string;
  default?: T;
  type?(value: any): T;
  alias?: string;
}

export interface CliRouteOptions<Path extends string = string>
  extends RouteOptions<Path, Micra.RoutePathOptions> {
  options?: Array<CliOption>;
  arguments?: Array<CliArgument>;
  description?: string;
  name?: string;
}

export class CliRoute<Path extends string = string> extends Route<Path> {
  options: Array<CliOption>;
  arguments: Array<CliArgument>;
  description: string;
  name: string;

  constructor(options: CliRouteOptions<Path>) {
    super(options);
    this.options = options.options ?? [];
    this.arguments = options.arguments ?? [];
    this.description = options.description ?? '';
    this.name = options.name ?? '';
  }
}
