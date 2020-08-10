import { buildVariablesScope, assemble } from './parser';

export const generate = (jsonTemplate: string): string => {
  const template = JSON.parse(jsonTemplate);
  if (!Object.prototype.hasOwnProperty.call(template, 'data')) {
    throw new Error('No data property in template.');
  }
  const { data, ...variablesTemplate } = template;
  const variablesScope = buildVariablesScope(variablesTemplate);
  const generatedJson = assemble(data, variablesScope);
  return JSON.stringify(generatedJson);
};
