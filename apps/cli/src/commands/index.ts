/* eslint-disable @typescript-eslint/no-explicit-any */
import * as prettierOptions from '@micra/eslint-config/prettier';
import {
  pathExistsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs-extra';
import changelog from 'generate-changelog';
import inquirer from 'inquirer';
import {join} from 'path';
import prettier from 'prettier';
import {$} from 'zx';

export const router = use('router');

export function cwd(...paths: string[]) {
  return join(process.cwd(), ...paths);
}

const getDirectories = (source: string) =>
  readdirSync(source, {withFileTypes: true})
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

router.command('sprint:close', async ({}) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkg = require(cwd('package.json'));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sprints = require(cwd('.config/sprints/config.json'));
  let changes = await changelog.generate({
    repoUrl: pkg.repository,
    major: true,
    exclude: ['wip', 'sprint'],
  });

  const currentSprint = sprints.names[sprints.active];
  const result =
    await $`npm version premajor --preid=${currentSprint} --allow-same-version`;
  changes = changes.replace(/^## (.*) \(/i, `## ${String(result).trim()} (`);

  const CHANGELOG = readFileSync(cwd('CHANGELOG.md'), 'utf-8');
  writeFileSync(
    cwd('CHANGELOG.md'),
    prettier.format(
      CHANGELOG.replace('# Changelog\n', '# Changelog\n' + changes),
      {
        ...(prettierOptions as any),
        parser: 'markdown',
      },
    ),
  );

  sprints.active += 1;
  writeFileSync(
    cwd('.config/sprints/config.json'),
    prettier.format(JSON.stringify(sprints), {
      ...(prettierOptions as any),
      parser: 'json',
    }),
  );

  await $`git add . && git commit -m "sprint: updated changelog and sprint config"`;
});

router
  .command('make\\:module', async ({use, options, arguments: args}) => {
    const print = use('print');
    const engine = use('template-engine');

    if (!options.name) {
      options = {
        ...options,
        ...(await inquirer.prompt({
          type: 'input',
          name: 'name',
          message: 'What is the module name?',
        })),
      };
    }

    const path = join('apps', options.to, 'src', args.type, options.name);
    if (pathExistsSync(path)) {
      const {force} = await inquirer.prompt({
        type: 'confirm',
        name: 'force',
        message: `The ${args.type} module "${options.name}" already exists on the ${options.to} project. Would you like to continue anyway?`,
      });

      if (!force) {
        return;
      }
    }

    print.info(
      `Creating the ${args.type} module ${options.name} on the ${options.to} project:\n`,
    );
    engine.generateFromFile('.config/templates/module', path, {
      ...options,
      ...args,
    });
  })
  .options({name: 'to'}, {name: 'name'})
  .arguments({name: 'type', alias: 't', default: 'core'});

router
  .command('make\\:class', async ({use, options, arguments: args}) => {
    const print = use('print');
    const engine = use('template-engine');
    const apps = getDirectories(cwd('apps'));

    const destination = {
      type: args.type,
      app: '',
      module: '',
      name: '',
      extension: '.ts',
    };
    if (!options.to) {
      if (apps.length === 0) {
        return print.error(
          `There are no apps created yet. Try creating a new one with the make:app command`,
        );
      }
      const {app} = await inquirer.prompt({
        type: 'list',
        name: 'app',
        message: 'What app should the class be created',
        choices: apps,
      });
      destination.app = app;

      const modules = getDirectories(cwd('apps', app, 'src', args.type));
      if (modules.length === 0) {
        return print.error(
          `There are no modules in the ${app} app. Try creating a new module with the make:module command`,
        );
      }
      const {mod} = await inquirer.prompt({
        type: 'list',
        name: 'mod',
        message: 'What module should the class be created',
        choices: modules,
      });
      destination.module = mod;
    } else {
      const [app, mod] = options.to.split('.');
      if (!pathExistsSync(cwd('apps', app))) {
        return print.error(
          `The app ${app} doesn't exist. Try creating it with make:app ${app}`,
        );
      }

      destination.app = app;

      if (!pathExistsSync(cwd('apps', app, 'src', destination.type, mod))) {
        return print.error(
          `The module ${mod} doesn't exist in the ${app} app. Try creating it with make:module ${app} ${mod}`,
        );
      }

      destination.module = mod;
    }

    if (!options.name) {
      const {name} = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'What is the class name?',
      });
      destination.name = name;
    } else {
      destination.name = options.name;
    }

    const path = join(
      'apps',
      destination.app,
      'src',
      destination.type,
      destination.module,
      'data/classes',
      `${destination.name}${destination.extension}`,
    );

    if (pathExistsSync(path)) {
      const {force} = await inquirer.prompt({
        type: 'confirm',
        name: 'force',
        message: `The class "${destination.name}" already exists on the ${destination.app}'s ${destination.module} module. Would you like to continue anyway?`,
      });

      if (!force) {
        return;
      }
    }

    print.info(
      `Creating the ${destination.name} class on the ${destination.app}'s ${destination.module} ${destination.type} module:\n`,
    );
    engine.generateFromFile('.config/templates/misc/class.ts', path, {
      ...options,
      ...args,
      ...destination,
    });
  })
  .options({name: 'to'}, {name: 'name'})
  .arguments({name: 'type', alias: 't', default: 'core'});

router
  .command('make\\:type', async ({use, options, arguments: args}) => {
    const print = use('print');
    const engine = use('template-engine');
    const apps = getDirectories(cwd('apps'));

    const destination = {
      type: args.type,
      app: '',
      module: '',
      name: '',
      extension: '.ts',
    };
    if (!options.to) {
      if (apps.length === 0) {
        return print.error(
          `There are no apps created yet. Try creating a new one with the make:app command`,
        );
      }
      const {app} = await inquirer.prompt({
        type: 'list',
        name: 'app',
        message: 'What app should the interface be created',
        choices: apps,
      });
      destination.app = app;

      const modules = getDirectories(cwd('apps', app, 'src', args.type));
      if (modules.length === 0) {
        return print.error(
          `There are no modules in the ${app} app. Try creating a new module with the make:module command`,
        );
      }
      const {mod} = await inquirer.prompt({
        type: 'list',
        name: 'mod',
        message: 'What module should the interface be created',
        choices: modules,
      });
      destination.module = mod;
    } else {
      const [app, mod] = options.to.split('.');
      if (!pathExistsSync(cwd('apps', app))) {
        return print.error(
          `The app ${app} doesn't exist. Try creating it with make:app ${app}`,
        );
      }

      destination.app = app;

      if (!pathExistsSync(cwd('apps', app, 'src', destination.type, mod))) {
        return print.error(
          `The module ${mod} doesn't exist in the ${app} app. Try creating it with make:module ${app} ${mod}`,
        );
      }

      destination.module = mod;
    }

    if (!options.name) {
      const {name} = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'What is the interface name?',
      });
      destination.name = name;
    } else {
      destination.name = options.name;
    }

    const path = join(
      'apps',
      destination.app,
      'src',
      destination.type,
      destination.module,
      'types',
      `${destination.name}${destination.extension}`,
    );

    if (pathExistsSync(path)) {
      const {force} = await inquirer.prompt({
        type: 'confirm',
        name: 'force',
        message: `The interface "${destination.name}" already exists on the ${destination.app}'s ${destination.module} module. Would you like to continue anyway?`,
      });

      if (!force) {
        return;
      }
    }

    print.info(
      `Creating the ${destination.name} interface on the ${destination.app}'s ${destination.module} ${destination.type} module:\n`,
    );
    engine.generateFromFile('.config/templates/misc/interface.ts', path, {
      ...options,
      ...args,
      ...destination,
    });
  })
  .options({name: 'to'}, {name: 'name'})
  .arguments({name: 'type', alias: 't', default: 'core'});

router
  .command('make\\:utility', async ({use, options, arguments: args}) => {
    const print = use('print');
    const engine = use('template-engine');
    const apps = getDirectories(cwd('apps'));

    const destination = {
      type: args.type,
      app: '',
      module: '',
      name: '',
      extension: '.ts',
    };
    if (!options.to) {
      if (apps.length === 0) {
        return print.error(
          `There are no apps created yet. Try creating a new one with the make:app command`,
        );
      }
      const {app} = await inquirer.prompt({
        type: 'list',
        name: 'app',
        message: 'What app should the utility be created',
        choices: apps,
      });
      destination.app = app;

      const modules = getDirectories(cwd('apps', app, 'src', args.type));
      if (modules.length === 0) {
        return print.error(
          `There are no modules in the ${app} app. Try creating a new module with the make:module command`,
        );
      }
      const {mod} = await inquirer.prompt({
        type: 'list',
        name: 'mod',
        message: 'What module should the utility be created',
        choices: modules,
      });
      destination.module = mod;
    } else {
      const [app, mod] = options.to.split('.');
      if (!pathExistsSync(cwd('apps', app))) {
        return print.error(
          `The app ${app} doesn't exist. Try creating it with make:app ${app}`,
        );
      }

      destination.app = app;

      if (!pathExistsSync(cwd('apps', app, 'src', destination.type, mod))) {
        return print.error(
          `The module ${mod} doesn't exist in the ${app} app. Try creating it with make:module ${app} ${mod}`,
        );
      }

      destination.module = mod;
    }

    if (!options.name) {
      const {name} = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'What is the utility name?',
      });
      destination.name = name;
    } else {
      destination.name = options.name;
    }

    const path = join(
      'apps',
      destination.app,
      'src',
      destination.type,
      destination.module,
      'data/utilities',
      `${destination.name}${destination.extension}`,
    );

    if (pathExistsSync(path)) {
      const {force} = await inquirer.prompt({
        type: 'confirm',
        name: 'force',
        message: `The utility "${destination.name}" already exists on the ${destination.app}'s ${destination.module} module. Would you like to continue anyway?`,
      });

      if (!force) {
        return;
      }
    }

    print.info(
      `Creating the ${destination.name} utility on the ${destination.app}'s ${destination.module} ${destination.type} module:\n`,
    );
    engine.generateFromFile('.config/templates/misc/utility.ts', path, {
      ...options,
      ...args,
      ...destination,
    });
  })
  .options({name: 'to'}, {name: 'name'})
  .arguments({name: 'type', alias: 't', default: 'core'});

router
  .command('make\\:factory', async ({use, options, arguments: args}) => {
    const print = use('print');
    const engine = use('template-engine');
    const apps = getDirectories(cwd('apps'));

    const destination = {
      type: args.type,
      app: '',
      module: '',
      name: '',
      extension: '.ts',
    };
    if (!options.to) {
      if (apps.length === 0) {
        return print.error(
          `There are no apps created yet. Try creating a new one with the make:app command`,
        );
      }
      const {app} = await inquirer.prompt({
        type: 'list',
        name: 'app',
        message: 'What app should the factory be created',
        choices: apps,
      });
      destination.app = app;

      const modules = getDirectories(cwd('apps', app, 'src', args.type));
      if (modules.length === 0) {
        return print.error(
          `There are no modules in the ${app} app. Try creating a new module with the make:module command`,
        );
      }
      const {mod} = await inquirer.prompt({
        type: 'list',
        name: 'mod',
        message: 'What module should the factory be created',
        choices: modules,
      });
      destination.module = mod;
    } else {
      const [app, mod] = options.to.split('.');
      if (!pathExistsSync(cwd('apps', app))) {
        return print.error(
          `The app ${app} doesn't exist. Try creating it with make:app ${app}`,
        );
      }

      destination.app = app;

      if (!pathExistsSync(cwd('apps', app, 'src', destination.type, mod))) {
        return print.error(
          `The module ${mod} doesn't exist in the ${app} app. Try creating it with make:module ${app} ${mod}`,
        );
      }

      destination.module = mod;
    }

    if (!options.name) {
      const {name} = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'What is the factory name?',
      });
      destination.name = name;
    } else {
      destination.name = options.name;
    }

    const path = join(
      'apps',
      destination.app,
      'src',
      destination.type,
      destination.module,
      'testing/factories',
      `${destination.name}Factory${destination.extension}`,
    );

    if (pathExistsSync(path)) {
      const {force} = await inquirer.prompt({
        type: 'confirm',
        name: 'force',
        message: `The factory "${destination.name}" already exists on the ${destination.app}'s ${destination.module} module. Would you like to continue anyway?`,
      });

      if (!force) {
        return;
      }
    }

    print.info(
      `Creating the ${destination.name} factory on the ${destination.app}'s ${destination.module} ${destination.type} module:\n`,
    );
    engine.generateFromFile('.config/templates/misc/factory.ts', path, {
      ...options,
      ...args,
      ...destination,
    });
  })
  .options({name: 'to'}, {name: 'name'})
  .arguments({name: 'type', alias: 't', default: 'core'});
