import app from '@micra/application';
import * as RequestHandler from '@little-apps/request-handler';
import * as Kernel from './core/kernel';
import * as Router from './core/router';
import * as TemplateEngine from './core/template-engine';
import * as Print from './core/print';
import * as App from './app';

export default app.run({
  kernel: Kernel.NodeCliKernel,
  providers: [
    Print.ServiceProvider,
    RequestHandler.ServiceProvider,
    Router.ServiceProvider,
    TemplateEngine.ServiceProvider,
    Kernel.ServiceProvider,
    App.ServiceProvider,
  ],
  configurations: {
    'cli-kernel': Kernel.configuration,
    router: Router.configuration,
    print: Print.configuration,
    app: App.configuration,
    'template-engine': TemplateEngine.configuration,
  },
});
