/* eslint-disable @typescript-eslint/no-explicit-any */
import {RouteBuilder} from '@micra/router';
import {CliArgument, CliOption, CliRoute, CliRouteOptions} from './CliRoute';

export class CliRouteBuilder<
  Path extends string = string,
> extends RouteBuilder {
  route: CliRoute<Path>;

  constructor(router: Micra.BaseRouter, options: CliRouteOptions<Path>) {
    super(router, options);
    this.route = new CliRoute<Path>(options);
  }

  name(name: string): this {
    this.route.name = name;
    return this;
  }

  description(description: string): this {
    this.route.description = description;
    return this;
  }

  arguments(...args: CliArgument[]): this {
    this.route.arguments.push(...args);
    return this;
  }

  options(...args: CliOption[]): this {
    this.route.options.push(...args);
    return this;
  }
}
