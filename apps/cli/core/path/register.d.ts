/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference types="@micra/core/error" />
/// <reference types="@micra/core/service-provider" />

declare global {
  namespace Application {
    interface PathConfiguration {
      //
    }

    type PathGenerator = (...paths: string[]) => string;

    interface Services {
      path: {
        cwd: PathGenerator;
        config: PathGenerator;
        apps: PathGenerator;
        packages: PathGenerator;
        templates: PathGenerator;
      };
    }

    interface Configurations {
      path: PathConfiguration;
    }

    interface EnvironmentVariables {
      //
    }
  }
}

export {};
