import {buildVariablesScope, assemble} from './parser';

export const generate = (jsonTemplate: string): string => {
  const template = JSON.parse(jsonTemplate);
  if (!template.hasOwnProperty('data')) {
    throw new Error('No data property in template.');
  }
  const {data, ...variablesTemplate} = template;
  const variablesScope = buildVariablesScope(variablesTemplate);
  const generatedJson = assemble(data, variablesScope);
  return JSON.stringify(generatedJson);
}

const t = `{
  "variable": "value from static scope variable",
  "data": {
    "data": "{{ @variable }}"
  }
}`;
generate(t);
