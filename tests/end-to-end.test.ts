import {expect} from 'chai';
import moment from 'moment';
import {generate} from './../src';

describe('end to end generation', () => {
  
  it('generating template with a static variable', () => {
    const templateJSON = `{
      "variable": "value from static scope variable",
      "data": {
        "data": "{{ @variable }}"
      }
    }`;
    const expectedJSON = `{
      "data": "value from static scope variable"
    }`;
    const generated = generate(templateJSON);
    expect(generated.replace(/\s+/g, '')).eq(expectedJSON.replace(/\s+/g, ''));
  });

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

  it('generating template with an embedded no-parameters operation in data scope', () => {
    const template = `{
      "data": {
        "date": "{{ $now() }}"
      }
    }`;
    const expectedJSON = {
      "date": moment().valueOf(),
    };
    const generatedJSON = JSON.parse(generate(template));
    const diff = expectedJSON.date - generatedJSON.date;
    expect(diff >= 0 && diff <= 1).to.be.true;
    
  });

  // it('template with no variables scope', () => {

  // });

  // it('template with a dynamic variable', () => {

  // });

});