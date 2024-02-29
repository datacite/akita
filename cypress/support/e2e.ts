// import '@cypress/code-coverage/support'
//require('@cypress/react/support')

// Alternatively you can use CommonJS syntax:
// require('./commands')

// To turn off all uncaught exception handling

//Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  //return false
//})


// https://medium.com/@edweng/ign-the-cypress-remix-hydration-error-b0bc256d853a
Cypress.on("uncaught:exception", (err) => {
  // Cypress and React Hydrating the document don't get along
  // for some unknown reason. Hopefully we figure out why eventually
  // so we can remove this.
  if (
    /hydrat/i.test(err.message) ||
    /Minified React error #418/.test(err.message) ||
    /Minified React error #419/.test(err.message) ||
    /Minified React error #423/.test(err.message)
  ) {
    return false;
  }
});

export {}
