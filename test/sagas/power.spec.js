import {expectSaga} from 'redux-saga-test-plan';
import powerSaga, {
  isMonotonicallyIncreasing,
  findNextBiggerElement,
  interpolateValues,
} from '../../app/scripts/store/power/PowerSaga';

describe('PowerAnalysis', () => {
  it('should have the expected watchers', done => expectSaga(powerSaga)
    .run({silenceTimeout: true})
    .then(saga => {
      expect(saga)
        .toMatchSnapshot();
      done();
    }));
});

describe('PowerAnalysis Data Interpolation', () => {
  it('isMonotonicallyIncreasing - is true', () => {
    const data = [{power: 1}, {power: 2}, {power: 3}];
    const res = isMonotonicallyIncreasing(data);
    expect(res)
      .toBe(true);
  });

  it('isMonotonicallyIncreasing - is false', () => {
    const data = [{power: 1}, {power: 3}, {power: 2}];
    const res = isMonotonicallyIncreasing(data);
    expect(res)
      .toBe(false);
  });

  it('findNextBiggerElement - is normal', () => {
    const data = [{power: 1}, {power: 2}, {power: 3}];
    const res = findNextBiggerElement(data, 1);
    expect(res)
      .toBe(2);
  });

  it('findNextBiggerElement - current element is the biggest', () => {
    const data = [{power: 2}, {power: 3}, {power: 1}];
    const res = findNextBiggerElement(data, 1);
    expect(res)
      .toBe(1);
  });


  it('findNextBiggerElement - two elements are smaller than the last', () => {
    const data = [{power: 3}, {power: 1}, {power: 2}, {power: 6}];
    const res = findNextBiggerElement(data, 0);
    expect(res)
      .toBe(3);
  });

  it('interpolateValues - should return the same', () => {
    const data = [{power: 1}, {power: 2}, {power: 3}];
    const res = interpolateValues(data);
    expect(res)
      .toEqual(data);
  });

  it('interpolateValues - one element needs to be interpolated', () => {
    const data = [{power: 1}, {power: 0.5}, {power: 3}];
    const target = [{power: 1}, {power: 2}, {power: 3}];
    const res = interpolateValues(data);
    expect(res)
      .toEqual(target);
  });

  it('interpolateValues - two consecutive elements need to be interpolated', () => {
    const data = [{power: 3}, {power: 1}, {power: 2}, {power: 6}];
    const target = [{power: 3}, {power: 4}, {power: 5}, {power: 6}];
    const res = interpolateValues(data);
    expect(res)
      .toEqual(target);
  });

  it('interpolateValues - multiple elements need to be interpolated', () => {
    // [3, 1, 2, 6, 7, 1, 2, 3, 11, 1, 13];
    const data = [{power: 3}, {power: 1}, {power: 2}, {power: 6}, {power: 7}, {power: 1}, {power: 2}, {power: 3}, {power: 11}, {power: 1}, {power: 13}];
    // [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const target = [{power: 3}, {power: 4}, {power: 5}, {power: 6}, {power: 7}, {power: 8}, {power: 9}, {power: 10}, {power: 11}, {power: 12}, {power: 13}];
    const res = interpolateValues(data);
    expect(res)
      .toEqual(target);
  });
});
