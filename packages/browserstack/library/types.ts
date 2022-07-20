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
    | WindowsOperatingSystemVersionFilter
    | OSXOperatingSystemVersionFilter
    | iOSOperatingSystemVersionFilter
    | AndroidOperatingSystemVersionFilter
  >;
  devices?: Filters<DeviceFilter>;
  formatForSelenium?: boolean;
}

export interface Browser {
  browser: string;
  browser_version: string | null;
}

export interface Capability extends Browser {
  os?: string;
  os_version?: string;
  browser: string;
  browser_version: string | null;
  device?: string | null;
  real_mobile?: boolean | null;

  // selenium
  browserName?: string;
  browserVersion?: string;
}

export enum OperatingSystemFilter {
  WINDOWS = 'Windows',
  OSX = 'OS X',
  IOS = 'ios',
  ANDROID = 'android',
}

export enum WindowsOperatingSystemVersionFilter {
  XP = 'XP',
  SEVEN = '7',
  EIGHT = '8',
  EIGHT_ONE = '8.1',
  TEN = '10',
}

export enum iOSOperatingSystemVersionFilter {
  TEN = '10',
  ELEVEN = '11',
  TWELVE = '12',
  THIRTEEN = '13',
  FOURTEEN = '14',
}

export enum AndroidOperatingSystemVersionFilter {
  FOUR_FOUR = '4.4',
  FIVE = '5',
  FIXE_ONE = '5.1',
  SIX = '6',
  SEVEN = '7',
  SEVEN_ONE = '7.1',
  EIGHT = '8',
  EIGHT_ONE = '8.1',
  NINE = '9',
  TEN = '10',
  ELEVEN = '11',
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
  MOJAVE = 'Mojave',
  CATALINA = 'Catalina',
  BIG_SUR = 'Big Sur', // (MacOS still listed as OS X in BrowsersStack)
}

export enum BrowserFilter {
  FIREFOX = 'firefox',
  SAFARI = 'safari',
  IE = 'ie',
  CHROME = 'chrome',
  OPERA = 'opera',
  EDGE = 'edge',
  IPHONE = 'iphone',
  IPAD = 'ipad',
  ANDROID = 'android',
}

export enum DeviceFilter {
  IPHONE_XS = 'iPhone XS',
  IPHONE_12_PRO_MAX = 'iPhone 12 Pro Max',
  IPHONE_12_PRO = 'iPhone 12 Pro',
  IPHONE_12_MINI = 'iPhone 12 Mini',
  IPHONE_12 = 'iPhone 12',
  IPHONE_11_PRO_MAX = 'iPhone 11 Pro Max',
  IPHONE_11 = 'iPhone 11',
  IPHONE_11_PRO = 'iPhone 11 Pro',
  IPHONE_XS_MAX = 'iPhone XS Max',
  IPHONE_XR = 'iPhone XR',
  IPHONE_X = 'iPhone X',
  IPHONE_8 = 'iPhone 8',
  IPHONE_8_PLUS = 'iPhone 8 Plus',
  IPHONE_7 = 'iPhone 7',
  IPHONE_7_PLUS = 'iPhone 7 Plus',
  IPHONE_6S = 'iPhone 6S',
  IPHONE_6S_PLUS = 'iPhone 6S Plus',
  IPHONE_6 = 'iPhone 6',
  IPHONE_SE_2020 = 'iPhone SE 2020',
  IPHONE_SE = 'iPhone SE',
  IPAD_AIR_4 = 'iPad Air 4',
  IPAD_PRO_12_9_2021 = 'iPad Pro 12.9 2021',
  IPAD_PRO_12_9_2020 = 'iPad Pro 12.9 2020',
  IPAD_PRO_11_2021 = 'iPad Pro 11 2021',
  IPAD_8th = 'iPad 8th',
  IPAD_PRO_12_9_2018 = 'iPad Pro 12.9 2018',
  IPAD_PRO_11_2020 = 'iPad Pro 11 2020',
  IPAD_MINI_2019 = 'iPad Mini 2019',
  IPAD_AIR_2019 = 'iPad Air 2019',
  IPAD_7th = 'iPad 7th',
  IPAD_PRO_11_2018 = 'iPad Pro 11 2018',
  IPAD_PRO_9_7_2016 = 'iPad Pro 9.7 2016',
  IPAD_PRO_12_9_2017 = 'iPad Pro 12.9 2017',
  IPAD_MINI_4 = 'iPad Mini 4',
  IPAD_6th = 'iPad 6th',
  IPAD_5th = 'iPad 5th',
  GALAXY_S21_ULTRA = 'Galaxy S21 Ultra',
  GALAXY_S21 = 'Galaxy S21',
  GALAXY_S21_PLUS = 'Galaxy S21 Plus',
  GALAXY_S20 = 'Galaxy S20',
  GALAXY_S20_PLUS = 'Galaxy S20 Plus',
  GALAXY_S20_ULTRA = 'Galaxy S20 Ultra',
  GALAXY_NOTE_20_ULTRA = 'Galaxy Note 20 Ultra',
  GALAXY_NOTE_20 = 'Galaxy Note 20',
  GALAXY_A51 = 'Galaxy A51',
  GALAXY_A11 = 'Galaxy A11',
  GALAXY_S9_PLUS = 'Galaxy S9 Plus',
  GALAXY_S8_PLUS = 'Galaxy S8 Plus',
  GALAXY_S10e = 'Galaxy S10e',
  GALAXY_S10_PLUS = 'Galaxy S10 Plus',
  GALAXY_S10 = 'Galaxy S10',
  GALAXY_NOTE_10_PLUS = 'Galaxy Note 10 Plus',
  GALAXY_NOTE_10 = 'Galaxy Note 10',
  GALAXY_A10 = 'Galaxy A10',
  GALAXY_NOTE_9 = 'Galaxy Note 9',
  GALAXY_J7_Prime = 'Galaxy J7 Prime',
  GALAXY_S9 = 'Galaxy S9',
  GALAXY_NOTE_8 = 'Galaxy Note 8',
  GALAXY_A8 = 'Galaxy A8',
  GALAXY_S8 = 'Galaxy S8',
  GALAXY_S7 = 'Galaxy S7',
  GALAXY_S6 = 'Galaxy S6',
  GALAXY_NOTE_4 = 'Galaxy Note 4',
  GALAXY_TAB_S7 = 'Galaxy Tab S7',
  GALAXY_TAB_S6 = 'Galaxy Tab S6',
  GALAXY_TAB_S5e = 'Galaxy Tab S5e',
  GALAXY_TAB_S4 = 'Galaxy Tab S4',
  GALAXY_TAB_S3 = 'Galaxy Tab S3',
  GALAXY_TAB_4 = 'Galaxy Tab 4',
  PIXEL_5 = 'Pixel 5',
  PIXEL_4 = 'Pixel 4',
  PIXEL_4_XL = 'Pixel 4 XL',
  PIXEL_3 = 'Pixel 3',
  PIXEL_3a_XL = 'Pixel 3a XL',
  PIXEL_3a = 'Pixel 3a',
  PIXEL_3_XL = 'Pixel 3 XL',
  PIXEL_2 = 'Pixel 2',
  PIXEL = 'Pixel',
  NEXUS_6 = 'Nexus 6',
  NEXUS_5 = 'Nexus 5',
  NEXUS_9 = 'Nexus 9',
}
