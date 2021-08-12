import { Capability, Browser, Options, ResponseError } from './types';
import { filter } from './helpers';
import fetch from 'node-fetch';

/**
 * Checks if a given capability appears in a list of browsers matched from browserslist queries.
 *
 * @param allSupportedBrowsers - A list of browsers matched from browserslist queries.
 * @param capability - A capability to check against the given list of supported browsers.
 * @returns Whether the capability matches a supported browser.
 */
export function matchCapability(
  allSupportedBrowsers: Browser[],
  capability: Capability
): boolean {
  for (const supported of allSupportedBrowsers) {
    if (
      supported.browser === capability.browser &&
      supported.browser_version === capability.browser_version
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Filters a given list of capabilities using the a list of supported browsers and include/exclude options.
 *
 * @param allCapabilities - A list of capabilities from BrowserStack's API.
 * @param allSupportedBrowsers - A list of browsers matched from browserslist queries.
 * @param options - The options to use when filtering capabilities.
 * @returns The given list of all capabilities filtered using the given supported browsers and options.
 */
export function filterCapabilities(
  allCapabilities: Capability[],
  allSupportedBrowsers: Browser[],
  options?: Options
): Capability[] {
  return allCapabilities.filter(
    (capability: Capability): boolean =>
      filter(capability.browser, options?.browsers) &&
      filter(capability.os, options?.operatingSystems) &&
      filter(capability.os_version, options?.operatingSystemVersion) &&
      filter(capability.device, options?.devices) &&
      matchCapability(allSupportedBrowsers, capability)
  );
}

/**
 * Gets a list of all possible capabilities for a given account.
 *
 * @param username - A BrowserStack account username to authenticate a BrowserStack REST API request.
 * @param accessKey - A BrowserStack account access key to authenticate a BrowserStack REST API request.
 * @returns The JSON response from the BrowserStack REST API Request.
 */
export async function getAllCapabilities(
  username: string,
  accessKey: string
): Promise<Capability[]> {
  const response = await fetch(
    `https://${username}:${accessKey}@api.browserstack.com/automate/browsers.json`
  );
  if (!response.ok) {
    throw new ResponseError(response.statusText, response.status);
  }
  return await response.json();
}
