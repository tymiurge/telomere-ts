import moment from 'moment';
import {getRandomValueOf} from './utils';

type OperationArgType = Object | string | number | Array<any>;

type Operation = (args: OperationArgType[]) => any; 

type OperationArg = {
  type: OperationArgType | OperationArgType[],
  required?: boolean,
  nullable?: boolean,
};

type OperationDef = {
  args?: OperationArg[],
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
    exec: (args: OperationArgType[]) => {
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
  OperationArg,
  OperationArgType,
};

export default (name: string, args?: OperationArgType[]) => {
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
    for (let argDef of operationDef.args) {
      
    }
  }
  return operationDef.exec(args as OperationArg[]);
}