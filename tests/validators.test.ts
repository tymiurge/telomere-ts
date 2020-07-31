import {expect} from 'chai';
import {validateArgType, validateArgPresence} from './../src/validators';
import {OperationArgDef} from './../src/operations';

const def: OperationArgDef = {
  type: ['array', 'object'],
  required: true,
  nullable: false,
};

describe('validators test suit', () => {
  
  it('validation passes for arg being not an empty array', () => {
    expect(validateArgType(def, [1, 2, 3])).to.be.true;
  });

  it('validation fails for an empty array', () => {
    expect(validateArgType(def, [])).to.be.false;
  });

  it('validation passes for arg being not an empty object', () => {
    expect(validateArgType(def, {a: 1, b: 2})).to.be.true;
  });

  it('validation fails for arg being an empty object', () => {
    expect(validateArgType(def, {})).to.be.false;
  });
  
});