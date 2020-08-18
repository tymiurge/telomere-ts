import {
  OperationArg,
  OperationDef,
} from '../types';

const def: OperationDef = {
  exec: (args: OperationArg[]): number => {
    const first = args[0] as number;
    const second = args[1] as number;
    return first + second;
  },
  args: [
    {
      type: 'number',
      required: true,
    },
    {
      type: 'number',
      required: true,
    },
  ],
};

export default def;
