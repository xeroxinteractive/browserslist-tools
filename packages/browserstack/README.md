# browserslist-browserstack

> Run BrowserStack tests for all browsers in project’s [Browserslist][browserslist-repo] config (with additional include/exclude filters).

[![npm package][npm-badge]][npm-link]
[![license MIT][license-badge]][license]

## Setup

**Important Note: In order to use this package a BrowserStack account with a valid Automate plan is required, a free trial is available.**

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

| Option                         | Type      | Description                                                                                                                                                                        | Example                                                                    | Default                                |
| ------------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------- |
| username                       | `String`  | A BrowserStack Username to use when requesting supported capabilities for an account.                                                                                              | `"username"`                                                               | `process.env.BROWSER_STACK_USERNAME`   |
| accessKey                      | `String`  | A BrowserStack Access Key to use when requesting supported capabilities for an account.                                                                                            | `"xxxxxxxxxxxxxxxxxxxx"`                                                   | `process.env.BROWSER_STACK_ACCESS_KEY` |
| browserslist                   | `Object`  | Options to pass to Browserslist. See [Browserslist options][browserslist-js-api].                                                                                                  | `{ queries: ['> 1%', 'IE 10'], options: { ignoreUnknownVersions: true } }` | `undefined`                            |
| browsers.include               | `Array`   | A list of [BrowserFilter's](#BrowserFilter) to include in the capabilities list.                                                                                                   | `[BrowserFilter.FIREFOX, BrowserFilter.CHROME]`                            | `[]`                                   |
| browsers.exclude               | `Array`   | A list of [BrowserFilter's](#BrowserFilter) to exclude in the capabilities list.                                                                                                   | `[BrowserFilter.IE, BrowserFilter.EDGE]`                                   | `[]`                                   |
| operatingSystems.include       | `Array`   | A list of [OperatingSystemFilter's](#OperatingSystemFilter) to include in the capabilities list.                                                                                   | `[OperatingSystemFilter.WINDOWS]`                                          | `[]`                                   |
| operatingSystems.exclude       | `Array`   | A list of [OperatingSystemFilter's](#OperatingSystemFilter) to exclude in the capabilities list.                                                                                   | `[OperatingSystemFilter.OSX]`                                              | `[]`                                   |
| operatingSystemVersion.include | `Array`   | A list of [operatingSystemVersion's](#operatingSystemVersion) to include in the capabilities list.                                                                                 | `[operatingSystemVersion.SEVEN, operatingSystemVersion.XP]`                | `[]`                                   |
| operatingSystemVersion.exclude | `Array`   | A list of [operatingSystemVersion's](#operatingSystemVersion) to exclude in the capabilities list.                                                                                 | `[operatingSystemVersion.EL_CAPITAN, operatingSystemVersion.HIGH_SIERRA]`  | `[]`                                   |
| formatForSelenium              | `Boolean` | Whether to add browserName and browserVersion properties to the outputted capabilites, as selenium does not understand BrowserStack's `browser` and `browser_version` equivelants. | `false`                                                                    | `true`                                 |

## Types

These are the core types exported by `browserslist-browserstack`.

### BrowserFilter

An enum of browsers to filter capabilites, possible values:

- FIREFOX
- SAFARI
- IE
- CHROME
- OPERA
- EDGE
- YANDEX

### OperatingSystemFilter

An enum of operating systems to filter capabilites, possible values:

- WINDOWS
- OSX
- IOS
- ANDROID

### WindowsOperatingSystemVersionFilter

An enum of windows versions to filter capabilities, possible values:

- XP
- SEVEN
- EIGHT
- EIGHT_ONE
- TEN

### OSXOperatingSystemVersionFilter

An enum of macOS versions to filter capabilities, possible values:

- SNOW_LEOPARD
- LION
- MOUNTAIN_LION
- MAVERICKS
- YOSEMITE
- EL_CAPITAN
- SIERRA
- HIGH_SIERRA
- MOJAVE
- CATALINA
- BIG_SUR
- MONTEREY
- VENTURA

### iOSOperatingSystemVersionFilter

An enum of iOS versions to filter capabilities, possible values:

- TEN
- ELEVEN
- TWELVE
- THIRTEEN
- FOURTEEN
- FIFTEEN
- SIXTEEN
- SIXTEEN_THREE
- SIXTEEN_FOUR
- SIXTEEN_FIVE

## AndroidOperatingSystemVersionFilter

An enum of Android versions to filter capabilities, possible values:

- FOUR_FOUR
- FIVE
- FIVE_ONE
- SIX
- SEVEN
- SEVEN_ONE
- EIGHT
- EIGHT_ONE
- NINE
- TEN
- ELEVEN
- TWELVE
- THIRTEEN

## DeviceFilter

- GALAXY_A10
- GALAXY_A11
- GALAXY_A51
- GALAXY_A52
- GALAXY_A8
- GALAXY_J7_PRIME
- GALAXY_M32
- GALAXY_M52
- GALAXY_NOTE_10
- GALAXY_NOTE_10_PLUS
- GALAXY_NOTE_20
- GALAXY_NOTE_20_ULTRA
- GALAXY_NOTE_8
- GALAXY_S10
- GALAXY_S10_PLUS
- GALAXY_S10E
- GALAXY_S20
- GALAXY_S20_PLUS
- GALAXY_S20_ULTRA
- GALAXY_S21
- GALAXY_S21_PLUS
- GALAXY_S21_ULTRA
- GALAXY_S22
- GALAXY_S22_PLUS
- GALAXY_S22_ULTRA
- GALAXY_S23
- GALAXY_S23_ULTRA
- GALAXY_S8
- GALAXY_S9
- GALAXY_S9_PLUS
- GALAXY_TAB_S5E
- GALAXY_TAB_S6
- GALAXY_TAB_S7
- GALAXY_TAB_S8
- HUAWEI_P30
- IPAD_10TH
- IPAD_5TH
- IPAD_6TH
- IPAD_7TH
- IPAD_8TH
- IPAD_9TH
- IPAD_AIR_2
- IPAD_AIR_2019
- IPAD_AIR_4
- IPAD_AIR_5
- IPAD_MINI_2019
- IPAD_MINI_2021
- IPAD_MINI_3
- IPAD_MINI_4
- IPAD_PRO_11_2018
- IPAD_PRO_11_2020
- IPAD_PRO_11_2021
- IPAD_PRO_11_2022
- IPAD_PRO_12_9
- IPAD_PRO_12_9_2018
- IPAD_PRO_12_9_2020
- IPAD_PRO_12_9_2021
- IPAD_PRO_12_9_2022
- IPAD_PRO_9_7_2016
- IPHONE_11
- IPHONE_11_PRO
- IPHONE_11_PRO_MAX
- IPHONE_12
- IPHONE_12_MINI
- IPHONE_12_PRO
- IPHONE_12_PRO_MAX
- IPHONE_13
- IPHONE_13_MINI
- IPHONE_13_PRO
- IPHONE_13_PRO_MAX
- IPHONE_14
- IPHONE_14_PLUS
- IPHONE_14_PRO
- IPHONE_14_PRO_MAX
- IPHONE_6
- IPHONE_6_PLUS
- IPHONE_6S
- IPHONE_6S_PLUS
- IPHONE_7
- IPHONE_8
- IPHONE_8_PLUS
- IPHONE_SE
- IPHONE_SE_2020
- IPHONE_X
- IPHONE_XR
- IPHONE_XS
- IPHONE_XS_MAX
- MOTO_G7_PLAY
- MOTO_G71_5G
- MOTO_G9_PLAY
- ONEPLUS_11R
- ONEPLUS_6T
- ONEPLUS_7
- ONEPLUS_7T
- ONEPLUS_8
- ONEPLUS_9
- OPPO_A78
- OPPO_A96
- OPPO_RENO_3_PRO
- OPPO_RENO_6
- PIXEL_2
- PIXEL_3_XL
- PIXEL_3A
- PIXEL_3A_XL
- PIXEL_4
- PIXEL_4_XL
- PIXEL_5
- PIXEL_6
- PIXEL_6_PRO
- PIXEL_7
- PIXEL_7_PRO
- REALME_8
- REDMI_NOTE_11
- REDMI_NOTE_12_PRO
- REDMI_NOTE_8
- REDMI_NOTE_9
- VIVO_V21
- VIVO_Y15
- VIVO_Y21
- VIVO_Y22
- VIVO_Y50

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
[issues]: https://github.com/xeroxinteractive/browserslist-tools/issues
[npm-badge]: https://img.shields.io/npm/v/browserslist-browserstack?style=flat-square&color=cyan
[npm-link]: https://www.npmjs.com/package/browserslist-browserstack
[license-badge]: https://img.shields.io/badge/license-MIT-blue?style=flat-square
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
