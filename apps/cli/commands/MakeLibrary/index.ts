import inquirer from 'inquirer';
import kebabCase from 'lodash/kebabCase';

export const options: Application.CliOption[] = [
  {name: 'name'},
  {name: 'description'},
];

export const args: Application.CliArgument[] = [];

export const command: Micra.RouteHandler = async ({use, options}) => {
  const path = use('path');
  const print = use('print');
  const Directory = use('Directory');
  const TemplateGroup = use('TemplateGroup');

  // Get name
  const {name} = options.name
    ? options
    : await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: "What's the name of this package?",
        transformer: (value) => kebabCase(value),
      });

  const destination = path.cwd('packages', name);

  if (Directory.exists(destination)) {
    const response = await inquirer.prompt({
      type: 'confirm',
      name: 'force',
      message: `The package ${name} already exists. Would you like to continue anyway?`,
    });

    if (!response.force) {
      return;
    }
  }

  // Get description
  const {description} = options.name
    ? options
    : await inquirer.prompt({
        type: 'input',
        name: 'description',
        message: "What's the description of this package?",
      });

  print.newLine().info(`Creating the package ${name}:`).newLine();

  TemplateGroup.find(path.templates('library')).save(
    destination,
    {name, description},
    (path) => print.success(`Created:`, path),
  );

  return new Response();
};
