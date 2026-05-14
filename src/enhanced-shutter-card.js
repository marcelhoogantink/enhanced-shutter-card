/**
 * Enhanced Shutter Card for Home Assistant
 * HA-dev-page for cover:
 * https://developers.home-assistant.io/docs/core/entity/cover
 */

// // local copy of RELEASE 3.0.1 of Lit-element:
// https://www.jsdelivr.com/package/gh/lit/dist

const VERSION = 'v1.6.1b1';

import {LitElement, html, css, unsafeCSS } from './code/lit/lit-core.min.js';
import * as C from './code/constants.js';

import {
  EnhancedShutterCardNew,
  EnhancedShutter,
} from './code/classes.js';

import {
  setDebug,
  isRunningLocally,
} from'./code/functions.js';

const IS_LOCAL = isRunningLocally();
const DEBUG = VERSION.includes('b') && IS_LOCAL;

setDebug(DEBUG);

import * as HtmlBlocks from './code/htmlBlocks.js';
import {EscImages} from './code/escImages.js';

// import {html, css, unsafeCSS } from './lit/lit-core.min.js';
// import {LitElement} from './lit/lit-debug.js'; // <-- dit is nu de debug versie






customElements.define(C.HA_CARD_NAME , EnhancedShutterCardNew);
customElements.define(C.HA_SHUTTER_NAME, EnhancedShutter);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "enhanced-shutter-card",
  name: "Enhanced Shutter Card",
  preview: true,
  description: "An enhanced shutter card for easy control of shutters",
  documentationURL: "https://github.com/marcelhoogantink/enhanced-shutter-card"
});

console.info(
  `%c ENHANCED-SHUTTER-CARD %c Version ${VERSION}`,
  'color: white; background: green; font-weight: 700',
  'color: black;background: white; font-weight: bold'
);
console.info(`my-card version __VERSION__`);
 console.log('Versie=', VERSION);
/*
*/


