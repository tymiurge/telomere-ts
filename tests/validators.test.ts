import { expect } from 'chai';
import { validateArgType } from '../src/validators';
import { OperationArgDef } from '../src/types';

const def: OperationArgDef = {
  type: ['array', 'object'],
  required: true,
  nullable: false,
};

describe('validators test suit', () => {
  it('validation passes for arg being not an empty array', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(validateArgType(def, [1, 2, 3])).to.be.true;
  });

  it('validation fails for an empty array', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(validateArgType(def, [])).to.be.false;
  });

  it('validation passes for arg being not an empty object', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(validateArgType(def, { a: 1, b: 2 })).to.be.true;
  });

  it('validation fails for arg being an empty object', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(validateArgType(def, {})).to.be.false;
  });
});
