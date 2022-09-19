import {join} from 'path';

export const ServiceProvider: Micra.ServiceProvider = {
  /**
   * Register any Package services.
   */
  async register({container}) {
    container.factory('package', () =>
      require(join(process.cwd(), 'package.json')),
    );
  },
};
