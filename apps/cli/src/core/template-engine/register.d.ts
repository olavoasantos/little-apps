/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference types="@micra/core/error" />
/// <reference types="@micra/core/service-provider" />
import type {TemplateEngine} from './types';

declare global {
  namespace Application {
    interface TemplateEngineConfiguration {
      //
    }

    interface Services {
      'template-engine': TemplateEngine;
    }

    interface Configurations {
      'template-engine': TemplateEngineConfiguration;
    }
  }
}

export {};
