export const options: Application.CliOption[] = [];

export const args: Application.CliArgument[] = [];

export const command: Micra.RouteHandler = async ({use, options, arguments: args}) => {
  return new Response();
}
