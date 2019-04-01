const { Builder } = require('selenium-webdriver');
const {
  default: getCapabilities,
  BrowserFilter,
  OperatingSystemFilter,
  WindowsOperatingSystemVersionFilter,
  OSXOperatingSystemVersionFilter
} = require('browserslist-browserstack');

(async () => {
  const capabilities = await getCapabilities({
    browserslist: {
      queries: 'last 1 versions'
    },
    browsers: {
      include: [BrowserFilter.FIREFOX, BrowserFilter.EDGE]
    },
    operatingSystems: {
      include: [OperatingSystemFilter.WINDOWS, OperatingSystemFilter.OSX]
    },
    operatingSystemVersion: {
      include: [
        WindowsOperatingSystemVersionFilter.TEN,
        OSXOperatingSystemVersionFilter.MOJAVE
      ]
    },
    formatForSelenium: true
  });

  for (const capability of capabilities) {
    const driver = new Builder()
      .usingServer('http://hub-cloud.browserstack.com/wd/hub')
      .withCapabilities({
        project: '<your-project-name>',
        'browserstack.user': process.env.BROWSER_STACK_USER,
        'browserstack.key': process.env.BROWSER_STACK_KEY,
        ...capability
      })
      .build();

    await driver.get('https://www.google.com')

    // do some tests.

    await driver.quit();
  }
})();

