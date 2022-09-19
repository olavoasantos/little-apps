/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference types="@micra/core/error" />
/// <reference types="@micra/core/service-provider" />
/// <reference types="@little-apps/request-handler/register" />

declare global {
  namespace Application {
    interface CliKernelConfiguration {
      //
    }

    interface Services {
      request: Request;
    }

    interface Configurations {
      'cli-kernel': CliKernelConfiguration;
    }

    interface EnvironmentVariables {
      //
    }
  }

  namespace Micra {
    interface ServiceProvider {
      registerRequest?(application: Application): void | Promise<void>;
      bootRequest?(application: Application): void | Promise<void>;
    }
  }
}

export {};
