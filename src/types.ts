type NoFunctionObject = {
  [key: string]: NoFunctionValue
}

// TODO: see if it's possible to use type instead fo interface here
interface NoFunctionArray extends Array<NoFunctionValue> { };

type NoFunctionValue =
    boolean
    | string
    | number
    | null
    | undefined
    | object
    | NoFunctionObject
    | NoFunctionArray;

type OperationArg = NonNullable<NoFunctionValue>;

type Emitter = (input: string) => string;

type Token = NoFunctionValue;

type Tokens = {
  [k: string]: Token,
};

type PlainJSON = {
  [k: string]: NoFunctionValue
}

type OperationArgDefType = 'array' | 'undefined' | 'object' | 'boolean' | 'number' | 'bigint' | 'string' | 'symbol' | 'function';

type OperationArgDef = {
  type: OperationArgDefType | OperationArgDefType[],
  required?: boolean,
  nullable?: boolean,
};

type Operation = (args: OperationArg[]) => NoFunctionValue; 

type OperationDef = {
  args?: OperationArgDef[],
  exec: Operation
}

type Operations = {
  [k: string]: OperationDef,
};

type Validator = (argDef: OperationArgDef, arg: NoFunctionValue) => boolean;

type Validators = {
  [k: string]: Validator,
};

export {
  Emitter,
  Token,
  Tokens,
  PlainJSON,
  NoFunctionValue,
  OperationArgDef,
  OperationArgDefType,
  OperationDef,
  Operation,
  Operations,
  OperationArg,
  Validator,
  Validators,
};


