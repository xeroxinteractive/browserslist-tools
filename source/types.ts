import { Options as BrowsersListOptions } from 'browserslist';
import BrowsersListError from 'browserslist/error';
import { FetchError } from 'node-fetch';

export { BrowsersListError, FetchError };

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

export type Queries = string | readonly string[];

export interface Filters<T> {
  include?: T[];
  exclude?: T[];
}

export interface Options {
  username?: string;
  accessKey?: string;
  browserslist?: {
    queries?: Queries;
    opts?: BrowsersListOptions;
  };
  browsers?: Filters<BrowserFilter>;
  operatingSystems?: Filters<OperatingSystemFilter>;
  operatingSystemVersion?: Filters<
    WindowsOperatingSystemVersionFilter | OSXOperatingSystemVersionFilter
  >;
  formatForSelenium?: boolean;
}

export interface Browser {
  browser: string;
  browser_version: string;
}

export interface Capability extends Browser {
  os: string;
  os_version: string;
  browser: string;
  browser_version: string | null;
  device: string | null;
  real_mobile: boolean | null;

  // selenium
  browserName?: string;
  browserVersion?: string;
}

export enum OperatingSystemFilter {
  WINDOWS = 'Windows',
  OSX = 'OS X'
}

export enum WindowsOperatingSystemVersionFilter {
  XP = 'XP',
  SEVEN = '7',
  EIGHT = '8',
  EIGHT_ONE = '8.1',
  TEN = '10'
}

export enum OSXOperatingSystemVersionFilter {
  SNOW_LEOPARD = 'Snow Leopard',
  LION = 'Lion',
  MOUNTAIN_LION = 'Mountain Lion',
  MAVERICKS = 'Mavericks',
  YOSEMITE = 'Yosemite',
  EL_CAPITAN = 'El Capitan',
  SIERRA = 'Sierra',
  HIGH_SIERRA = 'High Sierra',
  MOJAVE = 'Mojave'
}

export enum BrowserFilter {
  FIREFOX = 'firefox',
  SAFARI = 'safari',
  IE = 'ie',
  CHROME = 'chrome',
  OPERA = 'opera',
  EDGE = 'edge'
}
