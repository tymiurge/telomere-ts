import {OperationArgDef, OperationArgDefType, Validator, Validators} from './types';
import {isEmpty} from './utils';

const _validateNullablePolicy: Validator = (argDef, arg) => {
  const nullablePolicy = argDef?.nullable ?? true;
  if (!nullablePolicy && typeof arg === 'object' && isEmpty(arg)) {
    return false;
  }
  return true;
};

const object: Validator = (argDef, arg) => {
  if (typeof arg !== 'object') {
    return false;
  }
  return _validateNullablePolicy(argDef, arg);
};


const array: Validator = (argDef, arg) => {
  if (!Array.isArray(arg)) {
    return false;
  }
  return _validateNullablePolicy(argDef, arg);
};

const validators: Validators = {
  array,
  object,
};

/**
 * Validates arg type.
 * If argument type is not nullable in the <code>argDef</code> object but its run time value is null, validation fails.
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
