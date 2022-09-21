/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference types="@micra/core/error" />
/// <reference types="@micra/core/service-provider" />
import type {
  StaticTemplate,
  StaticTemplateGroup,
  TemplateEngine,
} from './types';

declare global {
  namespace Application {
    interface TemplateEngineConfiguration {
      //
    }

    interface Services {
      Template: StaticTemplate;
      TemplateGroup: StaticTemplateGroup;
      'template-engine': TemplateEngine;
    }

    interface Configurations {
      'template-engine': TemplateEngineConfiguration;
    }
  }
}

export {};
