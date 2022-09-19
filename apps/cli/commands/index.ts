/* eslint-disable @typescript-eslint/no-explicit-any */
import * as prettierOptions from '@micra/eslint-config/prettier';
import {readdirSync, readFileSync, writeFileSync} from 'fs-extra';
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

router.command('sprint:close', async () => {
  const path = use('path');
  const pkg = use('package');
  const sprints = use('sprint');

  let changes = await changelog.generate({
    repoUrl: typeof pkg.repository === 'string' ? pkg.repository : undefined,
    major: true,
    exclude: ['wip', 'sprint'],
  });

  const currentSprint = sprints.names[sprints.active];
  const result =
    await $`npm version premajor --preid=${currentSprint} --allow-same-version`;
  changes = changes.replace(/^## (.*) \(/i, `## ${String(result).trim()} (`);

  const changelogPath = path.cwd('CHANGELOG.md');
  writeFileSync(
    changelogPath,
    prettier.format(
      readFileSync(changelogPath, 'utf-8').replace(
        '# Changelog\n',
        '# Changelog\n' + changes,
      ),
      {
        ...(prettierOptions as any),
        parser: 'markdown',
      },
    ),
  );

  sprints.active += 1;
  writeFileSync(
    path.config('sprints/config.json'),
    prettier.format(JSON.stringify(sprints), {
      ...(prettierOptions as any),
      parser: 'json',
    }),
  );

  await $`git add . && git commit -m "sprint: updated changelog and sprint config"`;
});

router.command('make\\:readme', async ({use}) => {
  const path = use('path');
  const File = use('file');
  const pkg = use('package');
  const print = use('print');
  const sprints = use('sprint');
  const template = use('template-engine');

  print.info('Generating a new README...');

  const file = File.find(path.cwd('README.md'))
    .set({
      content: template.renderFromFile(path.templates('misc/root-readme.md'), {
        description: pkg.description,
        apps: getDirectories(path.cwd('apps')),
        packages: getDirectories(path.cwd('packages')),
        sprint: sprints.names[sprints.active],
      }),
    })
    .save();

  print.newLine().success('Created:', file.path);

  return new Response(JSON.stringify({success: true}));
});

router
  .command('make\\:module', async ({use, options}) => {
    const path = use('path');
    const print = use('print');
    const Directory = use('directory');
    const templateEngine = use('template-engine');
    const apps = Directory.find(path.apps()).directories.map(
      (directory) => directory.name,
    );

    if (apps.length === 0) {
      return print.error(
        `There are no apps created yet. Try creating a new one with the make:app command`,
      );
    }

    // Get app
    const {app} = options.app
      ? apps.includes(options.app)
        ? options
        : await inquirer.prompt({
            type: 'list',
            name: 'app',
            message: `Whoops! Seems that ${options.app} doesn't exist. Please choose one of the existing ones:`,
            choices: apps,
          })
      : await inquirer.prompt({
          type: 'list',
          name: 'app',
          message: 'In which app should we create this?',
          choices: apps,
        });

    // Get name
    const {name} = options.name
      ? options
      : await inquirer.prompt({
          type: 'input',
          name: 'name',
          message: 'What name should we use?',
        });

    const newModule = new Directory({path: path.apps(app, 'core', name)});
    if (newModule.exists) {
      const response = await inquirer.prompt({
        type: 'confirm',
        name: 'force',
        message: `The core module ${name} already exists on the ${app} app. Would you like to continue anyway?`,
      });

      if (!response.force) {
        return;
      }
    }

    print
      .newLine()
      .info(`Creating the core module ${name} on the ${app} project:`)
      .newLine();

    const ctx = {name, app};
    const templates = Directory.find(path.templates('module'));
    templates.allFiles.forEach((template) => {
      const file = newModule
        .createFile({
          content: templateEngine.render(template.content, ctx),
          path: templateEngine.render(template.pathFrom(templates), ctx),
        })
        .save();

      print.success(`Created:`, file.path);
    });

    return new Response();
  })
  .options({name: 'app'}, {name: 'name'});

router
  .command('make\\:class', async ({use, options}) => {
    const path = use('path');
    const print = use('print');
    const Directory = use('directory');
    const File = use('file');
    const templateEngine = use('template-engine');
    const types = ['apps', 'packages'];

    // Parse destination
    const parts = options.destination?.split('.') ?? [];

    // Get type
    const {type} = parts[0]
      ? types.includes(parts[0])
        ? {type: parts[0]}
        : await inquirer.prompt({
            type: 'list',
            name: 'type',
            message: `Whoops! Seems that ${parts[0]} doesn't exist. Please choose one of the existing ones:`,
            choices: types,
          })
      : await inquirer.prompt({
          type: 'list',
          name: 'type',
          message: 'Where should we create this?',
          choices: types,
        });

    // Get app
    const projects = Directory.find(path.cwd(type)).directories.map(
      (directory) => directory.name,
    );
    const {project} = parts[1]
      ? projects.includes(parts[1])
        ? {project: parts[1]}
        : await inquirer.prompt({
            type: 'list',
            name: 'project',
            message: `Whoops! Seems that the project ${parts[1]} doesn't exist. Please choose one of the following:`,
            choices: projects,
          })
      : await inquirer.prompt({
          type: 'list',
          name: 'project',
          message: 'In which project should we create this?',
          choices: projects,
        });

    // Get module
    let mod = '';
    if (type === 'apps') {
      const modules = Directory.find(path.apps(project, 'core'))
        .directories.map((directory) => directory.name)
        .concat(['app']);
      const result = parts[2]
        ? modules.includes(parts[2])
          ? {mod: parts[2]}
          : await inquirer.prompt({
              type: 'list',
              name: 'mod',
              message: `Whoops! Seems that ${parts[2]} doesn't exist in the ${project} app. Please choose one of the existing ones:`,
              choices: modules,
            })
        : await inquirer.prompt({
            type: 'list',
            name: 'mod',
            message: 'In which module we create this?',
            choices: modules,
          });

      mod = result.mod;
    }

    // Get name
    const {name} = options.name
      ? options
      : await inquirer.prompt({
          type: 'input',
          name: 'name',
          message: 'What name should we use?',
        });

    const template = File.find(path.templates('misc/class.ts'));
    const ctx = {name, project, moduleName: mod};
    const newClass = new File({
      path: templateEngine.render(
        path.cwd(
          type,
          project,
          mod === 'app' || type === 'packages' ? '' : 'core',
          mod,
          'data/classes',
          name + template.extension,
        ),
        ctx,
      ),
      content: templateEngine.render(template.content, ctx),
    });
    if (newClass.exists) {
      const response = await inquirer.prompt({
        type: 'confirm',
        name: 'force',
        message: `The class ${name} already exists on the ${project}'s ${mod} module. Would you like to continue anyway?`,
      });

      if (!response.force) {
        return new Response();
      }
    }

    print
      .newLine()
      .info(`Creating the class ${name} on the ${project}'s ${mod} module:`)
      .newLine();

    newClass.save();
    print.success(`Created:`, newClass.path);

    // Update index to export new file
    const exporter = File.find(
      path.cwd(
        type,
        project,
        mod === 'app' || type === 'packages' ? '' : 'core',
        mod,
        'data/index.ts',
      ),
    );
    const exportLine = `export * from './${join('classes', name)}';`;
    if (!exporter.content.includes(exportLine)) {
      exporter.append(exportLine).save();
      print.success(`Updated:`, exporter.path);
    }

    return new Response();
  })
  .options({name: 'destination'}, {name: 'name'});

router
  .command('make\\:type', async ({use, options}) => {
    const path = use('path');
    const print = use('print');
    const Directory = use('directory');
    const File = use('file');
    const templateEngine = use('template-engine');
    const types = ['apps', 'packages'];

    // Parse destination
    const parts = options.destination?.split('.') ?? [];

    // Get type
    const {type} = parts[0]
      ? types.includes(parts[0])
        ? {type: parts[0]}
        : await inquirer.prompt({
            type: 'list',
            name: 'type',
            message: `Whoops! Seems that ${parts[0]} doesn't exist. Please choose one of the existing ones:`,
            choices: types,
          })
      : await inquirer.prompt({
          type: 'list',
          name: 'type',
          message: 'Where should we create this?',
          choices: types,
        });

    // Get app
    const projects = Directory.find(path.cwd(type)).directories.map(
      (directory) => directory.name,
    );
    const {project} = parts[1]
      ? projects.includes(parts[1])
        ? {project: parts[1]}
        : await inquirer.prompt({
            type: 'list',
            name: 'project',
            message: `Whoops! Seems that the project ${parts[1]} doesn't exist. Please choose one of the following:`,
            choices: projects,
          })
      : await inquirer.prompt({
          type: 'list',
          name: 'project',
          message: 'In which project should we create this?',
          choices: projects,
        });

    // Get module
    let mod = '';
    if (type === 'apps') {
      const modules = Directory.find(path.apps(project, 'core'))
        .directories.map((directory) => directory.name)
        .concat(['app']);
      const result = parts[2]
        ? modules.includes(parts[2])
          ? {mod: parts[2]}
          : await inquirer.prompt({
              type: 'list',
              name: 'mod',
              message: `Whoops! Seems that ${parts[2]} doesn't exist in the ${project} app. Please choose one of the existing ones:`,
              choices: modules,
            })
        : await inquirer.prompt({
            type: 'list',
            name: 'mod',
            message: 'In which module we create this?',
            choices: modules,
          });

      mod = result.mod;
    }

    // Get name
    const {name} = options.name
      ? options
      : await inquirer.prompt({
          type: 'input',
          name: 'name',
          message: 'What name should we use?',
        });

    const template = File.find(path.templates('misc/interface.ts'));
    const ctx = {name, project, moduleName: mod};
    const newClass = new File({
      path: templateEngine.render(
        path.cwd(
          type,
          project,
          mod === 'app' || type === 'packages' ? '' : 'core',
          mod,
          'types',
          name + template.extension,
        ),
        ctx,
      ),
      content: templateEngine.render(template.content, ctx),
    });
    if (newClass.exists) {
      const response = await inquirer.prompt({
        type: 'confirm',
        name: 'force',
        message: `The interface ${name} already exists on the ${project}'s ${mod} module. Would you like to continue anyway?`,
      });

      if (!response.force) {
        return new Response();
      }
    }

    print
      .newLine()
      .info(`Creating the ${name} interface on the ${project}'s ${mod} module:`)
      .newLine();

    newClass.save();
    print.success(`Created:`, newClass.path);

    // Update index to export new file
    const exporter = File.find(
      path.cwd(
        type,
        project,
        mod === 'app' || type === 'packages' ? '' : 'core',
        mod,
        'types/index.ts',
      ),
    );
    const exportLine = `export * from './${name}';`;
    if (!exporter.content.includes(exportLine)) {
      exporter.append(exportLine).save();
      print.success(`Updated:`, exporter.path);
    }

    return new Response();
  })
  .options({name: 'destination'}, {name: 'name'});

router
  .command('make\\:utility', async ({use, options}) => {
    const path = use('path');
    const print = use('print');
    const Directory = use('directory');
    const File = use('file');
    const templateEngine = use('template-engine');
    const types = ['apps', 'packages'];

    // Parse destination
    const parts = options.destination?.split('.') ?? [];

    // Get type
    const {type} = parts[0]
      ? types.includes(parts[0])
        ? {type: parts[0]}
        : await inquirer.prompt({
            type: 'list',
            name: 'type',
            message: `Whoops! Seems that ${parts[0]} doesn't exist. Please choose one of the existing ones:`,
            choices: types,
          })
      : await inquirer.prompt({
          type: 'list',
          name: 'type',
          message: 'Where should we create this?',
          choices: types,
        });

    // Get app
    const projects = Directory.find(path.cwd(type)).directories.map(
      (directory) => directory.name,
    );
    const {project} = parts[1]
      ? projects.includes(parts[1])
        ? {project: parts[1]}
        : await inquirer.prompt({
            type: 'list',
            name: 'project',
            message: `Whoops! Seems that the project ${parts[1]} doesn't exist. Please choose one of the following:`,
            choices: projects,
          })
      : await inquirer.prompt({
          type: 'list',
          name: 'project',
          message: 'In which project should we create this?',
          choices: projects,
        });

    // Get module
    let mod = '';
    if (type === 'apps') {
      const modules = Directory.find(path.apps(project, 'core'))
        .directories.map((directory) => directory.name)
        .concat(['app']);
      const result = parts[2]
        ? modules.includes(parts[2])
          ? {mod: parts[2]}
          : await inquirer.prompt({
              type: 'list',
              name: 'mod',
              message: `Whoops! Seems that ${parts[2]} doesn't exist in the ${project} app. Please choose one of the existing ones:`,
              choices: modules,
            })
        : await inquirer.prompt({
            type: 'list',
            name: 'mod',
            message: 'In which module we create this?',
            choices: modules,
          });

      mod = result.mod;
    }

    // Get name
    const {name} = options.name
      ? options
      : await inquirer.prompt({
          type: 'input',
          name: 'name',
          message: 'What name should we use?',
        });

    const template = File.find(path.templates('misc/utility.ts'));
    const ctx = {name, project, moduleName: mod};
    const newClass = new File({
      path: templateEngine.render(
        path.cwd(
          type,
          project,
          mod === 'app' || type === 'packages' ? '' : 'core',
          mod,
          'data/utilities',
          name + template.extension,
        ),
        ctx,
      ),
      content: templateEngine.render(template.content, ctx),
    });
    if (newClass.exists) {
      const response = await inquirer.prompt({
        type: 'confirm',
        name: 'force',
        message: `The utility ${name} already exists on the ${project}'s ${mod} module. Would you like to continue anyway?`,
      });

      if (!response.force) {
        return new Response();
      }
    }

    print
      .newLine()
      .info(`Creating the ${name} utility on the ${project}'s ${mod} module:`)
      .newLine();

    newClass.save();
    print.success(`Created:`, newClass.path);

    // Update index to export new file
    const exporter = File.find(
      path.cwd(
        type,
        project,
        mod === 'app' || type === 'packages' ? '' : 'core',
        mod,
        'data/index.ts',
      ),
    );
    const exportLine = `export * from './${join('utilities', name)}';`;
    if (!exporter.content.includes(exportLine)) {
      exporter.append(exportLine).save();
      print.success(`Updated:`, exporter.path);
    }

    return new Response();
  })
  .options({name: 'destination'}, {name: 'name'});

router
  .command('make\\:factory', async ({use, options}) => {
    const path = use('path');
    const print = use('print');
    const Directory = use('directory');
    const File = use('file');
    const templateEngine = use('template-engine');
    const types = ['apps', 'packages'];

    // Parse destination
    const parts = options.destination?.split('.') ?? [];

    // Get type
    const {type} = parts[0]
      ? types.includes(parts[0])
        ? {type: parts[0]}
        : await inquirer.prompt({
            type: 'list',
            name: 'type',
            message: `Whoops! Seems that ${parts[0]} doesn't exist. Please choose one of the existing ones:`,
            choices: types,
          })
      : await inquirer.prompt({
          type: 'list',
          name: 'type',
          message: 'Where should we create this?',
          choices: types,
        });

    // Get app
    const projects = Directory.find(path.cwd(type)).directories.map(
      (directory) => directory.name,
    );
    const {project} = parts[1]
      ? projects.includes(parts[1])
        ? {project: parts[1]}
        : await inquirer.prompt({
            type: 'list',
            name: 'project',
            message: `Whoops! Seems that the project ${parts[1]} doesn't exist. Please choose one of the following:`,
            choices: projects,
          })
      : await inquirer.prompt({
          type: 'list',
          name: 'project',
          message: 'In which project should we create this?',
          choices: projects,
        });

    // Get module
    let mod = '';
    if (type === 'apps') {
      const modules = Directory.find(path.apps(project, 'core'))
        .directories.map((directory) => directory.name)
        .concat(['app']);
      const result = parts[2]
        ? modules.includes(parts[2])
          ? {mod: parts[2]}
          : await inquirer.prompt({
              type: 'list',
              name: 'mod',
              message: `Whoops! Seems that ${parts[2]} doesn't exist in the ${project} app. Please choose one of the existing ones:`,
              choices: modules,
            })
        : await inquirer.prompt({
            type: 'list',
            name: 'mod',
            message: 'In which module we create this?',
            choices: modules,
          });

      mod = result.mod;
    }

    // Get name
    const {name} = options.name
      ? options
      : await inquirer.prompt({
          type: 'input',
          name: 'name',
          message: 'What name should we use?',
        });

    const template = File.find(path.templates('misc/factory.ts'));
    const ctx = {name, project, moduleName: mod};
    const newClass = new File({
      path: templateEngine.render(
        path.cwd(
          type,
          project,
          mod === 'app' || type === 'packages' ? '' : 'core',
          mod,
          'testing/factories',
          name + 'Factory' + template.extension,
        ),
        ctx,
      ),
      content: templateEngine.render(template.content, ctx),
    });
    if (newClass.exists) {
      const response = await inquirer.prompt({
        type: 'confirm',
        name: 'force',
        message: `The factory ${name} already exists on the ${project}'s ${mod} module. Would you like to continue anyway?`,
      });

      if (!response.force) {
        return new Response();
      }
    }

    print
      .newLine()
      .info(`Creating the ${name} factory on the ${project}'s ${mod} module:`)
      .newLine();

    newClass.save();
    print.success(`Created:`, newClass.path);

    // Update index to export new file
    const exporter = File.find(
      path.cwd(
        type,
        project,
        mod === 'app' || type === 'packages' ? '' : 'core',
        mod,
        'testing/index.ts',
      ),
    );
    const exportLine = `export * from './${join(
      'factories',
      name + 'Factory',
    )}';`;
    if (!exporter.content.includes(exportLine)) {
      exporter.append(exportLine).save();
      print.success(`Updated:`, exporter.path);
    }

    return new Response();
  })
  .options({name: 'destination'}, {name: 'name'});
