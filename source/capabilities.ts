import {Capability, Browser, Options} from './types';
import {filter} from './helpers';
import fetch from 'node-fetch';

export function matchCapability(allSupportedBrowsers: Browser[], capability: Capability): boolean {
    for (const supported of allSupportedBrowsers) {
        if (supported.browser === capability.browser && supported.browser_version === capability.browser_version) {
            return true;
        }
    }
    return false;
}

export function filterCapabilities(allCapabilities: Capability[], allSupportedBrowsers: Browser[], options?: Options): Capability[] {
    return allCapabilities.filter((capability) =>
        filter(capability.browser, options.browsers)
        && filter(capability.os, options.operatingSystems)
        && matchCapability(allSupportedBrowsers, capability)
    );
}

export async function getAllCapabilities(username: string = process.env.BROWSER_STACK_USERNAME, accessKey: string = process.env.BROWSER_STACK_ACCESS_KEY): Promise<Capability[]> {
    const response = await fetch(`https://${username}:${accessKey}@api.browserstack.com/automate/browsers.json`);
    return await response.json();
}
