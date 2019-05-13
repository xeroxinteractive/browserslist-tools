# browserslist-browserstack

> Run BrowserStack tests for all browsers in project’s [Browserslist][browserslist-repo] config (with additional include/exclude filters).

[![circleci status][circleci-badge]][circleci-link] [![npm package][npm-badge]][npm-link] [![license MIT][license-badge]][license] [![commit style angular][commit-style-badge]][commit-style-link] [![semantic-release][semantic-release-badge]][semantic-release-link]

## Setup
__Important Note: In order to use this package a BrowserStack account with a valid Automate plan is required, a free trial is available.__

browserslist-browserstack is an npm module, so getting things up and running is simple.
1. Install the npm module:
```bash
yarn add browserslist-browserstack --dev
# or
npm install browserslist-browserstack --save-dev
```
2. Import it into a project (e.g. `browserstack.test.js` or whatever convention your testing suite uses):
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

## Example
The main use case for using browserslist-browserstack is to test websites across a number of different browsers and operating systems, without having to manually specify them or update them everytime a new browser version is released. The example below shows a minimal use-case using selenium-webdriver to run integration tests for https://www.google.com on BrowserStack's Automate platform. This code would likely be included as part of a testing suite like [Jest][jest-link] or [Mocha][mocha-link], and perform some relevant assertions like detecting JS errors on a webpage for different browsers.
[![minimal example][minimal-example-image]][minimal-example-link]
[View the source code][minimal-example-link]

Running the above code, providing valid `BROWSER_STACK_KEY` and `BROWSER_STACK_KEY` environment variable are set, would result in the following 3 tests being run on BrowserStack (browser versions will change as new ones are released, but should always be the latest):

![BrowserStack Interface][browserstack-image]

## Options
_Note: none of these options are required, by default `getCapabilities` will just return the list straight from BrowserStack's REST API provided `BROWSER_STACK_USERNAME` and `BROWSER_STACK_ACCESS_KEY` are set, and are valid._

| Option | Type | Description | Example | Default |
| --- | --- | --- | --- | --- |
| username | `String` | A BrowserStack Username to use when requesting supported capabilities for an account. | `"username"` | `process.env.BROWSER_STACK_USERNAME` |
| accessKey | `String` | A BrowserStack Access Key to use when requesting supported capabilities for an account. | `"xxxxxxxxxxxxxxxxxxxx"` | `process.env.BROWSER_STACK_ACCESS_KEY` |
| browserslist | `Object` | Options to pass to Browserslist. See [Browserslist options][browserslist-js-api]. | `{ queries: ['> 1%', 'IE 10'], options: { ignoreUnknownVersions: true } }` | `undefined` |
| browsers.include | `Array` | A list of [BrowserFilter's](#BrowserFilter) to include in the capabilities list. | `[BrowserFilter.FIREFOX, BrowserFilter.CHROME]` | `[]` |
| browsers.exclude | `Array` | A list of [BrowserFilter's](#BrowserFilter) to exclude in the capabilities list. | `[BrowserFilter.IE, BrowserFilter.EDGE]` | `[]` |
| operatingSystems.include | `Array` | A list of [OperatingSystemFilter's](#OperatingSystemFilter) to include in the capabilities list. | `[OperatingSystemFilter.WINDOWS]` | `[]` |
| operatingSystems.exclude | `Array` | A list of [OperatingSystemFilter's](#OperatingSystemFilter) to exclude in the capabilities list. | `[OperatingSystemFilter.OSX]` | `[]` |
| operatingSystemVersion.include | `Array` | A list of [operatingSystemVersion's](#operatingSystemVersion) to include in the capabilities list. | `[operatingSystemVersion.SEVEN, operatingSystemVersion.XP]` | `[]` |
| operatingSystemVersion.exclude | `Array` | A list of [operatingSystemVersion's](#operatingSystemVersion) to exclude in the capabilities list. | `[operatingSystemVersion.EL_CAPITAN, operatingSystemVersion.HIGH_SIERRA]` | `[]` |
| formatForSelenium | `Boolean` | Whether to add browserName and browserVersion properties to the outputted capabilites, as selenium does not understand BrowserStack's `browser` and `browser_version` equivelants. | `false` | `true`

## Types
These are the core types exported by `browserslist-browserstack`.
### BrowserFilter
An enum of browsers to filter capabilites, possible values:
* FIREFOX
* SAFARI
* IE
* CHROME
* OPERA
* EDGE

### OperatingSystemFilter
An enum of operating systems to filter capabilites, possible values:
* WINDOWS
* OSX

### WindowsOperatingSystemVersionFilter
An enum of windows versions to filter capabilities, possible values:
* XP
* SEVEN
* EIGHT
* EIGHT_ONE
* TEN

### OSXOperatingSystemVersionFilter
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

### Options
An interface to define the possible options to pass to `getCapabilities`. See [options](#Options).

### ResponseError
A custom error class which indicates errors caused if a node-fetch response is not in the range [200,300]. Mainly used to catch `401 Unauthorized` errors when trying to pull capabilities from BrowserStack's REST API.

### FetchError
For convinience, just fowards the class from [node-fetch][node-fetch-fetch-error].

### BrowsersListError
For convinience, just fowards the class from [Browserslist][browserslist-error].

## Error Handling
If a request to BrowserStack's REST API encounters an issue one of these errors will be thrown:
- [ResponseError](#ResponseError)
- [FetchError](#FetchError)
- [AbortError](#AbortError)

If there is an issue parsing queries with Browserslist a [BrowsersListError](#BrowsersListError) will be thrown.

See [node-fetch docs][node-fetch-error-handling] and [Browserslist docs][browserslist-repo] for more details.

## Useful links
- [BrowserStack Automate][browserstack-automate-link]: required service to run tests on remote machines with a webdriver.
- [Browserslist][browserslist-repo]: used to query browser versions.
- [selenium-webdriver][selenium-link]: allows control of remote browsers on BrowserStack's Automate platform.
- [browserstack-local][browserstack-local-link]: allows testing of local pages that aren not hosted on a web server.

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
[semantic-release-link]: https://github.com/semantic-release/semantic-release


[browserslist-repo]: https://github.com/browserslist/browserslist
[browserslist-js-api]: https://github.com/browserslist/browserslist#js-api
[browserslist-error]: https://github.com/browserslist/browserslist/blob/master/error.js


[node-fetch-repo]: https://github.com/bitinn/node-fetch
[node-fetch-error-handling]: https://github.com/bitinn/node-fetch/blob/master/ERROR-HANDLING.md
[node-fetch-fetch-error]: https://github.com/bitinn/node-fetch/blob/master/src/fetch-error.js

[minimal-example-image]: ./minimal-example.jpg
[minimal-example-link]: ./examples/minimal.js
[browserstack-image]: ./browserstack.jpg

[jest-link]: https://jestjs.io/
[mocha-link]: https://mochajs.org/
[browserstack-automate-link]: https://www.browserstack.com/automate
[selenium-link]: https://github.com/SeleniumHQ/selenium
[browserstack-local-link]: https://github.com/browserstack/browserstack-local-nodejs
