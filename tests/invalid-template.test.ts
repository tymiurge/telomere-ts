import { expect } from "chai";
import {generate} from './../src';

describe('parsing invalid templates', () => {
  
  it('template with no "data" property throws "no data property" error', () => {
    const template = `{
      "variable": "value from static scope variable"
    }`;
    expect(() => generate(template)).to.throw('No data property in template.');
  });

  // it('template with "data" property being not object throws "data should be a JSON  object" error', () => {
  // });

  // it('malformed json raises "malformed json" error', () => {
  // });

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