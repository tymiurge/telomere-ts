import { expect } from 'chai';
import { operationExecutor as execute } from '../../src/operations';

describe('sum operation test suit', () => {
  it('sum of two numbers returns their sum', () => {
    const expected = 2;
    const actual: number = execute('sum', [1, 1]) as number;
    expect(expected).to.be.equal(actual);
  });
});
