import * as browserslist from 'browserslist';
import {Capability, Options} from './types';
import { getAllCapabilities, filterCapabilities } from './capabilities';



export default async function getCapabilities(options?: Options): Promise<Capability[]> {
    const allCapabilities = await getAllCapabilities(options.username, options.accessKey);
    const allSupportedBrowsers = browserslist(options.browserslist.queries, options.browserslist.opts)
        .map((browserString) => {
            const [browser, browser_version] = browserString.split(' ');
            return {browser, browser_version};
        });

    return filterCapabilities(allCapabilities, allSupportedBrowsers, options);
}
