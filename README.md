[![circleci status][circleci-badge]][circleci-link] [![npm package][npm-badge]][npm-link] [![license MIT][license-badge]][license] [![commit style angular][commit-style-badge]][commit-style-link] [![semantic-release][semantic-release-badge]][semantic-relase-link]

# browserslist-browserstack

Filter available BrowserStack capabilities with a browserslist query.

## Usage
1. Install the npm module:
```bash
yarn add browserslist-browserstack
# or
npm install browserslist-browserstack
```
2. Import it into your project:
```javascript
const getCapabilities = require('browserslist-browserstack').default;
// or
import getCapabilities from 'browserslist-browserstack';
```
3. Pass options to customize the list of capabilites. See [options](#Options) for more details:
```javascript
import { BrowserFilter, OperatingSystemFilter }, getCapabilities from 'browserslist-browserstack';

const capabilities = await getCapabilities({
  username: 'browserstack-username',
  accessKey: 'browserstack-accesskey',
  browsers: {
    include: [
      BrowserFilter.Firefox
    ]
  },
  operatingSystems: {
    exclude: [
      OperatingSystemFilter.OSX
    ]
  }
});
```

# Options
_Note: none of these options are required, by default `getCapabilities` will just return the list straight from BrowserStack's REST API provided `BROWSER_STACK_USERNAME` and `BROWSER_STACK_ACCESS_KEY` are set, and are valid._

| Option | Type | Description | Example | Default |
| --- | --- | --- | --- | --- |
| username | `String` | Your BrowserStack Username to use when requesting supported capabilities for your account. | `"username"` | `process.env.BROWSER_STACK_USERNAME` |
| accessKey | `String` | Your BrowserStack Access Key to use when requesting supported capabilities for your account. | `"xxxxxxxxxxxxxxxxxxxx"` | `process.env.BROWSER_STACK_ACCESS_KEY` |
| browserslist | `Object` | Options to pass to browserslist. See [browserslist options][browserslist-js-api]. | `{ queries: ['> 1%', 'IE 10'], options: { ignoreUnknownVersions: true } }` | `undefined` |
| browsers.include | `Array` | A list of [BrowserFilter's](#BrowserFilter) to include in the capabilities list. | `[BrowserFilter.FIREFOX, BrowserFilter.CHROME]` | `[]` |
| browsers.exclude | `Array` | A list of [BrowserFilter's](#BrowserFilter) to exclude in the capabilities list. | `[BrowserFilter.IE, BrowserFilter.EDGE]` | `[]` |
| operatingSystems.include | `Array` | A list of [OperatingSystemFilter's](#OperatingSystemFilter) to include in the capabilities list. | `[OperatingSystemFilter.WINDOWS]` | `[]` |
| operatingSystems.exclude | `Array` | A list of [OperatingSystemFilter's](#OperatingSystemFilter) to exclude in the capabilities list. | `[OperatingSystemFilter.OSX]` | `[]` |
| operatingSystemVersion.include | `Array` | A list of [operatingSystemVersion's](#operatingSystemVersion) to include in the capabilities list. | `[operatingSystemVersion.SEVEN, operatingSystemVersion.XP]` | `[]` |
| operatingSystemVersion.exclude | `Array` | A list of [operatingSystemVersion's](#operatingSystemVersion) to exclude in the capabilities list. | `[operatingSystemVersion.EL_CAPITAN, operatingSystemVersion.HIGH_SIERRA]` | `[]` |

# Types
These are the core types exported by `browserslist-browserstack`.
## BrowserFilter
An enum of browsers to filter capabilites, possible values:
* FIREFOX
* SAFARI
* IE
* CHROME
* OPERA
* EDGE

## OperatingSystemFilter
An enum of operating systems to filter capabilites, possible values:
* WINDOWS
* OSX

## WindowsOperatingSystemVersionFilter
An enum of windows versions to filter capabilities, possible values:
* XP
* SEVEN
* EIGHT
* EIGHT_ONE
* TEN

## OSXOperatingSystemVersionFilter
An enum of macOS versions to filter capabilities, possible values:
* SNOW_LEOPARD
* LION
* MOUNTAIN_LION
* MAVERICKS
* YOSEMITE
* EL_CAPITAN
* SIERRA
* HIGH_SIERRA
* MOJAVE

## Options
An interface to define the possible options to pass to `getCapabilities`. See [options](#Options).

## ResponseError
A custom error class which indicates errors caused if a node-fetch response is not in the range [200,300]. Mainly used to catch `401 Unauthorized` errors when trying to pull capabilities from BrowserStack's REST API.

## FetchError
For convinience, just fowards the class from [node-fetch][node-fetch-fetch-error].

## BrowsersListError
For convinience, just fowards the class from [browserslist][browserslist-error].

# Error Handling
If a request to BrowserStack's REST API encounters an issue you will either see a [ResponseError](#ResponseError), [FetchError](#FetchError) or [AbortError](#AbortError). If there is an issue parsing queries with browserslist you will see a [BrowsersListError](#BrowsersListError).

See [node-fetch docs][node-fetch-error-handling] and [browserslist docs][browserslist-repo] for more details.

---

[LICENSE][license] | [CHANGELOG][changelog] | [ISSUES][issues]

[license]: ./LICENSE
[changelog]: ./CHANGELOG.md
[issues]: https://github.com/xeroxinteractive/browserslist-browserstack/issues


[circleci-badge]: https://flat.badgen.net/circleci/github/xeroxinteractive/browserslist-browserstack
[circleci-link]: https://circleci.com/gh/xeroxinteractive/browserslist-browserstack/tree/master

[npm-badge]: https://flat.badgen.net/npm/v/browserslist-browserstack?color=cyan
[npm-link]: https://www.npmjs.com/package/browserslist-browserstack

[license-badge]: https://flat.badgen.net/npm/license/browserslist-browserstack

[commit-style-badge]: https://flat.badgen.net/badge/commit%20style/angular/purple
[commit-style-link]: https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines

[semantic-release-badge]: https://flat.badgen.net/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80/semantic%20release/e10079
[semantic-relase-link]: https://github.com/semantic-release/semantic-release


[browserslist-repo]: https://github.com/browserslist/browserslist
[browserslist-js-api]: https://github.com/browserslist/browserslist#js-api
[browserslist-error]: https://github.com/browserslist/browserslist/blob/master/error.js


[node-fetch-repo]: https://github.com/bitinn/node-fetch
[node-fetch-error-handling]: https://github.com/bitinn/node-fetch/blob/master/ERROR-HANDLING.md
[node-fetch-fetch-error]: https://github.com/bitinn/node-fetch/blob/master/src/fetch-error.js
