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
    const diff = generatedJSON.date - expectedJSON.date;
    expect(diff >= 0 && diff <= 10).to.be.true;
    
  });

  // it('generating template with an embedded parameterized operation in data scope', () => {
  //   const template = `{
  //     "var": "[1]",
  //     "data": {
  //       "value": "{{ $randomValueOf(@var) }}"
  //     }
  //   }`;
  //   const expectedJSON = {
  //     "value": 1,
  //   };
  //   const generatedJSON = JSON.parse(generate(template));
  //   expect(generatedJSON.value).to.be.equal(expectedJSON.value);
  // });

  it('embedded operation that requires parameter but does not have it in template throws', () => {
    const template = `{
      "var": "[1]",
      "data": {
        "value": "{{ $randomValueOf(@var) }}"
      }
    }`;
    expect(() => generate(template)).to.throw('randomValueOf requires 1 parameter, but 0 is passed');
  });

});