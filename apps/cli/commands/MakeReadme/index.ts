export const options: Application.CliOption[] = [];

export const args: Application.CliArgument[] = [];

export const command: Micra.RouteHandler = async ({use}) => {
  const path = use('path');
  const Template = use('Template');
  const Directory = use('Directory');
  const pkg = use('package');
  const print = use('print');
  const sprints = use('sprint');

  print.info('Generating a new README...');

  const destination = path.cwd('README.md');
  Template.find(path.templates('misc/root-readme.md')).save(destination, {
    description: pkg.description,
    apps: Directory.find(path.cwd('apps')).directories.map((dir) => dir.name),
    packages: Directory.find(path.cwd('packages')).directories.map(
      (dir) => dir.name,
    ),
    sprint: sprints.names[sprints.active],
  });

  print.newLine().success('Created:', destination);

  return new Response(JSON.stringify({success: true}));
};
