jest.mock('node-fetch');

import * as modulerUnderTest from '../capabilities';
import { response as mockAllCapabilities } from '../__specs__/browsers.json';
import { BrowserFilter, Browser, Capability } from '../types';

const mockSupportedCapabilities: { [key: string]: Capability[] } = {
  [BrowserFilter.CHROME]: [
    {
      browser: 'chrome',
      device: null,
      browser_version: '48.0',
    },
    {
      browser: 'chrome',
      device: null,
      browser_version: '49.0',
    },
  ],
  [BrowserFilter.EDGE]: [
    {
      browser: 'edge',
      device: null,
      browser_version: '17.0',
    },
    {
      browser: 'edge',
      device: null,
      browser_version: '18.0',
    },
  ],
  [BrowserFilter.FIREFOX]: [
    {
      browser: 'firefox',
      device: null,
      browser_version: '64.0',
    },
    {
      browser: 'firefox',
      device: null,
      browser_version: '65.0',
    },
  ],
  [BrowserFilter.IE]: [
    {
      browser: 'ie',
      device: null,
      browser_version: '10.0',
    },
    {
      browser: 'ie',
      device: null,
      browser_version: '11.0',
    },
  ],
  [BrowserFilter.OPERA]: [
    {
      browser: 'opera',
      device: null,
      browser_version: '12.15',
    },
    {
      browser: 'opera',
      device: null,
      browser_version: '12.16',
    },
  ],
  [BrowserFilter.SAFARI]: [
    {
      browser: 'safari',
      device: null,
      browser_version: '12.1',
    },
    {
      browser: 'safari',
      device: null,
      browser_version: '13.0',
    },
  ],
  [BrowserFilter.IPHONE]: [
    {
      os: 'ios',
      os_version: '13',
      browser: 'iphone',
      device: 'iPhone XS',
      browser_version: null,
      real_mobile: true,
    },
  ],
  [BrowserFilter.IPAD]: [
    {
      os: 'ios',
      os_version: '13',
      browser: 'ipad',
      device: 'iPad Pro 12.9 2018',
      browser_version: null,
      real_mobile: true,
    },
  ],
  [BrowserFilter.ANDROID]: [
    {
      os: 'android',
      browser: 'android',
      device: 'Galaxy S20',
      browser_version: null,
      os_version: '10',
      real_mobile: true,
    },
  ],
};

function combine(first: BrowserFilter, ...args: BrowserFilter[]): Browser[] {
  const self = mockSupportedCapabilities[first];
  return self.concat(
    ...args.map((filter) => mockSupportedCapabilities[filter])
  );
}

const allSupportedCapabilityKeys = Object.keys(
  mockSupportedCapabilities
) as BrowserFilter[];
const [first, ...rest] = allSupportedCapabilityKeys;
const mockAllSupportedCapabilities = combine(first, ...rest);

describe('filterCapabilities', () => {
  describe('include filtering', () => {
    test.each(Object.values(BrowserFilter))('%s', async (type) => {
      const filtered = modulerUnderTest.filterCapabilities(
        mockAllCapabilities,
        mockSupportedCapabilities[type],
        {
          browsers: {
            include: [type],
          },
          browserslist: {
            queries: type,
          },
        }
      );
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every(({ browser }) => browser === type)).toBe(true);
    });

    test('safari + ie', async () => {
      const filtered = modulerUnderTest.filterCapabilities(
        mockAllCapabilities,
        combine(BrowserFilter.SAFARI, BrowserFilter.IE),
        {
          browsers: {
            include: [BrowserFilter.IE, BrowserFilter.SAFARI],
          },
          browserslist: {
            queries: ['ie', 'safari'],
          },
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
    test.each(Object.values(BrowserFilter))('%s', async (type) => {
      const filtered = modulerUnderTest.filterCapabilities(
        mockAllCapabilities,
        mockAllSupportedCapabilities,
        {
          browsers: {
            exclude: [type],
          },
          browserslist: {
            queries: type,
          },
        }
      );

      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every(({ browser }) => browser !== type)).toBe(true);
    });

    test('safari + ie', async () => {
      const filtered = modulerUnderTest.filterCapabilities(
        mockAllCapabilities,
        mockAllSupportedCapabilities,
        {
          browsers: {
            exclude: [BrowserFilter.IE, BrowserFilter.SAFARI],
          },
          browserslist: {
            queries: ['ie', 'safari'],
          },
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
            exclude: [BrowserFilter.SAFARI, BrowserFilter.CHROME],
          },
          browserslist: {
            queries: ['ie', 'safari'],
          },
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
    modulerUnderTest.getAllCapabilities('username', 'accessKey')
  ).resolves.toMatchSnapshot();
});

describe('matchCapability', () => {
  test('exact match', async () => {
    expect(
      modulerUnderTest.matchCapability(mockAllSupportedCapabilities, {
        browser: 'chrome',
        device: null,
        browser_version: '48.0',
        os: 'Windows',
        os_version: '10',
        real_mobile: null,
      })
    ).toBe(true);
  });
  test('version mismatch', async () => {
    expect(
      modulerUnderTest.matchCapability(mockAllSupportedCapabilities, {
        browser: 'safari',
        device: null,
        browser_version: '5.0',
        os: 'OS X',
        os_version: 'Mojave',
        real_mobile: null,
      })
    ).toBe(false);
  });
  test('wrong version format', async () => {
    expect(
      modulerUnderTest.matchCapability(mockAllSupportedCapabilities, {
        browser: 'ie',
        device: null,
        browser_version: '11',
        os: 'Windows',
        os_version: '7',
        real_mobile: null,
      })
    ).toBe(false);
  });
});
