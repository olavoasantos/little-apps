/// <reference types="@micra/core/error" />
/// <reference types="@micra/core/service-provider" />
/// <reference types="@micra/core/request-handler" />

declare global {
  namespace Application {
    interface Services {
      'request-handler': Micra.RequestHandlerManager;
    }
  }
}

export {};
