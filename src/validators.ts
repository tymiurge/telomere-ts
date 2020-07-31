import {OperationArgDef, OperationArgDefType, OperationArg} from './operations';
import {isEmpty} from './utils';

type Validator = (argDef: OperationArgDef, arg: OperationArg | null) => boolean;

type Validators = {
  [k: string]: Validator,
};

const _isNullableConditioned: Validator = (argDef, arg) => {
  const nullablePolicy = argDef?.nullable ?? true;
  if (!nullablePolicy && isEmpty(arg)) {
    return false;
  }
  return true;
};

const object: Validator = (argDef, arg) => {
  if (typeof arg !== 'object') {
    return false;
  }
  return _isNullableConditioned(argDef, arg);
};


const array: Validator = (argDef, arg) => {
  if (!Array.isArray(arg)) {
    return false;
  }
  return _isNullableConditioned(argDef, arg);
};

const validators: Validators = {
  array,
  object,
};

/**
 * Validates arg type.
 * @param argDef
 * @param arg 
 * @returns boolean
 */
const validateArgType: Validator = (argDef, arg) => {
  if (!Array.isArray(argDef.type)) {
    const v: Validator = validators[argDef.type];
    return v(argDef, arg);  
  }
  return  argDef.type.some((argType: OperationArgDefType) => {
    const ad: OperationArgDef = {
      type: argType,
      nullable: argDef?.nullable ?? true,
    };
    return validateArgType(ad, arg);
  });
};

/**
 * Tests if arg is not null or undefined if the <code>required</code> property is set to true in argument definition.
 * If the <code>required</code> property is not defined in <code>argDef</code> it's defaulted to false.
 * @param argDef
 * @param arg
 * @returns boolean 
 */
const validateArgPresence: Validator = (argDef, arg) => (argDef?.required ?? false) && !!arg;

export {
  validateArgPresence,
  validateArgType,
};

const def: OperationArgDef = {
  type: ['array', 'object'],
  required: true,
  nullable: false,
};
validateArgType(def, [])
