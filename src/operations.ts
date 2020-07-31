import moment from 'moment';
import {getRandomValueOf} from './utils';
import {validateArgPresence, validateArgType} from './validators';

type OperationArg = Object | string | number | Array<any>;

type OperationArgDefType = 'array' | 'undefined' | 'object' | 'boolean' | 'number' | 'bigint' | 'string' | 'symbol' | 'function';

type OperationArgDef = {
  type: OperationArgDefType | OperationArgDefType[],
  required?: boolean,
  nullable?: boolean,
};

type Operation = (args: OperationArg[]) => any; 

type OperationDef = {
  args?: OperationArgDef[],
  exec: Operation
}

type Operations = {
  [k: string]: OperationDef,
};

const operations: Operations = {
  now: {
    exec: () => moment().valueOf(),
  },
  randomValueOf: {
    exec: (args: OperationArg[]) => {
      const [source] = args;
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

export {
  OperationArgDef,
  OperationArgDefType,
  OperationArg,
};

export default (name: string, args?: OperationArg[]) => {
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
        throw new Error(`The ${idx}-th parameter of ${name} operation must be of the ${argDef.type} type`);
      }
    }
  }
  return operationDef.exec(args || []);
}