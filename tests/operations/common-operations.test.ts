import { expect } from 'chai';
import { operationExecutor as execute } from '../../src/operations';
import { generate } from '../../src';

describe('common cases for all operations test suit', () => {
  it('template with not supported operation name throws "not supported operation" error', () => {
    expect(() => execute('not_existing_operation', [])).to.throw('not_existing_operation is not supported operation');
  });

  it('error is raised for an operation with parameter type which does not correspond to its definition object', () => {
    const template = `{
      "var": "[1]",
      "data": {
        "value": "{{ $randomValueOf(@var) }}"
      }
    }`;
    expect(() => generate(template))
      .to
      // eslint-disable-next-line max-len
      .throw('The 0-th parameter of randomValueOf operation must be of the array,object type but is of the type string');
  });

  it('params amount mismatch error is raised at parsing operation that requires parameter but does not have it', () => {
    const template = `{
      "data": {
        "value": "{{ $randomValueOf() }}"
      }
    }`;
    expect(() => generate(template)).to.throw('randomValueOf requires 1 parameter, but 0 is passed');
  });
});
