import pluralize from 'pluralize';
import lodash from 'lodash';

export const _ = {
  ...lodash,
  pascalCase: (value?: string) => lodash.upperFirst(lodash.camelCase(value)),
  macroCase: (value?: string) => lodash.upperCase(lodash.snakeCase(value)),
  sentenceCase: (value?: string) => lodash.upperFirst(lodash.lowerCase(value)),
  plural: pluralize.plural.bind(pluralize),
  singular: pluralize.singular.bind(pluralize),
};
