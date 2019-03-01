import {Capability, Browser, Options} from '../types';
import {filter} from '../helpers';

export default function filterCapabilities(allCapabilities: Capability[], allSupportedBrowsers: Browser[], options?: Options): Capability[] {
    return allCapabilities.filter(({ os, browser, browser_version }) => filter(browser, options.browsers) && filter(os, options.operatingSystems));
}