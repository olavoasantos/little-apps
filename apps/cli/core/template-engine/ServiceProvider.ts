import {EjsTemplateEngine, Template, TemplateGroup} from './data';

export const ServiceProvider: Micra.ServiceProvider = {
  async register({container}) {
    container.value('Template', Template);
    container.value('TemplateGroup', TemplateGroup);
    container.factory(
      'template-engine',
      (container) => new EjsTemplateEngine(container.use('print')),
    );
  },
};
