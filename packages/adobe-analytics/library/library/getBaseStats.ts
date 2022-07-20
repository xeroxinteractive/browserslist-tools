import { agents } from 'caniuse-lite';
import { Stats } from 'browserslist';

/**
 * Returns browserslist statistics data with all the %'s set to 0.
 *
 * @remarks
 * Uses caniuse-lite data get all the browsers/versions.
 * Inspired by https://github.com/browserslist/browserslist-ga/blob/89a0c2dbf173632938cb1a8de24f9c3a0f4dc876/src/caniuse-agent-data.js
 * @returns Browserslist statistics.
 */
export default function getBaseStats(): Stats {
  const baseStats: Stats = {};
  return Object.entries(agents).reduce((stats, [browser, agent]): Stats => {
    if (agent) {
      stats[browser] = Object.entries(agent.release_date)
        .sort((a, b) => {
          if (a[1] === b[1]) {
            return 0;
          } else if (typeof a[1] === 'undefined' || a[1] === null) {
            return 1;
          } else if (typeof b[1] === 'undefined' || b[1] === null) {
            return -1;
          } else if (typeof a[1] === 'string' || typeof b[1] === 'string') {
            return a[1].toString().localeCompare(b[1].toString());
          } else {
            return b[1] - a[1];
          }
        })
        .reduce((versions, [version]) => {
          versions[version] = 0;
          return versions;
        }, {} as { [version: string]: number });
    }
    return stats;
  }, baseStats);
}
