export const router = use('router');

router
  .command('make\\::template', async (ctx) => {
    console.log(ctx);
  })
  .options({name: 'path'}, {name: 'another thing'})
  .arguments(
    {name: 'fabulous', alias: 'f'},
    {name: 'otherThing', type: Boolean},
  );
