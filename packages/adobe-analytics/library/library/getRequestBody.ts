import { BaseOptions, RequestBody } from '../types';
import moment from 'moment';

export const defaultDuration = [3, 'months'];

/**
 * Formats the time options to a date range suitable for Adobe Analytics.
 *
 * @param options - Options to use for the date range.
 * @returns Formatted date range.
 */
export function getDateRange(options: BaseOptions): string {
  const { duration = defaultDuration, from, until } = options || {};
  let length = moment.duration(...duration);
  let start = from
    ? moment(from)
    : until
    ? moment(until).subtract(length)
    : undefined;
  let end = until ? moment(until) : from ? moment(from).add(length) : undefined;

  if (!length.isValid()) {
    length = moment.duration(...defaultDuration);
  }

  if (!start || !start.isValid() || !end || !end.isValid()) {
    start = moment().subtract(length);
    end = moment();
  }
  const dateRange = `${start.format('YYYY-MM-DDTHH:mm:ss.SSS')}/${end.format(
    'YYYY-MM-DDTHH:mm:ss.SSS'
  )}`;
  return dateRange;
}

/**
 * Gets the request body to send to the Adobe analytics API.
 *
 * @param options - Options to use for getting the analytics data.
 * @returns Request body.
 */
export default function getRequestBody(options: BaseOptions): RequestBody {
  const { rsid, limit = 50 } = options;

  return {
    rsid,
    globalFilters: [
      {
        type: 'dateRange',
        dateRange: getDateRange(options),
      },
    ],
    metricContainer: {
      metrics: [
        {
          columnId: '0',
          id: 'metrics/visitors',
        },
      ],
    },
    dimension: 'variables/browser',
    settings: {
      countRepeatInstances: true,
      limit,
      page: 0,
      nonesBehavior: 'return-nones',
    },
  };
}
