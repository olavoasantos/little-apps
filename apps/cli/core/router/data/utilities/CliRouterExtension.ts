import {CliRouteBuilder} from '../classes/CliRouteBuilder';

export const CliRouterExtension: Partial<Micra.RouterExtensionDefinition> = {
  command: (base) => (path, serviceOrHandler) => {
    path = `/${path}` as typeof path;
    const builder = new CliRouteBuilder(base, {
      path,
      methods: ['POST'],
      handler: async (...args) =>
        (await serviceOrHandler?.(...args)) ?? new Response(JSON.stringify({})),
    });

    base.registry.register(builder.route);

    return builder;
  },
};
