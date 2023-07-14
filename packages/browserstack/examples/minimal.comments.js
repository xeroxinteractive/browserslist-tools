// import selenium web driver so we can run tests on the remote browser.





/* import browserslist-browserstack and the required filters so we can assemble
a list of capabilities for browserstack to run with. */




// use a browserslist query to find the latest version of browsers.


// specify to use Firefox and Edge browsers for testing.


// specify to use Windows and macOS for testing.



// specify to use the latest Windows and macOS versions.


/* since we are using selenium-webdriver we want the outputted capabilites to be
outputted in a compatible format. */


// loop over each capability to run test in BrowserStack for each.




// combine each capability with some basic BrowserStack settings.





// load your website.

/* do some test against your website in the BrowserStack environment,
see https://www.npmjs.com/package/selenium-webdriver for more details. */

// finally close the connection to BrowserStack.

