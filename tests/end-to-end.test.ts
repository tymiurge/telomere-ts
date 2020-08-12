import { expect } from 'chai';
import moment from 'moment';
import { generate } from '../src';

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
      date: moment().valueOf(),
    };
    const generatedJSON = JSON.parse(generate(template));
    const diff = generatedJSON.date - expectedJSON.date;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(diff >= 0 && diff <= 10).to.be.true;
  });

  // TODO: generating template with a static variable being array
  // TODO: generating template with a static variable being object

  it('generating template with an embedded parameterized operation in data scope', () => {
    const template = `{
      "var": [1],
      "data": {
        "value": "{{ $randomValueOf(@var) }}"
      }
    }`;
    const expectedJSON = {
      value: 1,
    };
    const generatedJSON = JSON.parse(generate(template));
    expect(generatedJSON.value).to.be.equal(expectedJSON.value);
  });

  it('required params amount mismatch error is raised at parsing operation that requires parameter but does not have it', () => {
    const template = `{
      "data": {
        "value": "{{ $randomValueOf() }}"
      }
    }`;
    expect(() => generate(template)).to.throw('randomValueOf requires 1 parameter, but 0 is passed');
  });

  it('generating template with an embedded static object', () => {
    const templateJSON = `{
      "data": {
        "device": {
          "producedBy": "samsung",
          "model": "galaxy note"
        }
      }
    }`;
    const expectedJSON = `{
      "device": {
        "producedBy": "samsung",
        "model": "galaxy note"
      }
    }`;
    const generated = generate(templateJSON);
    expect(generated.replace(/\s+/g, '')).eq(expectedJSON.replace(/\s+/g, ''));
  });

  it('generating template with an embedded object properties of which are variable templates', () => {
    const templateJSON = `{
      "manufacture": "samsung",
      "model": "galaxy note",
      "data": {
        "device": {
          "producedBy": "{{ @manufacture }}",
          "model": "{{ @model }}"
        }
      }
    }`;
    const expectedJSON = `{
      "device": {
        "producedBy": "samsung",
        "model": "galaxy note"
      }
    }`;
    const generated = generate(templateJSON);
    expect(generated.replace(/\s+/g, '')).eq(expectedJSON.replace(/\s+/g, ''));
  });

  // it('generating template with an embedded array in data scope', () => {
  //   const templateJSON = `{
  //     "phones": {
  //       "samsung": [
  //         "Samsung Galaxy S9",
  //         "Samsung Galaxy S9",
  //         "Samsung Galaxy S10e",
  //         "Samsung Galaxy S10",
  //         "Samsung Galaxy S10+",
  //         "Samsung Galaxy S10 5G",
  //         "Samsung Galaxy S10 Lite",
  //         "Samsung Galaxy S20",
  //         "Samsung Galaxy S20+",
  //         "Samsung Galaxy S20 Ultra"
  //       ],
  //       "huawei": [
  //         "Huawei Mate 30 Pro",
  //         "Huawei Mate 30 (5G)",
  //         "Huawei Mate 30 Pro (5G)",
  //         "Huawei Mate 30 RS",
  //         "Huawei MatePad Pro",
  //         "Huawei Mate Xs",
  //         "Huawei Mate 40"
  //       ]
  //     },
  //     "model": "galaxy note",
  //     "data": {
  //       "devices": []
  //     }
  //   }`;
  //   const expectedJSON = `{
  //     "device": {
  //       "producedBy": "samsung",
  //       "model": "galaxy note"
  //     }
  //   }`;
  //   const generated = generate(templateJSON);
  //   expect(generated.replace(/\s+/g, '')).eq(expectedJSON.replace(/\s+/g, ''));
  // });
});
