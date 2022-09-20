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

  arguments(...args: (CliArgument | CliArgument[])[]): this {
    this.route.arguments.push(
      ...args.reduce<CliArgument[]>((list, arg) => {
        list.push(...(Array.isArray(arg) ? arg : [arg]));
        return list;
      }, []),
    );
    return this;
  }

  options(...options: (CliOption | CliOption[])[]): this {
    this.route.options.push(
      ...options.reduce<CliOption[]>((list, option) => {
        list.push(...(Array.isArray(option) ? option : [option]));
        return list;
      }, []),
    );
    return this;
  }
}
