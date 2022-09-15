/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference types="@micra/core/error" />
/// <reference types="@micra/core/service-provider" />

declare global {
  namespace Application {
    interface AppConfiguration {
      //
    }

    interface Services {
      //
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
