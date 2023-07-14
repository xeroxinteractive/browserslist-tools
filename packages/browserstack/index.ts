import browserslist from 'browserslist';
import { Capability, Options, Browser } from './library/types';
import { getAllCapabilities, filterCapabilities } from './library/capabilities';

const defaultOptions: Options = {
  username: process.env['BROWSER_STACK_USERNAME'],
  accessKey: process.env['BROWSER_STACK_ACCESS_KEY'],
  formatForSelenium: true,
};

/**
 * Gets a list of capabilities from BrowserStack's REST API filtered using browser and os options as well as browserslist queries.
 *
 * @param userOptions - The options specified by the user to use when getting capabilities.
 * @returns A list of filtered capabilities.
 */
export default async function getCapabilities(
  userOptions?: Options
): Promise<Capability[]> {
  const options: Options = {
    ...defaultOptions,
    ...userOptions,
  };
  if (options.username && options.accessKey) {
    const allCapabilities = await getAllCapabilities(
      options.username,
      options.accessKey
    );
    const allSupportedBrowsers = browserslist(
      options.browserslist?.queries,
      options.browserslist?.opts
    ).map((browserString: string): Browser => {
      const [browser, browser_version] = browserString.split(' ');
      return {
        browser,
        browser_version:
          !browser_version.includes('.') && !isNaN(parseFloat(browser_version))
            ? `${browser_version}.0`
            : browser_version,
      };
    });
    const capabilities = filterCapabilities(
      allCapabilities,
      allSupportedBrowsers,
      options
    );
    if (options.formatForSelenium) {
      return capabilities.map(
        (capability: Capability): Capability => ({
          browserName: capability.browser,
          browserVersion: capability.browser_version ?? undefined,
          ...capability,
        })
      );
    } else {
      return capabilities;
    }
  } else {
    throw new TypeError(
      'Missing either `username` or `accessKey`. Pass it via the options object or environment variables (BROWSER_STACK_USERNAME, BROWSER_STACK_ACCESS_KEY)'
    );
  }
}

export {
  BrowserFilter,
  OperatingSystemFilter,
  WindowsOperatingSystemVersionFilter,
  OSXOperatingSystemVersionFilter,
  Options,
  BrowsersListError,
  FetchError,
  ResponseError,
} from './library/types';
