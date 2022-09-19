/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference types="@micra/core/error" />
/// <reference types="@micra/core/service-provider" />

import type {StaticDirectory, StaticFile} from './types';

declare global {
  namespace Application {
    interface FileConfiguration {
      //
    }

    interface Services {
      file: StaticFile;
      directory: StaticDirectory;
    }

    interface Configurations {
      file: FileConfiguration;
    }

    interface EnvironmentVariables {
      //
    }
  }
}

export {};
