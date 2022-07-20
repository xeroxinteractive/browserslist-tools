import getRequestBody, { getDateRange } from '../getRequestBody';
import mockOptions from '../../__specs__/options';
import MockDate from 'mockdate';

MockDate.set('2019-11-01T00:00:00.000');

describe('getDateRange', () => {
  test('default', () => {
    expect(getDateRange(mockOptions)).toBe(
      '2019-08-01T00:00:00.000/2019-11-01T00:00:00.000'
    );
  });

  test('duration number, string', () => {
    expect(getDateRange({ ...mockOptions, duration: [2, 'weeks'] })).toBe(
      '2019-10-18T00:00:00.000/2019-11-01T00:00:00.000'
    );
  });

  test('duration number', () => {
    expect(
      getDateRange({ ...mockOptions, duration: [1000 * 60 * 60 * 24] })
    ).toBe('2019-10-31T00:00:00.000/2019-11-01T00:00:00.000');
  });

  test('duration string', () => {
    expect(getDateRange({ ...mockOptions, duration: ['36:00'] })).toBe(
      '2019-10-30T12:00:00.000/2019-11-01T00:00:00.000'
    );
  });

  test('duration ISO 8601', () => {
    expect(getDateRange({ ...mockOptions, duration: ['P1Y'] })).toBe(
      '2018-11-01T00:00:00.000/2019-11-01T00:00:00.000'
    );
  });

  test('duration object', () => {
    expect(
      getDateRange({
        ...mockOptions,
        duration: [
          {
            days: 2,
            weeks: 1,
          },
        ],
      })
    ).toBe('2019-10-23T00:00:00.000/2019-11-01T00:00:00.000');
  });

  test('duration invalid', () => {
    expect(
      getDateRange({
        ...mockOptions,
        duration: [NaN],
      })
    ).toBe('2019-08-01T00:00:00.000/2019-11-01T00:00:00.000');
  });
});

describe('getRequestBody', () => {
  test('default', () => {
    expect(getRequestBody(mockOptions)).toMatchSnapshot();
  });

  test('limit', () => {
    expect(getRequestBody({ ...mockOptions, limit: 10 })).toEqual(
      expect.objectContaining({
        settings: expect.objectContaining({
          limit: 10,
        }),
      })
    );
  });

  test('time', () => {
    expect(getRequestBody({ ...mockOptions, duration: [1, 'month'] })).toEqual(
      expect.objectContaining({
        globalFilters: [
          {
            type: 'dateRange',
            dateRange: '2019-10-01T00:00:00.000/2019-11-01T00:00:00.000',
          },
        ],
      })
    );
  });
});
