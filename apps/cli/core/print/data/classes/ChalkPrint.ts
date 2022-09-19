/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from 'chalk';
import capitalize from 'lodash/capitalize';
import type {Chalk} from 'chalk';
import type {Color, Options, Print} from '../../types';

const colors = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
  'grey',
  'blackBright',
  'redBright',
  'greenBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright',
  'whiteBright',
];

type ColorType = 'rgb' | 'hsl' | 'hsv' | 'hwb';
const types = ['rgb', 'hsl', 'hsv', 'hwb'];
const colorMatcher = /([a-z]+)\(([0-9]+),([0-9]+),([0-9]+)\)/i;
export function parseColor(
  color: Color,
): [ColorType, [number, number, number]] {
  const [type, ...result] = (colorMatcher.exec(color) ?? []).slice(1, 5);
  const values = result.map(Number);

  if (types.includes(type) || values.length < 3 || values.includes(NaN)) {
    throw new Error('Invalid color');
  }

  return [type, values] as [ColorType, [number, number, number]];
}

export function parseOptions(options: Options): Chalk {
  let instance = chalk.reset;
  if (options.color) {
    if (types.some((type) => options.color?.startsWith(type))) {
      const [type, values] = parseColor(options.color);
      instance = instance[type](...values);
    } else if (options.color.startsWith('#') && options.color.length === 7) {
      instance = instance.hex(options.color);
    } else if (colors.includes(options.color)) {
      instance = instance.keyword(options.color);
    }
  }

  if (options.backgroundColor) {
    if (types.some((type) => options.backgroundColor?.startsWith(type))) {
      const [type, values] = parseColor(options.backgroundColor);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      instance = (instance as any)[`bg${capitalize(type)}`](...values);
    } else if (
      options.backgroundColor.startsWith('#') &&
      options.backgroundColor.length === 7
    ) {
      instance = instance.bgHex(options.backgroundColor);
    } else if (colors.includes(options.backgroundColor)) {
      instance = instance.bgKeyword(options.backgroundColor);
    }
  }

  if (options.fontStyle === 'italic') {
    instance = instance.italic;
  }

  if (options.textDecoration === 'line-through') {
    instance = instance.strikethrough;
  } else if (options.textDecoration === 'underline') {
    instance = instance.underline;
  }

  if (options.visibility === 'hidden') {
    instance = instance.hidden;
  }

  if (options.fontWight === 'bold') {
    instance = instance.bold;
  }

  if (options.opacity === 'dim') {
    instance = instance.dim;
  }

  return instance;
}

export class ChalkPrint implements Print {
  newLine(count = 1): this {
    process.stdout.write(
      Array.from({length: count})
        .map(() => '\n')
        .join(''),
    );
    return this;
  }
  log(messages: any, options: Options = {}): this {
    const chalk = parseOptions(options);
    console.log(chalk(...(Array.isArray(messages) ? messages : [messages])));
    return this;
  }

  debug(...messages: any): this {
    const chalk = parseOptions({color: '#e2e8f0'});
    console.debug(chalk('🔎', ...messages));
    return this;
  }

  info(...messages: any): this {
    const chalk = parseOptions({color: '#60a5fa'});
    console.info(chalk('ℹ️ ', ...messages));
    return this;
  }

  warn(...messages: any): this {
    const chalk = parseOptions({color: '#fbbf24'});
    console.warn('⚠️ ', chalk(...messages));
    return this;
  }

  error(...messages: any): this {
    const chalk = parseOptions({color: '#fecaca'});
    console.error(chalk('⛔', ...messages));
    return this;
  }

  fatal(...messages: any): this {
    const chalk = parseOptions({color: '#be123c'});
    console.error('🚨', chalk(...messages));
    return this;
  }

  success(...messages: any): this {
    const chalk = parseOptions({color: '#34d399'});
    console.log('✅', chalk(...messages));
    return this;
  }
}
