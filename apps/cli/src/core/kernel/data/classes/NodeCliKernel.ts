import {createRequestFromArgs} from '../utilities/createRequestFromArgs';
import {registerGlobalFetch} from '@little-apps/polyfills';

export class NodeCliKernel implements Micra.Kernel {
  constructor() {
    registerGlobalFetch();
  }

  async boot(application: Micra.Application): Promise<void> {
    const request = createRequestFromArgs(process.argv);
    const {container} = application;

    container.value('request', request);

    for (const provider of application.serviceProviders) {
      if (provider.registerRequest) {
        await provider.registerRequest({...application, container});
      }
    }

    for (const provider of application.serviceProviders) {
      if (provider.bootRequest) {
        await provider.bootRequest({...application, container});
      }
    }
  }

  async run({container, configuration, environment}: Micra.Application) {
    const request = container.use('request');
    const requestHandler = container.use('request-handler');

    await requestHandler.handle({
      request,
      config: configuration.get.bind(configuration),
      env: environment.get.bind(environment),
      use: container.use.bind(container),
    });
  }
}
