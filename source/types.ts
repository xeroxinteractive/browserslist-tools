import { Options as BrowsersListOptions } from 'browserslist';

export type Queries = string | ReadonlyArray<string>;

export interface Filters<T> {
    include?: T[],
    exclude?: T[]
}

export interface Options {
    username?: string;
    accessKey?: string;
    browserslist: {
        queries?: Queries;
        opts?: BrowsersListOptions
    },
    browsers?: Filters<BrowserFilter>,
    operatingSystems?: Filters<OperatingSystemFilter>
}

export interface Browser {
    browser: string;
    browser_version: string;
}

export interface Capability extends Browser {
    os: string;
    os_version: string;
    browser_version: string | null;
    device: string | null;
    real_mobile: boolean | null;
}

export enum OperatingSystemFilter {
    WINDOWS = 'WINDOWS',
    OSX = 'OS X'
}

export enum BrowserFilter {
    Firefox = 'Firefox', Safari = 'Safari', IE = 'IE', Chrome = 'Chrome', Opera = 'Opera', Edge = 'Edge'
}