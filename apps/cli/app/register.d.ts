/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference types="@micra/core/error" />
/// <reference types="@micra/core/service-provider" />

import type {Sprint} from './types/Sprint';

declare global {
  namespace Application {
    interface AppConfiguration {
      //
    }

    interface Services {
      sprint: Sprint;
    }

    interface Configurations {
      app: AppConfiguration;
    }

    interface EnvironmentVariables {
      //
    }
  }
}

export {};
