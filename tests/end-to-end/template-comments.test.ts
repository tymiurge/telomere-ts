import { expect } from 'chai';
import { generate } from '../../src';

describe('comments in template test suit', () => {
  it('whole line comment is omitted', () => {
    const templateJSON = `{
      "variable": "value from static scope variable",
      // this is a comment
      "data": {
        // this is another comment
        "data": "{{ @variable }}"
      }
    }`;
    const expectedJSON = `{
      "data": "value from static scope variable"
    }`;
    const generated = generate(templateJSON);
    expect(generated.replace(/\s+/g, '')).eq(expectedJSON.replace(/\s+/g, ''));
  });

  it('part line comment is omitted', () => {
    const templateJSON = `{
      "variable": "value from static scope variable",     // this is a comment
      "data": {
        "data": "{{ @variable }}"                         // this is another comment
      }
    }`;
    const expectedJSON = `{
      "data": "value from static scope variable"
    }`;
    const generated = generate(templateJSON);
    expect(generated.replace(/\s+/g, '')).eq(expectedJSON.replace(/\s+/g, ''));
  });
});
