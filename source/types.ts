import { Options as BrowsersListOptions } from 'browserslist';

export type Queries = string | ReadonlyArray<string>;

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
