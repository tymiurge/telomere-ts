import { expect } from 'chai';
import { generate } from '../../src';

describe('not supported operations test suit', () => {
  it('generating template with not supported operation in data scope throws error', () => {
    const notSupportedOperationName = 'NOT_SUPPORTED_OPERATION';
    const template = `{
      "data": {
        "date": "{{ $${notSupportedOperationName}() }}"
      }
    }`;
    const errorMessage = `${notSupportedOperationName} is not supported operation`;
    expect(() => generate(template)).to.throw(errorMessage);
  });

  it('generating template with not supported operation in variables scope throws error', () => {
    const notSupportedOperationName = 'NOT_SUPPORTED_OPERATION';
    const template = `{
      "var": "${notSupportedOperationName}()",
      "data": {
        "date": "{{ $${notSupportedOperationName}() }}"
      }
    }`;
    const errorMessage = `${notSupportedOperationName} is not supported operation`;
    expect(() => generate(template)).to.throw(errorMessage);
  });
});
