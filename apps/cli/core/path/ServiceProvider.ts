import {
  cwd,
  pathToApps,
  pathToConfig,
  pathToPackages,
  pathToTemplates,
} from './data';

export const ServiceProvider: Micra.ServiceProvider = {
  /**
   * Register any Path services.
   */
  async register({container}) {
    container.value('path', {
      cwd,
      apps: pathToApps,
      config: pathToConfig,
      packages: pathToPackages,
      templates: pathToTemplates,
    });
  },
};
