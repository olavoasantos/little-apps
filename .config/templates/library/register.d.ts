/// <reference types="@micra/core/error" />
/// <reference types="@micra/core/service-provider" />

declare global {
  namespace Application {
    interface <%= _.pascalCase(name) %>Configuration {
      //
    }

    interface Services {
      //
    }

    interface Configurations {
      '<%= _.kebabCase(name) %>': <%= _.pascalCase(name) %>Configuration;
    }

    interface EnvironmentVariables {
      //
    }
  }
}

export {};
