import transformAnalyticsResponse, {
  /*transfromAnalyticsResponse,*/ findVersion,
  getBrowserVersion,
  getLatestVersion,
} from '../transformAnalyticsResponse';
import { RankedReportData, ReportDimensionType } from '../../types';
import getBaseStats from '../getBaseStats';

describe('findVersion', () => {
  test('major', () => {
    expect(findVersion('8', ['8'])).toBe('8');
    expect(findVersion('8', ['8.0'])).toBe('8.0');
    expect(findVersion('8.0', ['8'])).toBe('8');
    expect(findVersion('8.0', ['8.0'])).toBe('8.0');
    expect(findVersion('8', ['9'])).toBeNull();
    expect(findVersion('8.0', ['9'])).toBeNull();
    expect(findVersion('8.0', ['9.0'])).toBeNull();
  });

  test('minor', () => {
    expect(findVersion('8.1', ['8.1'])).toBe('8.1');
    expect(findVersion('8.1', ['8'])).toBe('8');
    expect(findVersion('8', ['8.1'])).toBe('8.1');
    expect(findVersion('8.1', ['8.7'])).toBe('8.7');
  });

  test('patch', () => {
    expect(findVersion('8.2.1', ['8.2.1'])).toBe('8.2.1');
    expect(findVersion('8.2.1', ['8.2'])).toBe('8.2');
    expect(findVersion('8.2.1', ['8'])).toBe('8');
    expect(findVersion('8.2', ['8.2.1'])).toBe('8.2.1');
    expect(findVersion('8', ['8.2.1'])).toBe('8.2.1');
    expect(findVersion('8.2.2', ['8.2.1'])).toBe('8.2.1');
    expect(findVersion('8.3.5', ['8.6.2'])).toBe('8.6.2');
  });

  test('cascade', () => {
    expect(findVersion('8.2', ['8', '8.1', '8.2.1', '7.5', '7'])).toBe('8.2.1');
    expect(findVersion('8.1.1', ['8', '8.1', '8.2.1', '7.5', '7'])).toBe('8.1');
  });
});

describe('getBrowserVersion', () => {
  // More specific version matching is done in findVersion, this is just to test the regex matches all 3 levels.
  test('major version', () => {
    expect(
      getBrowserVersion('Google Chrome 70', { chrome: { '70': 0 } })
    ).toEqual({
      browser: 'chrome',
      version: '70',
    });
  });

  test('minor version', () => {
    expect(
      getBrowserVersion('Google Chrome 70.8', { chrome: { '70': 0 } })
    ).toEqual({
      browser: 'chrome',
      version: '70',
    });
  });

  test('patch version', () => {
    expect(
      getBrowserVersion('Google Chrome 70.1.54123', { chrome: { '70': 0 } })
    ).toEqual({
      browser: 'chrome',
      version: '70',
    });
  });

  test('unrecognized browser name', () => {
    expect(
      getBrowserVersion('Invalid 70', { chrome: { '70': 0 } })
    ).toBeUndefined();
  });

  test('(unknown version) chooses latest', () => {
    expect(
      getBrowserVersion('Opera (unknown version)', {
        opera: { '1': 1, '3': 3, '2': 2 },
      })
    ).toEqual({
      browser: 'opera',
      version: '3',
    });
  });

  test('no version chooses latest', () => {
    expect(
      getBrowserVersion('Safari', { safari: { '1': 1, '3': 3, '2': 2 } })
    ).toEqual({
      browser: 'safari',
      version: '3',
    });
  });

  test('safari 0.8.2 chooses latest', () => {
    expect(
      getBrowserVersion('Safari 0.8.2', { safari: { '1': 1, '3': 3, '2': 2 } })
    ).toEqual({
      browser: 'safari',
      version: '3',
    });
  });

  test('whitespace trimmed', () => {
    expect(
      getBrowserVersion(' Google Chrome  70    ', {
        chrome: { '70': 0, '71': 1 },
      })
    ).toEqual({
      browser: 'chrome',
      version: '70',
    });
  });

  test('whitespace trimmed when no version', () => {
    expect(
      getBrowserVersion(' Google Chrome    ', { chrome: { '70': 0 } })
    ).toEqual({
      browser: 'chrome',
      version: '70',
    });
  });

  test('only a version', () => {
    expect(getBrowserVersion('1.2.3', { chrome: { '70': 0 } })).toBeUndefined();
  });
});

describe('getLatestVersion', () => {
  test('gets the latest version', () => {
    expect(
      getLatestVersion({
        '1.4': 0,
        '1.1': 0,
        '1.2': 0,
        '1.4.3': 0,
        '1.2.8': 0,
        TP: 0,
      })
    ).toBe('1.4.3');
  });

  test('no versions', () => {
    expect(getLatestVersion({})).toBeUndefined();
  });
});

describe('transformAnalyticsResponse', () => {
  const baseResponse: Omit<RankedReportData, 'rows'> = {
    totalPages: 1,
    firstPage: true,
    lastPage: true,
    numberOfElements: 3,
    number: 3,
    totalElements: 3,
    columns: {
      dimension: {
        id: 'variables/browser',
        type: ReportDimensionType.STRING,
      },
      columnIds: ['0'],
    },
    summaryData: {
      filteredTotals: [30.0],
      totals: [30.0],
    },
  };
  const baseStats = getBaseStats();
  test('multiple with the same version', () => {
    expect(
      Math.round(
        transformAnalyticsResponse({
          ...baseResponse,
          rows: [
            {
              itemId: '1',
              value: 'Google Chrome 70.0',
              data: [5.0],
            },
            {
              itemId: '2',
              value: 'Yandex.Browser 70.3',
              data: [5.0],
            },
            {
              itemId: '3',
              value: 'Google Chrome 70.19.2',
              data: [5.0],
            },
          ],
        })['chrome']['70']
      )
    ).toBe(50);
  });

  test('data does not exist', () => {
    expect(
      transformAnalyticsResponse({
        ...baseResponse,
        rows: [
          {
            itemId: '1',
            value: 'Chrome 70.0',
            data: [],
          },
        ],
      })
    ).toEqual(baseStats);
  });

  test('value does not exist', () => {
    expect(
      transformAnalyticsResponse({
        ...baseResponse,
        rows: [
          {
            itemId: '1',
            data: [15.0],
          },
        ],
      })
    ).toEqual(baseStats);
  });

  test('no browsers', () => {
    expect(transformAnalyticsResponse({ ...baseResponse, rows: [] })).toEqual(
      baseStats
    );
  });

  test('no valid browsers', () => {
    expect(
      transformAnalyticsResponse({
        ...baseResponse,
        rows: [
          {
            itemId: '1',
            value: 'Invalid 70.0',
            data: [5.0],
          },
          {
            itemId: '2',
            value: 'What',
            data: [5.0],
          },
          {
            itemId: '3',
            value: '8.2',
            data: [2.0],
          },
        ],
      })
    ).toEqual(baseStats);
  });
});
