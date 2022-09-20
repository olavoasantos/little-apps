import inquirer from 'inquirer';
import {join} from 'path';

export const options: Application.CliOption[] = [
  {name: 'destination'},
  {name: 'name'},
];

export const args: Application.CliArgument[] = [];

export const command: Micra.RouteHandler = async ({use, options}) => {
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
};
