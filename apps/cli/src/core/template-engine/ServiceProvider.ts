import {EjsTemplateEngine} from './data';

export const ServiceProvider: Micra.ServiceProvider = {
  async register({container}) {
    container.factory(
      'template-engine',
      (container) => new EjsTemplateEngine(container.use('print')),
    );
  },
};
