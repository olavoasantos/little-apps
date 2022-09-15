import {RequestHandlerManager} from './data';

/**
 * It registers the request handler's services.
 */
export const ServiceProvider: Micra.ServiceProvider = {
  async register({container}) {
    container.singleton('request-handler', RequestHandlerManager);
  },
};
