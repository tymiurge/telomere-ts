import moment from 'moment';
import {getRandomValueOf} from './utils';
import {validateArgPresence, validateArgType} from './validators';
import {extractTemplateValue} from './extractors';
import {Tokens, NoFunctionValue, Operations, OperationArg} from './types';

const operations: Operations = {
  now: {
    exec: () => moment().valueOf(),
  },
  randomValueOf: {
    exec: (args: OperationArg[]) => {
      const source = args[0] as object;
      return getRandomValueOf(source);
    },
    args: [
      {
        type: ['array', 'object'],
        required: true,
        nullable: false,
      }
    ],
  }
}

const operationExecutor = (name: string, args?: NoFunctionValue[]) => {
  if (!operations.hasOwnProperty(name)) {
    throw new Error(`${name} is not supported operation`);
  }
  const operationDef = operations[name];
  if (operationDef.args) {
    const requiredParamsAmount = operationDef.args.length;
    const actualParamsAmount = args?.length ?? 0;
    if (requiredParamsAmount !== actualParamsAmount) {
      throw new Error(`${name} requires ${requiredParamsAmount} parameter, but ${actualParamsAmount} is passed`);
    }
    for (let idx = 0; idx < operationDef.args.length; idx ++) {
      const argDef = operationDef.args[idx];
      const arg = args ? args[idx] : null;
      if (!validateArgPresence(argDef, arg)) {
        throw new Error(`The ${name} operation requires ${operationDef.args.filter(({required}) => required).length} parameters.`);
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
  const name = template.substr(0, idx);
  return name;
}

const extractOperationParameters = (template: string, variablesScope: Tokens): NoFunctionValue[] => {
  const startIdx = template.indexOf('(');
  const endIdx = template.indexOf(')');
  if (endIdx - startIdx === 1) {
    return [];
  }
  const parameters = template
    .substr(startIdx + 1, endIdx - startIdx - 1)
    .split(',')
    .map(token => token.trim())
    .map(token => extractTemplateValue(token, variablesScope))
  return parameters;
}

/**
 * Extracts operation name, its parameters from stringified template, executes the operation and returns the execution results.
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
