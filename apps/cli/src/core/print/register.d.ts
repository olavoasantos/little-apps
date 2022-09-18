/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference types="@micra/core/error" />
/// <reference types="@micra/core/service-provider" />

import type {Print as IPrint} from './types';

declare global {
  namespace Application {
    type Print = IPrint;
    interface PrintConfiguration {
      //
    }

    interface Services {
      print: Print;
    }

    interface Configurations {
      print: PrintConfiguration;
    }

    interface EnvironmentVariables {
      //
    }
  }
}

export {};
