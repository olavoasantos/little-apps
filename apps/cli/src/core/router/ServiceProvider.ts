import type {Static} from '@micra/core/utilities/Static';
import {BaseRouter} from '@micra/router';
import {CliRouteHandler, CliRouterExtension} from './data';

export const ServiceProvider: Micra.ServiceProvider = {
  async register({container}) {
    container.singleton(
      'router',
      BaseRouter as unknown as Static<Micra.Router>,
    );
  },

  async boot({container}) {
    const router = container.use('router');
    const requestHandler = container.use('request-handler');

    router.extend(CliRouterExtension);
    requestHandler.use(CliRouteHandler);
  },
};
