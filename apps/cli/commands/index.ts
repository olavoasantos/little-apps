import * as SprintCloseCommand from './SprintClose';
import * as MakeReadmeCommand from './MakeReadme';
import * as MakeModuleCommand from './MakeModule';
import * as MakeClassCommand from './MakeClass';
import * as MakeTypeCommand from './MakeType';
import * as MakeUtilityCommand from './MakeUtility';
import * as MakeFactoryCommand from './MakeFactory';
import * as MakeCommandCommand from './MakeCommand';

export const router = use('router');

router
  .command('make\\:command', MakeCommandCommand.command)
  .options(MakeCommandCommand.options)
  .arguments(MakeCommandCommand.args);

router
  .command('make\\:factory', MakeFactoryCommand.command)
  .options(MakeFactoryCommand.options)
  .arguments(MakeFactoryCommand.args);

router
  .command('make\\:utility', MakeUtilityCommand.command)
  .options(MakeUtilityCommand.options)
  .arguments(MakeUtilityCommand.args);

router
  .command('make\\:type', MakeTypeCommand.command)
  .options(MakeTypeCommand.options)
  .arguments(MakeTypeCommand.args);

router
  .command('make\\:class', MakeClassCommand.command)
  .options(MakeClassCommand.options)
  .arguments(MakeClassCommand.args);

router
  .command('make\\:module', MakeModuleCommand.command)
  .options(MakeModuleCommand.options)
  .arguments(MakeModuleCommand.args);

router
  .command('make\\:readme', MakeReadmeCommand.command)
  .options(MakeReadmeCommand.options)
  .arguments(MakeReadmeCommand.args);

router
  .command('sprint\\:close', SprintCloseCommand.command)
  .options(SprintCloseCommand.options)
  .arguments(SprintCloseCommand.args);
