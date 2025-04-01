const VERSION = 'v1.1.4';

import {
  LitElement,
  html,
  css,
  unsafeCSS
}
from './lit/lit-core.min.js';
// local copy of RELEASE 3.0.1 of
// https://www.jsdelivr.com/package/gh/lit/dist

const HA_CARD_NAME = "enhanced-shutter-card";
const HA_SHUTTER_NAME = `enhanced-shutter`;
const HA_HUI_VIEW = 'hui-view';

const AUTO = 'auto';
const LEFT = 'left';
const RIGHT = 'right';
const BOTTOM = 'bottom';
const TOP = 'top';
const NONE = 'none';
const AUTO_TL = `${AUTO}-${TOP}-${LEFT}`;
const AUTO_TR = `${AUTO}-${TOP}-${RIGHT}`;
const AUTO_BL = `${AUTO}-${BOTTOM}-${LEFT}`;
const AUTO_BR = `${AUTO}-${BOTTOM}-${RIGHT}`;

const PORTRAIT ="P";
const LANDSCAPE ="L";

const SHUTTER_STATE_OPEN = 'open';
const SHUTTER_STATE_CLOSED = 'closed';
const SHUTTER_STATE_OPENING = 'opening';
const SHUTTER_STATE_CLOSING = 'closing';
const SHUTTER_STATE_PARTIAL_OPEN = 'partial_open'; // speudo state

const ESC_CLASS_BASE_NAME = 'esc-shutter';

const ESC_CLASS_SHUTTER = `${ESC_CLASS_BASE_NAME}`;
const ESC_CLASS_SHUTTERS = `${ESC_CLASS_BASE_NAME}s`;
const ESC_CLASS_TOP = `${ESC_CLASS_BASE_NAME}-${TOP}`;
const ESC_CLASS_MIDDLE = `${ESC_CLASS_BASE_NAME}-middle`;
const ESC_CLASS_BOTTOM = `${ESC_CLASS_BASE_NAME}-${BOTTOM}`;
const ESC_CLASS_LABEL = `${ESC_CLASS_BASE_NAME}-label`;
const ESC_CLASS_LABEL_DISABLED = `${ESC_CLASS_LABEL}-disabled`;
const ESC_CLASS_TITLE_DISABLED = `${ESC_CLASS_BASE_NAME}-title-disabled`
const ESC_CLASS_POSITION = `${ESC_CLASS_BASE_NAME}-position`;
const ESC_CLASS_BUTTONS = `${ESC_CLASS_BASE_NAME}-buttons`;
const ESC_CLASS_BUTTONS_TOP = `${ESC_CLASS_BUTTONS}-${TOP}`;
const ESC_CLASS_BUTTONS_BOTTOM = `${ESC_CLASS_BUTTONS}-${BOTTOM}`;
const ESC_CLASS_BUTTONS_LEFT = `${ESC_CLASS_BUTTONS}-${LEFT}`;
const ESC_CLASS_BUTTONS_RIGHT = `${ESC_CLASS_BUTTONS}-${RIGHT}`;
const ESC_CLASS_BUTTON = `${ESC_CLASS_BASE_NAME}-button`;
const ESC_CLASS_SELECTOR = `${ESC_CLASS_BASE_NAME}-selector`;
const ESC_CLASS_SELECTOR_PICTURE = `${ESC_CLASS_BASE_NAME}-selector-picture`;
const ESC_CLASS_SELECTOR_VIEW = `${ESC_CLASS_BASE_NAME}-selector-view`;
const ESC_CLASS_SELECTOR_FRAME = `${ESC_CLASS_BASE_NAME}-selector-frame`;
const ESC_CLASS_SELECTOR_SLIDE = `${ESC_CLASS_BASE_NAME}-selector-slide`;
const ESC_CLASS_SELECTOR_PICKER = `${ESC_CLASS_BASE_NAME}-selector-picker`;
const ESC_CLASS_SELECTOR_PARTIAL = `${ESC_CLASS_BASE_NAME}-selector-partial`;
const ESC_CLASS_MOVEMENT_OVERLAY = `${ESC_CLASS_BASE_NAME}-movement-overlay`;
const ESC_CLASS_MOVEMENT_OPEN = `${ESC_CLASS_BASE_NAME}-movement-open`;
const ESC_CLASS_MOVEMENT_CLOSE = `${ESC_CLASS_BASE_NAME}-movement-close`;
const ESC_CLASS_HA_ICON = `${ESC_CLASS_BASE_NAME}-ha-icon`;
const ESC_CLASS_HA_ICON_LOCK = `${ESC_CLASS_HA_ICON}-lock`;

const POSITIONS =[AUTO,AUTO_BL,AUTO_BR,AUTO_TL,AUTO_TR,LEFT,RIGHT,TOP,BOTTOM,NONE];

const ACTION_SHUTTER_OPEN = 'open_cover';
const ACTION_SHUTTER_OPEN_TILT = 'open_cover_tilt';
const ACTION_SHUTTER_CLOSE = 'close_cover';
const ACTION_SHUTTER_CLOSE_TILT = 'close_cover_tilt';
const ACTION_SHUTTER_STOP = 'stop_cover';
const ACTION_SHUTTER_STOP_TILT = 'stop_cover_tilt';
const ACTION_SHUTTER_SET_POS = 'set_cover_position';
const ACTION_SHUTTER_SET_POS_TILT = 'set_cover_tilt_position';

const UNITY= 'px';

const CONFIG_ENTITY_ID = 'entity';
const CONFIG_STATE = 'state';
const CONFIG_HEIGHT_PX = 'height_px';
const CONFIG_WIDTH_PX = 'width_px';

const CONFIG_BATTERY_ENTITY_ID = 'battery_entity';
const CONFIG_SIGNAL_ENTITY_ID = 'signal_entity';

const CONFIG_NAME = 'name';
const CONFIG_PASSIVE_MODE = 'passive_mode';
const CONFIG_IMAGE_MAP = 'image_map';
const CONFIG_WINDOW_IMAGE = 'window_image';
const CONFIG_VIEW_IMAGE = 'view_image';
const CONFIG_SHUTTER_SLAT_IMAGE = 'shutter_slat_image';
const CONFIG_SHUTTER_BOTTOM_IMAGE = 'shutter_bottom_image';
const CONFIG_SHUTTER_BOTTOM_HEIGHT_PX = 'shutter_bottom_height_px';
const CONFIG_BASE_HEIGHT_PX = 'base_height_px';
const CONFIG_BASE_WIDTH_PX = 'base_width_px';
const CONFIG_RESIZE_HEIGHT_PCT = 'resize_height_pct';
const CONFIG_RESIZE_WIDTH_PCT = 'resize_width_pct';

const CONFIG_SCALE_ICONS = 'scale_icons';
const CONFIG_SCALE_BUTTONS = 'scale_buttons';

const CONFIG_TOP_OFFSET_PCT = 'top_offset_pct';
const CONFIG_BOTTOM_OFFSET_PCT = 'bottom_offset_pct';
const CONFIG_LEFT_OFFSET_PCT = 'left_offset_pct';
const CONFIG_RIGHT_OFFSET_PCT = 'right_offset_pct';

const CONFIG_BUTTONS_POSITION = 'buttons_position';
const CONFIG_TITLE_POSITION = 'title_position';  // deprecated
const CONFIG_NAME_POSITION = 'name_position';
const CONFIG_NAME_DISABLED = 'name_disabled';
const CONFIG_OPENING_POSITION = 'opening_position';
const CONFIG_OPENING_DISABLED = 'opening_disabled';
const CONFIG_INLINE_HEADER = 'inline_header';

const CONFIG_INVERT_PCT = 'invert_percentage';
const CONFIG_CAN_TILT = 'can_tilt';
const CONFIG_PARTIAL_CLOSE_PCT = 'partial_close_percentage';
const CONFIG_OFFSET_CLOSED_PCT = 'offset_closed_percentage';
const CONFIG_ALWAYS_PCT = 'always_percentage';
const CONFIG_DISABLE_END_BUTTONS = 'disable_end_buttons';
const CONFIG_DISABLE_STANDARD_BUTTONS = 'disable_standard_buttons';
const CONFIG_DISABLE_PARTIAL_OPEN_BUTTONS = 'disable_partial_open_buttons';
const CONFIG_PICKER_OVERLAP_PX = 'picker_overlap_px';
const CONFIG_CURRENT_POSITION = 'current_position';

const CONFIG_BUTTON_STOP_HIDE_STATES = 'button_stop_hide_states';
const CONFIG_BUTTON_UP_HIDE_STATES = 'button_up_hide_states';
const CONFIG_BUTTON_DOWN_HIDE_STATES = 'button_down_hide_states';

const ESC_ENTITY_ID = null;

const ESC_BATTERY_ENTITY_ID = null;
const ESC_SIGNAL_ENTITY_ID = null;

const ESC_NAME = null;
const ESC_PASSIVE_MODE = false;
const ESC_IMAGE_MAP = `/local/community/${HA_CARD_NAME}/images`;
const ESC_IMAGE_WINDOW = 'esc-window.png';
const ESC_IMAGE_VIEW = 'esc-view.png';
const ESC_IMAGE_SHUTTER_SLAT = 'esc-shutter-slat.png';
const ESC_IMAGE_SHUTTER_BOTTOM = 'esc-shutter-bottom.png';
const ESC_SHUTTER_BOTTOM_HEIGHT_PX = 7;

const ESC_BASE_HEIGHT_PX = 150; // image-height
const ESC_BASE_WIDTH_PX = 150;  // image-width
const ESC_RESIZE_HEIGHT_PCT = 100;
const ESC_RESIZE_WIDTH_PCT  = 100;

const ESC_SCALE_ICONS = true;
const ESC_SCALE_BUTTONS = false;

// precise percentage values work better with high aspect rations
const ESC_TOP_OFFSET_PCT = 10.5; // default image has 16px of 151px (10.59%) from top until transparency starts
const ESC_BOTTOM_OFFSET_PCT = 3.9; // default image has 6px of 151px (3.9%) from bottom until transparency starts
const ESC_LEFT_OFFSET_PCT = 5.2; // default image has 8px of 153px (5.2%) from left until transparency starts
const ESC_RIGHT_OFFSET_PCT = 5.2; // default image has 8px of 153px (3.9%) from right until transparency starts

const ESC_BUTTONS_POSITION = LEFT;
const ESC_TITLE_POSITION = null;  // deprecated
const ESC_NAME_POSITION =TOP;
const ESC_NAME_DISABLED = false;
const ESC_OPENING_POSITION = TOP;
const ESC_OPENING_DISABLED = false;
const ESC_INLINE_HEADER = false;
const ESC_INVERT_PCT = false;
const ESC_CAN_TILT = false;
const ESC_PARTIAL_CLOSE_PCT = 0;
const ESC_OFFSET_CLOSED_PCT = 0;
const ESC_ALWAYS_PCT = false;
const ESC_DISABLE_END_BUTTONS = false;
const ESC_DISABLE_STANDARD_BUTTONS = false;
const ESC_DISABLE_PARTIAL_OPEN_BUTTONS = true;
const ESC_PICKER_OVERLAP_PX = 20;
const ESC_CURRENT_POSITION = 0;

const ESC_MIN_RESIZE_WIDTH_PCT  =  50;
const ESC_MAX_RESIZE_WIDTH_PCT  = 200;
const ESC_MIN_RESIZE_HEIGHT_PCT =  50;
const ESC_MAX_RESIZE_HEIGHT_PCT = 200;

const ESC_BUTTON_STOP_HIDE_STATES = [];
const ESC_BUTTON_UP_HIDE_STATES = [];
const ESC_BUTTON_DOWN_HIDE_STATES = [];

const CONFIG_DEFAULT ={
  [CONFIG_ENTITY_ID]: ESC_ENTITY_ID,

  [CONFIG_BATTERY_ENTITY_ID]: ESC_BATTERY_ENTITY_ID,
  [CONFIG_SIGNAL_ENTITY_ID]: ESC_SIGNAL_ENTITY_ID,

  [CONFIG_NAME]: ESC_NAME,
  [CONFIG_PASSIVE_MODE]: ESC_PASSIVE_MODE,
  [CONFIG_IMAGE_MAP]: ESC_IMAGE_MAP,
  [CONFIG_WINDOW_IMAGE]: ESC_IMAGE_WINDOW,
  [CONFIG_VIEW_IMAGE]: ESC_IMAGE_VIEW,
  [CONFIG_SHUTTER_SLAT_IMAGE]: ESC_IMAGE_SHUTTER_SLAT,
  [CONFIG_SHUTTER_BOTTOM_IMAGE]: ESC_IMAGE_SHUTTER_BOTTOM,
  [CONFIG_BASE_HEIGHT_PX]: ESC_BASE_HEIGHT_PX,
  [CONFIG_BASE_WIDTH_PX]: ESC_BASE_WIDTH_PX,
  [CONFIG_RESIZE_HEIGHT_PCT]: ESC_RESIZE_HEIGHT_PCT,
  [CONFIG_RESIZE_WIDTH_PCT]: ESC_RESIZE_WIDTH_PCT,

  [CONFIG_SCALE_ICONS]: ESC_SCALE_ICONS,
  [CONFIG_SCALE_BUTTONS]: ESC_SCALE_BUTTONS,
  [CONFIG_TOP_OFFSET_PCT]: ESC_TOP_OFFSET_PCT,
  [CONFIG_SHUTTER_BOTTOM_HEIGHT_PX]: ESC_SHUTTER_BOTTOM_HEIGHT_PX,
  [CONFIG_LEFT_OFFSET_PCT]: ESC_LEFT_OFFSET_PCT,
  [CONFIG_RIGHT_OFFSET_PCT]: ESC_RIGHT_OFFSET_PCT,
  [CONFIG_BOTTOM_OFFSET_PCT]: ESC_BOTTOM_OFFSET_PCT,
  [CONFIG_BUTTONS_POSITION]: ESC_BUTTONS_POSITION,
  [CONFIG_TITLE_POSITION]: ESC_TITLE_POSITION,  // deprecated
  [CONFIG_NAME_POSITION]: ESC_NAME_POSITION,
  [CONFIG_NAME_DISABLED]: ESC_NAME_DISABLED,
  [CONFIG_OPENING_POSITION]: ESC_OPENING_POSITION,
  [CONFIG_OPENING_DISABLED]: ESC_OPENING_DISABLED,
  [CONFIG_INLINE_HEADER]: ESC_INLINE_HEADER,

  [CONFIG_INVERT_PCT]: ESC_INVERT_PCT,
  [CONFIG_CAN_TILT]: ESC_CAN_TILT,
  [CONFIG_PARTIAL_CLOSE_PCT]: ESC_PARTIAL_CLOSE_PCT,
  [CONFIG_OFFSET_CLOSED_PCT]: ESC_OFFSET_CLOSED_PCT,
  [CONFIG_ALWAYS_PCT]: ESC_ALWAYS_PCT,
  [CONFIG_DISABLE_END_BUTTONS]: ESC_DISABLE_END_BUTTONS,
  [CONFIG_DISABLE_STANDARD_BUTTONS]: ESC_DISABLE_STANDARD_BUTTONS,
  [CONFIG_DISABLE_PARTIAL_OPEN_BUTTONS]: ESC_DISABLE_PARTIAL_OPEN_BUTTONS,

  [CONFIG_PICKER_OVERLAP_PX]: ESC_PICKER_OVERLAP_PX,
  [CONFIG_CURRENT_POSITION]: ESC_CURRENT_POSITION,

  [CONFIG_BUTTON_STOP_HIDE_STATES]: ESC_BUTTON_STOP_HIDE_STATES,
  [CONFIG_BUTTON_UP_HIDE_STATES]: ESC_BUTTON_UP_HIDE_STATES,
  [CONFIG_BUTTON_DOWN_HIDE_STATES]: ESC_BUTTON_DOWN_HIDE_STATES,

};
const IMAGE_TYPES = [
  CONFIG_WINDOW_IMAGE,
  CONFIG_VIEW_IMAGE,
  CONFIG_SHUTTER_SLAT_IMAGE,
  CONFIG_SHUTTER_BOTTOM_IMAGE,
];
const SHUTTER_CSS =`

      .${ESC_CLASS_BUTTON} {
        height: 36px;
        width: 36px;
      }
      .${ESC_CLASS_SHUTTER} {
        overflow: visible;
        --mdc-icon-button-size: 48px;
        --mdc-icon-size: 24px;

      }
      .${ESC_CLASS_MIDDLE} {
        display: flex;
        flex-flow: row;
        justify-content: center;
        align-items: center;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
      }
      .${ESC_CLASS_BUTTONS} {
        display: flex;
        flex: none;
        justify-content: center;
        align-items: center;
        max-width: 100%;
      }
      .${ESC_CLASS_BUTTONS_TOP} {
        flex-flow: row;
      }
      .${ESC_CLASS_BUTTONS_BOTTOM} {
        flex-flow: row;
      }
      .${ESC_CLASS_BUTTONS_LEFT} {
        flex-flow: column;
      }
      .${ESC_CLASS_BUTTONS_RIGHT} {
        flex-flow: column;
      }
      .${ESC_CLASS_BUTTONS} ha-icon-button {
        display: inline-block;
        width: min-content;
      }
      .${ESC_CLASS_SELECTOR} {
        max-width: 100%;
        justify-content: center;
        align-items: center;
      }
      .${ESC_CLASS_SELECTOR_PARTIAL} {
        z-index: 2;
        position: absolute;
        top: 0;
        left: 0px;
        width: 100%;
        height: 1px;
        background-color: gray;
      }
      .${ESC_CLASS_SELECTOR_PICTURE} {
        max-width: 100%;
        z-index: 1;
        justify-content: center;
        position: relative;
        margin: auto;
        line-height: 0;
        overflow: hidden;
      }
      .${ESC_CLASS_SELECTOR_VIEW} {
        z-index: -2;
      
        overflow: hidden;
        
        position: absolute;
        top: 0;
        left: 0;
        
        background-size: cover;
        background-position: center;
      }
      .${ESC_CLASS_SELECTOR_FRAME} {
        margin: auto;
        width: 100%;
        height: 100%;
        
        position: absolute;
        top: 0;
        left: 0;
        
        background-size: cover;
        background-position: center;
        
        image-rendering: auto;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
      }
      .${ESC_CLASS_SELECTOR_SLIDE} {
        z-index: -1;
        position: absolute;
        background-position: bottom;
        overflow: hidden;
        top: 0;
        
        image-rendering: auto;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
      }
      .${ESC_CLASS_SELECTOR_SLIDE}>img {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
      }
      .${ESC_CLASS_SELECTOR_PICKER} {
        z-index: 3;
        position: absolute;
        top: 20px;
        left: 0%;
        width: 100%;
        cursor: pointer;
        height: 40px;
      }
      .${ESC_CLASS_MOVEMENT_OVERLAY} {
        z-index: -1;
        display: block;
        position: absolute;
        top: 0;
        background-color: rgba(0,0,0,0.3);
        text-align: center;
        --mdc-icon-size: 60px;
      }
      .${ESC_CLASS_MOVEMENT_OPEN} {
        z-index: 3 !important;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        position: absolute;
        display: block;
      }
      .${ESC_CLASS_MOVEMENT_CLOSE} {
        z-index: 3 !important;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        position: absolute;
        display: block;
      }
      .${ESC_CLASS_TOP}, .${ESC_CLASS_BOTTOM} {
        text-align: center;
        padding-top: 8px;
        padding-bottom: 8px;
      }
      .${ESC_CLASS_LABEL} {
        display: inline-block;
        clear: both;
        font-size: 20px;
        line-height: 30px;
        bottom: 0;
        position: relative;
        cursor: pointer;
      }
      .${ESC_CLASS_LABEL_DISABLED} {
        color: var(--secondary-text-color);
      }
      .${ESC_CLASS_TITLE_DISABLED} {
        display: hidden;
      }
      .${ESC_CLASS_POSITION} {
        display: inline-block;
        vertical-align: top;
        line-height: 20px;
        clear: both;
        font-size: 14px;
        height: 20px;
        border-radius: 5px;
        margin: 5px;
      }
      .${ESC_CLASS_POSITION}>span {
        background-color: var(--secondary-background-color);
        padding: 2px 5px 2px 5px;
      }
      .${ESC_CLASS_HA_ICON} {
        padding-bottom: 10px;
      }
      .${ESC_CLASS_HA_ICON_LOCK} {
        position: relative;
        top: -0.3em;
        --mdc-icon-size: 10px;
      }
      .blankDiv{
        width: calc(var(--mdc-icon-size)*1.5);
        height: 1px;
      }
      .top-left, .top-right {
        --mdc-icon-size: var(--icon-size-wifi-battery, 24px);
        position: absolute;
        padding: 0 10px 10px 10px;
        text-align: center;
      }
      .top-left {
        left: 0;
      }
      .top-right {
        right: 0;
      }
   `;

class EnhancedShutterCardNew extends LitElement{
  //reactive properties
  static get properties() {
    return {
      hass: {type: Object},
      config: {type: Object},
      isShutterConfigLoaded: {type: Boolean, state: true},
      localCfgs: {type: Object, state: true},
      screenOrientation: {type: Object, state: true},
    };
  }

  constructor() {
    super();
    console_log('Card constructor');

    this.isShutterConfigLoaded = false;
    this.isResizeInProgress = false;
    this.handleWindowResize = this.onWindowResize.bind(this); // Bind the function once

    console_log('Card constructor: isShutterConfigLoaded:',this.isShutterConfigLoaded);
    console_log('Card constructor ready');
  }
  #defAllShutterConfig()
  {
    this.#getAllImages();
    this.globalCfg = this.#buildConfig(CONFIG_DEFAULT,this.config);
    this.localCfgs = {};
    this.config.entities.map((currEntityCfg) => {
      let tempCfg = this.#buildConfig(this.globalCfg,currEntityCfg);
      this.localCfgs[tempCfg.entity] = new shutterCfg(this.hass,tempCfg,this.allImages);
    });
    this.isShutterConfigLoaded = true;
  }

  #getAllImages(){
    this.allImages={};
    let base_image_map = this.config[CONFIG_IMAGE_MAP] || ESC_IMAGE_MAP;

    IMAGE_TYPES.forEach((image_type) =>
    {
      let images={};

      let base_image = this.config[image_type] ? defImagePathOrColor(base_image_map,this.config[image_type],image_type) : `${ESC_IMAGE_MAP}/${CONFIG_DEFAULT[image_type]}`;
      this.config.entities.forEach((entity) =>
      {
        let image_map = entity.image_map || base_image_map;
        let entityId = entity.entity ? entity.entity : entity;

        let image = entity[image_type] ? defImagePathOrColor(image_map,entity[image_type],image_type) : base_image;
        let src = image || `${ESC_IMAGE_MAP}/${CONFIG_DEFAULT[image_type]}`;
        images[entityId]={entityId,src};

      });
      this.allImages[image_type]=images;
    });
  }
  #buildConfig(configMain,configSub)
  {
    if (typeof configSub !== 'object' || configSub === null){
      configSub={[CONFIG_ENTITY_ID]: configSub};
    }

    let config={};
    Object.keys(configMain).forEach(keyMain =>{
      // handle deprecations ....
      let keySub = keyMain;
      if (keyMain == CONFIG_TITLE_POSITION && configSub[keyMain]){
        console.warn("Enhanced Shutter Card: 'title_position'-setting is deprecated, use 'name_position' !!");
        if (!configSub[CONFIG_NAME_POSITION]) {
          keySub = CONFIG_NAME_POSITION;
        }
      }
      // check already defined by deprecation handling ...
      if (!config[keySub]) {
        config[keySub] = (typeof configSub[keyMain] === 'undefined' || configSub[keyMain]=== null || configSub[keyMain]==='null') ? configMain[keyMain] : configSub[keyMain];
      }
    });
    return config;
  }
/*
* OVERRIDE FUNCTIONS LIT ELEMENT
*/
  shouldUpdate(changedProperties) {

    console_log('Card shouldUpdate');
    console_log('Card shouldUpdate: isShutterConfigLoaded:',this.isShutterConfigLoaded);
    let doUpdate =false;

    if (this.isShutterConfigLoaded){

      changedProperties.forEach((oldValue, propName) => {
        let newCoverStates;
        if (propName=='hass'){

            const statesNew = Object.values(this[propName].states);
            newCoverStates = statesNew.filter(entity => entity.entity_id.startsWith('cover.'));

            Object.keys(this.localCfgs).forEach(entityId =>{
              const entity = Object.values(newCoverStates).find(states => states.entity_id === entityId);
              if (entity) {
                let shutterState = `${entity.state}-${entity.attributes.current_position}`;
                if (shutterState != this.localCfgs[entityId].shutterState){
                  this.localCfgs[entityId].shutterState = shutterState;
                  doUpdate =true;
                }
              }
            });

        }else{
          doUpdate =true;
        }
      });
    }
    console_log('Card shouldUpdate ready: doUpdate=',doUpdate);
    return doUpdate;
  //    return changedProperties.has('prop1');
  }
  willUpdate(changedProperties){
    //console_log('Card willUpdate');
    super.willUpdate();
    //console_log('Card willUpdate: isShutterConfigLoaded:',this.isShutterConfigLoaded);
    //console_log('Card willUpdate ready');
  }
  update(changedProperties)
  {
    //console_log('Card Update');
    super.update(changedProperties);
    changedProperties.forEach((oldValue, prop) => {
      console_log(`Card Update, Property `,prop,` changed from`,oldValue,` to `,this[prop]);
    });
    //console_log('Card Update ready');
  }
  updated(changedProperties) {
    //console_log('Card Updated');
    super.updated(changedProperties);
    //console_log('Card Updated ready');
  }
  firstUpdated() {
    //console_log('Card firstUpdated');
    //console_log('Card firstUpdated isShutterConfigLoaded',this.isShutterConfigLoaded);
    //console_log('Card firstUpdated ready');
  }
  connectedCallback() {
    console_log('Card connectedCallback: isShutterConfigLoaded:',this.isShutterConfigLoaded);
    super.connectedCallback();
    Globals.huiView = findElement(HA_HUI_VIEW);
    const rect = Globals.huiView.getBoundingClientRect();
    this.checkOrientation(Globals.huiView); // Initial orientation check

    if (!this.isShutterConfigLoaded) {
      this.#defAllShutterConfig();
    }
    this.startResizeObserver();
    // Initialize window resize event listener
    window.addEventListener('resize', this.handleWindowResize);

    console_log('Card connectedCallback ready');
  }
  // Check the orientation based on the window and div visibility
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.resizeObserver) this.resizeObserver.disconnect();
    window.removeEventListener('resize', this.handleWindowResize);
  }
  checkOrientation(element) {
    // Get the window size

    this.isResizeInProgress = true; // Set flag to indicate a resize operation is in progress

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Get the bounding rect of the div (the visible area of the div)
    const rect = element.getBoundingClientRect();

    // Calculate the visible width and height of the element within the viewport
    const visibleWidth = Math.max(0, Math.min(rect.right, windowWidth) - Math.max(rect.left, 0));
    const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));

    // Determine the orientation based on visible area and window size
    Globals.screenOrientation = {value: visibleWidth*1.4 > visibleHeight ? LANDSCAPE : PORTRAIT};
    this.screenOrientation = Globals.screenOrientation;
    console_log('Card checkOrientation: screenOrientation:',this.screenOrientation);
    // Trigger re-render to update orientation
    //this.requestUpdate();
    // After orientation check is done, reset the flag
    this.isResizeInProgress = false;
  }
  startResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      if (!this.isResizeInProgress) {
        this.checkOrientation(Globals.huiView);
      }
    });
    this.resizeObserver.observe(Globals.huiView);
  }
  onWindowResize() {
    if (!this.isResizeInProgress) {
         this.checkOrientation(Globals.huiView); // Recheck orientation on window resize
    }
  }

  render() {
    console_log('Card Render');
    //console_log('Card Render,isShutterConfigLoaded',this.isShutterConfigLoaded);
    if (!this.config || !this.hass || !this.isShutterConfigLoaded) {
      console.warn('ShutterCard  .. no content ..');
      return html`Waiting ...`;
    }
    let htmlout = html`
        <ha-card .header=${this.config.title}>
          <div class="${ESC_CLASS_SHUTTERS}">
            ${this.config.entities.map( // TODO replace config by global.cfg ??
              (currEntity) => {
                let entityId = currEntity.entity ? currEntity.entity : currEntity;

                this.localCfgs[entityId].setState(this.hass.states[entityId]);

                return html`
                  <enhanced-shutter
                    .isShutterConfigLoaded=${this.isShutterConfigLoaded}
                    .hass=${this.hass}
                    .config=${currEntity}
                    .cfg=${this.localCfgs[entityId]}
                    .shutterState=${this.localCfgs[entityId].shutterState}
                    .screenOrientation=${this.screenOrientation}
                  >
                  </enhanced-shutter>
                  <div class="seperate"></div>
                `;
              }
            )}
          </div>
        </ha-card>
      `
    console_log('Card Render ready');
    return htmlout;
  }

  static get styles() {
    const CSS = `
     .${ESC_CLASS_SHUTTERS} {
      padding: 16px;
     }
    .seperate:not(:last-child){
      height: 5px;
      margin-left: auto;
      margin-right: auto;
      width: 25%;
      border-width: 3px 0 0 0;
      border-style: solid;
      border-color: var(--divider-color);
    }
    `;
    return css`${unsafeCSS(CSS)}`;
  }
/*
* OVERRIDE FUNCTIONS HA CARD
*/
  setConfig(config)
  {
    if (!config.entities) {
      throw new Error('You need to define entities');
    }
    this.config = config;
  }
  getCardSize() {
    console_log('Card getCardSize');
    return this.config.entities.length + 1;
  }

  getLayoutOptions(){
    const test=0;
  };
  //Section layout : we compute the size of the card. (experimental)
  getGridOptions(){
    // from https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/#sizing-in-sections-view
    // for getLayoutOptions() {
    //   size off cells.
    //   width:
    //      layout: between 80px and 120px depending on the screen size
    //   height: 56px
    //   gap between cells: 8px

    // for getGridOptions() (used here)
    //   width:
    //      layout: between 27px and 40px depending on the screen size (width for code: size is LayoutWidth/3 )
    //   height: 56px
    //   gap between cells: 8px

    //console_log('Card getGridOptions');
    //console_log ('Card getGridOptions isShutterConfigLoaded',this.isShutterConfigLoaded);

    // HA basic szies for calculations:

    const haCardPadding= 14; // 1rem
    const haCardTitleFontHeight= 24;
    const haTitleHeightPx = 76;
    const haTitleFont = 'Roboto, Noto, sans-serif';

    const haGridPxHeight =56;
    const haGridPxHeightGap = 8;

    const haGridPxWidthMin  =19; // 19
    const haGridPxWidthMean =26; // 26
    const haGridPxWidthMax  =32; // 32
    const haGridPxWidthGap  = 8;

    const shutterTitleHeight = 20;

    /**
     * load config is needed.
     */
    if (!this.isShutterConfigLoaded)
      this.#defAllShutterConfig();

    /**
     * initial
     */
    let totalHeightPx = 0;
    let totalWidthPx =0;

    if (this.config && this.config.entities && this.isShutterConfigLoaded) {
      let titleSize;
      if (this.config.title){
        // TODO: Add Card title to globalCfg
        titleSize= getTextSize(this.config.title,haTitleFont,haCardTitleFontHeight);
        totalHeightPx += haTitleHeightPx; // TODO
        totalWidthPx  += titleSize.width;
      }
      console_log('Start size: totalHeightPx:',totalHeightPx,'totalWidthPx',totalWidthPx,titleSize);
      Object.keys(this.localCfgs).forEach(key =>{

        let localHeightPx=0;
        let localWidthPx =0;

        let cfg= this.localCfgs[key];
        const haButtonSize = cfg.iconButtonSize();
        /*
        * Size shutter title row
        */
        if (!cfg.nameDisabled()){
          let titleSize = getTextSize(cfg.friendlyName(),haTitleFont,shutterTitleHeight,'400');
          let partHeightPx = 30;
          let partWidthPx = titleSize.width;

          localHeightPx += partHeightPx;
          localWidthPx = Math.max(totalWidthPx,partWidthPx);
          console_log('part size B*H',partWidthPx,partHeightPx,'after title',titleSize);
          console_log('size B*H',localWidthPx,localHeightPx);
        }
        /*
        * Size shutter opening row
        */
        if (!cfg.openingDisabled() && !cfg.inlineHeader()){
          let pctSize = getTextSize(cfg.computePositionText(),haTitleFont,14);
          let partHeightPx = 20;
          let partWidthPx = pctSize.width;
          localHeightPx += partHeightPx;
          localWidthPx = Math.max(totalWidthPx,partWidthPx);
          console_log('part size B*H',partWidthPx,partHeightPx,'after open%',pctSize);
          console_log('size B*H',localWidthPx,localHeightPx);
        }
        /*
        * padding top and bottom rows
        */
        let partHeightPx = 32;
        localHeightPx += partHeightPx;
        console_log('part size H',partHeightPx,'after including padding');
        console_log('size B*H',localWidthPx,localHeightPx);

        //totalHeightPx+=localHeightPx;
        console_log('size: totalHeightPx:',totalHeightPx,'totalWidthPx',totalWidthPx);
        /*
        * size image
        */
        partHeightPx = cfg.windowHeightPx();
        let partWidthPx = cfg.windowWidthPx();
        let localHeight2Px = partHeightPx;
        let localWidth2Px  = partWidthPx;
        console_log('part size B*H',partWidthPx,partHeightPx,'after image');
        console_log('size B2*H2',localWidth2Px,localHeight2Px);

        if (cfg.buttonsInRow()){
          //console_log('Buttons Naast shutter');
          /*
          * size standard-buttons
          */
          if (!cfg.disableStandardButtons()) {
            let partHeightPx = haButtonSize*3;
            let partWidthPx = haButtonSize;
            localHeight2Px = Math.max(localHeight2Px,partHeightPx);
            localWidth2Px+=partWidthPx;
            console_log('part size B*H',partWidthPx,partHeightPx,'after std buttons');
            console_log('size B2*H2',localWidth2Px,localHeight2Px);
          }

          /*
          * size tilt-buttons
          */
          if (cfg.canTilt()) {
            let partHeightPx = haButtonSize*2;
            let partWidthPx = haButtonSize;
            localHeight2Px = Math.max(localHeight2Px,partHeightPx);
            localWidth2Px += partWidthPx;
            console_log('part size B*H',partWidthPx,partHeightPx,'after tilt');
            console_log('size B2*H2',localWidth2Px,localHeight2Px,);
          }

          /*
          * size partial-open-buttons
          */
          if (!cfg.disablePartialOpenButtons()) {
            let partHeightPx = haButtonSize*3;
            let partWidthPx = haButtonSize*2;
            localHeight2Px = Math.max(localHeight2Px,partHeightPx);
            localWidth2Px+=partWidthPx;
            console_log('part size B*H',partWidthPx,partHeightPx,'after partial buttons');
            console_log('size B2*H2',localWidth2Px,localHeight2Px);
          }


        }else{
          console_log('Buttons boven/onder shutter');
          /*
          * size standard-buttons
          */
          if (!cfg.disableStandardButtons()) {
            let partHeightPx = haButtonSize;
            let partWidthPx = haButtonSize*3 ;
            localHeight2Px += partHeightPx;
            localWidth2Px=Math.max(localWidth2Px,partWidthPx);
            console_log('part size B*H',partWidthPx,partHeightPx,'after std buttons');
            console_log('size B2*H2',localWidth2Px,localHeight2Px);
          }
          /*
          * size tilt-buttons
          */
          if (cfg.canTilt()) {
            let partHeightPx = haButtonSize;
            let partWidthPx = haButtonSize*2;
            localHeight2Px += partHeightPx;
            localWidth2Px = Math.max(localWidth2Px,partWidthPx);
            console_log('part size B*H',partWidthPx,partHeightPx,'after tilt');
            console_log('size B2*H2',localWidth2Px,localHeight2Px);
          }


          /*
          * size partial-open-buttons
          */
          if (!cfg.disablePartialOpenButtons()) {
            let partHeightPx = haButtonSize*2;
            let partWidthPx =  haButtonSize*3;
            localHeight2Px += partHeightPx;
            localWidth2Px=Math.max(localWidth2Px,partWidthPx);
            console_log('part size B*H',partWidthPx,partHeightPx,'after partial buttons');
            console_log('size B2*H2',localWidth2Px,localHeight2Px);
          }

        }
        //localHeightPx+=haCardPadding*2;
        localWidthPx  = Math.max(localWidthPx,localWidth2Px);
        localHeightPx += localHeight2Px;
        localHeightPx += 16; // include bottom padding
        console_log(`Endsize ${key} B*H`,localWidthPx,localHeightPx);

        totalWidthPx  = Math.max(totalWidthPx,localWidthPx);
        totalHeightPx += localHeightPx;
      });
      console_log('Endsize: totalHeightPx:',totalHeightPx,'totalWidthPx',totalWidthPx);
      totalHeightPx += 16; // include bottom padding
      totalWidthPx += 32;
      console_log('Add padding Endsize: totalHeightPx:',totalHeightPx,'totalWidthPx',totalWidthPx);
    }
    let nbRows= Math.ceil((totalHeightPx+haGridPxHeightGap)/(haGridPxHeight+haGridPxHeightGap));
    let nbRows2 = ((totalHeightPx+haGridPxHeightGap)/(haGridPxHeight+haGridPxHeightGap));
    let nbColsMin= Math.ceil((totalWidthPx+haGridPxWidthGap)/(haGridPxWidthMax+haGridPxWidthGap));
    let nbColsMean= Math.ceil((totalWidthPx+haGridPxWidthGap)/(haGridPxWidthMean+haGridPxWidthGap));
    let nbColsMax= Math.ceil((totalWidthPx+haGridPxWidthGap)/(haGridPxWidthMin+haGridPxWidthGap));
    //let nbRows= Math.ceil(totalHeightPx/haGridPxHeight);
    //let nbColsMin= Math.ceil(totalWidthPx/haGridPxWidthMax);
    //let nbColsMax= Math.ceil(totalWidthPx/haGridPxWidthMin);

    console_log(`size Card getGridOptions totalHeightPx:`,totalHeightPx,'totalWidthPx',totalWidthPx, " ==> nbRows : " + nbRows +'/' + nbRows2 + " nbColsMin : " + nbColsMin + " nbColsMean : " + nbColsMean+ " nbColsMax : " + nbColsMax);
    console_log('Card getGridOptions ready');
    return {
      rows: nbRows,
      min_rows: nbRows,
      max_rows: nbRows,
      columns: nbColsMax,
      min_columns: nbColsMin,
      max_columns: nbColsMax,
    };
  }
  static getStubConfig(hass, unusedEntities, allEntities) {
    //Search for a cover entity unused first then in all entities.
    let entityId = unusedEntities.find((eid) => eid.split(".")[0] === "cover" );
    if (!entityId) {
      entityId = allEntities.find((eid) => eid.split(".")[0] === "cover");
    }
    let entity = hass.states[entityId];
    return {
      "entities": [{
        "entity": entityId,
        "name": entity.attributes.friendly_name ? entity.attributes.friendly_name : "My Enhanced Shuttter",
        "top_offset_pct": 13,
        "button_up_hide_states": [
          "open",
          "opening",
          "closing"
        ],
        "button_down_hide_states": [
          "closed",
          "opening",
          "closing"
        ],
        "button_stop_hide_states": [
          "open",
          "closed",
          "partial_open"
        ]
      }]
    };
  }
}


class EnhancedShutter extends LitElement
{
  //reactive properties
  static get properties() {
    return {
      shutterState: {type: String},
      screenPosition: {state: true},
      screenOrientation: {type: String},
    };
  }
  constructor(){
    //console_log('Shutter constructor');
    super(); //  mandetory
    this.screenPosition=-1;
    this.positionText ='';
    this.action = '#';
    console_log('Version:',this.version);
    //console_log('Shutter constructor ready');
  }
  shouldUpdate(changedProperties)
  {
    console_log(`Shutter shouldUpdate: ${this.cfg.entityId()}`);

    changedProperties.forEach((oldValue, propName) => {
      console_log(`Shutter ${propName} changed. oldValue: ${oldValue}; new: ${this[propName]}`);
    });
    console_log('Shutter shouldUpdate ready');
    return true;
  }

  update(changedProperties) {
    //console_log('Shutter Update');
    super.update(changedProperties);
    //console_log('Shutter Update ready');
  }
  updated(changedProperties) {
    // Log the properties that were updated
    //console_log('Shutter Updated');
    super.updated(changedProperties);
    this.action='cover';
    //console_log('Shutter Updated ready');
  }
  render()
  {
    console_log('Shutter Render',this.cfg.entityId());
    let entityId = this.cfg.entityId();
    let positionText;
    let screenPosition;

    if (this.action=='user-drag'){
      positionText =  this.positionText;
      screenPosition = this.screenPosition
    }else{
      positionText =  this.cfg.computePositionText();
      screenPosition =  this.cfg.defScreenPositionFromPercent();
    }

    console_log('Shutter Render ready');
    return html`
      <div class=${ESC_CLASS_SHUTTER} data-shutter="${entityId}"
        style="--mdc-icon-button-size: ${this.cfg.iconButtonSize()}${UNITY};
               --mdc-icon-size: ${this.cfg.iconSize()}${UNITY};
               --icon-size-wifi-battery: ${this.cfg.iconSizeWifiBattery()}${UNITY};
              "
      >
        <!-- battery-icon -->
        ${this.cfg.batteryEntityId() ? html`
          <div class="top-left" style="color: ${this.cfg.batteryIconColor()};";>
            <ha-icon
              class="${ESC_CLASS_HA_ICON}"
              icon=${this.cfg.batteryLevelIcon()}
            ></ha-icon>
            <div style="text-align: center; line-height: ${this.cfg.iconScalePercent()}; font-size: ${this.cfg.iconScalePercent()};">
              ${this.cfg.batteryLevelText()}
            </div>
          </div>
          ` : ''
        }
        <!-- signal-icon -->
        ${this.cfg.signalEntityId() ? html`
          <div class="top-right" style="color: ${this.cfg.signalIconColor()};">
            <ha-icon
              class="${ESC_CLASS_HA_ICON}"
              icon=${this.cfg.signalLevelIcon()}
            ></ha-icon>
            <div style="text-align: center; line-height: ${this.cfg.iconScalePercent()}; font-size: ${this.cfg.iconScalePercent()};">
              ${this.cfg.signalLevelText()}
            </div>
          </div>
          ` : ''
        }
        <div class="${ESC_CLASS_TOP}">
          <div class="${ESC_CLASS_LABEL} ${this.cfg.disabledGlobaly() ? `${ESC_CLASS_LABEL_DISABLED}` : ''}"
            @click="${() => this.doDetailOpen(entityId)}"
            style="display: ${this.cfg.displayName(TOP)}"
          >
            ${this.cfg.friendlyName()}
            ${this.cfg.passiveMode() ? html`
              <span class="${ESC_CLASS_HA_ICON_LOCK}">
                <ha-icon icon="mdi:lock"></ha-icon>
              </span>
            `:''}
          </div>
          <div class="${ESC_CLASS_POSITION} ${this.cfg.disabledGlobaly() ? `${ESC_CLASS_LABEL_DISABLED}` : ''}"
            style="display: ${this.cfg.displayOpening(TOP)}">
            <span>${positionText}</span>
          </div>
        </div>

        <div class="${ESC_CLASS_MIDDLE}" style="flex-flow: ${!this.cfg.buttonsInRow() ? 'column': 'row'}${this.cfg.buttonsContainerReversed() ? '-reverse' : ''} nowrap;">
          ${this.cfg.buttonsLeftActive()
          ? html`
            <div
              class="${ESC_CLASS_BUTTONS}"
              style="
                flex-flow: ${!this.cfg.buttonsInRow() ? 'row': 'column'} wrap;
                flex: none;
              ">
              ${!this.cfg.buttonUpHideStates().includes(this.cfg.movementState()) ? html`
                <ha-icon-button
                  label="${this.hass.localize('ui.card.cover.open_cover')}"
                  .disabled=${this.cfg.disabledGlobaly() || this.cfg.upButtonDisabled()}
                  @click=${()=> this.doOnclick(entityId, `${ACTION_SHUTTER_OPEN}`)} >
                  <ha-icon
                    class="${ESC_CLASS_HA_ICON}"
                    icon="mdi:arrow-up">
                  </ha-icon>
                </ha-icon-button>
              ` : ''}
              ${!this.cfg.buttonStopHideStates().includes(this.cfg.movementState())? html`
                <ha-icon-button
                  label="${this.hass.localize('ui.card.cover.stop_cover')}"
                  .disabled=${this.cfg.disabledGlobaly()}
                  @click=${()=> this.doOnclick(entityId, `${ACTION_SHUTTER_STOP}`)}>
                  <ha-icon
                    class="${ESC_CLASS_HA_ICON}"
                    icon="mdi:stop">
                  </ha-icon>
                </ha-icon-button>
              ` : ''}
              ${!this.cfg.buttonDownHideStates().includes(this.cfg.movementState())? html`
                <ha-icon-button
                  label="${this.hass.localize('ui.card.cover.close_cover')}"
                  .disabled=${this.cfg.disabledGlobaly() || this.cfg.downButtonDisabled()}
                  @click=${()=> this.doOnclick(entityId, `${ACTION_SHUTTER_CLOSE}`)} >
                  <ha-icon
                    class="${ESC_CLASS_HA_ICON}"
                    icon="mdi:arrow-down">
                  </ha-icon>
                </ha-icon-button>
              ` : ''}
            </div>
            <div
              class="${ESC_CLASS_BUTTONS}"
              style="
                flex-flow: ${!this.cfg.buttonsInRow() ? 'row': 'column'} wrap;
                flex: none;
                ${this.cfg.partial() || this.cfg.canTilt()?'':'display: none'};
              ">
              ${this.cfg.partial()  /* TODO localize texts */
                ? html`
                  <ha-icon-button label="Partially close (${100-this.cfg.partial()}% closed)"  .disabled=${this.cfg.disabledGlobaly()} @click="${()=> this.doOnclick(entityId, `${ACTION_SHUTTER_SET_POS}`, this.cfg.partial() )}" >
                      <ha-icon class="${ESC_CLASS_HA_ICON}" icon="mdi:arrow-expand-vertical"></ha-icon>
                  </ha-icon-button>` : ''}
              ${this.cfg.canTilt() ? html`
                  <ha-icon-button label="${this.hass.localize('ui.card.cover.open_tilt_cover')}"  .disabled=${this.cfg.disabledGlobaly()} @click="${()=> this.doOnclick(entityId, `${ACTION_SHUTTER_OPEN_TILT}`)}">
                      <ha-icon class="${ESC_CLASS_HA_ICON}" icon="mdi:arrow-top-right"></ha-icon>
                  </ha-icon-button>
                  <ha-icon-button label="${this.hass.localize('ui.card.cover.close_tilt_cover')}"  .disabled=${this.cfg.disabledGlobaly()} @click="${()=> this.doOnclick(entityId, `${ACTION_SHUTTER_CLOSE_TILT}`)}">
                      <ha-icon class="${ESC_CLASS_HA_ICON}" icon="mdi:arrow-bottom-left"></ha-icon>
                  </ha-icon-button>` : ''}
            </div>`
           : html`
            <div class='blankDiv'></div>
          `}
          <div
            class="${ESC_CLASS_SELECTOR}"
            style="
              flex-grow: 0;
              flex-shrink: 1;
              flex-basis: ${this.cfg.buttonsInRow() ? this.cfg.windowWidthPx():this.cfg.windowHeightPx()}${UNITY};
            "
          >
            <div class="${ESC_CLASS_SELECTOR_PICTURE}"
              style="
                width: ${this.cfg.buttonsInRow() ? '100%': this.cfg.windowWidthPx()+UNITY};
                height: ${this.cfg.windowHeightPx()+UNITY};
              ">
                <img class="${ESC_CLASS_SELECTOR_VIEW}" style="
                  margin: ${this.cfg.topOffsetPx()+UNITY} ${this.cfg.rightOffsetPx()+UNITY} ${this.cfg.bottomOffsetPx()+UNITY} ${this.cfg.leftOffsetPx()+UNITY};
                  width: calc(100% - (${(this.cfg.leftOffsetPx() + this.cfg.rightOffsetPx())+UNITY}));
                  height: ${this.cfg.coverAreaHeightPx()}${UNITY};
                  ${this.cfg.viewImage().includes('.')
                    ? `background-image: url(${this.cfg.viewImage()}`
                    : `background-color:${this.cfg.viewImage()}`
                  }">
                <img class="${ESC_CLASS_SELECTOR_FRAME}" src= "${this.cfg.windowImage() } ">
              <div class="${ESC_CLASS_SELECTOR_SLIDE}" style="
                margin: ${this.cfg.topOffsetPx()+UNITY} ${this.cfg.rightOffsetPx()+UNITY} ${this.cfg.bottomOffsetPx()+UNITY} ${this.cfg.leftOffsetPx()+UNITY};
                width: calc(100% - (${(this.cfg.leftOffsetPx() + this.cfg.rightOffsetPx())+UNITY}));
                height: ${screenPosition + this.cfg.shutterBottomHeightPx()}${UNITY};
                background-image: url(${this.cfg.shutterSlatImage()});
                ">
                <img style="height: ${this.cfg.shutterBottomHeightPx()}${UNITY};" src="${this.cfg.shutterBottomImage()}">
              </div>
              <div class="${ESC_CLASS_SELECTOR_PICKER}"
                @pointerdown="${this.mouseDown}"
                @mousedown="${this.mouseDown}"
                @touchstart="${this.mouseDown}"
                style="top: ${screenPosition + this.cfg.topOffsetPx() - this.cfg.pickerOverlapPx() + (this.cfg.shutterBottomHeightPx() / 2)}${UNITY};">
              </div>
              ${this.cfg.partial() && !this.cfg.offset()? html`
                <div class="${ESC_CLASS_SELECTOR_PARTIAL}" style="top:${this.cfg.defScreenPositionFromPercent(this.cfg.partial())}${UNITY}"></div>
                ` : ''}
              <div class="${ESC_CLASS_MOVEMENT_OVERLAY}" style="
                top: ${this.cfg.topOffsetPx()}${UNITY};
                left: ${this.cfg.leftOffsetPx()+UNITY};
                width: calc(100% - (${(this.cfg.leftOffsetPx() + this.cfg.rightOffsetPx())+UNITY}));
                height: ${this.cfg.coverAreaHeightPx()}${UNITY};
                display: ${(this.cfg.movementState() == SHUTTER_STATE_OPENING || this.cfg.movementState() == SHUTTER_STATE_CLOSING) ? 'block' : 'none'}">
                <ha-icon class="${ESC_CLASS_MOVEMENT_OPEN}" icon="mdi:arrow-up" style="display: ${this.cfg.movementState() == SHUTTER_STATE_OPENING ? 'block' : 'none'}"></ha-icon>
                <ha-icon class="${ESC_CLASS_MOVEMENT_CLOSE}" icon="mdi:arrow-down" style="display: ${this.cfg.movementState() == SHUTTER_STATE_CLOSING ? 'block' : 'none'}"></ha-icon>
              </div>
            </div>
          </div>
          ${this.cfg.buttonsRightActive() && !this.cfg.disablePartialOpenButtons() /* TODO localize texts */
            ? html`
              <div class="${ESC_CLASS_BUTTONS}" style="flex-flow: ${!this.cfg.buttonsInRow() ? 'row': 'column'} wrap;">
                <ha-icon-button label="Fully opened" .disabled=${this.cfg.disabledGlobaly() || this.cfg.upButtonDisabled()} @click=${()=> this.doOnclick(entityId, `${ACTION_SHUTTER_SET_POS}`, 100)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4Z"></ha-icon-button>
                <ha-icon-button label="Partially close (${25}% closed)" .disabled=${this.cfg.disabledGlobaly()} @click=${()=> this.doOnclick(entityId, `${ACTION_SHUTTER_SET_POS}`, 75)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9Z"></ha-icon-button>
                <ha-icon-button label="Partially close (${50}% closed)" .disabled=${this.cfg.disabledGlobaly()} @click=${()=> this.doOnclick(entityId, `${ACTION_SHUTTER_SET_POS}`, 50)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12Z"></ha-icon-button>
              </div>
              <div class="${ESC_CLASS_BUTTONS}" style="flex-flow: ${!this.cfg.buttonsInRow() ? 'row': 'column'} wrap;">
                <ha-icon-button label="Partially close (${75}% closed)" .disabled=${this.cfg.disabledGlobaly()} @click=${()=> this.doOnclick(entityId, `${ACTION_SHUTTER_SET_POS}`, 25)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15Z"></ha-icon-button>
                <ha-icon-button label="Partially close (${90}% closed)" .disabled=${this.cfg.disabledGlobaly()} @click=${()=> this.doOnclick(entityId, `${ACTION_SHUTTER_SET_POS}`, 10)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15M8 18H16V20H8V18Z"></ha-icon-button>
                <ha-icon-button label="Fully closed" .disabled=${this.cfg.disabledGlobaly() || this.cfg.downButtonDisabled()} @click=${()=> this.doOnclick(entityId, `${ACTION_SHUTTER_SET_POS}`, 0)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V20H8V18Z"></ha-icon-button>
              </div>
            `
           : html`
            <div class='blankDiv'></div>
          `}
        </div>

        <div class="${ESC_CLASS_BOTTOM}">
          <div class="${ESC_CLASS_LABEL} ${this.cfg.disabledGlobaly() ? `${ESC_CLASS_LABEL_DISABLED}` : ''}"
            @click="${() => this.doDetailOpen(entityId)}"
            style="display: ${this.cfg.displayName(BOTTOM)}">
            ${this.cfg.friendlyName()}
            ${this.cfg.passiveMode() ? html`
              <span class="${ESC_CLASS_HA_ICON_LOCK}">
                <ha-icon icon="mdi:lock"></ha-icon>
              </span>
            `:''}
          </div>
          <div class="${ESC_CLASS_POSITION} ${this.cfg.disabledGlobaly() ? `${ESC_CLASS_LABEL_DISABLED}` : ''}"
            style="display: ${this.cfg.displayOpening(BOTTOM)}">
            <span>${positionText}</span>
          </div>
        </div>
      </div>
    `;
  }

  //##########################################

  doDetailOpen(entityIdValue) {
    if (!this.cfg.passiveMode()){
      let e = new Event('hass-more-info', { composed: true});
      e.detail= { entityId : entityIdValue};
      this.dispatchEvent(e);
    }
  }
  doOnclick(entityId, command, position) {

    this.action='user-click';
    const services ={
      [ACTION_SHUTTER_OPEN] : {'args': ''},
      [ACTION_SHUTTER_CLOSE] : {'args': ''},
      [ACTION_SHUTTER_STOP] : {'args': ''},
      [ACTION_SHUTTER_SET_POS] : {'args': {position: position}},
      [ACTION_SHUTTER_OPEN_TILT] : {'args': ''},
      [ACTION_SHUTTER_CLOSE_TILT] : {'args': ''},
    }
    this.callHassCoverService(entityId,command,services[command].args);
  }
  getPickPoint(event){
    let siblings = Array.from(event.target.parentElement.children);
    let slide = siblings.find(sibling => sibling.classList.contains(ESC_CLASS_SELECTOR_SLIDE));
    this.pickPoint = event.pageY - parseInt(slide.style.height);
  }
  getShutterPosition(newScreenPosition){
    let shutterPosition = (newScreenPosition ) * (100-this.cfg.offset()) / (this.cfg.coverSlatsAreaHeightPx());
    shutterPosition = Math.round(this.cfg.invertPercentage() ?shutterPosition: 100 - shutterPosition);
    return shutterPosition;
  }
  getScreenPosition(pickPoint){
    let newScreenPosition = Math. round(boundary(pickPoint - this.pickPoint, 0, this.cfg.coverSlatsAreaHeightPx()));
    return newScreenPosition;
  }
  mouseDown = (event) =>
  {
    console_log('mouseDown:',event.type,event);
    if (event.pageY === undefined || this.cfg.passiveMode()) return;

    if (event.cancelable) {
      //Disable default drag event
      event.preventDefault();
    }
    this.action='user-drag';

    this.getPickPoint(event);

    this.addEventListener('mousemove', this.mouseMove);
    this.addEventListener('touchmove', this.mouseMove);
    this.addEventListener('pointermove', this.mouseMove);

    this.addEventListener('mouseup', this.mouseUp);
    this.addEventListener('touchend', this.mouseUp);
    this.addEventListener('pointerup', this.mouseUp);
  };

  mouseMove = (event) =>
  {
    console_log('mouseMove:',event.type,event);
    if (event.pageY === undefined) return;
    this.action='user-drag';

    this.screenPosition = this.getScreenPosition(event.pageY); // triggers refresh
    let pointedShutterPosition = this.getShutterPosition(this.screenPosition);

    this.positionText = this.cfg.computePositionText(pointedShutterPosition);
  };

  mouseUp = (event) =>
  {
    console_log('mouseUp:',event.type,event);
    if (event.pageY === undefined) return;

    this.removeEventListener('mousemove', this.mouseMove);
    this.removeEventListener('touchmove', this.mouseMove);
    this.removeEventListener('pointermove', this.mouseMove);

    this.removeEventListener('mouseup', this.mouseUp);
    this.removeEventListener('touchend', this.mouseUp);
    this.removeEventListener('pointerup', this.mouseUp);


    this.action='user-drag';

    let newScreenPosition = this.getScreenPosition(event.pageY);
    let shutterPosition = this.getShutterPosition(newScreenPosition);

    this.sendShutterPosition(this.cfg.entityId(), shutterPosition);

  };
  sendShutterPosition( entityId, position)
  {
    this.callHassCoverService(entityId,ACTION_SHUTTER_SET_POS, { position: position });
  }
  callHassCoverService(entityId,command,args='')
  {
    if (!this.cfg.passiveMode()){
      const domain= 'cover';
      if (this.checkServiceAvailability(domain, command)) {
        this.hass.callService(domain, command, {
          entity_id: entityId,
          ...args
        });
      } else {
        console.warn(`Service '${domain}'-'${command}' not available`);
      }
    }
  }
  checkServiceAvailability(serviceDomain, serviceName) {
    const services = this.hass.services;
    let check = services[serviceDomain]?.[serviceName] !== undefined;
    return check;
  }

  static get styles() {
    return css`${unsafeCSS(SHUTTER_CSS)}
    `
  }
}
class shutterCfg {

  #cfg={};
  #hassStateInfo={};
  #hass={};

  constructor(hass,config,allImages,imageDimension=null)
  {
    this.shutterState = 'None';
    let entityId = this.entityId(config[CONFIG_ENTITY_ID] ? config[CONFIG_ENTITY_ID] : config);

      this.setHass(hass);
      this.setState(hass.states[entityId]);

      this.batteryEntityId(config[CONFIG_BATTERY_ENTITY_ID]);
      this.signalEntityId(config[CONFIG_SIGNAL_ENTITY_ID]);

      this.friendlyName(config[CONFIG_NAME] ? config[CONFIG_NAME] : this.stateAttributes() ? this.stateAttributes().friendly_name : 'Unkown');
      this.invertPercentage(config[CONFIG_INVERT_PCT]);
      this.passiveMode(config[CONFIG_PASSIVE_MODE]);

      this.windowImage(allImages[CONFIG_WINDOW_IMAGE][entityId].src);
      this.viewImage(allImages[CONFIG_VIEW_IMAGE][entityId].src);
      this.shutterSlatImage(allImages[CONFIG_SHUTTER_SLAT_IMAGE][entityId].src);
      this.shutterBottomImage(allImages[CONFIG_SHUTTER_BOTTOM_IMAGE][entityId].src);

      let base_height_px = config[CONFIG_BASE_HEIGHT_PX] || imageDimension?.height;
      let resize_height_pct = config[CONFIG_RESIZE_HEIGHT_PCT];
      this.windowHeightPx(Math.round(boundary(resize_height_pct,ESC_MIN_RESIZE_HEIGHT_PCT,ESC_MAX_RESIZE_HEIGHT_PCT) / 100 * base_height_px));

      let base_width_px  = config[CONFIG_BASE_WIDTH_PX] || imageDimension?.width;
      let resize_width_pct  = config[CONFIG_RESIZE_WIDTH_PCT];
      this.windowWidthPx(Math.round(boundary(resize_width_pct, ESC_MIN_RESIZE_WIDTH_PCT ,ESC_MAX_RESIZE_WIDTH_PCT)  / 100 * base_width_px));


      this.scaleButtons(config[CONFIG_SCALE_BUTTONS]);
      this.scaleIcons(config[CONFIG_SCALE_ICONS]);
      this.partial(boundary(config[CONFIG_PARTIAL_CLOSE_PCT]));
      this.offset(boundary(config[CONFIG_OFFSET_CLOSED_PCT]));

      this.topOffsetPx(Math.round(boundary(config[CONFIG_TOP_OFFSET_PCT])/ 100 * this.windowHeightPx()));
      this.bottomOffsetPx(Math.round(boundary(config[CONFIG_BOTTOM_OFFSET_PCT])/ 100 * this.windowHeightPx()));
      this.leftOffsetPx(Math.round(boundary(config[CONFIG_LEFT_OFFSET_PCT])/ 100 * this.windowWidthPx()));
      this.rightOffsetPx(Math.round(boundary(config[CONFIG_RIGHT_OFFSET_PCT])/ 100 * this.windowWidthPx()));

      this.shutterBottomHeightPx(config[CONFIG_SHUTTER_BOTTOM_HEIGHT_PX]);

      this.canTilt(!!config[CONFIG_CAN_TILT]);

      this.defButtonPosition(config);

      this.titlePosition(config[CONFIG_TITLE_POSITION]);  //deprecated
      this.namePosition(config[CONFIG_NAME_POSITION]);
      this.nameDisabled(config[CONFIG_NAME_DISABLED]);

      this.openingPosition(config[CONFIG_OPENING_POSITION]);
      this.openingDisabled(config[CONFIG_OPENING_DISABLED]);
      this.inlineHeader(config[CONFIG_INLINE_HEADER]);

      this.alwaysPercentage(!!config[CONFIG_ALWAYS_PCT]);
      this.disableEndButtons(!!config[CONFIG_DISABLE_END_BUTTONS]);
      this.pickerOverlapPx(ESC_PICKER_OVERLAP_PX);
      this.disableStandardButtons(config[CONFIG_DISABLE_STANDARD_BUTTONS]);
      this.disablePartialOpenButtons(config[CONFIG_DISABLE_PARTIAL_OPEN_BUTTONS]);

      this.buttonStopHideStates(config[CONFIG_BUTTON_STOP_HIDE_STATES]  ? config[CONFIG_BUTTON_STOP_HIDE_STATES] : ESC_BUTTON_STOP_HIDE_STATES);
      this.buttonUpHideStates(config[CONFIG_BUTTON_UP_HIDE_STATES]  ? config[CONFIG_BUTTON_UP_HIDE_STATES] : ESC_BUTTON_UP_HIDE_STATES);
      this.buttonDownHideStates(config[CONFIG_BUTTON_DOWN_HIDE_STATES]  ? config[CONFIG_BUTTON_DOWN_HIDE_STATES] : ESC_BUTTON_DOWN_HIDE_STATES);

      //console.log ('constuct cfg: ',this);
      Object.preventExtensions(this);
  }

  /*
   ** getters/setters
   */
  getCfg(key,value= null){
    if (value!== null && this.#cfg[key]!=value){
      this.#cfg[key]= value;
    }
    return this.#cfg[key];
  }
  stateAttributes(){
    return (this.#state() && this.#state().attributes);
  }
  setHass(value){
    this.#hass=value;
  }
  getHass(){
    return this.#hass;
  }
  setState(value){
    return this.#state(value);
  }
  getState(){
    return this.#state().state;
  }
  #state(value= null){
    if (value!== null && this.#hassStateInfo != value) {
      this.#hassStateInfo = value
    };
    return this.#hassStateInfo;
  }
  batteryEntityId(value=null){
    return this.getCfg(CONFIG_BATTERY_ENTITY_ID,value);
  }
  batteryLevel(){
    let entity = this.batteryEntityId();

    let state = entity ? (this.#hass.states[entity] ? this.#hass.states[entity].state : '?') : '?';
    state = ['unavailable','unknown'].includes (state) ? '?' : state ;
    return state;
  }
  signalLevel(){
    let entity = this.signalEntityId();

    let state = entity ? (this.#hass.states[entity] ? this.#hass.states[entity].state : '?') : '?';
    state = ['unavailable','unknown'].includes (state) ? '?' : state ;
    return state;
  }
  signalUnit(){
    let entity = this.signalEntityId();

    let unit = entity ? (this.#hass.states[entity] ? this.#hass.states[entity].attributes.unit_of_measurement : '?') : '?';
    unit = ['unavailable','unknown'].includes (unit) ? '?' : unit ;
    return unit;
  }
  batteryUnit(){
    let entity = this.batteryEntityId();

    let unit = entity ? (this.#hass.states[entity] ? this.#hass.states[entity].attributes.unit_of_measurement : '?') : '?';
    unit = ['unavailable','unknown'].includes (unit) ? '?' : unit ;
    return unit;
  }
  signalEntityId(value){
    return this.getCfg(CONFIG_SIGNAL_ENTITY_ID,value);
  }
  buttonsPosition(value = null){
    return this.getCfg(CONFIG_BUTTONS_POSITION,value);
  }
  disableStandardButtons(value = null){
    return this.getCfg(CONFIG_DISABLE_STANDARD_BUTTONS,value);
  }
  disablePartialOpenButtons(value = null){
    return this.getCfg(CONFIG_DISABLE_PARTIAL_OPEN_BUTTONS,value);
  }
  disableEndButtons(value = null){
    return this.getCfg(CONFIG_DISABLE_END_BUTTONS,value);
  }
  entityId(value = null){
    return this.getCfg(CONFIG_ENTITY_ID,value);
  }
  friendlyName(value = null){
    return this.getCfg(CONFIG_NAME,value);
  }
  invertPercentage(value = null){
    return this.getCfg(CONFIG_INVERT_PCT,value);
  }
  openingDisabled(value = null){
    return this.getCfg(CONFIG_OPENING_DISABLED,value);
  }
  passiveMode(value = null){
    let mode = this.getCfg(CONFIG_PASSIVE_MODE,value)
    if (value!== null && mode) console.warn('Passive mode, no action');
    return mode;
  }
  viewImage(value = null){
    return this.getCfg(CONFIG_VIEW_IMAGE,value);
  }
  windowImage(value = null){
    return this.getCfg(CONFIG_WINDOW_IMAGE,value);
  }
  shutterSlatImage(value = null){
    return this.getCfg(CONFIG_SHUTTER_SLAT_IMAGE,value);
  }
  shutterBottomImage(value = null){
    return this.getCfg(CONFIG_SHUTTER_BOTTOM_IMAGE,value);
  }
  windowHeightPx(value = null){
    return this.getCfg(CONFIG_HEIGHT_PX,value);
  }
  windowWidthPx(value = null){
    return this.getCfg(CONFIG_WIDTH_PX,value);
  }
  partial(value = null){
    return this.getCfg(CONFIG_PARTIAL_CLOSE_PCT,value);
  }
  offset(value = null){
    return this.getCfg(CONFIG_OFFSET_CLOSED_PCT,value);
  }
  scaleButtons(value = null){
    return this.getCfg(CONFIG_SCALE_BUTTONS,value);
  }
  scaleIcons(value = null){
    return this.getCfg(CONFIG_SCALE_ICONS,value);
  }
  topOffsetPx(value = null){
    return this.getCfg(CONFIG_TOP_OFFSET_PCT,value);
  }
  bottomOffsetPx(value = null){
    return this.getCfg(CONFIG_BOTTOM_OFFSET_PCT,value);
  }
  leftOffsetPx(value = null){
    return this.getCfg(CONFIG_LEFT_OFFSET_PCT, value);
  }
  rightOffsetPx(value = null){
    return this.getCfg(CONFIG_RIGHT_OFFSET_PCT, value);
  }

  shutterBottomHeightPx(value = null){
    return this.getCfg(CONFIG_SHUTTER_BOTTOM_HEIGHT_PX, value);
  }

  canTilt(value = null){
    return this.getCfg(CONFIG_CAN_TILT,value);
  }
  nameDisabled(value = null){
    return this.getCfg(CONFIG_NAME_DISABLED,value);
  }
  buttonStopHideStates(value = null){
    return this.getCfg(CONFIG_BUTTON_STOP_HIDE_STATES,value);
  }
  buttonUpHideStates(value = null){
    return this.getCfg(CONFIG_BUTTON_UP_HIDE_STATES,value);
  }
  buttonDownHideStates(value = null){
    return this.getCfg(CONFIG_BUTTON_DOWN_HIDE_STATES,value);
  }

  // deprecated
  titlePosition(value = null){
    return this.getCfg(CONFIG_NAME_POSITION,value);
  }

  namePosition(value = null){
    return this.getCfg(CONFIG_NAME_POSITION,value);
  }
  inlineHeader(value = null){
    return this.getCfg(CONFIG_INLINE_HEADER,value);
  }
  openingDisabled(value = null){
    if (value !== null  && this.getCfg(CONFIG_OPENING_DISABLED,value) === null)
    {
      value = this.getCfg(CONFIG_NAME_DISABLED);
    }
    return this.getCfg(CONFIG_OPENING_DISABLED,value);
  }
  openingPosition(value = null){
    if (value !== null  && this.getCfg(CONFIG_OPENING_POSITION,value) === null)
    {
      value = this.getCfg(CONFIG_NAME_POSITION);
    }
    return this.getCfg(CONFIG_OPENING_POSITION,value);
  }
  alwaysPercentage(value = null){
    return this.getCfg(CONFIG_ALWAYS_PCT,value);
  }
  pickerOverlapPx(value = null){
    return this.getCfg(CONFIG_PICKER_OVERLAP_PX,value);
  }
  /*
  ** end getters/setters
  */
  currentPosition(){
    return this.stateAttributes() ? this.stateAttributes().current_position: 0;
  }
  getOrientation(){
    return Globals.screenOrientation.value; // global variable !!
  }
  movementState(){
    let state = (this.getState() ? this.getState() : 'unknownMovement');
    if (state == SHUTTER_STATE_OPEN && this.currentPosition() != 100 && this.currentPosition() != 0){
      state= SHUTTER_STATE_PARTIAL_OPEN;
    }
    if (this.currentPosition() == 100) state =SHUTTER_STATE_OPEN;
    else if (this.currentPosition() == 0) state =SHUTTER_STATE_CLOSED;

    return state;
  }
  buttonsLeftActive(){
    //if (this.disabledGlobaly()) return false;
    //if (!this.buttonsInRow()) return false;
    if (this.disableStandardButtons() && !this.canTilt() && !this.partial()) return false;
    return true;
  }
  buttonsRightActive(){
    //if (this.disabledGlobaly()) return false;
    //if (!this.buttonsInRow()) return false;
    if (this.disablePartialOpenButtons()) return false;
    return true;
  }
  buttonsInRow(){
    return this.getButtonsPosition() == LEFT || this.getButtonsPosition() == RIGHT;
  }
  buttonsContainerReversed(){
    return this.getButtonsPosition() == BOTTOM || this.getButtonsPosition() == RIGHT;
  }
  disabledGlobaly() {
    return (this.getState() == "unavailable");
  }
  upButtonDisabled(){
    let upDisabled = false;
    if (this.disableEndButtons()) {
      if (this.currentPosition() == 0) {
        upDisabled = this.invertPercentage();
      } else if (this.currentPosition() == 100) {
        upDisabled = !this.invertPercentage();
      }
    }
    return upDisabled;
  }
  downButtonDisabled(){
    let downDisabled = false;
    if (this.disableEndButtons()) {
      if (this.currentPosition() == 0) {
        downDisabled = !this.invertPercentage();
      } else if (this.currentPosition() == 100) {
        downDisabled = this.invertPercentage();
      }
    }
    return downDisabled;
  }

  displayName(position){
      let displayType= this.inlineHeader() ? 'inline-block' : 'block';
      let display =(this.namePosition() != position || this.nameDisabled()) ? 'none' : displayType;
      return display;
    }
  displayOpening(position){
    let displayType= this.inlineHeader() ? 'inline-block' : 'block';
    let display;
    if (this.inlineHeader()){
      display =(this.namePosition() != position || this.openingDisabled()) ? 'none' : displayType;
    }else{
      display =(this.openingPosition() != position || this.openingDisabled()) ? 'none' : displayType;
    }
    return display;
  }
  getButtonsPosition(){
    let position = this.buttonsPosition();
    if (position.substring(0,4) == AUTO){
      if  (this.getOrientation() == LANDSCAPE){
        if (position == AUTO || position == AUTO_TL || position == AUTO_BL){
          position = LEFT;
        } else {
          position = RIGHT;
        }
      }
      else{
        if (position == AUTO || position == AUTO_TL || position == AUTO_TR){
          position = TOP;
        } else {
          position = BOTTOM;
        }
      }
    }
    return position;
  }

  defButtonPosition(config) {
    let buttonsPosition = config[CONFIG_BUTTONS_POSITION];
    buttonsPosition
      = (buttonsPosition && POSITIONS.includes(buttonsPosition.toLowerCase()))
      ? buttonsPosition.toLowerCase()
      : ESC_BUTTONS_POSITION;

      this.buttonsPosition(buttonsPosition);
  }
  defScreenPositionFromPercent(position_pct=this.currentPosition()) {
    let visiblePosition;
    if (this.invertPercentage()) {
      visiblePosition = !!this.offset() ? Math.min(100, Math.round(position_pct / this.offset() * 100 )) : position_pct;
    }
    else  {
      visiblePosition = !!this.offset() ? Math.max(0, Math.round((position_pct - this.offset()) / (100-this.offset()) * 100 )) : position_pct;
    }

    return this.coverSlatsAreaHeightPx() * (this.invertPercentage() ? visiblePosition : 100 - visiblePosition) / 100 ;

  }
  positionPercentToText(percent){
    let text='';
    if (typeof percent === 'number') {
      if (this.alwaysPercentage()) {
        text = percent + '%';
      }else{
        if (percent == 100 || !percent) {
          if (this.invertPercentage()) percent = 100-percent;
          if (percent == 100 ) {
            text = this.#hass.localize('component.cover.entity_component._.state.open');
          } else if (!percent) {
            text = this.#hass.localize('component.cover.entity_component._.state.closed');
          }
        } else{
          text = percent + '%';
        }
      }
    } else {
      text = this.#hass.localize('state.default.unavailable');
    }
    return text;
  }
  computePositionText(currentPosition =this.currentPosition()) {

    let offset = this.offset()

    let visiblePosition;
    let positionText;

    if (this.invertPercentage()) {
      visiblePosition = offset ? Math.min(100, Math.round(currentPosition / offset * 100 )) : currentPosition;
      positionText = this.positionPercentToText(visiblePosition);

      if (visiblePosition == 100 && offset) {
        positionText += ' ('+ (100-Math.round(Math.abs(currentPosition-visiblePosition)/offset*100)) +'%)';
      }

    } else {
      visiblePosition = offset ? Math.max(0, Math.round((currentPosition - offset) / (100-offset) * 100 )) : currentPosition;
      positionText = this.positionPercentToText(visiblePosition);

      if (visiblePosition == 0 && offset) {
        positionText += ' ('+ (100-Math.round(Math.abs(currentPosition-visiblePosition)/offset*100)) +'%)';
      }
    }
    return positionText;
  }

  // whole area from window inner top to inner bottom
  coverAreaHeightPx(){
    return this.windowHeightPx() - this.bottomOffsetPx() - this.topOffsetPx();
  }

  // area excluding the bottom (slats-only area that will expand/collapse based on position)
  coverSlatsAreaHeightPx(){
    return this.coverAreaHeightPx() - this.shutterBottomHeightPx()
  }

  iconScaleFactor(){
    return this.scaleIcons()? Math.min(this.windowWidthPx()/ESC_BASE_WIDTH_PX*1.25,1): 1;
  }
  iconScalePercent(){
    return Math.round(this.iconScaleFactor()*100)+'%';
  }

  iconButtonSize(){
    let size = 48;
    if (this.scaleButtons()){
      let px;
      if (this.buttonsInRow()){
        px = this.windowHeightPx();
      }else{
        px = this.windowWidthPx();
      }
      size = Math.min(px/3.0,48);
    }
    return size;
  }
  iconSize(){
    let size = 24;
    if (this.scaleButtons()){
      let px;
      if (this.buttonsInRow()){
        px = this.windowHeightPx();
      }else{
        px = this.windowWidthPx();
      }
      size = Math.min(px/6.0,24);
    }
    return size;
  }
  iconSizeWifiBattery(){
    let size = 24;
    if (this.scaleIcons()){
      let px = this.windowWidthPx();
      size = Math.min(px/6.0,24);
    }
    return size;
  }
  batteryLevelText(){
    let level = this.batteryLevel();
    let unit = this.batteryUnit();
    return level+unit;
  }
  signalLevelText(){
    let level = this.signalLevel();
    let unit = this.signalUnit();
    return level+unit;
  }
  batteryLevelIcon(){

    let level = this.batteryLevel();
    let icon;
    let roundedLevel = Math.round(level / 10) * 10;
    roundedLevel = isNaN(roundedLevel) ? -1 : roundedLevel;

		switch (roundedLevel) {
			case -1:
				icon = 'mdi:battery-off-outline'; // mdi:battery should have an alias of mdi:battery-100, doesn't work in current HASS
				break;
			case 100:
				icon = 'mdi:battery'; // mdi:battery should have an alias of mdi:battery-100, doesn't work in current HASS
				break;
			case 0:
				icon = 'mdi:battery-outline'; // mdi:battery-outline should have an alias of mdi:battery-0, doesn't work in current HASS
				break;
			default:
				icon = 'mdi:battery-' + roundedLevel;
		}
    return icon;
  }
  batteryIconColor(){
    let level = this.batteryLevel();
    let roundedLevel = Math.round(level / 20);
    roundedLevel = isNaN(roundedLevel) ? -1 : roundedLevel;
    const iconColor = {
      '-1': "grey",
      0: "red",
      1: "#FF4D00",// deep orange,
      2: "#FF7F00", // amber
      3: "orange",
      4: "#66B266", // sligly dim green
      5: "green",
    };
    return iconColor[roundedLevel];
  }
  signalIconColor(){
    let iconLevelIndex= this.signalLevelIndex();
    const iconColor = {
      '-1': "grey",
      0: "red",
      1: "#FF4D00",// deep orange,
      2: "#FF7F00", // amber
      3: "orange",
      4: "#66B266", // sligly dim green
      5: "green",
    };
    return iconColor[iconLevelIndex];
  }
  signalLevelIndex(){
    let level = this.signalLevel();
    let unit = this.signalUnit();
    if (unit != '?'){
      const unitType ={
        'dB': {max: 100, min: 0},
        'dBm': {max: -40, min: -90},
        'lqi': {max: 255, min: 0}, // from Z2M values are 0-255 ??
        '%': {max: 100, min: 0},
        '?': {max: 100, min: 0}
      };
      let delta= unitType[unit].max-unitType[unit].min;
      let levelPercentage = (level-unitType[unit].min) / delta * 100;
      let levelIndex =Math.round(levelPercentage / 20);

      return levelIndex;
    }
    return -1;
  }
  signalLevelIcon(){
    let unit = this.signalUnit();
    let icon = 'mdi:wifi-strength-off-outline';
    if (unit != '?'){
      const iconStrength = {
        '-1': "alert-outline",
        0: "off-outline",
        1: "outline",
        2: "1",
        3: "2",
        4: "3",
        5: "4",
      };
      let iconLevelIndex= this.signalLevelIndex();
      icon = 'mdi:wifi-strength-'+iconStrength[iconLevelIndex];
    }
    return icon;
  }

}
/**
 * global functions
 */

function boundary(value,min=0,max=100){
  return Math.max(min,Math.min(max,value));
}
function defImagePathOrColor(image_map,image,image_type)
{
  let result;
  if (image_type== CONFIG_VIEW_IMAGE && !image.includes('.')){
    // is Color
    result=image;
  }else{
    // is URL
    result =(image.includes('/') ? image : `${image_map}/${image}`);
  }
  return result;
}

function getTextSize(text, font = 'Arial', fontHeight=16, fontWeight='') {
  // Create a temporary canvas element
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Set the font style
  context.font = `${fontWeight} ${fontHeight}px ${font}`;
  // Measure and return the width of the text
  let data = context.measureText(text);
  let width = Math.ceil(data.width);
  let height =  Math.ceil(data.fontBoundingBoxAscent + data.fontBoundingBoxDescent);
  let fontHeightData =        data.fontBoundingBoxAscent + data.fontBoundingBoxDescent;
  let actualHeight =      data.actualBoundingBoxAscent + data.actualBoundingBoxDescent;
  //console_log("Text data:",text,data);
  //console_log("Text fontHeightData actualHeight:",fontHeightData,actualHeight);
  //console_log("Text sizes w*h:",text,width,height);
  return {width,height,text,data};

}

/**
 * Main code
 */
const Globals={
  huiView: null,
  screenOrientation: {value:LANDSCAPE},
}

customElements.define(HA_CARD_NAME, EnhancedShutterCardNew);
customElements.define(HA_SHUTTER_NAME, EnhancedShutter);

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
/**
 * test functions
 */
function formatDate(format) {
  const now = new Date();
  const pad = (num, length) => num.toString().padStart(length, '0');

  return format.replace(/YYYY/g, now.getFullYear())
               .replace(/MM/g, pad(now.getMonth() + 1, 2))
               .replace(/DD/g, pad(now.getDate(), 2))
               .replace(/HH/g, pad(now.getHours(), 2))
               .replace(/mm/g, pad(now.getMinutes(), 2))
               .replace(/ss/g, pad(now.getSeconds(), 2))
               .replace(/SSS/g, pad(now.getMilliseconds(), 3));
}

function console_log(...args){
  if (VERSION.indexOf('b') > 0){
    console.log(formatDate("HH:mm:ss.SSS"),...args);
  }
}

/**
 * function findElement() to find an element in DOM body, inluding shadow DOMs.
 * @param {*} selector
 * @returns
 */
function findElement(selector) {
  // Search in the regular DOM
  let foundInDom = document.body.querySelector(selector);

  // If not found directly, search the element
  if (!foundInDom) foundInDom= recursiveSearch(document.body);
  return foundInDom;

  // Function to recursively search in shadow roots
  function searchInShadowDom(node) {
    // Check if the node has a shadow root
    if (node.shadowRoot) {
      // Search in the shadow root's DOM
      const foundInShadow = node.shadowRoot.querySelector(selector);
      if (foundInShadow) {
        return foundInShadow;
      }
      // Recurse into any shadow DOMs within this shadow root
      const shadowHost = node.shadowRoot.host;
      for (const child of node.shadowRoot.children) {
        const result = searchInShadowDom(child);
        if (result) {
          return result;
        }
      }
    }
    for (const child of node.children) {
      const result = recursiveSearch(child);
      if (result) {
        return result;
      }
    }
    return null;
  }

  // Start the search in the whole document, including all shadow DOMs
  function recursiveSearch(node) {
    // Search in the node itself
    if (node.matches && node.matches(selector)) {
      return node;
    }

    // Recurse into child nodes, including shadow roots if present
    if (node.shadowRoot) {
      const result = searchInShadowDom(node);
      if (result) {
        return result;
      }
    }

    // Recurse into child nodes (excluding shadow roots)
    for (const child of node.children) {
      const result = recursiveSearch(child);
      if (result) {
        return result;
      }
    }

    return null;
  }

}

