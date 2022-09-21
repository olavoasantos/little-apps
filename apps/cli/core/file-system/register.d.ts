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
      File: StaticFile;
      Directory: StaticDirectory;
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
