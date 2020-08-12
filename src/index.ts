import { buildVariablesScope, assemble } from './parser';

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
  const variablesScope = buildVariablesScope(variablesTemplate);
  const generatedJson = assemble(data, variablesScope);
  return JSON.stringify(generatedJson);
};
