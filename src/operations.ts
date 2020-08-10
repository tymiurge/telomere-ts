import moment from 'moment';
import { getRandomValueOf } from './utils';
import { validateArgPresence, validateArgType } from './validators';
import {
  Tokens,
  NoFunctionValue,
  Operations,
  OperationArg,
} from './types';

/**
 * extracts either variable value from variablesScope or operation value
 * @param rawTemplate
 * @param variablesScope
 */
export const extractTemplateValue = (
  rawTemplate: string,
  variablesScope: Tokens,
): NoFunctionValue => {
  const templateBody = rawTemplate.replace('{{', '').replace('}}', '').trim();
  const pointer = templateBody.charAt(0);
  if (pointer === '@' || pointer === '$') {
    if (templateBody.length === 1) {
      throw new Error('invalid template syntax: no variable name');
    }
    const variableName = templateBody.slice(1 - templateBody.length);
    if (pointer === '@') {
      return variablesScope[variableName];
    }
    if (pointer === '$') {
      return operationFactory(variableName, variablesScope);
    }
  }
  return templateBody;
};

/**
 * If valueTemplate is a string enclosed in {{<templateBody>}} then
 *  - either extracts variable templateBody starts from @
 *  - or generates value by applying an appropriated and supported operation.
 * Otherwise returns valueTemplate.
 * @param valueTemplate
 * @param variablesScope
 * @returns {any} value of the valueTemplate
 */
export const extractValue = (
  valueTemplate: NoFunctionValue,
  variablesScope: Tokens,
): NoFunctionValue => {
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

const operations: Operations = {
  now: {
    exec: () => moment().valueOf(),
  },
  randomValueOf: {
    exec: (args: OperationArg[]): NoFunctionValue => {
      const source = args[0] as Record<string, unknown>;
      return getRandomValueOf(source);
    },
    args: [
      {
        type: ['array', 'object'],
        required: true,
        nullable: false,
      },
    ],
  },
};

const operationExecutor = (name: string, args?: NoFunctionValue[]): NoFunctionValue => {
  if (!Object.prototype.hasOwnProperty.call(operations, name)) {
    throw new Error(`${name} is not supported operation`);
  }
  const operationDef = operations[name];
  if (operationDef.args) {
    const requiredParamsAmount = operationDef.args.length;
    const actualParamsAmount = args?.length ?? 0;
    if (requiredParamsAmount !== actualParamsAmount) {
      throw new Error(`${name} requires ${requiredParamsAmount} parameter, but ${actualParamsAmount} is passed`);
    }
    for (let idx = 0; idx < operationDef.args.length; idx++) {
      const argDef = operationDef.args[idx];
      const arg = args ? args[idx] : undefined;
      if (!validateArgPresence(argDef, arg)) {
        throw new Error(`The ${name} operation requires ${operationDef.args.filter(({ required }) => required).length} parameters.`);
      }
      if (!validateArgType(argDef, arg)) {
        throw new Error(`The ${idx}-th parameter of ${name} operation must be of the ${argDef.type} type but is of the type ${typeof arg}`);
      }
    }
  }
  return operationDef.exec(args as OperationArg[]);
};

const extractOperationName = (template: string): string => {
  const idx = template.indexOf('(');
  const name = template.slice(0, idx);
  return name;
};

const extractOperationParameters = (
  template: string,
  variablesScope: Tokens,
): NoFunctionValue[] => {
  const startIdx = template.indexOf('(');
  const endIdx = template.indexOf(')');
  if (endIdx - startIdx === 1) {
    return [];
  }
  const parameters = template
    .slice(startIdx + 1, endIdx)
    .split(',')
    .map((token) => token.trim())
    .map((token) => extractTemplateValue(token, variablesScope));
  return parameters;
};

/**
 * Extracts operation name, its parameters from stringified template, executes the operation and
 * returns the execution results.
 * @param {string} template: stringified operation, i.e. now(), getRandomValueOf(@object)
 * @param variablesScope
 * @returns executed operation value
 */
const operationFactory = (template: string, variablesScope: Tokens): NoFunctionValue => {
  const name = extractOperationName(template);
  const parameters = extractOperationParameters(template, variablesScope);
  return operationExecutor(name, parameters);
};

export {
  operationFactory,
  operationExecutor,
};
