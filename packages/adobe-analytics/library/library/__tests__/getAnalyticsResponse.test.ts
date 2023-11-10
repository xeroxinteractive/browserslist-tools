jest.mock('util');

import nodeFetch, { Response } from 'node-fetch';
import authenticate from '@adobe/jwt-auth';
import mockBrowserReport from '../../__specs__/browser-report';
import mockOptions from '../../__specs__/options';
import * as util from 'util';
import MockDate from 'mockdate';
// eslint-disable-next-line jest/no-mocks-import
import { FetchError } from '../../__mocks__/node-fetch';
import { ResponseError } from '../../types';

const mockFetch = jest.mocked(nodeFetch, { shallow: true });
const mockAuthenticate = jest.mocked(authenticate, { shallow: true });
MockDate.set('2019-11-01T00:00:00.000');
const mockReadFile = jest.fn();
jest.mocked(util).promisify.mockImplementation(() => mockReadFile);

import getAnalyticsResponse from '../getAnalyticsResponse';

beforeEach(() => {
  jest.clearAllMocks();
});

test('normal behaviour', async () => {
  await expect(getAnalyticsResponse(mockOptions)).resolves.toEqual(
    mockBrowserReport
  );
  expect(mockFetch).toHaveBeenCalledTimes(1);
  expect(mockFetch.mock.calls[0]).toMatchSnapshot();
  expect(mockAuthenticate).toHaveBeenCalledTimes(1);
  expect(mockAuthenticate).toHaveBeenCalledWith({
    ...mockOptions,
    metaScopes: ['ent_analytics_bulk_ingest_sdk'],
  });
  expect(mockReadFile).not.toHaveBeenCalled();
});

test('HTTP error', async () => {
  mockFetch.mockImplementationOnce(
    async (): Promise<Response> =>
      ({
        json: async (): Promise<Response> => {
          return undefined as any;
        },
        ok: false,
        statusText: 'Forbidden',
        status: 403,
      }) as Partial<Response> as Response
  );
  await expect(getAnalyticsResponse(mockOptions)).rejects.toThrow(
    new ResponseError('Forbidden', 403)
  );
  expect(mockFetch).toHaveBeenCalledTimes(1);
  expect(mockAuthenticate).toHaveBeenCalledTimes(1);
  expect(mockAuthenticate).toHaveBeenCalledWith({
    ...mockOptions,
    metaScopes: ['ent_analytics_bulk_ingest_sdk'],
  });
  expect(mockReadFile).not.toHaveBeenCalled();
});

test('Fetch error', async () => {
  const mockFetchError = new FetchError('---message---', '---type---');
  mockFetch.mockImplementationOnce(
    async (): Promise<Response> =>
      ({
        json: async (): Promise<Response> => {
          throw mockFetchError;
        },
        ok: true,
      }) as Partial<Response> as Response
  );
  await expect(getAnalyticsResponse(mockOptions)).rejects.toThrow(
    mockFetchError
  );
  expect(mockFetch).toHaveBeenCalledTimes(1);
  expect(mockAuthenticate).toHaveBeenCalledTimes(1);
  expect(mockAuthenticate).toHaveBeenCalledWith({
    ...mockOptions,
    metaScopes: ['ent_analytics_bulk_ingest_sdk'],
  });
  expect(mockReadFile).not.toHaveBeenCalled();
});

test('private key from file', async () => {
  mockReadFile.mockImplementationOnce(() => {
    return '---private-key-from-file---';
  });
  await expect(
    getAnalyticsResponse({
      ...mockOptions,
      privateKey: undefined,
      privateKeyPath: '/path/to/private.key',
    })
  ).resolves.toEqual(mockBrowserReport);
  expect(mockFetch).toHaveBeenCalledTimes(1);
  expect(mockFetch.mock.calls[0]).toMatchSnapshot();
  expect(mockAuthenticate).toHaveBeenCalledTimes(1);
  expect(mockAuthenticate).toHaveBeenCalledWith({
    ...mockOptions,
    privateKey: '---private-key-from-file---',
    privateKeyPath: '/path/to/private.key',
    metaScopes: ['ent_analytics_bulk_ingest_sdk'],
  });
  expect(mockReadFile).toHaveBeenCalledTimes(1);
});

test('no private key', async () => {
  await expect(
    getAnalyticsResponse({
      ...mockOptions,
      privateKey: undefined,
      privateKeyPath: '/path/to/private.key',
    })
  ).rejects.toThrow(
    new Error(
      'Invalid private key either pass the raw key via `privateKey` or a path to it via `privateKeyPath`.'
    )
  );
  expect(mockFetch).not.toHaveBeenCalled();
  expect(mockAuthenticate).not.toHaveBeenCalled();
  expect(mockReadFile).toHaveBeenCalledTimes(1);
});

test('no private or private key path', async () => {
  await expect(
    getAnalyticsResponse({
      ...mockOptions,
      privateKey: undefined,
    } as any)
  ).rejects.toThrow(
    new Error(
      'Invalid private key either pass the raw key via `privateKey` or a path to it via `privateKeyPath`.'
    )
  );
  expect(mockFetch).not.toHaveBeenCalled();
  expect(mockAuthenticate).not.toHaveBeenCalled();
  expect(mockReadFile).not.toHaveBeenCalled();
});
