// import selenium web driver so we can run tests on the remote browser.





/* import browserslist-browserstack and the required filters so we can assemble
a list of capabilities for browserstack to run with. */




// we are using a browserslist query to find the latest version of browsers.


// we are specifing that we only want to use Firefox and Edge browsers for testing.


// we are specifing that we only want to use Windows and macOS for testing.



// we are specifing that we only want to use the latest Windows and macOS versions.


/* since we are using selenium-webdriver we want the outputted capabilites to be
outputted in a compatible format. */




/* finally we need to loop over our selected capabilities and pass them to
selenium-webdriver with some basic project settings, and run some tests */
