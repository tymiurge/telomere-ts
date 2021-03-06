import { expect } from 'chai';
import { generate } from '../../src';

describe('parsing malformed templates', () => {
  it('template with no "data" property throws "no data property" error', () => {
    const template = `{
      "variable": "value from static scope variable"
    }`;
    expect(() => generate(template)).to.throw('No data property in template.');
  });

  it('if data property is not an object or array then error is raised', () => {
    const template = `{
      "data": "string instead of object or array"
    }`;
    const msg = 'value of the data property should be either of object or of array type';
    expect(() => generate(template)).to.throw(msg);
  });

  it('template with a syntax error raises SyntaxError', () => {
    const template = `{
      "var": "[1]"
      "data": {
        "value": "{{ $getRandomValueOf(@var) }}"
      }
    }`;
    expect(() => generate(template)).to.throw('Unexpected string in JSON at position');
  });

  // it('malformed value template raises "malformed value template "', () => {
  //  data: {
  //    prop: "{{ @value }}{{ @other value }}"
  //  }
  // });

  // it('invalid syntax in template returns the template as string', () => {
  //  data: {
  //    prop: "{ { @value }}" // with space in '{ {'
  //  }
  // });

  // it('no variable name in template raises no variable error', () => {
  //  data: {
  //    prop: "{{ @ }}"
  //  }
  //
  //  or
  //
  //  data: {
  //    prop: "{{ $ }}"
  //  }
  // });
});
