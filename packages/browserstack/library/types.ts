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
  ELEVEN = '11',
}

export enum iOSOperatingSystemVersionFilter {
  TEN = '10',
  ELEVEN = '11',
  TWELVE = '12',
  THIRTEEN = '13',
  FOURTEEN = '14',
  FIFTEEN = '15',
  SIXTEEN = '16',
  SIXTEEN_THREE = '16.3',
  SIXTEEN_FOUR = '16.4',
  SIXTEEN_FIVE = '16.5',
}

export enum AndroidOperatingSystemVersionFilter {
  FOUR_FOUR = '4.4',
  FIVE = '5',
  FIVE_ONE = '5.1',
  SIX = '6',
  SEVEN = '7',
  SEVEN_ONE = '7.1',
  EIGHT = '8',
  EIGHT_ONE = '8.1',
  NINE = '9',
  TEN = '10',
  ELEVEN = '11',
  TWELVE = '12',
  THIRTEEN = '13',
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
  BIG_SUR = 'Big Sur',
  MONTEREY = 'Monterey',
  VENTURA = 'Ventura',
}

export enum BrowserFilter {
  FIREFOX = 'firefox',
  SAFARI = 'safari',
  IE = 'ie',
  CHROME = 'chrome',
  OPERA = 'opera',
  EDGE = 'edge',
  YANDEX = 'yandex',
  IPHONE = 'iphone',
  IPAD = 'ipad',
  ANDROID = 'android',
}

export enum DeviceFilter {
  GALAXY_A10 = 'Galaxy A10',
  GALAXY_A11 = 'Galaxy A11',
  GALAXY_A51 = 'Galaxy A51',
  GALAXY_A52 = 'Galaxy A52',
  GALAXY_A8 = 'Galaxy A8',
  GALAXY_J7_PRIME = 'Galaxy J7 Prime',
  GALAXY_M32 = 'Galaxy M32',
  GALAXY_M52 = 'Galaxy M52',
  GALAXY_NOTE_10 = 'Galaxy Note 10',
  GALAXY_NOTE_10_PLUS = 'Galaxy Note 10+',
  GALAXY_NOTE_20 = 'Galaxy Note 20',
  GALAXY_NOTE_20_ULTRA = 'Galaxy Note 20 Ultra',
  GALAXY_NOTE_8 = 'Galaxy Note 8',
  GALAXY_S10 = 'Galaxy S10',
  GALAXY_S10_PLUS = 'Galaxy S10+',
  GALAXY_S10E = 'Galaxy S10e',
  GALAXY_S20 = 'Galaxy S20',
  GALAXY_S20_PLUS = 'Galaxy S20+',
  GALAXY_S20_ULTRA = 'Galaxy S20 Ultra',
  GALAXY_S21 = 'Galaxy S21',
  GALAXY_S21_PLUS = 'Galaxy S21+',
  GALAXY_S21_ULTRA = 'Galaxy S21 Ultra',
  GALAXY_S22 = 'Galaxy S22',
  GALAXY_S22_PLUS = 'Galaxy S22+',
  GALAXY_S22_ULTRA = 'Galaxy S22 Ultra',
  GALAXY_S23 = 'Galaxy S23',
  GALAXY_S23_ULTRA = 'Galaxy S23 Ultra',
  GALAXY_S8 = 'Galaxy S8',
  GALAXY_S9 = 'Galaxy S9',
  GALAXY_S9_PLUS = 'Galaxy S9+',
  GALAXY_TAB_S5E = 'Galaxy Tab S5e',
  GALAXY_TAB_S6 = 'Galaxy Tab S6',
  GALAXY_TAB_S7 = 'Galaxy Tab S7',
  GALAXY_TAB_S8 = 'Galaxy Tab S8',
  HUAWEI_P30 = 'Huawei P30',
  IPAD_10TH = 'iPad 10th',
  IPAD_5TH = 'iPad 5th',
  IPAD_6TH = 'iPad 6th',
  IPAD_7TH = 'iPad 7th',
  IPAD_8TH = 'iPad 8th',
  IPAD_9TH = 'iPad 9th',
  IPAD_AIR_2 = 'iPad Air 2',
  IPAD_AIR_2019 = 'iPad Air 2019',
  IPAD_AIR_4 = 'iPad Air 4',
  IPAD_AIR_5 = 'iPad Air 5',
  IPAD_MINI_2019 = 'iPad Mini 2019',
  IPAD_MINI_2021 = 'iPad Mini 2021',
  IPAD_MINI_3 = 'iPad Mini 3',
  IPAD_MINI_4 = 'iPad Mini 4',
  IPAD_PRO_11_2018 = 'iPad Pro 11 2018',
  IPAD_PRO_11_2020 = 'iPad Pro 11 2020',
  IPAD_PRO_11_2021 = 'iPad Pro 11 2021',
  IPAD_PRO_11_2022 = 'iPad Pro 11 2022',
  IPAD_PRO_12_9 = 'iPad Pro 12.9',
  IPAD_PRO_12_9_2018 = 'iPad Pro 12.9 2018',
  IPAD_PRO_12_9_2020 = 'iPad Pro 12.9 2020',
  IPAD_PRO_12_9_2021 = 'iPad Pro 12.9 2021',
  IPAD_PRO_12_9_2022 = 'iPad Pro 12.9 2022',
  IPAD_PRO_9_7_2016 = 'iPad Pro 9.7 2016',
  IPHONE_11 = 'iPhone 11',
  IPHONE_11_PRO = 'iPhone 11 Pro',
  IPHONE_11_PRO_MAX = 'iPhone 11 Pro Max',
  IPHONE_12 = 'iPhone 12',
  IPHONE_12_MINI = 'iPhone 12 Mini',
  IPHONE_12_PRO = 'iPhone 12 Pro',
  IPHONE_12_PRO_MAX = 'iPhone 12 Pro Max',
  IPHONE_13 = 'iPhone 13',
  IPHONE_13_MINI = 'iPhone 13 Mini',
  IPHONE_13_PRO = 'iPhone 13 Pro',
  IPHONE_13_PRO_MAX = 'iPhone 13 Pro Max',
  IPHONE_14 = 'iPhone 14',
  IPHONE_14_PLUS = 'iPhone 14 Plus',
  IPHONE_14_PRO = 'iPhone 14 Pro',
  IPHONE_14_PRO_MAX = 'iPhone 14 Pro Max',
  IPHONE_6 = 'iPhone 6',
  IPHONE_6_PLUS = 'iPhone 6 Plus',
  IPHONE_6S = 'iPhone 6S',
  IPHONE_6S_PLUS = 'iPhone 6S Plus',
  IPHONE_7 = 'iPhone 7',
  IPHONE_8 = 'iPhone 8',
  IPHONE_8_PLUS = 'iPhone 8 Plus',
  IPHONE_SE = 'iPhone SE',
  IPHONE_SE_2020 = 'iPhone SE 2020',
  IPHONE_X = 'iPhone X',
  IPHONE_XR = 'iPhone XR',
  IPHONE_XS = 'iPhone XS',
  IPHONE_XS_MAX = 'iPhone XS Max',
  MOTO_G7_PLAY = 'Moto G7 Play',
  MOTO_G71_5G = 'Moto G71 5G',
  MOTO_G9_PLAY = 'Moto G9 Play',
  ONEPLUS_11R = 'OnePlus 11R',
  ONEPLUS_6T = 'OnePlus 6T',
  ONEPLUS_7 = 'OnePlus 7',
  ONEPLUS_7T = 'OnePlus 7T',
  ONEPLUS_8 = 'OnePlus 8',
  ONEPLUS_9 = 'OnePlus 9',
  OPPO_A78 = 'Oppo A78',
  OPPO_A96 = 'Oppo A96',
  OPPO_RENO_3_PRO = 'Oppo Reno 3 Pro',
  OPPO_RENO_6 = 'Oppo Reno 6',
  PIXEL_2 = 'Pixel 2',
  PIXEL_3_XL = 'Pixel 3 XL',
  PIXEL_3A = 'Pixel 3a',
  PIXEL_3A_XL = 'Pixel 3a XL',
  PIXEL_4 = 'Pixel 4',
  PIXEL_4_XL = 'Pixel 4 XL',
  PIXEL_5 = 'Pixel 5',
  PIXEL_6 = 'Pixel 6',
  PIXEL_6_PRO = 'Pixel 6 Pro',
  PIXEL_7 = 'Pixel 7',
  PIXEL_7_PRO = 'Pixel 7 Pro',
  REALME_8 = 'Realme 8',
  REDMI_NOTE_11 = 'Redmi Note 11',
  REDMI_NOTE_12_PRO = 'Redmi Note 12 Pro',
  REDMI_NOTE_8 = 'Redmi Note 8',
  REDMI_NOTE_9 = 'Redmi Note 9',
  VIVO_V21 = 'Vivo V21',
  VIVO_Y15 = 'Vivo Y15',
  VIVO_Y21 = 'Vivo Y21',
  VIVO_Y22 = 'Vivo Y22',
  VIVO_Y50 = 'Y50',
}
