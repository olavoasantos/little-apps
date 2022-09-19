export function createRequestFromArgs(args: string[]): Request {
  const host = args
    .slice(0, 2)
    .join('.')
    .replace(/\/+/gi, '.')
    .replace(/\.+/gi, '.');

  const {command, options, searchParams} = args.slice(2).reduce(
    (params, arg) => {
      if (!params.command) {
        params.command = arg;
      } else if (arg.startsWith('-')) {
        const [name, value = true] = arg.replace(/^-+/, '').split('=');
        params.searchParams.append(name, String(value));
      } else {
        params.options.push(arg);
      }

      return params;
    },
    {command: '', options: [] as string[], searchParams: new URLSearchParams()},
  );

  return new Request(new URL(`cli://${host}/${command}?${searchParams}`), {
    method: 'POST',
    body: JSON.stringify(options),
  });
}
