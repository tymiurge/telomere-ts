import {Tokens, NoFunctionValue} from './types';
import {operationFactory} from './operations';


/**
 * extracts either variable value from variablesScope or operation value 
 * @param rawTemplate 
 * @param variablesScope 
 */
export const extractTemplateValue = (rawTemplate: string, variablesScope: Tokens): NoFunctionValue => {
  const templateBody = rawTemplate.replace('{{', '').replace('}}', '').trim();
  const pointer = templateBody.charAt(0);
  if (pointer === '@' || pointer === '$') {
    if (templateBody.length === 1) {
      throw new Error('invalid template syntax: no variable name');
    }
    const variableName = templateBody.substr(1, templateBody.length - 1);
    if (pointer === '@') {
      return variablesScope[variableName];
    }
    if (pointer === '$') {
      return operationFactory(variableName, variablesScope);
    }
  }
  return templateBody;
}

/**
 * If valueTemplate is a string enclosed in {{<templateBody>}} then
 *  - either extracts variable templateBody starts from @
 *  - or generates value by applying an appropriated and supported operation.
 * Otherwise returns valueTemplate.
 * @param valueTemplate 
 * @param variablesScope 
 * @returns {any} value of the valueTemplate
 */
export const extractValue = (valueTemplate: NoFunctionValue, variablesScope: Tokens): NoFunctionValue => {
  if (typeof valueTemplate !== 'string') {
    return valueTemplate;
  }

  const templateRegex = /{{.*}}/;
  if (templateRegex.test(valueTemplate)) {
    const matches = templateRegex.exec(valueTemplate) as RegExpExecArray;
    if (matches.length > 1) {
      throw new Error(`invalid value template: value template must match to {{ @variable || $func() }} pattern but it is ${valueTemplate}`);
    }
    return extractTemplateValue(matches[0], variablesScope);
  }

  return valueTemplate;
};
