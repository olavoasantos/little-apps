import app from '@micra/application';
import * as RequestHandler from '@little-apps/request-handler';
import * as Kernel from '@/core/kernel';
import * as Router from '@/core/router';
import * as App from '@/app';

export default app.run({
  kernel: Kernel.NodeCliKernel,
  providers: [
    RequestHandler.ServiceProvider,
    Router.ServiceProvider,
    Kernel.ServiceProvider,
    App.ServiceProvider,
  ],
  configurations: {
    'cli-kernel': Kernel.configuration,
    router: Router.configuration,
    app: App.configuration,
  },
});
