# browserslist-adobe-analytics

> Use Adobe Analytics data to target browsers.

[![npm package][npm-badge]][npm-link]
[![license MIT][license-badge]][license]

browserslist-adobe-analytics provides a CLI and Node API which can pull analytics data about what browsers your users use, and convert that data into a [`browserslist-stats.json`](https://github.com/browserslist/browserslist#custom-usage-data) file so browserslist can select the appropriate browsers based on your user base. To achieve this a browser report is fetched from the Adobe Analytics API, each browser entry is then converted to the format browserslist supports.

Please note that to do this browserslist-adobe-analytics uses very loose matching rules e.g: `Chrome 1.2.3` could be interpretted as `chrome 1.2.7` in browserslist land, this is so we do not ignore any data. It is better to support more browsers less accurately than less browsers more accuratly in my opinion, so please do not rely on the output to report actual browser usage.

## Setup
__Important Note: In order to use this package an Adobe Experience Cloud account with a valid Adobe Analytics license is required. You will also need developer permissions in order to create an integration.__
### Creating an Adobe Analytics Integration
You will need an Integration for Adobe Analytics as it will allow you to set up JWT authorization so browserslist-adobe-analytics can retrieve your user browser usage data.
1. Log in to the Adobe I/O Console: https://console.adobe.io/
2. Navigate to the "Integrations" tab, make sure the dropdown in the top-left is set to the correct organization and select "New Integration". ![New Integration Page][new-integration-image]
3. Go through the setup wizard selecting the following:
    1. Q: "Do you want to access an API or receive near-real time events?" A: "Access an API"
    2. Q: "Select the Adobe service you wish to integrate with" A: "Experience Cloud" > "Adobe Analytics" > "Service Account Integration"
    3. Q: "Integration Details" A:
        * The name and description is up to you, I went with "Browserslist Integration" and "Pull Adobe Analytics data to use as custom data for browserslist."
        * For "Public keys certificates" follow https://github.com/AdobeDocs/adobeio-auth/blob/stage/AuthenticationOverview/ServiceAccountIntegration.md#step-2-create-a-public-key-certificate
    4. Q: "Select one or more product profiles for Adobe Analytics" A: "Reports & Analytics Access"
    5: Finally click "Continue to Integration Details" and you will have access to most of the information you will need to pass to browserslist-adobe-analytics

### Using this module
browserslist-adobe-analytics is shipped as an npm module. It has 2 primary ways of usage, either via the [CLI](#cli) or via the [Node API](#node-api). Either way you will need to install it either on a per project basis or as part of a shareable config. To install the module use:
```bash
yarn add browserslist-adobe-analytics --dev
# or
npm install browserslist-adobe-analytics --save-dev
```
#### CLI
The CLI (Command Line Interface) provides a configurable way to generate a `browserslist-stats.json` file from your preferred terminal. This is intended to facilitate CI (Continuos Integration) processes, as well as quickly testing the API locally.

There are 2 commands provided:
1. `baa write` which directly writes the statistics data to a `browserslist-stats.json` file in the cwd (current working directory). The configurable options can be seen below:
```
$ baa write --help
baa write

Write browserslist stats to file from Adobe Analytics data.

Adobe Analytics
  --clientId, --cid         Integration client ID.                               [string] [required]
  --technicalAccountId, -t  Integration technical account ID.                    [string] [required]
  --orgId, -o               Integration organization ID.                         [string] [required]
  --clientSecret, --cs      Integration client secret.                           [string] [required]
  --privateKey, --pk        Integration private key.                                        [string]
  --privateKeyPath, --pkp   Integration private key path.                                   [string]
  --passphrase, -p          Passphrase used to secure integration public/private key.       [string]
  --ims, -i                 Identity management system ID.                                  [string]
  --rsid, -r                Report Suite ID.                                     [string] [required]
  --globalId, -g            Global ID.                                           [string] [required]
  --limit, -l               The maximum number of browser entries to request. [number] [default: 50]

Time
  --duration, -d  Period of time to request data for.                        [string] [default: P3M]
  --from, -f      Date to request data from.                                                [string]
  --until, -u     Date to request data until.                       [string] [default: Today's date]

File Writing
  --cwd, -c         The current working directory to write the file in.
                                                                   [string] [default: process.cwd()]
  --filename, --fn  The name of the file to write.       [string] [default: browserslist-stats.json]

Options:
  --version  Show version number                                                           [boolean]
  --config   Path to JSON config file
  --help     Show help                                                                     [boolean]
```
2. `baa` which logs the statistics data in JSON format to the command line. This is intended for testing locally and also provides a way to use unix output redirection (e.g: `baa > browserslist-stats.json`). The configurable options can be seen below:
```
$ baa --help
baa

Generate browserslist stats from Adobe Analytics data.

Commands:
  baa        Generate browserslist stats from Adobe Analytics data.                        [default]
  baa write  Write browserslist stats to file from Adobe Analytics data.

Adobe Analytics
  --clientId, --cid         Integration client ID.                               [string] [required]
  --technicalAccountId, -t  Integration technical account ID.                    [string] [required]
  --orgId, -o               Integration organization ID.                         [string] [required]
  --clientSecret, --cs      Integration client secret.                           [string] [required]
  --privateKey, --pk        Integration private key.                                        [string]
  --privateKeyPath, --pkp   Integration private key path.                                   [string]
  --passphrase, -p          Passphrase used to secure integration public/private key.       [string]
  --ims, -i                 Identity management system ID.                                  [string]
  --rsid, -r                Report Suite ID.                                     [string] [required]
  --globalId, -g            Global ID.                                           [string] [required]
  --limit, -l               The maximum number of browser entries to request. [number] [default: 50]

Time
  --duration, -d  Period of time to request data for.                        [string] [default: P3M]
  --from, -f      Date to request data from.                                                [string]
  --until, -u     Date to request data until.                       [string] [default: Today's date]

Options:
  --version  Show version number                                                           [boolean]
  --config   Path to JSON config file
  --help     Show help                                                                     [boolean]

For possible duration formats see https://momentjs.com/docs/#/durations/
For possible date     formats see https://momentjs.com/docs/#/parsing/string/
```

#### Node API
The Node API provides a more raw approach where you can retrieve a stats object in order to directly pass it to [browserslist's JS API](https://github.com/browserslist/browserslist#js-api).

There are 2 exported methods from the primary API:
1. `getBrowserslistStats(options)` which will return a Promise which resolves to a browserslist stats object. See [options section](#options) for more details.
2. `writeBrowserslistStats(options)` which will return a promise which when resolved will have generated and written a `browserslist-stats.json` file assuming nothing goes wrong. See [write options section](#write-options) for more details.

#### Options

`clientId`, `technicalId`, `orgId` and `clientSecret` can all be found on your integration details page after you have followed the steps from [Creating an Adobe Analytics Integration](#creating-an-adobe-analytics-integration).

You need to specify one of either `privateKey` or `privateKeyPath`, which should be the raw contents of the `private.key` file that you generated during the ["Creating an Adobe Analytics Integration"](#creating-an-adobe-analytics-integration) step or a path to said file. `passphrase` is optional so only pass it if you secured your public/private key with a passphrase when creating it.

`ims` is optional and you likely do not use the Identity Manager System, but if you do see https://docs.adobe.com/content/help/en/campaign-classic/using/integrating-with-adobe-experience-cloud/connecting-via-an-adobe-id/configuring-ims.html.

To find your `rsid` do the following:
1. Login to Adobe Experience Cloud: https://experiencecloud.adobe.com
2. Navigate to Adobe Analytics either in the "Quick Access" section or the menu on the top nav.
3. Select your report suite in the top right (the one you want to pull browser data from).
4. Open a report e.g. "Technology: PC / Browsers".
5. Click "Try in Workspace [NEW]" at the top of the report.
6. Open devtools and type `adobe.tools.debug.includeOberonXml = true` in the console, and refresh the page.
7. Click one of the debug (beatle) icons in the report then select the latest "Freeform Table" request.
8. Scroll down to the JSON request, the first field should be `rsid`.

To find your `globalId` do the following:
1. Navigate to https://adobedocs.github.io/analytics-2.0-apis/ and login.
2. Open the "/reports" accordion and click "Try it out" next to "Parameters".
3. Click "Execute" you should see a "Request URL" field.
4. The "Request URL" field should look something like `https://analytics.adobe.io/api/company0/reports` where company0 is your `globalId`.

The time settings `duration`, `from` and `until` are all parsed with moment.js. The Node API can accept anything that [`moment.duration`](https://momentjs.com/docs/#/durations/) can accept whereas the CLI can only accept single strings so you are best using the [ISO 8601](https://www.digi.com/resources/documentation/digidocs/90001437-13/reference/r_iso_8601_duration_format.htm) format. Only one of `from` or `until` should be used, they basically define the anchor point for where the duration is added or subtracted from/to respectively.

| Option | Type | Decription | Example | Default |
| --- | --- | --- | --- | --- |
| clientId | `String` | Integration client ID. | `"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"` | CLI: `process.env.BAA_CLIENT_ID` NODE: `undefined` |
| technicalAccountId | `String` | Integration technical account ID. | `"xxxxxxxxxxxxxxxxxxxxxxxx@techacct.adobe.com"` | CLI: `process.env.BAA_TECHNICAL_ACCOUNT_ID` NODE: `undefined` |
| orgId | `String` | Integration organization ID. | `"xxxxxxxxxxxxxxxxxxxxxxxx@AdobeOrg"` | CLI: `process.env.BAA_ORG_ID` NODE: `undefined` |
| clientSecret | `String` | Integration client secret. | `"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"` | CLI: `process.env.BAA_CLIENT_SECRET` NODE: `undefined` |
| privateKey | `String` | Integration private key. | `"-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----"` | CLI: `process.env.BAA_PRIVATE_KEY` NODE: `undefined` |
| privateKeyPath | `String` | Integration private key path. | `"./path/to/private.key"` | CLI: `process.env.BAA_PRIVATE_KEY_PATH` NODE: `undefined` |
| passphrase | `String` | Passphrase used to secure integration public/private key. | `"xxxxxx"` | CLI: `process.env.BAA_PASSPHRASE` NODE: `undefined` |
| ims | `String` | Identity management system ID. | `""` | CLI: `process.env.BAA_IMS` NODE: `undefined` |
| rsid | `String` | Report Suite ID. | `"myreportsuite"` | CLI: `process.env.BAA_RSID` NODE: `undefined` |
| globalId | `String` | Global ID. | `"company0"` | CLI: `process.env.BAA_GLOBAL_ID` NODE: `undefined` |
| duration | `String` | Period of time to request data for. | `"P1Y"` | CLI `process.env.BAA_DURATION` or `"P3M"` NODE `[3, "months"]` |
| from | `String` | Date to request data from. | `"2019-10-01"` | CLI: `process.env.BAA_FROM` NODE: `undefined` |
| until | `String` | Date to request data until. | `"2019-11-26"` | CLI: `process.env.BAA_UNTIL` or Today's date Node: Today's date |
| limit | `Number` | The maximum number of browser entries to request. | `100` | CLI: `process.env.BAA_LIMIT` or `50` Node: `50` |

#### Write Options
These are additional options used when writing directly to a file. The [standard options](#options) also need to be specified.

| Option | Type | Decription | Example | Default |
| --- | --- | --- | --- | --- |
| cwd | `String` | The current working directory to write the file in. | `"./path/to/folder"` | CLI: `process.env.BAA_CWD` or `process.cwd()` NODE: `process.cwd()` |
| filename | `String` | The name of the file to write. | `"stats.json"` | CLI: `process.env.BAA_FILENAME` or `"browserslist-stats.json"` NODE: `"browserslist-stats.json"` |

## Example
This module was built to facilitate Xerox's shareable browserslist configuration which generates a new `browserslist-stats.json` file every month based on the previous 3 months of analytics data across all the various Xerox websites. Said config is open-source and uses a CircleCi cron job to run the `baa` CLI. You can view the implementation here: https://github.com/xeroxinteractive/config/tree/master/packages/xerox-browserslist-config

## Contributing

### Building

Run `nx build adobe-analytics` to build the library.

### Running unit tests

Run `nx test adobe-analytics` to execute the unit tests via [Jest](https://jestjs.io).

---

[LICENSE][license] | [CHANGELOG][changelog] | [ISSUES][issues]

[license]: ./LICENSE
[changelog]: ./CHANGELOG.md
[issues]: https://github.com/xeroxinteractive/browserslist-tools/issues

[npm-badge]: https://flat.badgen.net/npm/v/browserslist-adobe-analytics?color=cyan
[npm-link]: https://www.npmjs.com/package/browserslist-adobe-analytics

[license-badge]: https://flat.badgen.net/npm/license/browserslist-adobe-analytics

[new-integration-image]: ./new-integration.png

