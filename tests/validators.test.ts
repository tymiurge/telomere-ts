import {expect} from 'chai';
import {validateArgType, validateArgPresence} from './../src/validators';
import {OperationArgDef} from './../src/operations';

const def: OperationArgDef = {
  type: ['array', 'object'],
  required: true,
  nullable: false,
};

describe('validators test suit', () => {
  
  it('array arg positive case', () => {
    expect(validateArgType(def, [1, 2, 3])).to.be.true;
  });

  it('array arg fails for empty array', () => {
    expect(validateArgType(def, [])).to.be.false;
  });
  
});