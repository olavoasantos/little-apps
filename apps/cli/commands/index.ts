import * as SprintClose from './SprintClose';
import * as MakeReadme from './MakeReadme';
import * as MakeModule from './MakeModule';
import * as MakeClass from './MakeClass';
import * as MakeType from './MakeType';
import * as MakeUtility from './MakeUtility';
import * as MakeFactory from './MakeFactory';
import * as MakeCommand from './MakeCommand';

export const router = use('router');

router
  .command('make\\:command', MakeCommand.command)
  .options(MakeCommand.options)
  .arguments(MakeCommand.args);

router
  .command('make\\:factory', MakeFactory.command)
  .options(MakeFactory.options)
  .arguments(MakeFactory.args);

router
  .command('make\\:utility', MakeUtility.command)
  .options(MakeUtility.options)
  .arguments(MakeUtility.args);

router
  .command('make\\:type', MakeType.command)
  .options(MakeType.options)
  .arguments(MakeType.args);

router
  .command('make\\:class', MakeClass.command)
  .options(MakeClass.options)
  .arguments(MakeClass.args);

router
  .command('make\\:module', MakeModule.command)
  .options(MakeModule.options)
  .arguments(MakeModule.args);

router
  .command('make\\:readme', MakeReadme.command)
  .options(MakeReadme.options)
  .arguments(MakeReadme.args);

router
  .command('sprint\\:close', SprintClose.command)
  .options(SprintClose.options)
  .arguments(SprintClose.args);
