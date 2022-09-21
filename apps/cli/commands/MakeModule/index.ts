import inquirer from 'inquirer';
export const options: Application.CliOption[] = [{name: 'app'}, {name: 'name'}];

export const args: Application.CliArgument[] = [];

export const command: Micra.RouteHandler = async ({use, options}) => {
  const path = use('path');
  const print = use('print');
  const Directory = use('Directory');
  const TemplateGroup = use('TemplateGroup');
  const apps = Directory.find(path.apps()).directories.map(
    (directory) => directory.name,
  );

  if (apps.length === 0) {
    print.error(
      `There are no apps created yet. Try creating a new one with the make:app command`,
    );
    return;
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

  const destination = path.apps(app, 'core', name);
  if (Directory.exists(destination)) {
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

  TemplateGroup.find(path.templates('module')).save(
    destination,
    {name, app},
    (path) => print.success(`Created:`, path),
  );

  return new Response();
};
