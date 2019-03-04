jest.mock('node-fetch');

import * as modulerUnderTest from '../capabilities';
import {response as mockAllCapabilities} from '../__mocks__/browsers.json';
import {BrowserFilter, Browser, Capability} from '../types';

const mockSupportedCapabilities: {[key: string]: Browser[]} = {
    [BrowserFilter.Chrome]: [
        {
            browser: 'chrome',
            browser_version: '48.0'
        },
        {
            browser: 'chrome',
            browser_version: '49.0'
        }
    ],
    [BrowserFilter.Edge]: [
        {
            browser: 'edge',
            browser_version: '17.0'
        },
        {
            browser: 'edge',
            browser_version: '18.0'
        }
    ],
    [BrowserFilter.Firefox]: [
        {
            browser: 'firefox',
            browser_version: '64.0'
        },
        {
            browser: 'firefox',
            browser_version: '65.0'
        }
    ],
    [BrowserFilter.IE]: [
        {
            browser: 'ie',
            browser_version: '10.0'
        },
        {
            browser: 'ie',
            browser_version: '11.0'
        }
    ],
    [BrowserFilter.Opera]: [
        {
            browser: 'opera',
            browser_version: '12.15'
        },
        {
            browser: 'opera',
            browser_version: '12.16'
        }
    ],
    [BrowserFilter.Safari]: [
        {
            browser: 'safari',
            browser_version: '11.0'
        },
        {
            browser: 'safari',
            browser_version: '12.0'
        }
    ]
};

function combine(...args: BrowserFilter[]) {
    const self = mockSupportedCapabilities[args.shift()];
    return self.concat.apply(self, args.map((filter) => mockSupportedCapabilities[filter]));
}

const mockAllSupportedCapabilities = combine.apply(null, Object.keys(mockSupportedCapabilities));

describe('filterCapabilities', () => {
    describe('include filtering', () => {
        for (const type of Object.values(BrowserFilter)) {
            test(type, async () => {
                const filtered = modulerUnderTest.filterCapabilities(mockAllCapabilities, mockSupportedCapabilities[type], {
                    browsers: {
                        include: [type]
                    },
                    browserslist: {
                        queries: type
                    }
                });
            
                expect(filtered.length).toBeGreaterThan(0);
                expect(filtered.every(({browser}) => browser === type));
            });
        }
        test('safari + ie', async () => {
            const filtered = modulerUnderTest.filterCapabilities(mockAllCapabilities, combine(BrowserFilter.Safari, BrowserFilter.IE), {
                browsers: {
                    include: [BrowserFilter.IE, BrowserFilter.Safari]
                },
                browserslist: {
                    queries: ['ie', 'safari']
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
                const filtered = modulerUnderTest.filterCapabilities(mockAllCapabilities, mockAllSupportedCapabilities, {
                    browsers: {
                        exclude: [type]
                    },
                    browserslist: {
                        queries: type
                    }
                });
            
                expect(filtered.length).toBeGreaterThan(0);
                expect(filtered.every(({browser}) => browser !== type));
            });
        }
        test('safari + ie', async () => {
            const filtered = modulerUnderTest.filterCapabilities(mockAllCapabilities, mockAllSupportedCapabilities, {
                browsers: {
                    exclude: [BrowserFilter.IE, BrowserFilter.Safari]
                },
                browserslist: {
                    queries: ['ie', 'safari']
                }
            });
        
            expect(filtered.length).toBeGreaterThan(0);
            expect(filtered.every(({browser}) => browser !== BrowserFilter.Safari && browser !== BrowserFilter.IE));
        });
    });
    describe('include/exclude filtering', () => {
        test('safari + ie', async () => {
            const filtered = modulerUnderTest.filterCapabilities(mockAllCapabilities, mockAllSupportedCapabilities, {
                browsers: {
                    include: [BrowserFilter.IE, BrowserFilter.Safari],
                    exclude: [BrowserFilter.Safari, BrowserFilter.Chrome]
                },
                browserslist: {
                    queries: ['ie', 'safari']
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

describe('matchCapability', () => {
    test('exact match', async() => {
        expect(modulerUnderTest.matchCapability(mockAllSupportedCapabilities, {
            browser: 'chrome',
            browser_version: '48.0',
            os: 'Windows',
            os_version: '10',
            device: null,
            real_mobile: null
        } as Capability)).toBe(true);
    });
    test('version mismatch', async() => {
        expect(modulerUnderTest.matchCapability(mockAllSupportedCapabilities, {
            browser: 'safari',
            browser_version: '5.0',
            os: 'OS X',
            os_version: 'Mojave',
            device: null,
            real_mobile: null
        } as Capability)).toBe(false);
    });
    test('wrong version format', async() => {
        expect(modulerUnderTest.matchCapability(mockAllSupportedCapabilities, {
            browser: 'ie',
            browser_version: '11',
            os: 'Windows',
            os_version: '7',
            device: null,
            real_mobile: null
        } as Capability)).toBe(false);
    });
});