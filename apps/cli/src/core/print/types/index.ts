import {} from 'chalk';

export type Color =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray'
  | 'grey'
  | 'blackBright'
  | 'redBright'
  | 'greenBright'
  | 'yellowBright'
  | 'blueBright'
  | 'magentaBright'
  | 'cyanBright'
  | 'whiteBright'
  | `#${string}`
  | `rgb(${number},${number},${number})`
  | `hsl(${number},${number},${number})`
  | `hsv(${number},${number},${number})`
  | `hwb(${number},${number},${number})`;

export interface Options {
  color?: Color;
  backgroundColor?: Color;
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'line-through' | 'underline' | 'none';
  visibility?: 'visible' | 'hidden';
  fontWight?: 'normal' | 'bold';
  opacity?: 1 | 'dim';
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Print {
  log(messages: any, options?: Options): void;
  debug(...messages: any): void;
  info(...messages: any): void;
  warn(...messages: any): void;
  error(...messages: any): void;
  fatal(...messages: any): void;
  success(...messages: any): void;
}
