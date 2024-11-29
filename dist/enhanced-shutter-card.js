import {
  LitElement,
  html,
  css,
  unsafeCSS
}
from "https://unpkg.com/lit-element@3.0.1/lit-element.js?module";
import {until} from 'https://unpkg.com/lit-html/directives/until.js';

const HA_CARD_NAME = "enhanced-shutter-card";
const HA_SHUTTER_NAME = `enhanced-shutter`;
const HA_ELEMENT_NAME = 'ha-card';

const LEFT = 'left';
const RIGHT = 'right';
const BOTTOM = 'bottom';
const TOP = 'top';
const NONE = 'none';

const ESC_BASE_CLASS_NAME = 'esc-shutter';
const ESC_CLASS_SHUTTERS = `${ESC_BASE_CLASS_NAME}s`;
const ESC_CLASS_TOP = `${ESC_BASE_CLASS_NAME}-${TOP}`;
const ESC_CLASS_MIDDLE = `${ESC_BASE_CLASS_NAME}-middle`;
const ESC_CLASS_BOTTOM = `${ESC_BASE_CLASS_NAME}-${BOTTOM}`;
const ESC_CLASS_LABEL = `${ESC_BASE_CLASS_NAME}-label`;
const ESC_CLASS_LABEL_DISABLED = `${ESC_CLASS_LABEL}-disabled`;
const ESC_CLASS_TITLE_DISABLED = `${ESC_BASE_CLASS_NAME}-title-disabled`
const ESC_CLASS_POSITION = `${ESC_BASE_CLASS_NAME}-position`;
const ESC_CLASS_BUTTONS = `${ESC_BASE_CLASS_NAME}-buttons`;
const ESC_CLASS_BUTTONS_TOP = `${ESC_CLASS_BUTTONS}-${TOP}`;
const ESC_CLASS_BUTTONS_BOTTOM = `${ESC_CLASS_BUTTONS}-${BOTTOM}`;
const ESC_CLASS_BUTTONS_LEFT = `${ESC_CLASS_BUTTONS}-${LEFT}`;
const ESC_CLASS_BUTTONS_RIGHT = `${ESC_CLASS_BUTTONS}-${RIGHT}`;
const ESC_CLASS_BUTTON = `${ESC_BASE_CLASS_NAME}-button`;
const ESC_CLASS_BUTTON_UP = `${ESC_BASE_CLASS_NAME}-button-up`;
const ESC_CLASS_BUTTON_DOWN = `${ESC_BASE_CLASS_NAME}-button-down`;
const ESC_CLASS_SELECTOR = `${ESC_BASE_CLASS_NAME}-selector`;
const ESC_CLASS_SELECTOR_PICTURE = `${ESC_BASE_CLASS_NAME}-selector-picture`;
const ESC_CLASS_SELECTOR_SLIDE = `${ESC_BASE_CLASS_NAME}-selector-slide`;
const ESC_CLASS_SELECTOR_PICKER = `${ESC_BASE_CLASS_NAME}-selector-picker`;
const ESC_CLASS_SELECTOR_PARTIAL = `${ESC_BASE_CLASS_NAME}-selector-partial`;
const ESC_CLASS_MOVEMENT_OVERLAY = `${ESC_BASE_CLASS_NAME}-movement-overlay`;
const ESC_CLASS_MOVEMENT_OPEN = `${ESC_BASE_CLASS_NAME}-movement-open`;
const ESC_CLASS_MOVEMENT_CLOSE = `${ESC_BASE_CLASS_NAME}-movement-close`;
const ESC_CLASS_HA_ICON = `${ESC_BASE_CLASS_NAME}-ha-icon`;

const POSITIONS =[LEFT,RIGHT,TOP,BOTTOM,NONE];

const SERVICE_SHUTTER_UP = 'open_cover';
const SERVICE_SHUTTER_DOWN = 'close_cover';
const SERVICE_SHUTTER_STOP = 'stop_cover';
const SERVICE_SHUTTER_PARTIAL = 'set_cover_position';
const SERVICE_SHUTTER_TILT_OPEN = 'open_cover_tilt';
const SERVICE_SHUTTER_TILT_CLOSE = 'close_cover_tilt';

const UNITY= 'px';

const CONFIG_ENTITY_ID = 'entity';
const CONFIG_STATE = 'state';
const CONFIG_HEIGHT_PX = 'height_px';
const CONFIG_WIDTH_PX = 'width_px';

const CONFIG_NAME = 'name';
const CONFIG_IMAGE_MAP = 'image_map';
const CONFIG_WINDOW_IMAGE = 'windows_image';
const CONFIG_VIEW_IMAGE = 'view_image';
const CONFIG_SHUTTER_SLAT_IMAGE = 'shutter_slat_image';
const CONFIG_SHUTTER_BOTTOM_IMAGE = 'shutter_bottom_image';
const CONFIG_BASE_HEIGHT_PX = 'base_height_px';
const CONFIG_BASE_WIDTH_PX = 'base_width_px';
const CONFIG_RESIZE_HEIGHT_PCT = 'resize_height_pct';
const CONFIG_RESIZE_WIDTH_PCT = 'resize_width_pct';
const CONFIG_TOP_OFFSET_PCT = 'top_offset_pct';
const CONFIG_BOTTOM_OFFSET_PCT = 'bottom_offset_pct';
const CONFIG_BUTTONS_POSITION = 'buttons_position';
const CONFIG_TITLE_POSITION = 'title_position';
const CONFIG_TITLE_DISABLED = 'title_disabled';
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

const ESC_ENTITY_ID = null;

const ESC_NAME = null;
const ESC_IMAGE_MAP = `/local/community/${HA_CARD_NAME}/images`;
const ESC_IMAGE_WINDOW = 'esc-window.png';
const ESC_IMAGE_VIEW = 'esc-view.png';
const ESC_IMAGE_SHUTTER_SLAT = 'esc-shutter-slat.png';
const ESC_IMAGE_SHUTTER_BOTTOM = 'esc-shutter-bottom.png';
const ESC_BASE_HEIGHT_PX = null; // image-height
const ESC_BASE_WIDTH_PX = null;// image-width
const ESC_RESIZE_HEIGHT_PCT = 100;
const ESC_RESIZE_WIDTH_PCT  = 100;

const ESC_TOP_OFFSET_PCT = 0;
const ESC_BOTTOM_OFFSET_PCT = 0;
const ESC_BUTTONS_POSITION = LEFT;
const ESC_TITLE_POSITION = TOP;
const ESC_TITLE_DISABLED = false;
const ESC_INVERT_PCT = false;
const ESC_CAN_TILT = false;
const ESC_PARTIAL_CLOSE_PCT = 0;
const ESC_OFFSET_CLOSED_PCT = 0;
const ESC_ALWAYS_PCT = false;
const ESC_DISABLE_END_BUTTONS = false;
const ESC_DISABLE_STANDARD_BUTTONS = false;
const ESC_DISABLE_PARTIAL_OPEN_BUTTONS = false;
const ESC_PICKER_OVERLAP_PX = 20;
const ESC_CURRENT_POSITION = 0;

const ESC_MIN_RESIZE_WIDTH_PCT  =  50;
const ESC_MAX_RESIZE_WIDTH_PCT  = 200;
const ESC_MIN_RESIZE_HEIGHT_PCT =  50;
const ESC_MAX_RESIZE_HEIGHT_PCT = 200;

const CONFIG_DEFAULT ={
  [CONFIG_ENTITY_ID]: ESC_ENTITY_ID,

  [CONFIG_NAME]: ESC_NAME,
  [CONFIG_IMAGE_MAP]: ESC_IMAGE_MAP,
  [CONFIG_WINDOW_IMAGE]: ESC_IMAGE_WINDOW,
  [CONFIG_VIEW_IMAGE]: ESC_IMAGE_VIEW,
  [CONFIG_SHUTTER_SLAT_IMAGE]: ESC_IMAGE_SHUTTER_SLAT,
  [CONFIG_SHUTTER_BOTTOM_IMAGE]: ESC_IMAGE_SHUTTER_BOTTOM,
  [CONFIG_BASE_HEIGHT_PX]: ESC_BASE_HEIGHT_PX,
  [CONFIG_BASE_WIDTH_PX]: ESC_BASE_WIDTH_PX,
  [CONFIG_RESIZE_HEIGHT_PCT]: ESC_RESIZE_HEIGHT_PCT,
  [CONFIG_RESIZE_WIDTH_PCT]: ESC_RESIZE_WIDTH_PCT,
  [CONFIG_TOP_OFFSET_PCT]: ESC_TOP_OFFSET_PCT,
  [CONFIG_BOTTOM_OFFSET_PCT]: ESC_BOTTOM_OFFSET_PCT,
  [CONFIG_BUTTONS_POSITION]: ESC_BUTTONS_POSITION,
  [CONFIG_TITLE_POSITION]: ESC_TITLE_POSITION,
  [CONFIG_TITLE_DISABLED]: ESC_TITLE_DISABLED,
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

  [CONFIG_HEIGHT_PX]: ESC_BASE_HEIGHT_PX,
  [CONFIG_WIDTH_PX]: ESC_BASE_WIDTH_PX,

};
const IMAGE_TYPES = [CONFIG_WINDOW_IMAGE,CONFIG_VIEW_IMAGE,CONFIG_SHUTTER_SLAT_IMAGE,CONFIG_SHUTTER_BOTTOM_IMAGE];
const CSS =`
      .${ESC_CLASS_SHUTTERS} {
        padding: 16px;
      }
      .${ESC_CLASS_BUTTON} {
        height: 36px;
        width: 36px;
      }
      .${ESC_BASE_CLASS_NAME} {
        margin-top: 1rem;
        overflow: visible;
      }
      .${ESC_BASE_CLASS_NAME}:first-child {
        margin-top: 0;
      }
      .${ESC_CLASS_MIDDLE} {
        display: flex;
        flex-flow: row;
        justify-content: center;
        align-items: center;
        width: fit-content;
        max-width: 100%;
        margin: auto;
        overflow: hidden;
      }
      .${ESC_CLASS_BUTTONS} {
        flex: 1;
        justify-content: center;
        align-items: center;
        margin: 0.4rem;
        display: flex;
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
        flex: 1;
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
        z-index: 1;
        justify-content: center;
        position: relative;
        margin: auto;
        background-size: cover;
        background-position: center;
        line-height: 0;
        ooverflow: auto;
      }
      .${ESC_CLASS_SELECTOR_PICTURE}>img {
        justify-content: center;
        margin: auto;
        width: 100%;
        height: 100%;
      }
      .${ESC_CLASS_SELECTOR_SLIDE} {
        z-index: -1;
        position: absolute;
        background-position: bottom;
        overflow: hidden;
        top: 0;
        width: 100%;
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
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.3);
        text-align: center;
        --mdc-icon-size: 60px;
      }
      .${ESC_CLASS_MOVEMENT_OPEN} {
        z-index: 3 !important;
        position: relatve;
        display: none;
      }
      .${ESC_CLASS_MOVEMENT_CLOSE} {
        z-index: 3 !important;
        position: relatve;
        display: none;
      }
      .${ESC_CLASS_HA_ICON} {
        padding-bottom: 10px;
      }

      .${ESC_CLASS_TOP} {
        text-align: center;
        margin-bottom: 1rem;
      }
      .${ESC_CLASS_BOTTOM} {
        text-align: center;
        margin-top: 1rem;
        display:none;
      }
      .${ESC_CLASS_LABEL} {
        display: inline-block;
        font-size: 20px;
        vertical-align: middle;
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
        vertical-align: middle;
        padding: 0 6px;
        margin-left: 1rem;
        border-radius: 2px;
        background-color: var(--secondary-background-color);
      }
    `;

class EnhancedShutterCardNew extends LitElement{
  //reactive properties
  static get properties() {
    return {
      hass: {type: Object},
      config: {type: Object},
      isAllImagesLoaded: { type: Boolean}
    };
  }
  constructor() {
    super();
    this.isAllImagesLoaded = false;
  }
  getAllImages(){
    this.allImages={};
    IMAGE_TYPES.forEach((image_type) =>
    {
      let images={};
      let base_image_map = this.config.image_map || ESC_IMAGE_MAP;
      let base_image = this.config[image_type] ? defImagePath(base_image_map,this.config[image_type]) : `${ESC_IMAGE_MAP}/${CONFIG_DEFAULT[image_type]}`;
      this.config.entities.forEach((entity) =>
      {
        let image_map = entity.image_map || base_image_map;
        let entityId = entity.entity ? entity.entity : entity;

        let image = entity[image_type] ? defImagePath(image_map,entity[image_type]) : base_image;
        let src = image || `${ESC_IMAGE_MAP}/${CONFIG_DEFAULT[image_type]}`;
        images[entityId]={entityId,src};

      });
      this.allImages[image_type]=images;
    });

  }
  update(changedProperties) {
    console.log('Update');
    super.update(changedProperties);
    console.log('Update ready');
  }
  updated(changedProperties) {
    console.log('Updated');
    super.updated(changedProperties);
    console.log('Updated ready');
  }
  cconnectedCallback() {
    console.log('connectedCallback');
    this.getAllImages();
    console.log('AllImages:',this.allImages);
    const promisesForImageSizes = getPromisesForImageSizes(this.allImages[CONFIG_WINDOW_IMAGE]);

    Promise.all(promisesForImageSizes).then((results) => {
      const imageDimensions = Object.assign({}, ...results);
      this.config.entities.map(
        (currEntity) => {
          console.log('===SUB===')
          this.tempCfg = this.defConfig(this.globalCfg,currEntity);
          let entity= this.tempCfg.entity;
          this.localCfg[entity] = new shutterCfg(this.hass,this.tempCfg,imageDimensions,this.allImages);
        }
      )
      this.isAllImagesLoaded = true;
      this.requestUpdate(); // Trigger re-render once all images are loaded
    });
    super.connectedCallback();
    console.log('connectedCallback ready');
  }
  render() {
    console.log('Render');
    if (!this.config || !this.hass) {
      console.warn('ShutterCard  .. no content ..');
      return html``;
    }
    this.getAllImages();
    const promisesForImageSizes = getPromisesForImageSizes(this.allImages[CONFIG_WINDOW_IMAGE]);

    console.log('===MAIN===')
    this.globalCfg = this.defConfig(CONFIG_DEFAULT,this.config);

    let htmlout = until(Promise.all(promisesForImageSizes).then((results) => {
      this.cardReady = false;
      const imageDimensions = Object.assign({}, ...results);

      console.log('Org imageDimensions',imageDimensions);
      this.localCfg = {};
      return html`
        <ha-card .header=${this.config.title}>
          <div class="${ESC_CLASS_SHUTTERS}">
            ${this.config.entities.map(
              (currEntity) => {
                console.log('===SUB===')
                this.tempCfg = this.defConfig(this.globalCfg,currEntity);
                let entity= this.tempCfg.entity;
                this.localCfg[entity] = new shutterCfg(this.hass,this.tempCfg,imageDimensions,this.allImages);
                return html`<enhanced-shutter .hass=${this.hass} .config=${currEntity} .cfg=${this.localCfg[entity]} .tempCfg=${this.tempCfg}></enhanced-shutter>`;
              }
            )}
          </div>
        </ha-card>
      `
    }));
    console.log('Render ready');
    return htmlout;
  }

  static get styles() {
    const CSS = `.${ESC_CLASS_SHUTTERS} { padding: 16px; }`;
    return css`${unsafeCSS(CSS)}`;
  }

  defConfig(configMain,configSub){
    console.log('configMain:',configMain);
    console.log('configSub:',configSub);

    if (typeof configSub !== 'object' || configSub === null){
      configSub={[CONFIG_ENTITY_ID]: configSub};
    }

    let config={};
    Object.keys(configMain).forEach(key =>{
      config[key] = (typeof configSub[key] === 'undefined' || configSub[key]=== null || configSub[key]==='null') ? configMain[key] : configSub[key];
    });
    console.log( 'NewConfig:',config);
    return config;
  }
  setConfig(config) {
    //console.log('setConfig');
    if (!config.entities) {
      throw new Error('You need to define entities');
    }
    this.config = config;


  }
// The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return this.config.entities.length + 1;
  }

  //Section layout : we compute the size of the card. cf : https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/#sizing-in-sections-view
  getLayoutOptions() {
    // size off cells.
    // width: between 80px and 120px depending on the screen size
    // height: 56px
    // gap between cells: 8px
    console.log ('getLayoutOptions this.globalCfg',this.globalCfg);
    console.log ('localCfg',this.localCfg);
    let nbRows = 4;
    let nbCols = 3;

    let heightPx =0;
    let widthPx =0;
    if (this.config && this.config.entities) {
      heightPx = this.config.title ? 76 : 0;
      let maxWidthPx = 0;
      this.config.entities.forEach(entity => {
      });
      //nbRows = Math.ceil(nbRows);
      //nbCols = Math.ceil(maxNbCols);
    }
    //console.log("Section sizing computed. nbRows : " + nbRows + " nbCols : " + nbCols);
    return {
      "grid_rows": nbRows,
      "grid_min_rows": nbRows,
      "grid_columns": nbCols,
      "grid_min_columns": nbCols,
    };
  }
  firstUpdated() {
    // You can safely access this.data or perform actions after the element is rendered
    console.log('firstUpdated() Element EnhancedShutterCardNew is rendered and data is:');
  }

}


class EnhancedShutter extends LitElement{
  slide;
  shutter;
  //reactive properties
  static get properties() {
    return {
//      hass: {},
//      config: {state: true},
      cfg: {type: Object},
//      tempCfg: {type: Object},
      screenPosition: {state: true},
//      positionText: {state: true}
    };
  }
  constructor(){
    super(); //  mandetory
    //console.log('***** EnhancedShutter constructor');
    this.screenPosition=-1;
    this.positionText ='';
    this.action = '#';
  }
  update(changedProperties) {
    console.log('');
    console.log('-------------------------');
    console.log('EnhancedShutter',this.cfg.entityId());
    // Log the properties that were updated
    changedProperties.forEach((oldValue, prop) => {
      console.log((new Date).toLocaleTimeString(),`Property "${prop}" changed from ${oldValue} to ${this[prop]}`);
      console.log('oldValue',oldValue);
      console.log('this[prop]',this[prop]);
      console.log('lodash.isEqual',deepEqual(oldValue,this[prop]));
    });
    super.update(changedProperties);
  }
  updated(changedProperties) {
    // Log the properties that were updated
    super.updated(changedProperties);
    this.action='cover';
  }
  firstUpdated() {
    // You can safely access this.data or perform actions after the element is rendered
    //console.log('Element EnhancedShutter is rendered and data is:');
  }
  render()
  {
    let entityId = this.cfg.entityId();
    //console.log('In EnhancedShutter{}: render EnhancedShutter',new Date().toString(),entityId);
    //console.log('cfg=',this.cfg);
    //console.log('this.positionText=',this.positionText);
    //console.log('this.screenPosition =',this.screenPosition );
    //console.log('=====> this.action =',this.action);
    let positionText;
    let screenPosition;

    if (this.action=='user-drag'){
      positionText =  this.positionText;
      screenPosition = this.screenPosition

    }else{
      positionText =  this.computePositionText();
      screenPosition =  this.cfg.defScreenPositionFromPercent();

    }
/*
    console.log('In EnhancedShutter{} (2),hass',this.hass);
    console.log('In EnhancedShutter{} (2) config', this.config);
    console.log('slide',this.slide);
    console.log('picker',this.picker);
    console.log('shutter',this.shutter);
    console.log('entityId',this.entityId);
    console.log('data',this.data);
    console.log('positionText',positionText);
*/
    //console.log('Render: screenPosition',screenPosition);
    return html`
      <div class=${ESC_BASE_CLASS_NAME} data-shutter="${entityId}">
        <div class="${ESC_CLASS_TOP}" style="display: ${(this.cfg.titlePosition() == BOTTOM || this.cfg.titleDisabled()) ? 'none' : 'block'}">
          <div class="${ESC_CLASS_LABEL} ${this.cfg.disabledGlobaly() ? `${ESC_CLASS_LABEL_DISABLED}` : ''}" @click="${() => this.doDetailOpen(entityId)}" >
            ${this.cfg.friendlyName()}
          </div>
          <div class="${ESC_CLASS_POSITION} ${this.cfg.disabledGlobaly() ? `${ESC_CLASS_LABEL_DISABLED}` : ''}">
            ${positionText}
          </div>
        </div>
        <div class="${ESC_CLASS_MIDDLE}" style="flex-flow: ${this.cfg.buttonsInRow() ? 'column': 'row'}${this.cfg.buttonsContainerReversed() ? '-reverse' : ''} nowrap;">
          <div class="${ESC_CLASS_BUTTONS}" style="flex-flow: ${this.cfg.buttonsInRow() ? 'row': 'column'} wrap;">
            ${!this.cfg.disableStandardButtons() ? html`
                <ha-icon-button label="${this.hass.localize('ui.card.cover.open_cover')}"  .disabled=${this.cfg.disabledGlobaly() || this.cfg.upButtonDisabled()} @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_UP}`)} ><ha-icon class="${ESC_CLASS_HA_ICON}" icon="mdi:arrow-up"></ha-icon></ha-icon-button>
                <ha-icon-button label="${this.hass.localize('ui.card.cover.stop_cover')}"  .disabled=${this.cfg.disabledGlobaly()} @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_STOP}`)}><ha-icon class="${ESC_CLASS_HA_ICON}" icon="mdi:stop"></ha-icon></ha-icon-button>
                <ha-icon-button label="${this.hass.localize('ui.card.cover.close_cover')}" .disabled=${this.cfg.disabledGlobaly() || this.cfg.downButtonDisabled()} @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_DOWN}`)} ><ha-icon class="${ESC_CLASS_HA_ICON}" icon="mdi:arrow-down"></ha-icon></ha-icon-button>
              ` : ''}
          </div>
          <div class="${ESC_CLASS_BUTTONS}" style="flex-flow: ${this.cfg.buttonsInRow() ? 'row': 'column'} wrap;">
            ${this.cfg.partial() ? html`
                            <ha-icon-button label="Partially close"  .disabled=${this.cfg.disabledGlobaly()} @click="${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_PARTIAL}`, partial)}" >
                                <ha-icon class="${ESC_CLASS_HA_ICON}" icon="mdi:arrow-expand-vertical"></ha-icon>
                            </ha-icon-button>` : ''}
              ${this.cfg.tilt() ? html`
                        <ha-icon-button label="${this.hass.localize('ui.card.cover.open_tilt_cover')}"  .disabled=${this.cfg.disabledGlobaly()} @click="${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_TILT_OPEN}`)}">
                            <ha-icon class="${ESC_CLASS_HA_ICON}" icon="mdi:arrow-top-right"></ha-icon>
                        </ha-icon-button>
                        <ha-icon-button label="${this.hass.localize('ui.card.cover.close_tilt_cover')}"  .disabled=${this.cfg.disabledGlobaly()} @click="${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_TILT_CLOSE}`)}">
                            <ha-icon class="${ESC_CLASS_HA_ICON}" icon="mdi:arrow-bottom-left"></ha-icon>
                        </ha-icon-button>` : ''}
          </div>
          <div class="${ESC_CLASS_SELECTOR}">
            <div class="${ESC_CLASS_SELECTOR_PICTURE} "
              style="
                width: ${this.cfg.windowWidthPx()}${UNITY};
                height: ${this.cfg.windowHeightPx()}${UNITY};
                background-image: url(${this.cfg.viewImage()});
              ">
              <img src= "${this.cfg.windowImage() } "
              style="
              ">
              <div class="${ESC_CLASS_SELECTOR_SLIDE}" style="height: ${screenPosition}${UNITY}; background-image: url(${this.cfg.shutterSlatImage()});">
                <img src="${this.cfg.shutterBottomImage()}">
              </div>
              <div class="${ESC_CLASS_SELECTOR_PICKER}"
                @mousedown="${this.mouseDown}"
                @touchstart="${this.mouseDown}"
                @pointerdown="${this.mouseDown}"
                style="top: ${screenPosition-this.cfg.pickerOverlapPx()}${UNITY};">
              </div>
              ${this.cfg.partial() && !this.cfg.offset()? html`
                <div class="${ESC_CLASS_SELECTOR_PARTIAL}" style="top:${this.cfg.defScreenPositionFromPercent(this.cfg.partial())}${UNITY}"></div>
                ` : ''}
              <div class="${ESC_CLASS_MOVEMENT_OVERLAY}" style="
                top: ${this.cfg.topOffsetPct()-7}${UNITY};
                height: ${this.cfg.coverHeightPx() + 7}${UNITY};
                display: ${(this.cfg.movementState() == "opening" || this.cfg.movementState() == "closing") ? 'block' : 'none'}">
                <ha-icon class="${ESC_CLASS_MOVEMENT_OPEN}" icon="mdi:arrow-up" style="display: ${this.cfg.movementState() == 'opening' ? 'block' : 'none'}"></ha-icon>
                <ha-icon class="${ESC_CLASS_MOVEMENT_CLOSE}" icon="mdi:arrow-down" style="display: ${this.cfg.movementState() == 'closing' ? 'block' : 'none'}"></ha-icon>
              </div>
            </div>
          </div>
          ${!this.cfg.disablePartialOpenButtons() ? html`
            <div class="${ESC_CLASS_BUTTONS}" style="flex-flow: ${this.cfg.buttonsInRow() ? 'row': 'column'} wrap;">

              <ha-icon-button label="Partially close" .disabled=${this.cfg.disabledGlobaly() || this.cfg.upButtonDisabled()} @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_PARTIAL}`, 100)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4Z"></ha-icon-button>
              <ha-icon-button label="Partially close" .disabled=${this.cfg.disabledGlobaly()} @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_PARTIAL}`, 75)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9Z"></ha-icon-button>
              <ha-icon-button label="Partially close" .disabled=${this.cfg.disabledGlobaly()} @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_PARTIAL}`, 50)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12Z"></ha-icon-button>
            </div>
            <div class="${ESC_CLASS_BUTTONS}" style="flex-flow: ${this.cfg.buttonsInRow() ? 'row': 'column'} wrap;">
              <ha-icon-button label="Partially close" .disabled=${this.cfg.disabledGlobaly()} @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_PARTIAL}`, 25)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15Z"></ha-icon-button>
              <ha-icon-button label="Partially close" .disabled=${this.cfg.disabledGlobaly()} @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_PARTIAL}`, 10)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15M8 18H16V20H8V18Z"></ha-icon-button>
              <ha-icon-button label="Partially close" .disabled=${this.cfg.disabledGlobaly() || this.cfg.downButtonDisabled()} @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_PARTIAL}`, 0)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V20H8V18Z"></ha-icon-button>
            </div>
          `:''}
        </div>
        <div class="${ESC_CLASS_BOTTOM}" style="display: ${(this.cfg.titlePosition() == TOP || this.cfg.titleDisabled()) ? 'none' : 'block'}">

          <div class="${ESC_CLASS_LABEL} ${this.cfg.disabledGlobaly() ? `${ESC_CLASS_LABEL_DISABLED}` : ''}" @click="${() => this.doDetailOpen(entityId)}" >
            ${this.cfg.friendlyName()}
          </div>
          <div class="${ESC_CLASS_POSITION} ${this.cfg.disabledGlobaly() ? `${ESC_CLASS_LABEL_DISABLED}` : ''}">
            ${positionText}
          </div>
        </div>
      </div>
    `;
  }

//##########################################
doDetailOpen(entityIdValue) {
  let e = new Event('hass-more-info', { composed: true});
  e.detail= { entityId : entityIdValue};
  this.dispatchEvent(e);
}
mouseDown = (event) =>{
    if (event.pageY === undefined) return;
    if (event.cancelable) {
      //Disable default drag event
      event.preventDefault();
    }
    this.action='user-drag';

    this.shutter = event.target.parentElement.parentElement.parentElement.parentNode;
    this.slide  = this.shutter.querySelector(`.${ESC_CLASS_SELECTOR_SLIDE}`);
    this.pickPoint = event.pageY - parseInt(this.slide.style.height);

    //console.log('this.pickPoint:',this.pickPoint);
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('touchmove', this.mouseMove);
    document.addEventListener('pointermove', this.mouseMove);

    document.addEventListener('mouseup', this.mouseUp);
    document.addEventListener('touchend', this.mouseUp);
    document.addEventListener('pointerup', this.mouseUp);
  };

  mouseMove = (event) =>{
    if (event.pageY === undefined) return;
    this.action='user-drag';

    let newScreenPosition = Math.round(boundary(event.pageY - this.pickPoint,this.cfg.coverTopPx(),this.cfg.coverBottomPx()));
    this.screenPosition = newScreenPosition; // triggers refresh

    let shutterPosition = (newScreenPosition - this.cfg.topOffsetPct()) * (100-this.cfg.offset()) / this.cfg.coverHeightPx();
    shutterPosition = Math.round(this.cfg.invertPercentage() ?shutterPosition: 100 - shutterPosition);
    let positionText = this.computePositionText(shutterPosition);
    this.positionText = positionText;
    //console.log('mouseMove:',this.screenPosition);
  };

  mouseUp = (event) => {
    if (event.pageY === undefined) return;

    this.action='user-drag';

    let newScreenPosition = Math.round(boundary(event.pageY - this.pickPoint,this.cfg.coverTopPx(),this.cfg.coverBottomPx()));
    let shutterPosition = (newScreenPosition - this.cfg.topOffsetPct()) * (100-this.cfg.offset()) / this.cfg.coverHeightPx();
    shutterPosition = Math.round(this.cfg.invertPercentage() ?shutterPosition: 100 - shutterPosition);


    //console.log('MouseUp: ShutterPosition=',shutterPosition);
    document.removeEventListener('mousemove', this.mouseMove);
    document.removeEventListener('touchmove', this.mouseMove);
    document.removeEventListener('pointermove', this.mouseMove);

    document.removeEventListener('mouseup', this.mouseUp);
    document.removeEventListener('touchend', this.mouseUp);
    document.removeEventListener('pointerup', this.mouseUp);
    //this.screenPosition=-1;
    this.sendShutterPosition(this.cfg.entityId(), shutterPosition);
    this.cfg.currentPosition(shutterPosition);
  };
  doOnclick(entityId, command, position) {

    this.action='user-click';

    const services ={
      [SERVICE_SHUTTER_UP] : {'args': ''},
      [SERVICE_SHUTTER_DOWN] : {'args': ''},
      [SERVICE_SHUTTER_STOP] : {'args': ''},
      [SERVICE_SHUTTER_PARTIAL] : {'args': {position: position}},
      [SERVICE_SHUTTER_TILT_OPEN] : {'args': ''},
      [SERVICE_SHUTTER_TILT_CLOSE] : {'args': ''},
    }
    this.callHassCoverService(entityId,command,services[command].args);

  }
  callHassCoverService(entityId,command,args='')
  {
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
  checkServiceAvailability(serviceDomain, serviceName) {
    const services = this.hass.services;
    let check = services[serviceDomain]?.[serviceName] !== undefined;
    return check;
  }
  sendShutterPosition( entityId, position)
  {
    this.callHassCoverService(entityId,SERVICE_SHUTTER_PARTIAL, { position: position });
  }
  computePositionText(currentPosition =this.cfg.currentPosition()) {

    let offset = this.cfg.offset()
    let invertPercentage=this.cfg.invertPercentage()
    let alwaysPercentage=this.cfg.alwaysPercentage()

    let visiblePosition;
    let positionText;

    if (invertPercentage) {
      visiblePosition = offset ? Math.min(100, Math.round(currentPosition / offset * 100 )) : currentPosition;
      positionText = this.positionPercentToText(visiblePosition, invertPercentage, alwaysPercentage);
      console.log(`PositionText1='${positionText}'`);

      if (visiblePosition == 100 && offset) {
        positionText += ' ('+ (100-Math.round(Math.abs(currentPosition-visiblePosition)/offset*100)) +' %)';
      }
      console.log(`PositionText2='${positionText}'`);

    } else {
      visiblePosition = offset ? Math.max(0, Math.round((currentPosition - offset) / (100-offset) * 100 )) : currentPosition;
      console.log(`visiblePosition='${visiblePosition}'`);
      positionText = this.positionPercentToText(visiblePosition, invertPercentage, alwaysPercentage);
      console.log(`PositionText3='${positionText}'`);

      if (visiblePosition == 0 && offset) {
        positionText += ' ('+ (100-Math.round(Math.abs(currentPosition-visiblePosition)/offset*100)) +' %)';
      }
      console.log(`PositionText4='${positionText}'`);
    }
    console.log(`PositionText='${positionText}'`);
    return positionText;
  }
  positionPercentToText(percent, inverted, alwaysPercentage) {
    if (typeof percent === 'number') {
      if (!alwaysPercentage) {
        if (percent == 100) {
          return this.hass.localize(inverted?'component.cover.entity_component._.state.closed':'component.cover.entity_component._.state.open');
        } else if (percent == 0) {
          return this.hass.localize(inverted?'component.cover.entity_component._.state.open':'component.cover.entity_component._.state.closed');
        }
      }
      return percent + ' %';
    } else {
      return this.hass.localize('state.default.unavailable');
    }
  }


  static get styles() {
    return css`${unsafeCSS(CSS)}
    `
  }

}
customElements.define(HA_CARD_NAME, EnhancedShutterCardNew);
customElements.define(HA_SHUTTER_NAME, EnhancedShutter);
console.info(
  '%c ENHANCED-SHUTTER-CARD ',
  'color: white; background: green; font-weight: 700',
);
//###########################################
class shutterCfg {

  cfg={};
  #state={};
  constructor(hass,configMain,imageDimensions,allImages)
  {
      let entityId = this.entityId(configMain.entity ? configMain.entity : configMain);

      this.state(hass.states[entityId]);
      this.friendlyName(configMain.name ? configMain.name : this.stateAttributes() ? this.stateAttributes().friendly_name : 'Unkown');
      this.invertPercentage(configMain.invert_percentage);

      this.currentPosition(this.stateAttributes() ? this.stateAttributes().current_position : ESC_CURRENT_POSITION);

      this.windowImage(allImages[CONFIG_WINDOW_IMAGE][entityId].src);
      this.viewImage(allImages[CONFIG_VIEW_IMAGE][entityId].src);
      this.shutterSlatImage(allImages[CONFIG_SHUTTER_SLAT_IMAGE][entityId].src);
      this.shutterBottomImage(allImages[CONFIG_SHUTTER_BOTTOM_IMAGE][entityId].src);

      let base_height_px = configMain.base_height_px || imageDimensions[entityId]?.height;
      let resize_height_pct = configMain.resize_height_pct;
      this.windowHeightPx(Math.round(boundary(resize_height_pct,ESC_MIN_RESIZE_HEIGHT_PCT,ESC_MAX_RESIZE_HEIGHT_PCT) / 100 * base_height_px));

      let base_width_px  = configMain.base_width_px || imageDimensions[entityId]?.width;
      let resize_width_pct  = configMain.resize_width_pct;
      this.windowWidthPx(Math.round(boundary(resize_width_pct, ESC_MIN_RESIZE_WIDTH_PCT ,ESC_MAX_RESIZE_WIDTH_PCT)  / 100 * base_width_px));

      this.partial(boundary(configMain.partial_close_percentage));
      this.offset(boundary(configMain.offset_closed_percentage));

      this.topOffsetPct(Math.round(boundary(configMain.top_offset_pct)/ 100 * this.windowHeightPx()));
      this.bottomOffsetPct(Math.round(boundary(configMain.bottom_offset_pct)/ 100 * this.windowHeightPx()));

      this.tilt(!!configMain.can_tilt);

      this.defButtonPosition(configMain);
      this.titlePosition(configMain.title_position);
      this.titleDisabled(configMain.title_disabled);

      this.alwaysPercentage(!!configMain.always_percentage);
      this.disableEndButtons(!!configMain.disable_end_buttons);
      this.pickerOverlapPx(ESC_PICKER_OVERLAP_PX);
      this.disableStandardButtons(configMain.disable_standard_buttons);
      this.disablePartialOpenButtons(configMain.disable_partial_open_buttons);

      //console.log ('constuct cfg: ',this);
      Object.preventExtensions(this);
  }

  /*
   ** getters/setters
   */
  getCfg(key,value= null){
    if (value!== null) this.cfg[key]= value;
    return this.cfg[key];
  }
  getState(key,value= null){
    if (value!== null) this.#state[key]= value;
    return this.#state[key];
  }
  state(value = null){
    return this.getState(CONFIG_STATE,value);
  }
  entityId(value = null){
    return this.getCfg(CONFIG_ENTITY_ID,value);
  }
  titleDisabled(value = null){
    return this.getCfg(CONFIG_TITLE_DISABLED,value);
  }
  friendlyName(value = null){
    return this.getCfg(CONFIG_NAME,value);
  }
  disableStandardButtons(value = null){
    return this.getCfg(CONFIG_DISABLE_STANDARD_BUTTONS,value);
  }
  disablePartialOpenButtons(value = null){
    return this.getCfg(CONFIG_DISABLE_PARTIAL_OPEN_BUTTONS,value);
  }
  buttonsPosition(value = null){
    return this.getCfg(CONFIG_BUTTONS_POSITION,value);
  }
  disableEndButtons(value = null){
    return this.getCfg(CONFIG_DISABLE_END_BUTTONS,value);
  }
  invertPercentage(value = null){
    return this.getCfg(CONFIG_INVERT_PCT,value);
  }
  currentPosition(value = null){
    return this.getCfg(CONFIG_CURRENT_POSITION,value);
  }
  windowImage(value = null){
    return this.getCfg(CONFIG_WINDOW_IMAGE,value);
  }
  viewImage(value = null){
    return this.getCfg(CONFIG_VIEW_IMAGE,value);
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
  topOffsetPct(value = null){
    return this.getCfg(CONFIG_TOP_OFFSET_PCT,value);
  }
  bottomOffsetPct(value = null){
    return this.getCfg(CONFIG_BOTTOM_OFFSET_PCT,value);
  }
  tilt(value = null){
    return this.getCfg(CONFIG_CAN_TILT,value);
  }
  titlePosition(value = null){
    return this.getCfg(CONFIG_TITLE_POSITION,value);
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
  movementState(){
    return (this.state() ? this.state().state : 'unknownMovement');
  }
  stateAttributes(){
    return (this.state() && this.state().attributes);
  }
  buttonsInRow(){
    return this.buttonsPosition() == TOP || this.buttonsPosition() == BOTTOM;
  }
  buttonsContainerReversed(){
    return this.buttonsPosition() == BOTTOM || this.buttonsPosition() == RIGHT;
  }
  disabledGlobaly() {
    return (this.state().state == "unavailable");
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
  defButtonPosition(config) {
    let buttonsPosition = config.buttons_position;
    buttonsPosition
      = (buttonsPosition && POSITIONS.includes(buttonsPosition.toLowerCase()))
      ? buttonsPosition.toLowerCase()
      : ESC_BUTTONS_POSITION;

      this.buttonsPosition(buttonsPosition);
  }
/*
  defPercentagPositionFromScreenposition(screenPosition){
    let percentagePosition = Math.round((screenPosition - this.topOffsetPct()) / this.coverHeightPx() * (100-this.offset()));
    percentagePosition = this.getDisplayedPctPosition(percentagePosition);
    return percentagePosition;
  }
  getDisplayedPctPosition(position){
    let pctPosition = Math.round(this.invertPercentage() ? position : 100 - position);
    return pctPosition;
  }
  updatePosition(percentagePosition){
    this.currentPosition(percentagePosition);
  }
*/
  defScreenPositionFromPercent(position_pct=this.currentPosition()) {
    let visiblePosition;
    if (this.invertPercentage()) {
      visiblePosition = !!this.offset() ? Math.min(100, Math.round(position_pct / this.offset() * 100 )) : position_pct;
    }
    else  {
      visiblePosition = !!this.offset() ? Math.max(0, Math.round((position_pct - this.offset()) / (100-this.offset()) * 100 )) : position_pct;
    }

    let position =this.coverHeightPx() * (this.invertPercentage()?visiblePosition:100-visiblePosition) / 100 + this.topOffsetPct();

    return position;

  }
  coverHeightPx(){
    return this.windowHeightPx()-this.bottomOffsetPct() - this.topOffsetPct();
  }
  coverTopPx(){
    return this.topOffsetPct();
  }
  coverBottomPx(){
    return this.windowHeightPx()-this.bottomOffsetPct();
  }
}
//####################################

function getPromiseForImageSize(image)
{
  let imageUrl = image.src;
  const promise = new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () =>{
        resolve({ width: img.width, height: img.height });
    };
    img.onerror = function() {
      img.src = `${ESC_IMAGE_MAP}/${ESC_IMAGE_WINDOW}`;
    };
    img.src = imageUrl;
  });

  return promise;
}
function getPromisesForImageSizes(imageObj) {
  const promises = [];

  for (const key in imageObj) {
    if (imageObj.hasOwnProperty(key)) {
      const promise = getPromiseForImageSize(imageObj[key])
        .then(dimensions => ({ [key]: dimensions }))
        .catch(error => {
          console.error(`Error loading image ${key}:`, error);
          return { [key]: null };
        });
      promises.push(promise);
    }
  }
  return promises;
}
function boundary(value,min=0,max=100){
  return Math.max(min,Math.min(max,value));
}
function defImagePath(image_map,image)
{
 return (image.includes('/') ? image : `${image_map}/${image}`);
}

function deepEqual(a, b) {
  // Check if both are the same reference
  if (a === b) return true;

  // If either is not an object, they must be primitive values and different
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  // Get the keys of both objects
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  // If the number of keys is different, they are not equal
  if (keysA.length !== keysB.length) {
    return false;
  }

  // Check the equality of each key and its corresponding value
  for (let key of keysA) {
    // If the key is missing in object 'b' or values are different, return false
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  // If no issues were found, the objects are equal
  return true;
}