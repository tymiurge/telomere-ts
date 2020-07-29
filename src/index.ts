import {parse, assemble} from './parser';
// const templateJSON = `{
//   "variable": "value from static scope variable",
//   "template": {
//     "data": "{{ @variable }}"
//   }
// }`;

// const expectedJSON = `{
//   "data": "value from static scope variable",
// }`;

// const lexer = new TokesTree(templateJSON);
// const tree = lexer.tree;

// console.log(tree)

export const generate = (jsonTemplate: string): string => {
  const template = JSON.parse(jsonTemplate);
  if (!template.hasOwnProperty('data')) {
    throw new Error("no data property");
  }
  const {data, ...variablesTemplate} = template;
  const variablesScope = parse(variablesTemplate);
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
