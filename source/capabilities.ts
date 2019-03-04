import {Capability, Browser, Options} from './types';
import {filter} from './helpers';
import fetch from 'node-fetch';

export function filterCapabilities(allCapabilities: Capability[], allSupportedBrowsers: Browser[], options?: Options): Capability[] {
    return allCapabilities.filter(({ os, browser, browser_version }) => filter(browser, options.browsers) && filter(os, options.operatingSystems));
}

export async function getAllCapabilities(username: string = process.env.BROWSER_STACK_USERNAME, accessKey: string = process.env.BROWSER_STACK_ACCESS_KEY): Promise<Capability[]> {
    const response = await fetch(`https://${username}:${accessKey}@api.browserstack.com/automate/browsers.json`);
    return await response.json();
}
