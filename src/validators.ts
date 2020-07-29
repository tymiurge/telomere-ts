import {OperationArgDef, OperationArgDefType, OperationArg} from './operations';
import {isEmpty} from './utils';

type Validator = (argDef: OperationArgDef, arg: OperationArg | null) => boolean;

type Validators = {
  [k: string]: Validator,
};

const object: Validator = (argDef, arg) => {
  return false;
};


const array: Validator = (argDef, arg) => {
  if (!Array.isArray(arg)) {
    return false;
  }
  const nullable = argDef?.nullable ?? true;
  if (!nullable && isEmpty(arg)) {
    return false;
  }
  return true;
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
  return argDef.type.some((argType: OperationArgDefType) => {
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
