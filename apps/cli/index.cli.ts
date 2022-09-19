#!/usr/bin/env zx
import app from '@micra/application';
import * as RequestHandler from '@little-apps/request-handler';
import * as Kernel from './core/kernel';
import * as Router from './core/router';
import * as TemplateEngine from './core/template-engine';
import * as Print from './core/print';
import * as Package from './core/package';
import * as Path from './core/path';
import * as FileSystem from './core/file-system';
import * as App from './app';

export default app.run({
  kernel: Kernel.NodeCliKernel,
  providers: [
    Path.ServiceProvider,
    FileSystem.ServiceProvider,
    Package.ServiceProvider,
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
