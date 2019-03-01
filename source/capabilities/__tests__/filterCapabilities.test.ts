import filterCapabilities from '../filterCapabilities';
import {response as mockAllCapabilities} from '../__mocks__/browsers.json';
import {BrowserFilter} from '../../types';

describe('basic filtering', () => {
    for (const type of Object.values(BrowserFilter)) {
        test(type, async () => {
            const filtered = filterCapabilities(mockAllCapabilities, [], {
                browsers: {
                    include: [type]
                }
            });
        
            expect(filtered.length).toBeGreaterThan(0);
            expect(filtered.every(({browser}) => browser === type));
        });
    }
});
