import {Tokens, PlainJSON, NoFunctionValue, Emitter} from './types';

export const parse = (variablesTemplate: PlainJSON): Tokens => Object.keys(variablesTemplate).reduce(
  (accumulator, key) => {
    return {...accumulator, [key]: (variablesTemplate[key])};
  },
  {}
);

// TODO: clear return type here - must not include | Emitter 
const extractTemplateValue = (rawTemplate: string, variablesScope: Tokens): NoFunctionValue | Emitter => {
  const template = rawTemplate.replace('{{', '').replace('}}', '').trim();
  const pointer = template.charAt(0);
  if ((pointer === '@' || pointer === '$') && template.length === 1) {
    throw new Error('invalid template syntax: no variable name');
  }
  if (pointer === '@') {
    const variableName = template.substr(1, template.length - 1);
    return variablesScope[variableName];
  }
  return template;
}

const extract = (valueTemplate: NoFunctionValue, variablesScope: Tokens): NoFunctionValue => {
  if (typeof valueTemplate !== 'string') {
    return valueTemplate;
  };

  const templateRegex = /{{.*}}/;
  if (templateRegex.test(valueTemplate)) {
    const matches = templateRegex.exec(valueTemplate) as RegExpExecArray;
    if (matches.length > 1) {
      throw new Error(`invalid value template: value template must match to {{ @variable || $func() }} pattern but it is ${valueTemplate}`);
    }
    // TODO: clear as NoFunctionValue casting here
    return extractTemplateValue(matches[0], variablesScope) as NoFunctionValue;
  }

  return valueTemplate;
};

export const assemble = (dataTemplate: PlainJSON, variablesScope: Tokens): PlainJSON => Object.keys(dataTemplate).reduce(
  (accumulator, key) => {
    const value = extract(dataTemplate[key], variablesScope);
    return {...accumulator, [key]: value};
  },
  {}
);
