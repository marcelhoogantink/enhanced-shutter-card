import {
  LitElement,
  html,
  css,
  unsafeCSS
}
//from "https://cdn.jsdelivr.net/npm/lit-element@2.0.1/lit-element.min.js?module"
//from "https://unpkg.com/lit-element@4.0.0/lit-element.js?module";
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
const ESC_CLASS_POSITION = `${ESC_BASE_CLASS_NAME}-position`;
const ESC_CLASS_BUTTONS = `${ESC_BASE_CLASS_NAME}-buttons`;
const ESC_CLASS_BUTTONS_TOP = `${ESC_CLASS_BUTTONS}-${TOP}`;
const ESC_CLASS_BUTTONS_BOTTOM = `${ESC_CLASS_BUTTONS}-${BOTTOM}`;
const ESC_CLASS_BUTTONS_LEFT = `${ESC_CLASS_BUTTONS}-${LEFT}`;
const ESC_CLASS_BUTTONS_RIGHT = `${ESC_CLASS_BUTTONS}-${RIGHT}`;
const ESC_CLASS_BUTTON = `${ESC_BASE_CLASS_NAME}-button`;
const ESC_CLASS_BUTTON_UP = `${ESC_BASE_CLASS_NAME}-button-up`;
const ESC_CLASS_BUTTON_STOP = `${ESC_BASE_CLASS_NAME}-button-stop`;
const ESC_CLASS_BUTTON_DOWN = `${ESC_BASE_CLASS_NAME}-button-down`;
const ESC_CLASS_BUTTON_PARTIAL = `${ESC_BASE_CLASS_NAME}-button-partial`;
const ESC_CLASS_BUTTON_TILT_OPEN = `${ESC_BASE_CLASS_NAME}-button-tilt-open`;
const ESC_CLASS_BUTTON_TILT_DOWN = `${ESC_BASE_CLASS_NAME}-button-tilt-down`;
const ESC_CLASS_SELECTOR = `${ESC_BASE_CLASS_NAME}-selector`;
const ESC_CLASS_SELECTOR_PICTURE = `${ESC_BASE_CLASS_NAME}-selector-picture`;
const ESC_CLASS_SELECTOR_SLIDE = `${ESC_BASE_CLASS_NAME}-selector-slide`;
const ESC_CLASS_SELECTOR_PICKER = `${ESC_BASE_CLASS_NAME}-selector-picker`;
const ESC_CLASS_SELECTOR_PARTIAL = `${ESC_BASE_CLASS_NAME}-selector-partial`;
const ESC_CLASS_MOVEMENT_OVERLAY = `${ESC_BASE_CLASS_NAME}-movement-overlay`;
const ESC_CLASS_MOVEMENT_OPEN = `${ESC_BASE_CLASS_NAME}-movement-open`;
const ESC_CLASS_MOVEMENT_CLOSE = `${ESC_BASE_CLASS_NAME}-movement-close`;

const TEST = '#'.ESC_BUTTONS_POSITION;

const POSITIONS =[LEFT,RIGHT,TOP,BOTTOM,NONE];

const ESC_IMAGE_MAP = `/local/community/${HA_CARD_NAME}/images`;

const ESC_IMAGE_VIEW = 'esc-view.png';
const ESC_IMAGE_SHUTTER_SLAT = 'esc-shutter-slat.png';
const ESC_IMAGE_SHUTTER_BOTTOM = 'esc-shutter-bottom.png';
const ESC_IMAGE_WINDOW = 'esc-window.png';


const SERVICE_SHUTTER_UP = 'open_cover';
const SERVICE_SHUTTER_DOWN = 'close_cover';
const SERVICE_SHUTTER_STOP = 'stop_cover';
const SERVICE_SHUTTER_PARTIAL = 'set_cover_position';
const SERVICE_SHUTTER_TILT_OPEN = 'open_cover_tilt';
const SERVICE_SHUTTER_TILT_CLOSE = 'close_cover_tilt';

const UNITY= 'px';

const CONFIG_FRIENDLY_NAME = 'friendly_name';
const CONFIG_IMAGE_MAP = 'image_map';
const CONFIG_WINDOW_IMAGE = 'windows_image';
const CONFIG_VIEW_IMAGE = 'view_image';
const CONFIG_SHUTTER_SLAT_IMAGE = 'shutter_slat_image';
const CONFIG_SHUTTER_BOTTOM_IMAGE = 'shutter_bottom_image';
const CONFIG_BASE_HEIGHT_PX = 'base_height_px';
const CONFIG_BASE_WIDTH_PX = 'base_width_px';
const CONFIG_HEIGHT_PX = 'height_px';
const CONFIG_WIDTH_PX = 'width_px';
const CONFIG_RESIZE_HEIGHT_PCT = 'resize_height_pct';
const CONFIG_RESIZE_WIDTH_PCT = 'resise_width_pct';
const CONFIG_TOP_OFFSET_PCT = 'top_offset_pct';
const CONFIG_BOTTOM_OFFSET_PCT = 'bottom_offset_pct';
const CONFIG_BUTTONS_POSITION = 'buttons_position';
const CONFIG_TITLE_POSITION = 'title_position';
const CONFIG_INVERT_PCT = 'invert_percentage';
const CONFIG_CAN_TILT = 'can_tilt';
const CONFIG_PARTIAL_CLOSE_PCT = 'partial_close_percentage';
const CONFIG_OFFSET_CLOSE_PCT = 'offset_closed_percentage';
const CONFIG_ALWAYS_PCT = 'always_percentage';
const CONFIG_DISABLE_END_BUTTONS = 'disable_end_buttons';
const CONFIG_PICKER_OVERLAP_PX = 'picker_overlap_px';
const CONFIG_CURRENT_POSITION = 'current_position';

const ESC_FRIENDLY_NAME = 'unknown';
const ESC_BASE_WIDTH_PX =100;
const ESC_BASE_HEIGHT_PX = 100;

const ESC_RESIZE_WIDTH_PCT  = 100;
const ESC_RESIZE_HEIGHT_PCT = 100;

const ESC_MIN_RESIZE_WIDTH_PCT  =  50;
const ESC_MAX_RESIZE_WIDTH_PCT  = 200;
const ESC_MIN_RESIZE_HEIGHT_PCT =  50;
const ESC_MAX_RESIZE_HEIGHT_PCT = 200;

const ESC_TOP_OFFSET_PCT = 0;
const ESC_BOTTOM_OFFSET_PCT = 0;
const ESC_PARTIAL_CLOSE_PCT = 0;
const ESC_OFFSET_CLOSED_PCT = 0;

const ESC_BUTTONS_POSITION =LEFT;
const ESC_TITLE_POSITION = TOP;

const ESC_CAN_TILT = false;
const ESC_INVERT_PCT = false;
const ESC_ALWAYS_PCT = false;
const ESC_DISABLE_END_BUTTONS = false;
const ESC_PICKER_OVERLAP_PX = 20;
const ESC_CURRENT_POSITION =0;

const CONFIG_DEFAULT ={
  [CONFIG_FRIENDLY_NAME]: ESC_FRIENDLY_NAME,

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
  [CONFIG_INVERT_PCT]: ESC_INVERT_PCT,
  [CONFIG_CAN_TILT]: ESC_CAN_TILT,
  [CONFIG_PARTIAL_CLOSE_PCT]: ESC_PARTIAL_CLOSE_PCT,
  [CONFIG_OFFSET_CLOSE_PCT]: ESC_OFFSET_CLOSED_PCT,
  [CONFIG_ALWAYS_PCT]: ESC_ALWAYS_PCT,
  [CONFIG_DISABLE_END_BUTTONS]: ESC_DISABLE_END_BUTTONS,

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
      hass: {},
      config: {},
      cfg: {},
    };
  }

  render() {


    console.log('start rendering EnhancedShutterCardNew:',this,this.hass);

    if (!this.config || !this.hass) {
      console.log('ShutterCard  .. no content ..');
      return html``;
    }
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

    const promisesForImageSizes = getPromisesForImageSizes(this.allImages[CONFIG_WINDOW_IMAGE]);

    return until(Promise.all(promisesForImageSizes).then((results) => {
      this.cardReady = false;
      const imageDimensions = Object.assign({}, ...results);
      //console.log('imageDimensions:',imageDimensions);
      //console.log('  ShutterCard:',this.config);

      return html`
        <ha-card .header=${this.config.title}>
          <div class="sc-shutters">
            ${this.config.entities.map(
              (currEntity) => {

                let cfg = new shutterCfg(this.hass,this.config,currEntity,imageDimensions,this.allImages);

                return html`
                <enhanced-shutter .hass=${this.hass} .config=${currEntity} .cfg=${cfg} >
                </enhanced-shutter>
                `
              }
            )}
          </div>
        </ha-card>
      `
        }));

    //this.cfg = new shutterCfg(this.hass,CONFIG_DEFAULT,this.config,imageDimensions,this.allImages);

  }

  static get styles() {
    return css`
      .sc-shutters { padding: 16px; }
    `;
  }
  setConfig(config) {
    if (!config.entities) {
      throw new Error('You need to define entities');
    }

    this.config = config;

  }
// The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return this._config.entities.length + 1;
  }

  //Section layout : we compute the size of the card. cf : https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/#sizing-in-sections-view
  ggetLayoutOptions() {
    let nbRows = 4;
    let nbCols = 3;
    if (this._config && this._config.entities) {
      nbRows = this._config.title ? 1.5 : 0;
      let maxNbCols = 0;
      this._config.entities.forEach(entity => {
        nbCols = 0;
        let verticalButtons = false;
        entity.buttons_position == 'top' || entity.buttons_position == 'down' ? verticalButtons = true : verticalButtons = false;
        let isDisableStandardButtons = entity.disable_standard_buttons ? entity.disable_standard_buttons : false;
        let isTiltButtonsDisplayed = entity.can_tilt ? entity.can_tilt : false;
        let isPartialButtonDisplayed = entity.partial_open_buttons_displayed ? entity.partial_open_buttons_displayed : false;
        if (verticalButtons) {
          //vertical layout for buttons
          entity.shutter_width_px ? nbCols = nbCols + Math.round(entity.shutter_width_px / 80) : nbCols = nbCols + 2;
          nbCols > maxNbCols ? maxNbCols = nbCols : null; // we keep the max number of cols for the section.
          nbRows = nbRows + 3.2; // 1 for title and 2 for the image.
          isDisableStandardButtons ? null : nbRows = nbRows + 1;
          isTiltButtonsDisplayed ? nbRows = nbRows + 1 : null;
          isPartialButtonDisplayed ? nbRows = nbRows + 2 : null;
        } else {
          //horizontal layout for buttons
          entity.shutter_width_px ? nbCols = nbCols + Math.round(entity.shutter_width_px / 80) : nbCols = nbCols + 2;
          isDisableStandardButtons ? null : nbCols = nbCols + 1;
          isTiltButtonsDisplayed ? nbCols = nbCols + 1 : null;
          isPartialButtonDisplayed ? nbCols = nbCols + 2 : null;
          nbCols > maxNbCols ? maxNbCols = nbCols : null; // we keep the max number of cols for the section.
          nbRows = nbRows + 3.2;
        }
      });
      nbRows = Math.ceil(nbRows);
      nbCols = Math.ceil(maxNbCols);
    }
    //console.log("Section sizing computed. nbRows : " + nbRows + " nbCols : " + nbCols);
    return {
      "grid_rows": nbRows,
      "grid_min_rows": nbRows,
      "grid_columns": nbCols,
      "grid_min_columns": nbCols,
    };
  }

}


class EnhancedShutterCard extends HTMLElement {

  set hass(hass) {
    const config = this.config
    const entities = config.entities;
    //console.info('Starting Enhanced Shutter Card');
    //console.log('config: ',config);
    //console.log('hass: ',hass);
    //Init the card
    if (!this.card) {
      const card = document.createElement(HA_ELEMENT_NAME);
      if (this.config.title) {
          card.header = this.config.title;
      }

      this.card = card;
      this.appendChild(card);


      this.allImages={};
      IMAGE_TYPES.forEach((image_type) =>
      {
        let images={};
        let base_image_map = config.image_map || ESC_IMAGE_MAP;
        let base_image = config[image_type] ? defImagePath(base_image_map,config[image_type]) : `${ESC_IMAGE_MAP}/${CONFIG_DEFAULT[image_type]}`;
        entities.forEach((entity) =>
        {
          base_image_map = entity.image_map || config.image_map || ESC_IMAGE_MAP;
          let entityId = entity.entity ? entity.entity : entity;

          let image = entity[image_type] ? defImagePath(base_image_map,entity[image_type]) : base_image;
          let src = image || `${ESC_IMAGE_MAP}/${CONFIG_DEFAULT[image_type]}`;
          images[entityId]={entityId,src};

        });
        this.allImages[image_type]=images;
      });

      const promisesForImageSizes = getPromisesForImageSizes(this.allImages[CONFIG_WINDOW_IMAGE]);

//      let test = this.getPromiseResults(promisesForImageSizes);
//      console.log('TEST:',test);

      Promise.all(promisesForImageSizes)
          .then(results => {
            this.cardReady = false;
            const imageDimensions = Object.assign({}, ...results);
            this.buildShutters(hass,config,imageDimensions);
            this.updateShutters(hass, config);
            this.cardReady = true;
          })
          .catch(error => console.error(error));

    }
    //Update the shutters UI
    if (this.cardReady) this.updateShutters(hass,config);
  }
  // end main
  async getPromiseResults(promises){
    let results = await Promise.all(promises);
    //console.log(results);
      const imageDimensions = Object.assign({}, ...results);
      return imageDimensions;
  };

  buildShutters(hass,config,imageDimensions)
  {
    const entities = config.entities;
    let allShutters = document.createElement('div');
    allShutters.className = `${ESC_CLASS_SHUTTERS}`;
    this.entityCfg = [];
    let pickPoint = -1;

    entities.forEach((entity) =>
    {
      let entityId = entity.entity ? entity.entity : entity;
      let cfg = this.entityCfg[entityId] = new shutterCfg(hass,config,entity,imageDimensions,this.allImages);
      cfg.testLog();
      const buttonsInRow = cfg.buttonsPosition() == TOP || cfg.buttonsPosition() == BOTTOM;
      const buttonsContainerReversed = cfg.buttonsPosition() == BOTTOM || cfg.buttonsPosition() == RIGHT;

      let shutter = document.createElement('div');

      shutter.className = ESC_BASE_CLASS_NAME;
      shutter.dataset.shutter = entityId;

      shutter.innerHTML = `
        <div class="${ESC_CLASS_TOP}">
          <div class="${ESC_CLASS_LABEL}"></div>
          <div class="${ESC_CLASS_POSITION}"></div>
        </div>
        <div class="${ESC_CLASS_BUTTONS} ${ESC_CLASS_BUTTONS_TOP}" style="display: ${cfg.buttonsPosition()==TOP?'flex':'none'};">
          <ha-icon-button label="` + hass.localize(`ui.card.cover.open_cover`) +`" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_UP} " data-command="${SERVICE_SHUTTER_UP}"><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
          <ha-icon-button label="` + hass.localize(`ui.card.cover.stop_cover`) +`"class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_STOP} " data-command="${SERVICE_SHUTTER_STOP}"><ha-icon icon="mdi:stop"></ha-icon></ha-icon-button>
          <ha-icon-button label="` + hass.localize(`ui.card.cover.close_cover`) +`" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_DOWN} " data-command="${SERVICE_SHUTTER_DOWN}"><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
        </div>
        <div class="${ESC_CLASS_BUTTONS} ${ESC_CLASS_BUTTONS_TOP}" style="display: ${cfg.buttonsPosition()==TOP?'flex':'none'};">
          <ha-icon-button label="Partially close (${cfg.partial()}%)" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_PARTIAL} " data-command="${SERVICE_SHUTTER_PARTIAL}" data-position="${cfg.partial()}"><ha-icon icon="mdi:arrow-expand-vertical"></ha-icon></ha-icon-button>
          <ha-icon-button label="` + hass.localize(`ui.card.cover.open_tilt_cover`)  +`" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_TILT_OPEN} " data-command="${SERVICE_SHUTTER_TILT_OPEN}"><ha-icon icon="mdi:arrow-top-right"></ha-icon></ha-icon-button>
          <ha-icon-button label="` + hass.localize(`ui.card.cover.close_tilt_cover`) +`" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_TILT_DOWN} " data-command="${SERVICE_SHUTTER_TILT_CLOSE}"><ha-icon icon="mdi:arrow-bottom-left"></ha-icon></ha-icon-button>
        </div>
        <div class="${ESC_CLASS_MIDDLE}" style="
          ">
          <div class="${ESC_CLASS_BUTTONS}  ${ESC_CLASS_BUTTONS_LEFT}" style="display: ${cfg.buttonsPosition()==LEFT?'flex':'none'};">
            <ha-icon-button label="` + hass.localize(`ui.card.cover.open_cover`) +`" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_UP} " data-command="${SERVICE_SHUTTER_UP}"><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
            <ha-icon-button label="` + hass.localize(`ui.card.cover.stop_cover`) +`"class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_STOP} " data-command="${SERVICE_SHUTTER_STOP}"><ha-icon icon="mdi:stop"></ha-icon></ha-icon-button>
            <ha-icon-button label="` + hass.localize(`ui.card.cover.close_cover`) +`" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_DOWN} " data-command="${SERVICE_SHUTTER_DOWN}"><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
          </div>
          <div class="${ESC_CLASS_BUTTONS}  ${ESC_CLASS_BUTTONS_LEFT}" style="display: ${cfg.buttonsPosition()==LEFT?`flex`:`none`};">
            <ha-icon-button label="Partially close (${cfg.partial()}%)" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_PARTIAL} " data-command="${SERVICE_SHUTTER_PARTIAL}" data-position="${cfg.partial()}"><ha-icon icon="mdi:arrow-expand-vertical"></ha-icon></ha-icon-button>
            <ha-icon-button label="${hass.localize(`ui.card.cover.open_tilt_cover`)}" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_TILT_OPEN} " data-command="${SERVICE_SHUTTER_TILT_OPEN}"><ha-icon icon="mdi:arrow-top-right"></ha-icon></ha-icon-button>
            <ha-icon-button label="${hass.localize(`ui.card.cover.close_tilt_cover`)}" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_TILT_DOWN} " data-command="${SERVICE_SHUTTER_TILT_CLOSE}"><ha-icon icon="mdi:arrow-bottom-left"></ha-icon></ha-icon-button>
          </div>
          <div class="${ESC_CLASS_SELECTOR}">
            <div class="${ESC_CLASS_SELECTOR_PICTURE} "
              style="
                width: ${cfg.windowWidthPx()}${UNITY};
                height: ${cfg.windowHeightPx()}${UNITY};
                background-image: url(${cfg.viewImage()});
              ">
              <img src= "${cfg.windowImage() } "
              style="
              ">
              <div class="${ESC_CLASS_SELECTOR_SLIDE}" style="height: ${cfg.topOffsetPct()}${UNITY}; background-image: url(${cfg.shutterSlatImage()});">
                <img src="${cfg.shutterBottomImage()}">
              </div>
              <div class="${ESC_CLASS_SELECTOR_PICKER}" style="top: ${cfg.topOffsetPct()-cfg.pickerOverlapPx()}${UNITY};"></div>`+
              (cfg.partial()&&!cfg.offset()?
                `<div class="${ESC_CLASS_SELECTOR_PARTIAL}" style="top:${cfg.defScreenPositionFromPercent(cfg.partial())}${UNITY}"></div>`:``
              ) + `
              <div class="${ESC_CLASS_MOVEMENT_OVERLAY}" style="top: ${cfg.topOffsetPct()-7}${UNITY}; height: ${cfg.coverHeightPx() + 7}${UNITY};">
                <ha-icon class="${ESC_CLASS_MOVEMENT_OPEN}" icon="mdi:arrow-up"></ha-icon>
                <ha-icon class="${ESC_CLASS_MOVEMENT_CLOSE}" icon="mdi:arrow-down"></ha-icon>
              </div>
            </div>
          </div>
          <div class="${ESC_CLASS_BUTTONS} ${ESC_CLASS_BUTTONS_RIGHT}" style="display: ${cfg.buttonsPosition()==RIGHT?'flex':'none'};">
            <ha-icon-button label="` + hass.localize(`ui.card.cover.open_cover`) +`" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_UP} " data-command="${SERVICE_SHUTTER_UP}"><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
            <ha-icon-button label="` + hass.localize(`ui.card.cover.stop_cover`) +`"class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_STOP} " data-command="${SERVICE_SHUTTER_STOP}"><ha-icon icon="mdi:stop"></ha-icon></ha-icon-button>
            <ha-icon-button label="` + hass.localize(`ui.card.cover.close_cover`) +`" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_DOWN} " data-command="${SERVICE_SHUTTER_DOWN}"><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
        </div>

        </div>
        <div class="${ESC_CLASS_BUTTONS} ${ESC_CLASS_BUTTONS_BOTTOM}" style="display: ${cfg.buttonsPosition()==BOTTOM?'flex':'none'};">
            <ha-icon-button label="` + hass.localize(`ui.card.cover.open_cover`) +`" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_UP} " data-command="${SERVICE_SHUTTER_UP}"><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
            <ha-icon-button label="` + hass.localize(`ui.card.cover.stop_cover`) +`"class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_STOP} " data-command="${SERVICE_SHUTTER_STOP}"><ha-icon icon="mdi:stop"></ha-icon></ha-icon-button>
            <ha-icon-button label="` + hass.localize(`ui.card.cover.close_cover`) +`" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_DOWN} " data-command="${SERVICE_SHUTTER_DOWN}"><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
        </div>
        <div class="${ESC_CLASS_BOTTOM}">
          <div class="${ESC_CLASS_LABEL}"></div>
          <div class="${ESC_CLASS_POSITION}"></div>
        </div>
      `;

      let slide  = shutter.querySelector(`.${ESC_CLASS_SELECTOR_SLIDE}`);
      let picker = shutter.querySelector(`.${ESC_CLASS_SELECTOR_PICKER}`);
      let labels = shutter.querySelectorAll(`.${ESC_CLASS_LABEL}`);

      const reverse_position={
          [TOP] : BOTTOM,
          [BOTTOM] : TOP,
        }
      if (cfg.titlePosition()=='none'){
        shutter.querySelector(`.${ESC_BASE_CLASS_NAME}-${TOP}`).style.display = "none";
        shutter.querySelector(`.${ESC_BASE_CLASS_NAME}-${BOTTOM}`).style.display = "none";

      }else{
        shutter.querySelector(`.${ESC_BASE_CLASS_NAME}-${cfg.titlePosition()}`).style.display = "block";
        shutter.querySelector(`.${ESC_BASE_CLASS_NAME}-${reverse_position[cfg.titlePosition()]}`).style.display = "none";
      }
      let hassDetailPopup = (event) =>{
          let e = new Event('hass-more-info', { composed: true });
          e.detail = {
            entityId
          };
          this.dispatchEvent(e);
      }

      labels.forEach((label) => {
          label.addEventListener('click', hassDetailPopup);
        }
      )

      let mouseDown = (event) =>{
        if (event.cancelable) {
          //Disable default drag event
          event.preventDefault();
        }
        if (event.pageY === undefined) return;

        pickPoint = event.pageY - parseInt(slide.style.height);

        this.isUpdating = true;

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('touchmove', mouseMove);
        document.addEventListener('pointermove', mouseMove);

        document.addEventListener('mouseup', mouseUp);
        document.addEventListener('touchend', mouseUp);
        document.addEventListener('pointerup', mouseUp);
      };

      let mouseMove = (event) =>{
        if (event.pageY === undefined) return;

        let newScreenPosition = Math.round(boundary(event.pageY - pickPoint,cfg.coverTopPx(),cfg.coverBottomPx()));

        setPickerPositionScreen(cfg,newScreenPosition, picker, slide);

        let percentagePosition=cfg.defPercentagPositionFromScreenposition(newScreenPosition);

        shutter.querySelectorAll(`.${ESC_CLASS_POSITION}`).forEach( (shutterPositionText) =>{
          setShutterPositionText(hass,cfg,percentagePosition,shutter,shutterPositionText);
        })
      };

      let mouseUp = (event) => {
        if (event.pageY === undefined) return;

        //console.log( 'MousUp cfg: ',cfg);

        this.isUpdating = false;
        let newPosition = Math.round(boundary(event.pageY - pickPoint,cfg.coverTopPx(),cfg.coverBottomPx()));
        //console.log( 'newPosition : ',newPosition);

        let position = (newPosition - cfg.topOffsetPct()) * (100-cfg.offset()) / cfg.coverHeightPx();
        //console.log( 'position 1: ',position);
        position = Math.round(cfg.invertPercentage() ?position: 100 - position);//invert
        //console.log( 'position 2: ',position);
        sendShutterPosition(hass, entityId, position);

        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('touchmove', mouseMove);
        document.removeEventListener('pointermove', mouseMove);

        document.removeEventListener('mouseup', mouseUp);
        document.removeEventListener('touchend', mouseUp);
        document.removeEventListener('pointerup', mouseUp);
      };

      //Manage slider update
      picker.addEventListener('mousedown', mouseDown);
      picker.addEventListener('touchstart', mouseDown);
      picker.addEventListener('pointerdown', mouseDown);

      //Manage click on buttons
      shutter.querySelectorAll(`.${ESC_CLASS_BUTTON}`).forEach( (button) =>{

        button.onclick =  (event) =>{

          const command = event.target.parentElement.dataset.command;

          const services ={
            [SERVICE_SHUTTER_UP] : {'args': ''},
            [SERVICE_SHUTTER_DOWN] : {'args': ''},
            [SERVICE_SHUTTER_STOP] : {'args': ''},
            [SERVICE_SHUTTER_PARTIAL] : {'args': {position: this.dataset.position}},
            [SERVICE_SHUTTER_TILT_OPEN] : {'args': ''},
            [SERVICE_SHUTTER_TILT_CLOSE] : {'args': ''},
          }
          callHassCoverService(hass,entityId,command,services[command].args);
        };
      });

      allShutters.appendChild(shutter);
    });
    this.card.appendChild(allShutters);

    const style = document.createElement('style');
    style.textContent = CSS;
    this.appendChild(style);

  }
  updateShutters(hass,config)
  {
    console.log('updateShutters() ....');
    const entities = config.entities;
    entities.forEach((entity) =>
    {
      let entityId = entity.entity ? entity.entity : entity;
      let cfg = this.entityCfg[entityId];

      const state = hass.states[entityId];
      let statePosition = (state && state.attributes) ? state.attributes.current_position : cfg.currentPosition();

      const movementState = state ? state.state : 'Demo';
      const shutter = this.card.querySelector('div[data-shutter="' + entityId +'"]');
      setMovement(movementState, shutter);

      if (statePosition != cfg.currentPosition() || !this.cardReady)
      {
        cfg.updatePosition(statePosition);

        const slide = shutter.querySelector(`.${ESC_CLASS_SELECTOR_SLIDE}`);
        const picker = shutter.querySelector(`.${ESC_CLASS_SELECTOR_PICKER}`);

        const labels = shutter.querySelectorAll(`.${ESC_CLASS_LABEL}`);
        labels.forEach((shutterLabel) =>{
            shutterLabel.innerHTML = cfg.friendlyName();
        })

        if (!this.isUpdating) {
          shutter.querySelectorAll(`.${ESC_CLASS_POSITION}`).forEach( (shutterPosition) =>{
            setShutterPositionText(hass,cfg,cfg.currentPosition(),shutter,shutterPosition, statePosition);
          })
          let screenPosition = getPickerPositionScreenFromPercentage(cfg,statePosition);
          setPickerPositionScreen(cfg,screenPosition, picker, slide);

        }
      }
    });
  }
  setConfig(config) {
    if (!config.entities) {
      throw new Error('You need to define entities');
    }
    this.config = config;
    this.cardReady= false;
    this.isUpdating = false;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return this.config.entities.length + 1;
  }
}
class EnhancedShutter extends LitElement{
  //reactive properties
  pickPoint = -1;
  slide;
  picker;
  shutter;
  entityId;
  static get properties() {
    return {
      hass: {},
      config: {state: true},
    };
  }
  mouseDown = (event) =>{
    if (event.cancelable) {
      //Disable default drag event
      event.preventDefault();
    }
    if (event.pageY === undefined) return;
    this.shutter = event.target.parentElement.parentElement.parentElement.parentNode;
    this.slide  = this.shutter.querySelector(`.${ESC_CLASS_SELECTOR_SLIDE}`);
    this.picker = this.shutter.querySelector(`.${ESC_CLASS_SELECTOR_PICKER}`);

    this.pickPoint = event.pageY - parseInt(this.slide.style.height);
    console.log('this.pickPoint:',this.pickPoint);
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('touchmove', this.mouseMove);
    document.addEventListener('pointermove', this.mouseMove);

    document.addEventListener('mouseup', this.mouseUp);
    document.addEventListener('touchend', this.mouseUp);
    document.addEventListener('pointerup', this.mouseUp);
  };

  mouseMove = (event) =>{
    if (event.pageY === undefined) return;

    let newScreenPosition = Math.round(boundary(event.pageY - this.pickPoint,this.cfg.coverTopPx(),this.cfg.coverBottomPx()));
    setPickerPositionScreen(this.cfg,newScreenPosition, this.picker, this.slide);
    let percentagePosition=this.cfg.defPercentagPositionFromScreenposition(newScreenPosition);
    console.log('mouseMove:');
    this.shutter.querySelectorAll(`.${ESC_CLASS_POSITION}`).forEach( (shutterPositionText) =>{
      setShutterPositionText(this.hass,this.cfg,percentagePosition,this.shutter,shutterPositionText);
    })
  };

  mouseUp = (event) => {
    if (event.pageY === undefined) return;


    let newScreenPosition = Math.round(boundary(event.pageY - this.pickPoint,this.cfg.coverTopPx(),this.cfg.coverBottomPx()));
    let position = (newScreenPosition - this.cfg.topOffsetPct()) * (100-this.cfg.offset()) / this.cfg.coverHeightPx();
    position = Math.round(this.cfg.invertPercentage() ?position: 100 - position);//invert
    sendShutterPosition(this.hass, this.entityId, position);

    document.removeEventListener('mousemove', this.mouseMove);
    document.removeEventListener('touchmove', this.mouseMove);
    document.removeEventListener('pointermove', this.mouseMove);

    document.removeEventListener('mouseup', this.mouseUp);
    document.removeEventListener('touchend', this.mouseUp);
    document.removeEventListener('pointerup', this.mouseUp);
  };
render() {
    console.log('In EnhancedShutter{}: render EnhancedShutter');
    let cfg = this.cfg;
    let hass = this.hass;

    let entityId = this.entityId = this.config.entity ? this.config.entity : this.config;
    console.log('In EnhancedShutter{}: render EnhancedShutter',entityId);


    const state = this.hass.states[entityId];
    const disabledGlobaly = (state.state == "unavailable");
    const friendlyName = (this.config.name) ? this.config.name : state ? state.attributes.friendly_name : 'unknown';
    const movementState = state ? state.state : 'unknown';
    let disableStandardButtons = this.config.disable_standard_buttons ? this.config.disable_standard_buttons : false;
    let partialOpenButtonsDisplayed = this.config.partial_open_buttons_displayed ? this.config.partial_open_buttons_displayed : true;

    let currentPosition = (state && state.attributes) ? state.attributes.current_position : cfg.currentPosition();
    cfg.updatePosition(currentPosition);
    let positionText = computePositionText(hass,cfg.invertPercentage(), cfg.alwaysPercentage(), currentPosition, cfg.offset());

    let screenPosition = getPickerPositionScreenFromPercentage(cfg,currentPosition);
    let disableEnd = this.config.disable_end_buttons ? this.config.disable_end_buttons : false;

    let upDisabled = false;
    let downDisabled = false;
    if (disableEnd) {
      if (currentPosition == 0) {
        upDisabled = cfg.invertPercentage();
        downDisabled = !cfg.invertPercentage();
      } else if (currentPosition == 100) {
        upDisabled = !cfg.invertPercentage();
        downDisabled = cfg.invertPercentage();
      }
    }

    return html`
      <div class=${ESC_BASE_CLASS_NAME} data-shutter="${entityId}">
        <div class="${ESC_CLASS_TOP}">
          <div class="${ESC_CLASS_LABEL} ${disabledGlobaly ? `${ESC_CLASS_LABEL_DISABLED}` : ''}" @click="${() => this.doDetailOpen(entityId)}" >
            ${cfg.friendlyName()}
          </div>
          <div class="${ESC_CLASS_POSITION} ${disabledGlobaly ? `${ESC_CLASS_LABEL_DISABLED}` : ''}">
            ${positionText}
          </div>
        </div>
        <div class="${ESC_CLASS_MIDDLE}" style="flex-flow: ${cfg.buttonsInRow() ? 'column': 'row'}${cfg.buttonsContainerReversed() ? '-reverse' : ''} nowrap;">
          <div class="${ESC_CLASS_BUTTONS}" style="flex-flow: ${cfg.buttonsInRow() ? 'row': 'column'} wrap;">
            ${!disableStandardButtons ? html`
                <ha-icon-button label="${this.hass.localize('ui.card.cover.open_cover')}" class="sc-shutter-button sc-shutter-button-up" .disabled=${disabledGlobaly || upDisabled} @click=${()=> this.doOnclick(entityId, "up")} ><ha-icon class="sc-shutter-ha-icon" icon="mdi:arrow-up"></ha-icon></ha-icon-button>
                <ha-icon-button label="${this.hass.localize('ui.card.cover.stop_cover')}" class="sc-shutter-button sc-shutter-button-stop" .disabled=${disabledGlobaly} @click=${()=> this.doOnclick(entityId, "stop")}><ha-icon class="sc-shutter-ha-icon" icon="mdi:stop"></ha-icon></ha-icon-button>
                <ha-icon-button label="${this.hass.localize('ui.card.cover.close_cover')}" class="sc-shutter-button sc-shutter-button-down" .disabled=${disabledGlobaly || downDisabled} @click=${()=> this.doOnclick(entityId, "down")} ><ha-icon class="sc-shutter-ha-icon" icon="mdi:arrow-down"></ha-icon></ha-icon-button>
              ` : ''}
          </div>
          <div class="${ESC_CLASS_BUTTONS}" style="flex-flow: ${cfg.buttonsInRow ? 'row': 'column'} wrap;">
            ${cfg.partial() ? html`
                            <ha-icon-button label="Partially close" class="sc-shutter-button sc-shutter-button-partial" .disabled=${disabledGlobaly} @click="${()=> this.doOnclick(entityId, "partial", partial)}" >
                                <ha-icon class="sc-shutter-ha-icon" icon="mdi:arrow-expand-vertical"></ha-icon>
                            </ha-icon-button>` : ''}
              ${cfg.tilt() ? html`
                        <ha-icon-button label="${this.hass.localize('ui.card.cover.open_tilt_cover')}" class="sc-shutter-button sc-shutter-button-tilt-open" .disabled=${disabledGlobaly} @click="${()=> this.doOnclick(entityId, "tilt-open")}">
                            <ha-icon class="sc-shutter-ha-icon" icon="mdi:arrow-top-right"></ha-icon>
                        </ha-icon-button>
                        <ha-icon-button label="${this.hass.localize('ui.card.cover.close_tilt_cover')}" class="sc-shutter-button sc-shutter-button-tilt-down" .disabled=${disabledGlobaly} @click="${()=> this.doOnclick(entityId, "tilt-close")}">
                            <ha-icon class="sc-shutter-ha-icon" icon="mdi:arrow-bottom-left"></ha-icon>
                        </ha-icon-button>` : ''}
          </div>
          <div class="${ESC_CLASS_SELECTOR}">
            <div class="${ESC_CLASS_SELECTOR_PICTURE} "
              style="
                width: ${cfg.windowWidthPx()}${UNITY};
                height: ${cfg.windowHeightPx()}${UNITY};
                background-image: url(${cfg.viewImage()});
              ">
              <img src= "${cfg.windowImage() } "
              style="
              ">
              <div class="${ESC_CLASS_SELECTOR_SLIDE}" style="height: ${screenPosition}${UNITY}; background-image: url(${cfg.shutterSlatImage()});">
                <img src="${cfg.shutterBottomImage()}">
              </div>
              <div class="${ESC_CLASS_SELECTOR_PICKER}"
                @mousedown="${this.mouseDown}"
                @touchstart="${this.mouseDown}"
                @pointerdown="${this.mouseDown}"
                style="top: ${screenPosition-cfg.pickerOverlapPx()}${UNITY};">
              </div>
              ${cfg.partial() && !cfg.offset()? html`
                <div class="${ESC_CLASS_SELECTOR_PARTIAL}" style="top:${cfg.defScreenPositionFromPercent(cfg.partial())}${UNITY}"></div>
                ` : ''}
              <div class="${ESC_CLASS_MOVEMENT_OVERLAY}" style="
                top: ${cfg.topOffsetPct()-7}${UNITY};
                height: ${cfg.coverHeightPx() + 7}${UNITY};
                display: ${(movementState == "opening" || movementState == "closing") ? 'block' : 'none'}">
                <ha-icon class="${ESC_CLASS_MOVEMENT_OPEN}" icon="mdi:arrow-up" style="display: ${movementState == 'opening' ? 'block' : 'none'}"></ha-icon>
                <ha-icon class="${ESC_CLASS_MOVEMENT_CLOSE}" icon="mdi:arrow-down" style="display: ${movementState == 'closing' ? 'block' : 'none'}"></ha-icon>
              </div>
            </div>
          </div>
          <div style="${partialOpenButtonsDisplayed ? 'flex-flow: column wrap;' : 'display:none;'}" >
            <div class="sc-shutter-buttons" style="flex-flow: row wrap;">
              <ha-icon-button label="Partially close" class="sc-shutter-button" .disabled=${disabledGlobaly || upDisabled} @click=${()=> this.doOnclick(entityId, "partial", 100)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4Z"></ha-icon-button>
              <ha-icon-button label="Partially close" class="sc-shutter-button" .disabled=${disabledGlobaly} @click=${()=> this.doOnclick(entityId, "partial", 75)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9Z"></ha-icon-button>
              <ha-icon-button label="Partially close" class="sc-shutter-button" .disabled=${disabledGlobaly} @click=${()=> this.doOnclick(entityId, "partial", 50)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12Z"></ha-icon-button>
            </div>
            <div class="sc-shutter-buttons" style="flex-flow: row wrap;">
              <ha-icon-button label="Partially close" class="sc-shutter-button" .disabled=${disabledGlobaly} @click=${()=> this.doOnclick(entityId, "partial", 25)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15Z"></ha-icon-button>
              <ha-icon-button label="Partially close" class="sc-shutter-button" .disabled=${disabledGlobaly} @click=${()=> this.doOnclick(entityId, "partial", 10)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15M8 18H16V20H8V18Z"></ha-icon-button>
              <ha-icon-button label="Partially close" class="sc-shutter-button" .disabled=${disabledGlobaly || downDisabled} @click=${()=> this.doOnclick(entityId, "partial", 0)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V20H8V18Z"></ha-icon-button>
            </div>
          </div>
        <div class="${ESC_CLASS_BOTTOM}">
          <div class="${ESC_CLASS_LABEL} ${disabledGlobaly ? `${ESC_CLASS_LABEL_DISABLED}` : ''}" @click="${() => this.doDetailOpen(entityId)}" >
            ${friendlyName}
          </div>
          <div class="${ESC_CLASS_POSITION} ${disabledGlobaly ? `${ESC_CLASS_LABEL_DISABLED}` : ''}">
            ${positionText}
          </div>
        </div>
      </div>
    `;
  }
  static get styles() {
    return css`${unsafeCSS(CSS)}
    `
  }

}
//customElements.define(HA_CARD_NAME, EnhancedShutterCard);
customElements.define(HA_CARD_NAME, EnhancedShutterCardNew);
customElements.define(HA_SHUTTER_NAME, EnhancedShutter);
console.info(
  '%c ENHANCED-SHUTTER-CARDDDD ',
  'color: white; background: green; font-weight: 700',
);
//###########################################
class shutterCfg {

  #cfg={};

  constructor(hass,configMain,configSub,imageDimensions,allImages)
  {
     //console.log('configMain: ',configMain);
     //console.log('configSub: ',configSub);
     this.configMain = configMain;
     this.configSub =  configSub


    let entityId = configSub.entity ? configSub.entity : configSub;

      const state = hass.states[entityId];
      this.friendlyName(configSub.name ? configSub.name : (state && state.attributes) ? state.attributes.friendly_name : ESC_FRIENDLY_NAME);

      this.invertPercentage(!!configSub.invert_percentage || !!configMain.invert_percentage || ESC_INVERT_PCT);

      this.currentPosition((state && state.attributes) ? state.attributes.current_position : ESC_CURRENT_POSITION);

      this.windowImage(allImages[CONFIG_WINDOW_IMAGE][entityId].src);
      this.viewImage(allImages[CONFIG_VIEW_IMAGE][entityId].src);
      this.shutterSlatImage(allImages[CONFIG_SHUTTER_SLAT_IMAGE][entityId].src);
      this.shutterBottomImage(allImages[CONFIG_SHUTTER_BOTTOM_IMAGE][entityId].src);

      let base_height_px = configSub.base_height_px || configMain.base_height_px || imageDimensions[entityId]?.height || ESC_BASE_HEIGHT_PX;
      let resize_height_pct = configSub.resize_height_pct || configMain.resize_height_pct || ESC_RESIZE_HEIGHT_PCT;
      this.windowHeightPx(Math.round(boundary(resize_height_pct,ESC_MIN_RESIZE_HEIGHT_PCT,ESC_MAX_RESIZE_HEIGHT_PCT) / 100 * base_height_px));

      let base_width_px  = configSub.base_width_px  || configMain.base_width_px  || imageDimensions[entityId]?.width  || ESC_BASE_WIDTH_PX;
      let resize_width_pct  = configSub.resize_width_pct  || configMain.resize_width_pct  || ESC_RESIZE_WIDTH_PCT;
      this.windowWidthPx(Math.round(boundary(resize_width_pct, ESC_MIN_RESIZE_WIDTH_PCT ,ESC_MAX_RESIZE_WIDTH_PCT)  / 100 * base_width_px));

      this.partial(boundary(configSub.partial_close_percentage || configMain.partial_close_percentage || ESC_PARTIAL_CLOSE_PCT));
      this.offset(boundary(configSub.offset_closed_percentage || configMain.offset_closed_percentage || ESC_OFFSET_CLOSED_PCT));

      this.topOffsetPct(Math.round(boundary(configSub.top_offset_pct || configMain.top_offset_pct || ESC_TOP_OFFSET_PCT)/ 100 * this.windowHeightPx()));
      this.bottomOffsetPct(Math.round(boundary(configSub.bottom_offset_pct || configMain.bottom_offset_pct || ESC_BOTTOM_OFFSET_PCT)/ 100 * this.windowHeightPx()));

      this.tilt(!!configSub.can_tilt || !!configMain.can_tilt || ESC_CAN_TILT);

      this.defButtonPosition(configMain,configSub);
      this.titlePosition(configSub.title_position || configMain.title_position || ESC_TITLE_POSITION);

      this.alwaysPercentage(!!configSub.always_percentage || !!configMain.always_percentage || ESC_ALWAYS_PCT);
      this.disableEndButtons(!!configSub.disable_end_buttons || !!configMain.disable_end_buttons || ESC_DISABLE_END_BUTTONS);
      this.pickerOverlapPx(ESC_PICKER_OVERLAP_PX);
      console.log ('constuct cfg: ',this);
      Object.preventExtensions(this);
  }
  /*
   ** getters/setters
   */
   getCfg(key,value= null){
    if (value!== null) this.#cfg[key]= value;
    //console.log("key,value",key,this.#cfg[key]);
    return this.#cfg[key];
  }
  // no global setting
  friendlyName(value = null){
    return this.getCfg(CONFIG_FRIENDLY_NAME,value);
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
    return this.getCfg(CONFIG_OFFSET_CLOSE_PCT,value);
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
  buttonsInRow(){
    return this.buttonsPosition() == TOP || this.buttonsPosition() == BOTTOM;
  }
  buttonsContainerReversed(){
    return this.buttonsPosition() == BOTTOM || this.buttonsPosition() == RIGHT;
  }



  defButtonPosition(config,entity) {
    let buttonsPosition = entity.buttons_position || config.buttons_position || ESC_BUTTONS_POSITION;
    buttonsPosition
      = (buttonsPosition && POSITIONS.includes(buttonsPosition.toLowerCase()))
      ? buttonsPosition.toLowerCase()
      : ESC_BUTTONS_POSITION;

      this.buttonsPosition(buttonsPosition);
  }
  // test
  testLog(text='çfg',value=""){
    console.log(`${text}: value=${value} cfg = `,this);
  }

  defPercentagPositionFromScreenposition(screenPosition){
    let percentagePosition = Math.round((screenPosition - this.topOffsetPct()) / this.coverHeightPx() * (100-this.offset()));
    percentagePosition = this.getDisplayedPctPosition(percentagePosition);
    return percentagePosition;
  }
  getDisplayedPctPosition(position=this.current_position){
    let pctPosition = Math.round(this.invert_percentage ? position : 100 - position);
    return pctPosition;
  }
  updatePosition(percentagePosition){
    this.currentPosition(percentagePosition);
  }
  defScreenPositionFromPercent(position_pct) {
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
  setButtonsDisplay(shutter,position){

  }

}
//####################################

function getPromiseForImageSize(image)
{
  let imageUrl = image.src;
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () =>{
        resolve({ width: img.width, height: img.height });
    };
    img.onerror = function() {
      img.src = `${ESC_IMAGE_MAP}/${ESC_IMAGE_WINDOW}`;
    };
    img.src = imageUrl;
  });
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
function checkServiceAvailability(hass,serviceDomain, serviceName) {
  const services = hass.services;
  let check = services[serviceDomain]?.[serviceName] !== undefined;
  return check;
}
function callHassCoverService(hass,entityId,command,args='')
{
  if (checkServiceAvailability(hass,'cover', command)) {
    hass.callService('cover', command, {
      entity_id: entityId,
      ...args
    });
  } else {
    console.warn(`Service 'cover'-'${command}' not available`);
  }
}
function sendShutterPosition(hass, entityId, position)
{
  callHassCoverService(hass,entityId,SERVICE_SHUTTER_PARTIAL, { position: position });
}
function setPickerPositionScreen(cfg,screenPosition, picker, slide)
{
  screenPosition = boundary(screenPosition, cfg.coverTopPx(), cfg.coverBottomPx());
  console.log('screenPosition',screenPosition);
  slide.style.height = (screenPosition ) + `${UNITY}`;
  picker.style.top = (screenPosition - cfg.pickerOverlapPx()) + `${UNITY}`;
}
function getPickerPositionScreenFromPercentage(cfg,percentage)
{
  let screenPosition = cfg.defScreenPositionFromPercent(percentage);
  return screenPosition;
}
function setMovement(movement, shutter) {
  if (movement == "opening" || movement == "closing") {
    let opening = (movement == "opening");
    shutter.querySelectorAll(`.${ESC_CLASS_MOVEMENT_OVERLAY}`).forEach(
      (overlay) => overlay.style.display = "block"
    )
    shutter.querySelectorAll(`.${ESC_CLASS_MOVEMENT_OPEN}`).forEach(
      (overlay) => overlay.style.display = opening?"block":"none"
    )
    shutter.querySelectorAll(`.${ESC_CLASS_MOVEMENT_CLOSE}`).forEach(
      (overlay) => overlay.style.display = opening?"none":"block"
    )
  }
  else {
    shutter.querySelectorAll(`.${ESC_CLASS_MOVEMENT_OVERLAY}`).forEach(
      (overlay) => overlay.style.display = "none"
    )
  }
}
function positionPercentToText2(percent, cfg, hass) {
  if (!cfg.alwaysPercentage()) {
    if (percent == 100) {
      return hass.localize(cfg.invertPercentage()?'ui.components.logbook.messages.was_closed':'ui.components.logbook.messages.was_opened');//invert
    }
    else if (percent == 0) {
      return hass.localize(cfg.invertPercentage()?'ui.components.logbook.messages.was_opened':'ui.components.logbook.messages.was_closed');//invert
    }
  }
  return Math.round(percent) + ' %';
}
function positionPercentToText(hass,percent, inverted, alwaysPercentage) {
  if (!alwaysPercentage) {
    if (percent == 100) {
      return hass.localize(inverted?'component.cover.entity_component._.state.closed':'component.cover.entity_component._.state.open');
    } else if (percent == 0) {
      return hass.localize(inverted?'component.cover.entity_component._.state.open':'component.cover.entity_component._.state.closed');
    }
  }
  if (percent) {
    return percent + ' %';
  } else {
    return hass.localize('state.default.unavailable');
  }
}

function changeButtonState(shutter, percent, cfg)
{ //invert
  if (cfg.disableEndButtons()) {
    if (percent == 0) {
      shutter.querySelectorAll(`.${ESC_CLASS_BUTTON_UP} `).forEach((button) => {
        button.disabled = cfg.invertPercentage();
      });
      shutter.querySelectorAll(`.${ESC_CLASS_BUTTON_DOWN} `).forEach((button) => {
        button.disabled = !cfg.invertPercentage();
      });
    }
    else if (percent == 100) {
      shutter.querySelectorAll(`.${ESC_CLASS_BUTTON_UP} `).forEach((button) => {
        button.disabled = !cfg.invertPercentage();
      });
      shutter.querySelectorAll(`.${ESC_CLASS_BUTTON_DOWN} `).forEach((button) => {
        button.disabled = cfg.invertPercentage();
      });
    }
    else {
      shutter.querySelectorAll(`.${ESC_CLASS_BUTTON_UP} `).forEach((button) => {
        button.disabled = false;
      });
      shutter.querySelectorAll(`.${ESC_CLASS_BUTTON_DOWN} `).forEach((button) => {
        button.disabled = false;
      });
    }
  }
}
function setShutterPositionText(hass,cfg,position_pct,shutter,shutterPosition)
{
  let visiblePosition;
  let positionText;

  changeButtonState(shutter, position_pct, cfg);


  if (cfg.invertPercentage()) {//invert
    visiblePosition = cfg.offset() ? Math.min(100, Math.round(       (position_pct)           /( cfg.offset())     * 100)) : position_pct;
  }
  else { //invert
    visiblePosition = cfg.offset() ? Math.max(  0, Math.round((position_pct - cfg.offset()) / (100 - cfg.offset()) * 100)) : position_pct;
  }
  positionText = positionPercentToText2(visiblePosition, cfg, hass);

  if (cfg.invertPercentage()) {//invert
    if (visiblePosition == 100 && cfg.offset()) {
      positionText += ' (' + (100 - Math.round(Math.abs(position_pct - visiblePosition) / cfg.offset() * 100)) + ' %)';
    }
  }
  else { //invert
    if (visiblePosition == 0 && cfg.offset()) {
      positionText += ' (' + (100 - Math.round(Math.abs(position_pct - visiblePosition) / cfg.offset() * 100)) + ' %)';
    }
  }
  console.log('shutterPosition,positionText',shutterPosition,positionText);
  shutterPosition.innerHTML = positionText;
}
function computePositionText(hass,invertPercentage, alwaysPercentage, currentPosition, offset) {
  let visiblePosition;
  let positionText;
  if (invertPercentage) {
    visiblePosition = offset ? Math.min(100, Math.round(currentPosition / offset * 100 )) : currentPosition;
    positionText = positionPercentToText(hass,visiblePosition, invertPercentage, alwaysPercentage);

    if (visiblePosition == 100 && offset) {
      positionText += ' ('+ (100-Math.round(Math.abs(currentPosition-visiblePosition)/offset*100)) +' %)';
    }

  } else {
    visiblePosition = offset ? Math.max(0, Math.round((currentPosition - offset) / (100-offset) * 100 )) : currentPosition;
    positionText = positionPercentToText(hass,visiblePosition, invertPercentage, alwaysPercentage);

    if (visiblePosition == 0 && offset) {
      positionText += ' ('+ (100-Math.round(Math.abs(currentPosition-visiblePosition)/offset*100)) +' %)';
    }
  }
  return positionText;
}



