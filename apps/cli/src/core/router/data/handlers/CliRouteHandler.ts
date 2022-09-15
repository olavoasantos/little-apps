/* eslint-disable @typescript-eslint/no-explicit-any */
import {executeRouteHandler} from '@micra/router';
import type {CliRoute} from '../classes/CliRoute';

export const CliRouteHandler: Micra.RequestHandler =
  async function CliRouteHandler(partial) {
    const {request, use} = partial;
    const url = new URL(request.url);
    const method = 'POST';
    const route = use('router').registry.find(url.pathname, method) as CliRoute;

    if (route) {
      let body: Array<string> = await request.clone().json();
      if (!Array.isArray(body)) {
        body = [];
      }
      return await executeRouteHandler({
        method,
        route,
        context: {
          ...partial,
          command: url.pathname.slice(1),
          params: route.path.match(url.pathname),
          options: route.options.reduce((options, option, index) => {
            const value = body[index];
            options[option.name] = value
              ? option.type?.(value) ?? value
              : option.default;

            return options;
          }, {} as Record<string, any>),
          arguments: route.arguments.reduce((args, argument) => {
            let value: string | string[] = argument.alias
              ? url.searchParams
                  .getAll(argument.name)
                  .concat(url.searchParams.getAll(argument.alias))
              : url.searchParams.getAll(argument.name);

            if (value.length < 2) {
              value = value[0];
            }

            args[argument.name] = value
              ? argument.type?.(value) ?? value
              : argument.type?.(argument.default) ?? argument.default;

            return args;
          }, {} as Record<string, any>),
        },
        middlewares: use('router').registry.middlewares,
      });
    }
  };
