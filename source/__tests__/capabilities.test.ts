jest.mock('node-fetch');

import * as modulerUnderTest from '../capabilities';
import { response as mockAllCapabilities } from '../__mocks__/browsers.json';
import { BrowserFilter, Browser } from '../types';

const mockSupportedCapabilities: { [key: string]: Browser[] } = {
  [BrowserFilter.CHROME]: [
    {
      browser: 'chrome',
      browser_version: '48.0'
    },
    {
      browser: 'chrome',
      browser_version: '49.0'
    }
  ],
  [BrowserFilter.EDGE]: [
    {
      browser: 'edge',
      browser_version: '17.0'
    },
    {
      browser: 'edge',
      browser_version: '18.0'
    }
  ],
  [BrowserFilter.FIREFOX]: [
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
  [BrowserFilter.OPERA]: [
    {
      browser: 'opera',
      browser_version: '12.15'
    },
    {
      browser: 'opera',
      browser_version: '12.16'
    }
  ],
  [BrowserFilter.SAFARI]: [
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

function combine(...args: BrowserFilter[]): Browser[] {
  const self = mockSupportedCapabilities[args.shift()];
  return self.concat.apply(
    self,
    args.map((filter) => mockSupportedCapabilities[filter])
  );
}

const mockAllSupportedCapabilities = combine.apply(
  null,
  Object.keys(mockSupportedCapabilities)
);

describe('filterCapabilities', () => {
  describe('include filtering', () => {
    for (const type of Object.values(BrowserFilter)) {
      test(type, async () => {
        const filtered = modulerUnderTest.filterCapabilities(
          mockAllCapabilities,
          mockSupportedCapabilities[type],
          {
            browsers: {
              include: [type]
            },
            browserslist: {
              queries: type
            }
          }
        );

        expect(filtered.length).toBeGreaterThan(0);
        expect(filtered.every(({ browser }) => browser === type)).toBe(true);
      });
    }
    test('safari + ie', async () => {
      const filtered = modulerUnderTest.filterCapabilities(
        mockAllCapabilities,
        combine(BrowserFilter.SAFARI, BrowserFilter.IE),
        {
          browsers: {
            include: [BrowserFilter.IE, BrowserFilter.SAFARI]
          },
          browserslist: {
            queries: ['ie', 'safari']
          }
        }
      );

      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.some(({ browser }) => browser === BrowserFilter.IE)).toBe(
        true
      );
      expect(
        filtered.some(({ browser }) => browser === BrowserFilter.SAFARI)
      ).toBe(true);
      expect(
        filtered.every(
          ({ browser }) =>
            browser === BrowserFilter.SAFARI || browser === BrowserFilter.IE
        )
      ).toBe(true);
    });
  });
  describe('exclude filtering', () => {
    for (const type of Object.values(BrowserFilter)) {
      test(type, async () => {
        const filtered = modulerUnderTest.filterCapabilities(
          mockAllCapabilities,
          mockAllSupportedCapabilities,
          {
            browsers: {
              exclude: [type]
            },
            browserslist: {
              queries: type
            }
          }
        );

        expect(filtered.length).toBeGreaterThan(0);
        expect(filtered.every(({ browser }) => browser !== type)).toBe(true);
      });
    }
    test('safari + ie', async () => {
      const filtered = modulerUnderTest.filterCapabilities(
        mockAllCapabilities,
        mockAllSupportedCapabilities,
        {
          browsers: {
            exclude: [BrowserFilter.IE, BrowserFilter.SAFARI]
          },
          browserslist: {
            queries: ['ie', 'safari']
          }
        }
      );

      expect(filtered.length).toBeGreaterThan(0);
      expect(
        filtered.every(
          ({ browser }) =>
            browser !== BrowserFilter.SAFARI && browser !== BrowserFilter.IE
        )
      ).toBe(true);
    });
  });
  describe('include/exclude filtering', () => {
    test('safari + ie', async () => {
      const filtered = modulerUnderTest.filterCapabilities(
        mockAllCapabilities,
        mockAllSupportedCapabilities,
        {
          browsers: {
            include: [BrowserFilter.IE, BrowserFilter.SAFARI],
            exclude: [BrowserFilter.SAFARI, BrowserFilter.CHROME]
          },
          browserslist: {
            queries: ['ie', 'safari']
          }
        }
      );

      expect(filtered.length).toBeGreaterThan(0);
      expect(
        filtered.every(({ browser }) => browser === BrowserFilter.IE)
      ).toBe(true);
    });
  });
});

test('getAllCapabilities', async () => {
  await expect(
    modulerUnderTest.getAllCapabilities()
  ).resolves.toMatchSnapshot();
});

describe('matchCapability', () => {
  test('exact match', async () => {
    expect(
      modulerUnderTest.matchCapability(mockAllSupportedCapabilities, {
        browser: 'chrome',
        browser_version: '48.0',
        os: 'Windows',
        os_version: '10',
        device: null,
        real_mobile: null
      })
    ).toBe(true);
  });
  test('version mismatch', async () => {
    expect(
      modulerUnderTest.matchCapability(mockAllSupportedCapabilities, {
        browser: 'safari',
        browser_version: '5.0',
        os: 'OS X',
        os_version: 'Mojave',
        device: null,
        real_mobile: null
      })
    ).toBe(false);
  });
  test('wrong version format', async () => {
    expect(
      modulerUnderTest.matchCapability(mockAllSupportedCapabilities, {
        browser: 'ie',
        browser_version: '11',
        os: 'Windows',
        os_version: '7',
        device: null,
        real_mobile: null
      })
    ).toBe(false);
  });
});
