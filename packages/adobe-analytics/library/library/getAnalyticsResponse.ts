import authorize, { JWTAuthConfig } from '@adobe/jwt-auth';
import {
  BaseOptions,
  ResponseError,
  RankedReportData,
  hasPrivateKey,
} from '../types';
import fetch from 'node-fetch';
import getRequestBody from './getRequestBody';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

/**
 * Pulls browser data from Adobe Analytics.
 *
 * @param options - Adobe Analytics credential options.
 * @returns Browser data.
 */
export default async function getAnalyticsResponse(
  options: BaseOptions
): Promise<RankedReportData | undefined> {
  const privateKey =
    (hasPrivateKey(options) && options.privateKey) ||
    (options.privateKeyPath &&
      (await readFile(options.privateKeyPath))?.toString());
  if (!privateKey) {
    throw new Error(
      'Invalid private key either pass the raw key via `privateKey` or a path to it via `privateKeyPath`.'
    );
  }
  const config: JWTAuthConfig = {
    ...options,
    privateKey,
    metaScopes: ['ent_analytics_bulk_ingest_sdk'],
  };
  const { access_token } = await authorize(config);
  const response = await fetch(
    `https://analytics.adobe.io/api/${options.globalId}/reports`,
    {
      method: 'post',
      body: JSON.stringify(getRequestBody(options)),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
        'x-proxy-global-company-id': options.globalId,
        'x-api-key': options.clientId,
      },
    }
  );
  if (!response.ok) {
    throw new ResponseError(response.statusText, response.status);
  }
  return (await response.json()) as RankedReportData | undefined;
}
