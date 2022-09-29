import {default as prettierOptions} from '@micra/eslint-config/prettier';
import {readFileSync, writeFileSync} from 'fs-extra';
import changelog from 'generate-changelog';
import prettier, {type Options} from 'prettier';
import {$} from 'zx';

export const options: Application.CliOption[] = [];

export const args: Application.CliArgument[] = [];

export const command: Micra.RouteHandler = async ({use}) => {
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
        ...(prettierOptions as Options),
        parser: 'markdown',
      },
    ),
  );

  sprints.active += 1;
  writeFileSync(
    path.config('sprints/config.json'),
    prettier.format(JSON.stringify(sprints), {
      ...(prettierOptions as Options),
      parser: 'json',
    }),
  );

  await $`git add . && git commit -m "chore: updated changelog and sprint config"`;
};
