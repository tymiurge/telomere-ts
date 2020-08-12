import { expect } from 'chai';
import moment from 'moment';
import { operationExecutor as execute } from '../../src/operations';

describe('now operation test suit', () => {
  it('now operation returns current time', () => {
    const expected = moment().valueOf();
    const actual: number = execute('now') as number;
    expect(expected - actual).lessThan(1000);
  });
});
