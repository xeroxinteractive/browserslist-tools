import { RankedReportData } from '../types';
import { Stats } from 'browserslist';
import getBaseStats from './getBaseStats';
import semver from 'semver';

const browserVersionRegex = /(?:(^\D+?)$|(^\D+?)((?:\d{1,16}\.?){1,3}\s*$))/;

const adobeBrowserslistBrowserMap: { [name: string]: string } = {
  'Google Chrome': 'chrome',
  'Mozilla Firefox': 'firefox',
  'Microsoft Internet Explorer': 'ie',
  'Microsoft Edge': 'edge',
  Safari: 'safari',
  'Chrome Mobile': 'and_chr',
  'Yandex.Browser': 'chrome',
  'Samsung Browser': 'samsung',
  Opera: 'opera',
  'Mobile Safari': 'ios_saf',
  'UC Browser': 'and_uc',
  'Opera Mobile': 'op_mob',
  QQBrowser: 'and_qq',
  'Coc Coc Browser': 'chrome',
  'Internet Explorer Mobile': 'ie_mob',
  'Opera Mini': 'op_mini',
  'BlackBerry Browser': 'bb',
  'MQQ Browser': 'and_qq',
};

/**
 * Finds the browserslist version that best matches the given version.
 *
 * @remarks
 * Deliberately returns null to signify an invalid version rather than a non existing one.
 *
 * @param version - The version to check for.
 * @param possibleVersions - The browserslist base versions to check against.
 * @returns Matched version or null.
 */
export function findVersion(
  version: string,
  possibleVersions: string[]
): string | null {
  const semvers = possibleVersions
    .map((possible) => possible.split('-').join(' - '))
    .reverse();
  for (const current of semvers) {
    // This is kind of confusing to understand, but we try match the semver version
    // both ways around to may the match more fuzzy. This is not technically accurate
    // i.e: version 8.2.1 could match to version 8 but we don't want to lose data
    // So we match loosely.
    const satisfies =
      semver.satisfies(semver.coerce(version) ?? version, current) ||
      semver.satisfies(semver.coerce(current) ?? current, `~${version}`);
    if (satisfies) {
      return current.split(' - ').join('-');
    }
  }
  // If we don't find a version try fallback to minor/major version.
  // This allows use to match things like 8.2.2 -> 8.2.1, which again is
  // not technically accurate but we are trying to find the closest value.
  const cascade = version.split('.').slice(0, -1).join('.');
  if (cascade) {
    return findVersion(cascade, possibleVersions);
  }
  return null;
}

/**
 * Get the latest version of a browser.
 *
 * @param browser - Version to release data mapping for a browser.
 * @returns Latest version or undefined.
 */
export function getLatestVersion(browser: {
  [version: string]: number;
}): string | undefined {
  return Object.keys(browser).sort((a, b) => {
    const versionA = semver.coerce(a);
    const versionB = semver.coerce(b);
    if (!versionB || (versionA && semver.gt(versionA, versionB))) {
      return -1;
    } else if (!versionA || (versionB && semver.lt(versionA, versionB))) {
      return 1;
    }
    return 0;
  })[0];
}

/**
 * Extracts the browser name and version from a given string.
 *
 * @param raw - Raw broweser/version string.
 * @param allStats - All possible stats.
 * @returns Extracted browser and version.
 */
export function getBrowserVersion(
  raw: string,
  allStats: Stats
): { browser: string; version?: string } | undefined {
  let match;
  if ((match = browserVersionRegex.exec(raw)) !== null) {
    let [, browser1, browser2, version]: (string | undefined | null)[] = match;
    let browser: string | undefined = browser2 || browser1;
    if (browser) {
      // Strip (unkown version) from browser if it exists.
      if (browser.includes('(unknown version)')) {
        browser = browser.replace('(unknown version)', '');
        version = undefined;
      }
      // Make sure they are not empty strings.
      browser = browser.trim() || undefined;
      version = version?.trim() || undefined;
      if (browser) {
        // Map to browserslist equivalent.
        browser = adobeBrowserslistBrowserMap[browser];
        if (browser && allStats.hasOwnProperty(browser)) {
          // Safari 0.8.2 use latest.
          // https://helpx.adobe.com/uk/analytics/kb/Why-is-latest-version-of-Safari-reported-as-0-8-2-Adobe-Analytics.html
          if (browser === 'safari' && version === '0.8.2') {
            version = getLatestVersion(allStats[browser]);
          } else if (version) {
            // try match the version to the browserslist base versions.
            version = findVersion(version, Object.keys(allStats[browser]));
          }
          // No version use latest
          if (!version) {
            version = getLatestVersion(allStats[browser]);
          }

          // null signifies we have a version but it does not map to browserslist base versions.
          // so ignore it.
          if (version !== null) {
            return {
              browser,
              version,
            };
          }
        }
      }
    }
  }
  return undefined;
}

/**
 * Transforms analytics data to the browserslist statistics format.
 *
 * @param response - The response from Adobe Analytics.
 * @returns Browserslist statistics data.
 */
export default function transformAnalyticsResponse(
  response: RankedReportData
): Stats {
  const total = response.summaryData.filteredTotals[0];
  return response.rows.reduce((acc, cur): Stats => {
    const views = cur.data?.[0];
    if (cur.value && views) {
      const { browser, version } = getBrowserVersion(cur.value, acc) || {};
      if (browser && version) {
        acc[browser][version] += (views / total) * 100;
      }
    }
    return acc;
  }, getBaseStats());
}
