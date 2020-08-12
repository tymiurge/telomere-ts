import { buildVariablesScope, assemble } from './parser';
import { NoFunctionValue } from './types';

const removeComments = (fileContent: string): string => {
  let result = '';
  fileContent.split('\n').forEach((line) => {
    const commentIdx = line.indexOf('//');
    if (commentIdx === -1) {
      result += line;
    } else if (commentIdx !== 0) {
      const purifiedLine = line.slice(0, commentIdx);
      if (purifiedLine.trim() !== '') {
        result += purifiedLine;
      }
    }
  });
  return result;
};

export const generate = (jsonTemplate: string): string => {
  const rawTemplate = removeComments(jsonTemplate);
  const template = JSON.parse(rawTemplate);
  if (!Object.prototype.hasOwnProperty.call(template, 'data')) {
    throw new Error('No data property in template.');
  }
  const { data, ...variablesTemplate } = template;
  if (typeof data !== 'object') {
    throw new TypeError('value of the data property should be either of object or of array type');
  }
  const variablesScope = buildVariablesScope(variablesTemplate);
  const generatedJson = assemble(data, variablesScope);
  return JSON.stringify(generatedJson);
};
