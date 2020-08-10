import { expect } from 'chai';
import moment from 'moment';
import { operationExecutor as execute } from '../src/operations';
import { generate } from '../src';

describe('operations test suit', () => {
  it('template with not supported operation name throws "not supported operation" error', () => {
    expect(() => execute('not_existing_operation', [])).to.throw('not_existing_operation is not supported operation');
  });

  it('now operation returns current time', () => {
    const expected = moment().valueOf();
    const actual: number = execute('now') as number;
    expect(expected - actual).lessThan(1000);
  });

  it('type error is raised for an operation with parameter type of which does not correspond to its definition object', () => {
    const template = `{
      "var": "[1]",
      "data": {
        "value": "{{ $randomValueOf(@var) }}"
      }
    }`;
    expect(() => generate(template))
      .to
      .throw('The 0-th parameter of randomValueOf operation must be of the array,object type but is of the type string');
  });

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
    expect(() => execute('randomValueOf', [[]])).to.throw('The 0-th parameter of randomValueOf operation must be of the array,object type');
  });

  it('randomValueOf applied to an empty object throws type error', () => {
    expect(() => execute('randomValueOf', [{}])).to.throw('The 0-th parameter of randomValueOf operation must be of the array,object type');
  });
});
