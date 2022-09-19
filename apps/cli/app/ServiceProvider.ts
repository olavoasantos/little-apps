import {join} from 'path';

export const ServiceProvider: Micra.ServiceProvider = {
  async register({container}) {
    container.factory('sprint', () =>
      require(join(process.cwd(), '.config/sprints/config.json')),
    );
  },
  async boot() {
    await import('~/commands');
  },
};
