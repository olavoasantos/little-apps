/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference types="@micra/core/error" />
/// <reference types="@micra/core/service-provider" />
import type {PackageJson} from 'type-fest';

declare global {
  namespace Application {
    interface Services {
      package: PackageJson;
    }
  }
}

export {};
