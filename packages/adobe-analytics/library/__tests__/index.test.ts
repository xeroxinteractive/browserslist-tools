jest.mock('util');

import * as getAnalyticsResponse from '../library/getAnalyticsResponse';
import mockBrowserReport from '../__specs__/browser-report';
import mockOptions from '../__specs__/options';
import MockDate from 'mockdate';
import getBaseStats from '../library/getBaseStats';
import * as util from 'util';

const mockWriteFile = jest.fn();
jest.mocked(util).promisify.mockImplementation(() => mockWriteFile);

import { getBrowserslistStats, writeBrowserslistStats } from '../../index';

MockDate.set('2019-11-01T00:00:00.000');

const originalProcessCwd = process.cwd;
const mockProcessCwd = jest.fn(() => '/cwd/path');

beforeAll(() => {
  process.cwd = mockProcessCwd;
});

afterAll(() => {
  process.cwd = originalProcessCwd;
});

beforeEach(() => {
  jest.clearAllMocks();
});

jest
  .spyOn(getAnalyticsResponse, 'default')
  .mockImplementation(async () => mockBrowserReport);

describe('getBrowserslistStats', () => {
  test('default options', async () => {
    const result = await getBrowserslistStats(mockOptions);
    expect(result).toBeTruthy();
    expect(result).toMatchSnapshot();
    const total =
      result &&
      Object.values(result).reduce(
        (bTotal, browser) =>
          bTotal +
          Object.values(browser).reduce((vTotal, vPart) => vTotal + vPart, 0),
        0
      );
    expect(total).toBeLessThanOrEqual(100);
    expect(total).toBeGreaterThan(90);
  });
});

type GenericStats = {
  [browser: string]: {
    [version: string]: any;
  };
};

describe('writeBrowserslistStats', () => {
  let genericStats: GenericStats;
  beforeAll(() => {
    genericStats = Object.entries(getBaseStats()).reduce(
      (browsers, [key, value]) => {
        browsers[key] = Object.keys(value).reduce(
          (versions, cur) => {
            versions[cur] = expect.any(Number);
            return versions;
          },
          {} as { [version: string]: number }
        );
        return browsers;
      },
      {} as GenericStats
    );
  });

  test('default options', async () => {
    await writeBrowserslistStats(mockOptions);
    expect(mockWriteFile.mock.calls[0][0]).toBe(
      '/cwd/path/browserslist-stats.json'
    );
    expect(JSON.parse(mockWriteFile.mock.calls[0][1])).toEqual(genericStats);
  });

  test('cwd', async () => {
    await writeBrowserslistStats({ ...mockOptions, cwd: '/new/cwd' });
    expect(mockWriteFile.mock.calls[0][0]).toBe(
      '/new/cwd/browserslist-stats.json'
    );
    expect(JSON.parse(mockWriteFile.mock.calls[0][1])).toEqual(genericStats);
  });

  test('filename', async () => {
    await writeBrowserslistStats({ ...mockOptions, filename: '/stats.jsonc' });
    expect(mockWriteFile.mock.calls[0][0]).toBe('/cwd/path/stats.jsonc');
    expect(JSON.parse(mockWriteFile.mock.calls[0][1])).toEqual(genericStats);
  });

  test('cwd + filename', async () => {
    await writeBrowserslistStats({
      ...mockOptions,
      filename: '/stats.jsonc',
      cwd: '/new/cwd',
    });
    expect(mockWriteFile.mock.calls[0][0]).toBe('/new/cwd/stats.jsonc');
    expect(JSON.parse(mockWriteFile.mock.calls[0][1])).toEqual(genericStats);
  });
});
