import {expect} from 'chai';
import {generate} from './../src';

describe('end to end generation', () => {
  
  it('template with a static variable', () => {
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

  // it('value template with an embedded function', () => {
  //   const templateJSON = `{
  //     "data": {
  //       "data": "{{ $now() }}"
  //     }
  //   }`;
  //   const expectedJSON = `{
  //     "data": "value from static scope variable"
  //   }`;
  //   const generated = generate(templateJSON);
  //   expect(generated.replace(/\s+/g, '')).eq(expectedJSON.replace(/\s+/g, ''));
  // });

  // it('template with no variables scope', () => {

  // });

  // it('template with a dynamic variable', () => {

  // });

});