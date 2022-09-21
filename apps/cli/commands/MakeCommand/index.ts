import inquirer from 'inquirer';
import _ from 'lodash';

export const options: Application.CliOption[] = [{name: 'command'}];

export const args: Application.CliArgument[] = [];

export const command: Micra.RouteHandler = async ({use, options}) => {
  const path = use('path');
  const print = use('print');
  const File = use('File');
  const Template = use('Template');
  const templateEngine = use('template-engine');

  // Get name
  const {command} = options.command
    ? options
    : await inquirer.prompt({
        type: 'input',
        name: 'command',
        message: 'What should we call this command?',
      });

  const template = Template.find(path.templates('misc/command.ts'));
  const name = _.upperFirst(_.camelCase(command));
  const ctx = {name};
  const destination = templateEngine.render(
    path.cwd('apps', 'cli', 'commands', name, 'index.ts'),
    ctx,
  );
  if (File.exists(destination)) {
    const response = await inquirer.prompt({
      type: 'confirm',
      name: 'force',
      message: `The command ${name} already exists. Would you like to continue anyway?`,
    });

    if (!response.force) {
      return;
    }
  }

  print.newLine().info(`Creating the ${name} command:`).newLine();

  template.save(destination, ctx);
  print.success(`Created:`, destination);

  // Update index to export new file
  const exporter = File.find(path.cwd('apps', 'cli', 'commands', 'index.ts'));
  const importLine = `import * as ${name}Command from './${name}';\n`;
  const commandRegistration = `\nrouter.command('${command}', ${name}.command).options(${name}.options).arguments(${name}.args);`;
  if (!exporter.content.includes(importLine)) {
    exporter.prepend(importLine);
  }
  if (!exporter.content.includes(commandRegistration)) {
    exporter.append(commandRegistration);
  }
  if (exporter.isDirty) {
    exporter.save();
    print.success(`Updated:`, exporter.path);
  }

  return new Response();
};
