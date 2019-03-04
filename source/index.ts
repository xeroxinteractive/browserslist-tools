import browserslist from 'browserslist';
import {Capability, Options} from './types';
import { getAllCapabilities, filterCapabilities } from './capabilities';

export default async function getCapabilities(options?: Options): Promise<Capability[]> {
    const allCapabilities = await getAllCapabilities(options.username, options.accessKey);
    const allSupportedBrowsers = browserslist(options.browserslist.queries, options.browserslist.opts)
    .map((browserString: string) => {
        const [browser, browser_version] = browserString.split(' ');
        return {browser, browser_version: (!browser_version.includes('.') && !isNaN(parseFloat(browser_version))) ? `${browser_version}.0` : browser_version};
    });
    
    return filterCapabilities(allCapabilities, allSupportedBrowsers, options);
}

export { BrowserFilter, OperatingSystemFilter, Options } from './types';
