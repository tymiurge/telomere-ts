type NoFunctionValue =
    boolean
    | string
    | number
    | null
    | undefined
    | NoFunctionObject
    | NoFunctionArray

type NoFunctionObject = {
    [key: string]: NoFunctionValue
}

// TODO see if it's possible to extend type
interface NoFunctionArray extends Array<NoFunctionValue> { };

type Emitter = (input: string) => string;

type Token = NoFunctionValue;

type Tokens = {
  [k: string]: Token,
};

type PlainJSON = {
  [k: string]: NoFunctionValue
}

export {
  Emitter,
  Token,
  Tokens,
  PlainJSON,
  NoFunctionValue,
};
