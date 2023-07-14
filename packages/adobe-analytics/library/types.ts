import { JWTAuthConfig } from '@adobe/jwt-auth';
import moment from 'moment';

interface BaseBaseOptions
  extends Omit<JWTAuthConfig, 'metaScopes' | 'privateKey'> {
  privateKeyPath?: string;
  rsid: string;
  globalId: string;
  duration?: Parameters<typeof moment.duration>;
  from?: string;
  until?: string;
  limit?: number;
}

export type BaseOptionsWithPrivateKey = BaseBaseOptions & {
  privateKey: string;
};
export type BaseOptionsWithPrivateKeyPath = BaseBaseOptions & {
  privateKeyPath: string;
};

export type BaseOptions =
  | BaseOptionsWithPrivateKey
  | BaseOptionsWithPrivateKeyPath;

export type BaseOptionsCombined = BaseOptionsWithPrivateKey &
  BaseOptionsWithPrivateKeyPath;

/**
 * Type guard to check if we have a private key or private key path.
 *
 * @param options - Options object to check.
 * @returns Whether `privateKey` or `privateKeyPath` is present.
 */
export function hasPrivateKey(
  options: BaseOptions
): options is BaseOptionsWithPrivateKey {
  if ((options as BaseOptionsWithPrivateKey).privateKey) {
    return true;
  }
  return false;
}

export type WriteOptions = BaseOptions & {
  cwd?: string;
  filename?: string;
};

export interface RankedReportData {
  totalPages: number;
  firstPage: boolean;
  lastPage: boolean;
  numberOfElements: number;
  number: number;
  totalElements: number;
  message?: string;
  request?: Record<string, unknown>;
  columns: RankedColumnMetaData;
  rows: Row[];
  summaryData: RankedSummaryData;
}

export interface RankedColumnMetaData {
  dimension: ReportDimension;
  columnIds: string[];
  columnErrors?: RankedColumnError[];
}

export interface ReportDimension {
  id: string;
  type: ReportDimensionType;
}

export enum ReportDimensionType {
  STRING = 'string',
}

export interface RankedColumnError {
  columnId: string;
  errorCode:
    | 'unauthorized_metric'
    | 'unauthorized_dimension'
    | 'unauthorized_dimension_global'
    | 'anomaly_detection_failure_unexpected_item_count'
    | 'anomaly_detection_failure_tsa_service'
    | 'not_enabled_metric'
    | 'not_enabled_dimension'
    | 'not_enabled_dimension_global';
  errorId: string;
  errorDescription: string;
}

export interface Row {
  itemId: string;
  value?: string;
  data: number[];
}

export interface RankedSummaryData {
  filteredTotals: number[];
  totals: number[];
}

/**
 * Thrown if node-fetch response status is not >= 200 < 300.
 */
export class ResponseError extends Error {
  public status: number;
  /**
   * Creates a new ResponseError instance.
   *
   * @param statusText - The message returned by the server.
   * @param status - The HTTP status code returned by the server.
   */
  public constructor(statusText: string, status: number) {
    super(`${statusText} (${status})`);
    this.status = status;
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export interface RequestBody {
  rsid: string;
  globalFilters: AAFilter[];
  metricContainer: {
    metrics: AAMetric[];
  };
  dimension: string;
  settings: AASettings;
}

export type AAFilter = AADateFilter;

export interface AADateFilter {
  type: 'dateRange';
  dateRange: string;
}

export interface AAMetric {
  columnId: string;
  id: string;
}

export interface AASettings {
  countRepeatInstances: boolean;
  limit: number;
  page: number;
  nonesBehavior: 'return-nones';
}
