/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-interface */
/// <reference types="@micra/core/error" />
/// <reference types="@micra/core/service-provider" />
/// <reference types="@micra/router/register" />

import type * as CliRoute from './data/classes/CliRoute';
import type {CliRouteBuilder} from './data/classes/CliRouteBuilder';

declare global {
  namespace Application {
    type CliOption = CliRoute.CliOption;
    type CliArgument = CliRoute.CliArgument;

    interface RouterConfiguration {
      //
    }

    interface Services {
      //
    }

    interface Configurations {
      router: RouterConfiguration;
    }

    interface EnvironmentVariables {
      //
    }

    interface Routers {
      command: Micra.RouteCreator<CliRouteBuilder>;
    }
  }

  namespace Micra {
    interface RouteHandlerContext {
      command: string;
      options: Record<string, any>;
      arguments: Record<string, any>;
    }
  }
}

export {};
