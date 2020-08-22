import { expect } from 'chai';
import { operationExecutor as execute } from '../../src/operations';

describe('randomValueOf operation test suit', () => {
  it('randomValueOf applied to an array returns random element of the last', () => {
    const source = [1, 2, 3, 4];
    const expected = execute('randomValueOf', [source]) as number;
    expect(source.includes(expected)).equal(true);
  });

  it('randomValueOf applied to an object returns value of random key of the last', () => {
    const source = { a: 1, b: 2, c: 3 };
    const expected = execute('randomValueOf', [source]) as number;
    expect(Object.values(source).includes(expected)).equal(true);
  });

  it('randomValueOf with no parameter passed throws "randomValueOf requires params..." error', () => {
    expect(() => execute('randomValueOf', [])).to.throw('randomValueOf requires 1 parameter, but 0 is passed');
  });

  it('randomValueOf applied to an empty array throws type error', () => {
    expect(() => execute('randomValueOf', [[]]))
      .to
      .throw('The 0-th parameter of randomValueOf operation must be of the array,object type');
  });

  it('randomValueOf applied to an empty object throws type error', () => {
    expect(() => execute('randomValueOf', [{}]))
      .to
      .throw('The 0-th parameter of randomValueOf operation must be of the array,object type');
  });
});
