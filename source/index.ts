import browserslist from 'browserslist';
import { Capability, Options, Browser } from './types';
import { getAllCapabilities, filterCapabilities } from './capabilities';

const defaultOptions: Options = {
  username: process.env.BROWSER_STACK_USERNAME,
  accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
  formatForSelenium: true,
};

/**
 * Gets a list of capabilities from BrowserStack's REST API filtered using browser and os options as well as browserslist queries.
 *
 * @param userOptions - The options specified by the user to use when getting capabilites.
 * @returns A list of filtered capabilities.
 */
export default async function getCapabilities(
  userOptions?: Options
): Promise<Capability[]> {
  const options: Options = {
    ...defaultOptions,
    ...userOptions,
  };
  const allCapabilities = await getAllCapabilities(
    options.username,
    options.accessKey
  );
  const allSupportedBrowsers = browserslist(
    options.browserslist.queries,
    options.browserslist.opts
  ).map(
    (browserString: string): Browser => {
      const [browser, browser_version] = browserString.split(' ');
      return {
        browser,
        browser_version:
          !browser_version.includes('.') && !isNaN(parseFloat(browser_version))
            ? `${browser_version}.0`
            : browser_version,
      };
    }
  );
  const capabilites = filterCapabilities(
    allCapabilities,
    allSupportedBrowsers,
    options
  );
  if (options.formatForSelenium) {
    return capabilites.map(
      (capability: Capability): Capability => ({
        browserName: capability.browser,
        browserVersion: capability.browser_version,
        ...capability,
      })
    );
  } else {
    return capabilites;
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
} from './types';
