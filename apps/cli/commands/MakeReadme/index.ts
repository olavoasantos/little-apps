export const options: Application.CliOption[] = [];

export const args: Application.CliArgument[] = [];

export const command: Micra.RouteHandler = async ({use}) => {
  const path = use('path');
  const File = use('file');
  const Directory = use('directory');
  const pkg = use('package');
  const print = use('print');
  const sprints = use('sprint');
  const template = use('template-engine');

  print.info('Generating a new README...');

  const file = File.find(path.cwd('README.md'))
    .set({
      content: template.renderFromFile(path.templates('misc/root-readme.md'), {
        description: pkg.description,
        apps: Directory.find(path.cwd('apps')).directories.map(
          (dir) => dir.name,
        ),
        packages: Directory.find(path.cwd('packages')).directories.map(
          (dir) => dir.name,
        ),
        sprint: sprints.names[sprints.active],
      }),
    })
    .save();

  print.newLine().success('Created:', file.path);

  return new Response(JSON.stringify({success: true}));
};
