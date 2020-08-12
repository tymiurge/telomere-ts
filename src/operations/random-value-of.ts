import {
  NoFunctionValue,
  OperationArg,
  OperationDef,
} from '../types';
import { getRandomValueOf } from '../utils';

const def: OperationDef = {
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
};

export default def;
