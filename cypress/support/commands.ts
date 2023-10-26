/// <reference types="cypress" />
// ***********************************************

import cypress = require('cypress');
import i18n from '../../src/plugins/i18n';
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.add('getByDataCy', (value, nestedSelector = '') => {
  return cy.get(`[data-cy=${value}] ${nestedSelector}`);
});

Cypress.Commands.add('importEssentials', () => {
  Cypress.env('i18n', i18n);
});
