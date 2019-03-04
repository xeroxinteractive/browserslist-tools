jest.mock('node-fetch');

import * as modulerUnderTest from '../capabilities';
import {response as mockAllCapabilities} from '../__mocks__/browsers.json';
import {BrowserFilter} from '../types';

describe('filterCapabilities', () => {
    describe('include filtering', () => {
        for (const type of Object.values(BrowserFilter)) {
            test(type, async () => {
                const filtered = modulerUnderTest.filterCapabilities(mockAllCapabilities, [], {
                    browsers: {
                        include: [type]
                    }
                });
            
                expect(filtered.length).toBeGreaterThan(0);
                expect(filtered.every(({browser}) => browser === type));
            });
        }
        test('safari + ie', async () => {
            const filtered = modulerUnderTest.filterCapabilities(mockAllCapabilities, [], {
                browsers: {
                    include: [BrowserFilter.IE, BrowserFilter.Safari]
                }
            });
        
            expect(filtered.length).toBeGreaterThan(0);
            expect(filtered.some(({browser}) => browser === BrowserFilter.IE));
            expect(filtered.some(({browser}) => browser === BrowserFilter.Safari));
            expect(filtered.every(({browser}) => browser === BrowserFilter.Safari || browser === BrowserFilter.IE));
        });
    });
    describe('exclude filtering', () => {
        for (const type of Object.values(BrowserFilter)) {
            test(type, async () => {
                const filtered = modulerUnderTest.filterCapabilities(mockAllCapabilities, [], {
                    browsers: {
                        exclude: [type]
                    }
                });
            
                expect(filtered.length).toBeGreaterThan(0);
                expect(filtered.every(({browser}) => browser !== type));
            });
        }
        test('safari + ie', async () => {
            const filtered = modulerUnderTest.filterCapabilities(mockAllCapabilities, [], {
                browsers: {
                    exclude: [BrowserFilter.IE, BrowserFilter.Safari]
                }
            });
        
            expect(filtered.length).toBeGreaterThan(0);
            expect(filtered.every(({browser}) => browser !== BrowserFilter.Safari && browser !== BrowserFilter.IE));
        });
    });
    describe('include/exclude filtering', () => {
        test('safari + ie', async () => {
            const filtered = modulerUnderTest.filterCapabilities(mockAllCapabilities, [], {
                browsers: {
                    include: [BrowserFilter.IE, BrowserFilter.Safari],
                    exclude: [BrowserFilter.Safari, BrowserFilter.Chrome]
                }
            });
        
            expect(filtered.length).toBeGreaterThan(0);
            expect(filtered.every(({browser}) => browser === BrowserFilter.IE));
        });
    });
});

test('getAllCapabilities', async () => {
    await expect(modulerUnderTest.getAllCapabilities()).resolves.toMatchSnapshot();
});
