import {
  LitElement,
  html,
  css,
  unsafeCSS
}
from "https://unpkg.com/lit-element@3.0.1/lit-element.js?module";

const VERSION = 'v1.1.0b0';
const HA_CARD_NAME = "enhanced-shutter-card";
const HA_SHUTTER_NAME = `enhanced-shutter`;

const LEFT = 'left';
const RIGHT = 'right';
const BOTTOM = 'bottom';
const TOP = 'top';
const NONE = 'none';

const SHUTTER_STATE_OPEN = 'open';
const SHUTTER_STATE_CLOSED = 'closed';
const SHUTTER_STATE_OPENING = 'opening';
const SHUTTER_STATE_CLOSING = 'closing';
const SHUTTER_STATE_PARTIAL_OPEN = 'partial_open'; // speudo state

const ESC_CLASS_BASE_NAME = 'esc-shutter';
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
const ESC_CLASS_SELECTOR_SLIDE = `${ESC_CLASS_BASE_NAME}-selector-slide`;
const ESC_CLASS_SELECTOR_PICKER = `${ESC_CLASS_BASE_NAME}-selector-picker`;
const ESC_CLASS_SELECTOR_PARTIAL = `${ESC_CLASS_BASE_NAME}-selector-partial`;
const ESC_CLASS_MOVEMENT_OVERLAY = `${ESC_CLASS_BASE_NAME}-movement-overlay`;
const ESC_CLASS_MOVEMENT_OPEN = `${ESC_CLASS_BASE_NAME}-movement-open`;
const ESC_CLASS_MOVEMENT_CLOSE = `${ESC_CLASS_BASE_NAME}-movement-close`;
const ESC_CLASS_HA_ICON = `${ESC_CLASS_BASE_NAME}-ha-icon`;
const ESC_CLASS_HA_ICON_LOCK = `${ESC_CLASS_HA_ICON}-lock`;

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
const CONFIG_PASSIVE_MODE = 'passive_mode';
const CONFIG_IMAGE_MAP = 'image_map';
const CONFIG_WINDOW_IMAGE = 'window_image';
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
const CONFIG_TITLE_POSITION = 'title_position';  // deprecated
const CONFIG_NAME_POSITION = 'name_position';
const CONFIG_NAME_DISABLED = 'name_disabled';
const CONFIG_OPENING_POSITION = 'opening_position';
const CONFIG_OPENING_DISABLED = 'opening_disabled';
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

const ESC_NAME = null;
const ESC_PASSIVE_MODE = false;
const ESC_IMAGE_MAP = `/local/community/${HA_CARD_NAME}/images`;
const ESC_IMAGE_WINDOW = 'esc-window.png';
const ESC_IMAGE_VIEW = 'esc-view.png';
const ESC_IMAGE_SHUTTER_SLAT = 'esc-shutter-slat.png';
const ESC_IMAGE_SHUTTER_BOTTOM = 'esc-shutter-bottom.png';
const ESC_BASE_HEIGHT_PX = 150; // image-height
const ESC_BASE_WIDTH_PX = 150;  // image-width
const ESC_RESIZE_HEIGHT_PCT = 100;
const ESC_RESIZE_WIDTH_PCT  = 100;

const ESC_TOP_OFFSET_PCT = 0;
const ESC_BOTTOM_OFFSET_PCT = 0;
const ESC_BUTTONS_POSITION = LEFT;
const ESC_NAME_POSITION =TOP;
const ESC_TITLE_POSITION = null;  // deprecated
const ESC_NAME_DISABLED = false;
const ESC_OPENING_POSITION = null;
const ESC_OPENING_DISABLED = null;
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
  [CONFIG_TOP_OFFSET_PCT]: ESC_TOP_OFFSET_PCT,
  [CONFIG_BOTTOM_OFFSET_PCT]: ESC_BOTTOM_OFFSET_PCT,
  [CONFIG_BUTTONS_POSITION]: ESC_BUTTONS_POSITION,
  [CONFIG_TITLE_POSITION]: ESC_TITLE_POSITION,  // deprecated
  [CONFIG_NAME_POSITION]: ESC_NAME_POSITION,
  [CONFIG_NAME_DISABLED]: ESC_NAME_DISABLED,
  [CONFIG_OPENING_POSITION]: ESC_OPENING_POSITION,
  [CONFIG_OPENING_DISABLED]: ESC_OPENING_DISABLED,
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
const IMAGE_TYPES = [CONFIG_WINDOW_IMAGE,CONFIG_VIEW_IMAGE,CONFIG_SHUTTER_SLAT_IMAGE,CONFIG_SHUTTER_BOTTOM_IMAGE];
const SHUTTER_CSS =`
      .${ESC_CLASS_BUTTON} {
        height: 36px;
        width: 36px;
      }
      .${ESC_CLASS_BASE_NAME} {
        overflow: visible;
      }
      .${ESC_CLASS_MIDDLE} {
        display: flex;
        flex-flow: row;
        justify-content: center;
        align-items: center;
        width: fit-content;
        max-width: 100%;
        margin: auto;
      }
      .${ESC_CLASS_BUTTONS} {
        flex: 1;
        justify-content: center;
        align-items: center;
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
        overflow: hidden;
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
      .${ESC_CLASS_TOP} {
        text-align: center;
        padding-bottom: 16px;
      }
      .${ESC_CLASS_BOTTOM} {
        text-align: center;
        padding-bottom: 16px;
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
        clear: both;
        font-size: 14px;
        height: 20px;
        border-radius: 2px;
      }
      .${ESC_CLASS_POSITION}>span {
        background-color: var(--secondary-background-color);
      }
      .${ESC_CLASS_HA_ICON} {
        padding-bottom: 10px;
      }
      .${ESC_CLASS_HA_ICON_LOCK} {
        position: relative;
        top: -0.3em;
        --mdc-icon-size: 10px;
      }
   `;

class EnhancedShutterCardNew extends LitElement{
  //reactive properties
  static get properties() {
    return {
      hass: {type: Object},
      config: {type: Object},
      isShutterConfigLoaded: {type: Boolean, state: true},
      localCfgs: {type: Object, state: true}
    };
  }
  constructor() {
    super();
    console_log('Card constructor');
    this.isShutterConfigLoaded = false;
    console_log('Card constructor: isShutterConfigLoaded:',this.isShutterConfigLoaded);
    console_log('Card constructor ready');
  }
  #defAllShutterConfig()
  {
    this.#getAllImages();
    this.globalCfg = this.#buildConfig(CONFIG_DEFAULT,this.config);
    this.localCfgs = {};
    this.config.entities.map((currEntity) => {
      let tempCfg = this.#buildConfig(this.globalCfg,currEntity);
      let entity= tempCfg.entity;
      this.localCfgs[entity] = new shutterCfg(this.hass,tempCfg,this.allImages);
    });
    this.isShutterConfigLoaded = true;
  }

  #getAllImages(){
    this.allImages={};
    IMAGE_TYPES.forEach((image_type) =>
    {
      let images={};
      let base_image_map = this.config[CONFIG_IMAGE_MAP] || ESC_IMAGE_MAP;
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
* OVERRIDE FUNCTIONS
*/
  shouldUpdate(changedProperties) {
    // Only update element if prop1 changed.
    console_log('Card shouldUpdate');
    super.shouldUpdate();
    console_log('Card shouldUpdate: isShutterConfigLoaded:',this.isShutterConfigLoaded);
    console_log('Card shouldUpdate ready');
    return this.isShutterConfigLoaded;

  }
  willUpdate(changedProperties){
    console_log('Card willUpdate');
    super.willUpdate();
    console_log('Card willUpdate: isShutterConfigLoaded:',this.isShutterConfigLoaded);
    console_log('Card willUpdate ready');
  }
  update(changedProperties)
  {
    console_log('Card Update');
    super.update(changedProperties);
    changedProperties.forEach((oldValue, prop) => {
      console_log(`Card Update, Property `,prop,` changed from`,oldValue,` to `,this[prop]);
    });
    super.update(changedProperties);
    console_log('Card Update ready');
  }
  updated(changedProperties) {
    console_log('Card Updated');
    super.updated(changedProperties);
    console_log('Card Updated ready');
  }
  connectedCallback() {
    console_log('Card connectedCallback: isShutterConfigLoaded:',this.isShutterConfigLoaded);
    super.connectedCallback();
    if (!this.isShutterConfigLoaded) {
      this.#defAllShutterConfig();
      console_log("def configs",this.globalCfg, this.localCfgs);
    }
    console_log('Card connectedCallback ready');

  }

/**
 *
 * @returns
 */
  render() {
    console_log('Card Render');
    console_log('Card Render,isShutterConfigLoaded',this.isShutterConfigLoaded);
    if (!this.config || !this.hass || !this.isShutterConfigLoaded) {
      console.warn('ShutterCard  .. no content ..');
      return html`Waiting ...`;
    }
    let htmlout = html`
        <ha-card .header=${this.config.title}>
          <div class="${ESC_CLASS_SHUTTERS}">
            ${console_log('Card this.localCfgs',this.localCfgs)}
            ${console_log('Card isShutterConfigLoaded',this.isShutterConfigLoaded)}
            ${this.config.entities.map( // TODO replace config by global.cfg ??
              (currEntity) => {
                let entityId = currEntity.entity ? currEntity.entity : currEntity;

                console_log('currEntity',currEntity);
                console_log('entityId',entityId);
                console_log('this.hass',this.hass);
                console_log('this.localCfgs[entity]',this.localCfgs[entityId]);
                //console_log('Card per shutter this.isShutterConfigLoaded xx',this.isShutterConfigLoaded);
                //console.log('entity,position',entity,this.hass.states[entity].attributes.current_position);
                //console.log('state',this.localCfgs[entity]);
                //console.log('currentPosition old',this.localCfgs[entity].currentPosition());
                this.localCfgs[entityId].state(this.hass.states[entityId]);
                //console.log('currentPosition new',this.localCfgs[entity].currentPosition());

                return html
                `
                  <enhanced-shutter
                    .isShutterConfigLoaded=${this.isShutterConfigLoaded}
                    .hass=${this.hass}
                    .config=${currEntity}
                    .cfg=${this.localCfgs[entityId]}
                  >
                  </enhanced-shutter>`;
              }
            )}
          </div>
        </ha-card>
        ${console_log('***********************')}

      `
    console_log('Card Render ready');
    return htmlout;
  }

  static get styles() {
    const CSS = `.${ESC_CLASS_SHUTTERS} { padding: 0px 16px 16px 16px; }`;
    return css`${unsafeCSS(CSS)}`;
  }
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

    console_log('Card getGridOptions');
    console_log ('Card getGridOptions isShutterConfigLoaded',this.isShutterConfigLoaded);

    // HA basic szies for calculations:

    let haCardPadding= 14; // 1rem
    let haCardTitleFontHeight= 24;
    let haTitleHeightPx = 76;
    let haTitleFont = 'Roboto, Noto, sans-serif';

    let haButtonSize= 48;

    let haGridPxHeight =65;
    let haGridPxWidthMin  =27;
    let haGridPxWidthMax  =40;
    let shutterTitleHeight = 20;

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

      if (this.config.title){
        // TODO: Add Card title to globalCfg
        let titleSize= getTextSize(this.config.title,haTitleFont,haCardTitleFontHeight);
        totalHeightPx += haTitleHeightPx; // TODO
        totalWidthPx  += titleSize.width;
      }
      console_log('Start size: totalHeightPx:',totalHeightPx,'totalWidthPx',totalWidthPx);
      Object.keys(this.localCfgs).forEach(key =>{

        let localHeightPx=0;
        let localWidthPx =0;
        let cfg= this.localCfgs[key];
        /*
        * Size shutter title row
        */
        if (!cfg.nameDisabled()){
          let titleSize = getTextSize(cfg.friendlyName(),haTitleFont,shutterTitleHeight,'400');
          let partHeightPx = 30;
          let partWidthPx = titleSize.width;
          localHeightPx += partHeightPx;
          localWidthPx = Math.max(totalWidthPx,partWidthPx);
          console_log('part size B*H',partWidthPx,partHeightPx,'after title');
          console_log('size B*H',localWidthPx,localHeightPx);
        }
        /*
        * Size shutter opening row
        */
        if (!cfg.openingDisabled()){
          let pctSize = getTextSize(cfg.currentPosition()+' %',haTitleFont,14);
          let partHeightPx = 20;
          let partWidthPx = pctSize.width;
          localHeightPx += partHeightPx;
          localWidthPx = Math.max(totalWidthPx,partWidthPx);
          console_log('part size B*H',partWidthPx,partHeightPx,'after open%');
          console_log('size B*H',localWidthPx,localHeightPx);
        }
        /*
        * padding top and bottom rows
        */
        let partHeightPx = 32;
        localHeightPx += partHeightPx;
        console_log('part size H',partHeightPx,'after including padding');
        console_log('size H',localHeightPx);

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
        console_log('size B*H',localWidth2Px,localHeight2Px);

        if (cfg.buttonsInRow()){
          console_log('Buttons Naast shutter');
          /*
          * size standard-buttons
          */
          if (!cfg.disableStandardButtons()) {
            let partHeightPx = haButtonSize*3;
            let partWidthPx = haButtonSize;
            localHeight2Px = Math.max(localHeight2Px,partHeightPx);
            localWidth2Px+=partWidthPx;
            console_log('part size B*H',partWidthPx,partHeightPx,'after std buttons');
            console_log('size B*H',localWidth2Px,localHeight2Px);
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
            console_log('size B*H',localWidth2Px,localHeight2Px,);
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
            console_log('size B*H',localWidth2Px,localHeight2Px);
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
            console_log('size B*H',localWidth2Px,localHeight2Px);
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
            console_log('size B*H',localWidth2Px,localHeight2Px);
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
            console_log('size B*H',localWidth2Px,localHeight2Px);
            }

        }
        //localHeightPx+=haCardPadding*2;
        localWidthPx  = Math.max(localWidthPx,localWidth2Px);
        localHeightPx += localHeight2Px;
        console_log(`Endsize ${key} B*H`,localWidthPx,localHeightPx);

        totalWidthPx  = Math.max(totalWidthPx,localWidthPx);
        totalHeightPx += localHeightPx;
      });
      totalHeightPx += 16; // include bottom padding
      console_log('Endsize: totalHeightPx:',totalHeightPx,'totalWidthPx',totalWidthPx);
    }
    let nbRows= Math.ceil(totalHeightPx/haGridPxHeight);
    let nbColsMin= Math.ceil(totalWidthPx/haGridPxWidthMax);
    let nbColsMax= Math.ceil(totalWidthPx/haGridPxWidthMin);

    console_log("size Card getGridOptions total Section sizing computed. nbRows : " + nbRows + " nbColsMax : " + nbColsMax);
    console_log('Card getGridOptions ready');
    return {
      rows: nbRows,
      min_rows: nbRows-1,
      max_rows: nbRows+1,
      columns: nbColsMax,
      min_columns: nbColsMin,
      max_columns: nbColsMax,
    };
  }
  firstUpdated() {
    console_log('Card firstUpdated');
    console_log('Card firstUpdated isShutterConfigLoaded',this.isShutterConfigLoaded);
    console_log('Card firstUpdated ready');
  }

}


class EnhancedShutter extends LitElement
{
  //reactive properties
  static get properties() {
    return {
      hass: {},
      cfg: {type: Object},
      screenPosition: {state: true},
//      positionText: {state: true}
    };
  }
  constructor(){
    console_log('Shutter constructor');
    super(); //  mandetory
    this.screenPosition=-1;
    this.positionText ='';
    this.action = '#';
    console_log('Shutter constructor ready');
  }
  shouldUpdate(changedProperties) {
    // Only update element if isShutterConfigLoaded changed   = true
    console_log('Shutter shouldUpdate');
    console_log('Shutter shouldUpdate, isShutterConfigLoaded',this.isShutterConfigLoaded);
    console_log('Shutter shouldUpdate ready');
    return this.isShutterConfigLoaded;

//    return changedProperties.has('prop1');
  }
  update(changedProperties) {
    console_log('Shutter Update');
    console_log('Shutter update, isShutterConfigLoaded',this.isShutterConfigLoaded);
    console_log('Shutter update changedProperties',changedProperties);
    changedProperties.forEach((oldValue, prop) => {
      console_log(`Shutter update, Property `,prop,` changed from`,oldValue,` to `,this[prop]);

    });
    super.update(changedProperties);
    console_log('Shutter Update ready');
  }
  updated(changedProperties) {
    // Log the properties that were updated
    console_log('Shutter Updated');
    super.updated(changedProperties);
    this.action='cover';
    console_log('Shutter Updated ready');
  }
  render()
  {
    console_log('Shutter Render',this.cfg.entityId());
    console_log('Shutter Render,isShutterConfigLoaded',this.isShutterConfigLoaded);
    let entityId = this.cfg.entityId();
    let positionText;
    let screenPosition;

    if (this.action=='user-drag'){
      positionText =  this.positionText;
      screenPosition = this.screenPosition
    }else{
      positionText =  this.computePositionText();
      screenPosition =  this.cfg.defScreenPositionFromPercent();
    }

    console_log('Shutter Render ready');
    return html`
      <div class=${ESC_CLASS_BASE_NAME} data-shutter="${entityId}">


        <div class="${ESC_CLASS_TOP}">

          <div class="${ESC_CLASS_LABEL} ${this.cfg.disabledGlobaly() ? `${ESC_CLASS_LABEL_DISABLED}` : ''}"
            @click="${() => this.doDetailOpen(entityId)}"
            style="display: ${(this.cfg.namePosition() != TOP || this.cfg.nameDisabled()) ? 'none' : 'block'}">
            ${this.cfg.friendlyName()}
            ${this.cfg.passiveMode() ? html`
              <span class="${ESC_CLASS_HA_ICON_LOCK}">
                <ha-icon icon="mdi:lock"></ha-icon>
              </span>
            `:''}
          </div>
          <div class="${ESC_CLASS_POSITION} ${this.cfg.disabledGlobaly() ? `${ESC_CLASS_LABEL_DISABLED}` : ''}"
            style="display: ${(this.cfg.openingPosition() != TOP || this.cfg.openingDisabled()) ? 'none' : 'block'}">
            <span>${positionText}</span>
          </div>
        </div>
        <div class="${ESC_CLASS_MIDDLE}" style="flex-flow: ${!this.cfg.buttonsInRow() ? 'column': 'row'}${this.cfg.buttonsContainerReversed() ? '-reverse' : ''} nowrap;">
          <div class="${ESC_CLASS_BUTTONS}" style="flex-flow: ${!this.cfg.buttonsInRow() ? 'row': 'column'} wrap;">
              ${!this.cfg.disableStandardButtons() && !this.cfg.buttonUpHideStates().includes(this.cfg.movementState()) ? html`
                <ha-icon-button
                  label="${this.hass.localize('ui.card.cover.open_cover')}"
                  .disabled=${this.cfg.disabledGlobaly() || this.cfg.upButtonDisabled()}
                  @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_UP}`)} >
                  <ha-icon
                    class="${ESC_CLASS_HA_ICON}"
                    icon="mdi:arrow-up">
                  </ha-icon>
                </ha-icon-button>
              ` : ''}
              ${!this.cfg.disableStandardButtons() && !this.cfg.buttonStopHideStates().includes(this.cfg.movementState())? html`
                <ha-icon-button
                  label="${this.hass.localize('ui.card.cover.stop_cover')}"
                  .disabled=${this.cfg.disabledGlobaly()}
                  @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_STOP}`)}>
                  <ha-icon
                    class="${ESC_CLASS_HA_ICON}"
                    icon="mdi:stop">
                  </ha-icon>
                </ha-icon-button>
              ` : ''}
              ${!this.cfg.disableStandardButtons() && !this.cfg.buttonDownHideStates().includes(this.cfg.movementState())? html`
                <ha-icon-button
                  label="${this.hass.localize('ui.card.cover.close_cover')}"
                  .disabled=${this.cfg.disabledGlobaly() || this.cfg.downButtonDisabled()}
                  @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_DOWN}`)} >
                  <ha-icon
                    class="${ESC_CLASS_HA_ICON}"
                    icon="mdi:arrow-down">
                  </ha-icon>
                </ha-icon-button>
              ` : ''}
          </div>
          <div class="${ESC_CLASS_BUTTONS}" style="flex-flow: ${!this.cfg.buttonsInRow() ? 'row': 'column'} wrap;">
            ${this.cfg.partial()  /* TODO localize texts */
              ? html`
                  <ha-icon-button label="Partially close (${100-this.cfg.partial()}% closed)"  .disabled=${this.cfg.disabledGlobaly()} @click="${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_PARTIAL}`, this.cfg.partial() )}" >
                    <ha-icon class="${ESC_CLASS_HA_ICON}" icon="mdi:arrow-expand-vertical"></ha-icon>
                </ha-icon-button>`
              : ''}
            ${this.cfg.canTilt() ? html`
                <ha-icon-button label="${this.hass.localize('ui.card.cover.open_tilt_cover')}"  .disabled=${this.cfg.disabledGlobaly()} @click="${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_TILT_OPEN}`)}">
                    <ha-icon class="${ESC_CLASS_HA_ICON}" icon="mdi:arrow-top-right"></ha-icon>
                </ha-icon-button>
                <ha-icon-button label="${this.hass.localize('ui.card.cover.close_tilt_cover')}"  .disabled=${this.cfg.disabledGlobaly()} @click="${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_TILT_CLOSE}`)}">
                    <ha-icon class="${ESC_CLASS_HA_ICON}" icon="mdi:arrow-bottom-left"></ha-icon>
                </ha-icon-button>` : ''}
          </div>
          <div class="${ESC_CLASS_SELECTOR}">
            <div class="${ESC_CLASS_SELECTOR_PICTURE}"
              style="
                width: ${this.cfg.windowWidthPx()}${UNITY};
                height: ${this.cfg.windowHeightPx()}${UNITY};
                background-image: url(${this.cfg.viewImage()});
              ">
              <img src= "${this.cfg.windowImage() } ">
              <div class="${ESC_CLASS_SELECTOR_SLIDE}" style="height: ${screenPosition}${UNITY}; background-image: url(${this.cfg.shutterSlatImage()});">
                <img src="${this.cfg.shutterBottomImage()}">
              </div>
              <div class="${ESC_CLASS_SELECTOR_PICKER}"
                @pointerdown="${this.mouseDown}"
                style="top: ${screenPosition-this.cfg.pickerOverlapPx()}${UNITY};">
              </div>
              ${this.cfg.partial() && !this.cfg.offset()? html`
                <div class="${ESC_CLASS_SELECTOR_PARTIAL}" style="top:${this.cfg.defScreenPositionFromPercent(this.cfg.partial())}${UNITY}"></div>
                ` : ''}
              <div class="${ESC_CLASS_MOVEMENT_OVERLAY}" style="
                top: ${this.cfg.topOffsetPct()-7}${UNITY};
                height: ${this.cfg.coverHeightPx() + 7}${UNITY};
                display: ${(this.cfg.movementState() == SHUTTER_STATE_OPENING || this.cfg.movementState() == SHUTTER_STATE_CLOSING) ? 'block' : 'none'}">
                <ha-icon class="${ESC_CLASS_MOVEMENT_OPEN}" icon="mdi:arrow-up" style="display: ${this.cfg.movementState() == SHUTTER_STATE_OPENING ? 'block' : 'none'}"></ha-icon>
                <ha-icon class="${ESC_CLASS_MOVEMENT_CLOSE}" icon="mdi:arrow-down" style="display: ${this.cfg.movementState() == SHUTTER_STATE_CLOSING ? 'block' : 'none'}"></ha-icon>
              </div>
            </div>
          </div>
          ${!this.cfg.disablePartialOpenButtons() /* TODO localize texts */
            ? html`
              <div class="${ESC_CLASS_BUTTONS}" style="flex-flow: ${!this.cfg.buttonsInRow() ? 'row': 'column'} wrap;">
                <ha-icon-button label="Fully opened" .disabled=${this.cfg.disabledGlobaly() || this.cfg.upButtonDisabled()} @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_PARTIAL}`, 100)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4Z"></ha-icon-button>
                <ha-icon-button label="Partially close (${25}% closed)" .disabled=${this.cfg.disabledGlobaly()} @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_PARTIAL}`, 75)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9Z"></ha-icon-button>
                <ha-icon-button label="Partially close (${50}% closed)" .disabled=${this.cfg.disabledGlobaly()} @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_PARTIAL}`, 50)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12Z"></ha-icon-button>
              </div>
              <div class="${ESC_CLASS_BUTTONS}" style="flex-flow: ${!this.cfg.buttonsInRow() ? 'row': 'column'} wrap;">
                <ha-icon-button label="Partially close (${75}% closed)" .disabled=${this.cfg.disabledGlobaly()} @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_PARTIAL}`, 25)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15Z"></ha-icon-button>
                <ha-icon-button label="Partially close (${90}% closed)" .disabled=${this.cfg.disabledGlobaly()} @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_PARTIAL}`, 10)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15M8 18H16V20H8V18Z"></ha-icon-button>
                <ha-icon-button label="Fully closed" .disabled=${this.cfg.disabledGlobaly() || this.cfg.downButtonDisabled()} @click=${()=> this.doOnclick(entityId, `${SERVICE_SHUTTER_PARTIAL}`, 0)} path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V20H8V18Z"></ha-icon-button>
              </div>
            `
          :''}
        </div>
        <div class="${ESC_CLASS_BOTTOM}">

          <div class="${ESC_CLASS_LABEL} ${this.cfg.disabledGlobaly() ? `${ESC_CLASS_LABEL_DISABLED}` : ''}" @click="${() => this.doDetailOpen(entityId)}"
            style="display: ${(this.cfg.namePosition() != BOTTOM || this.cfg.nameDisabled()) ? 'none' : 'block'}">
            ${this.cfg.friendlyName()}
            ${this.cfg.passiveMode() ? html`
              <span class="${ESC_CLASS_HA_ICON_LOCK}">
                <ha-icon icon="mdi:lock"></ha-icon>
              </span>
            `:''}
          </div>
          <div class="${ESC_CLASS_POSITION} ${this.cfg.disabledGlobaly() ? `${ESC_CLASS_LABEL_DISABLED}` : ''}"
            style="display: ${(this.cfg.openingPosition() != BOTTOM || this.cfg.openingDisabled()) ? 'none' : 'inline-block'}">
            ${positionText}
          </div>
        </div>
      </div>
    `;
  }

  //##########################################

  doDetailOpen(entityIdValue) {
    if (this.cfg.passiveMode()){
      console.warn('Passive mode, no action');
    }else{
      let e = new Event('hass-more-info', { composed: true});
      e.detail= { entityId : entityIdValue};
      this.dispatchEvent(e);
    }
  }
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
  getPickPoint(event){
    let siblings = Array.from(event.target.parentElement.children);
    let slide = siblings.find(sibling => sibling.classList.contains(ESC_CLASS_SELECTOR_SLIDE));
    this.pickPoint = event.pageY - parseInt(slide.style.height);
  }
  getShutterPosition(newScreenPosition){
    let shutterPosition = (newScreenPosition - this.cfg.topOffsetPct()) * (100-this.cfg.offset()) / this.cfg.coverHeightPx();
    shutterPosition = Math.round(this.cfg.invertPercentage() ?shutterPosition: 100 - shutterPosition);
    return shutterPosition;
  }
  getScreenPosition(pickPoint){
    let newScreenPosition = Math. round(boundary(pickPoint - this.pickPoint,this.cfg.coverTopPx(),this.cfg.coverBottomPx()));
    return newScreenPosition;
  }
  mouseDown = (event) =>{
    console_log('mouseDown:',event.type);
    if (event.pageY === undefined) return;

    if (event.cancelable) {
      //Disable default drag event
      event.preventDefault();
    }
    this.action='user-drag';

    this.getPickPoint(event);
    document.addEventListener('pointermove', this.mouseMove);
    document.addEventListener('pointerup', this.mouseUp);
  };

  mouseMove = (event) =>{
    console_log('mouseMove:',event.type);
    if (event.pageY === undefined) return;
    this.action='user-drag';

    this.screenPosition = this.getScreenPosition(event.pageY); // triggers refresh
    let pointedShutterPosition = this.getShutterPosition(this.screenPosition);

    this.positionText = this.computePositionText(pointedShutterPosition);
  };

  mouseUp = (event) => {
    console_log('mouseUp:',event.type);
    if (event.pageY === undefined) return;

    document.removeEventListener('pointermove', this.mouseMove);

    document.removeEventListener('pointerup', this.mouseUp);

    this.action='user-drag';

    let newScreenPosition = this.getScreenPosition(event.pageY);
    let shutterPosition = this.getShutterPosition(newScreenPosition);

    this.sendShutterPosition(this.cfg.entityId(), shutterPosition);

  };
  callHassCoverService(entityId,command,args='')
  {
    if (this.cfg.passiveMode()){
      console.warn('Passive mode, no action');
    }else{
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
  sendShutterPosition( entityId, position)
  {
    this.callHassCoverService(entityId,SERVICE_SHUTTER_PARTIAL, { position: position });
  }
  computePositionText(currentPosition =this.cfg.currentPosition()) {

    let offset = this.cfg.offset()

    let visiblePosition;
    let positionText;

    if (this.cfg.invertPercentage()) {
      visiblePosition = offset ? Math.min(100, Math.round(currentPosition / offset * 100 )) : currentPosition;
      positionText = this.positionPercentToText(visiblePosition);
      //console.log(`PositionText1='${positionText}'`);

      if (visiblePosition == 100 && offset) {
        positionText += ' ('+ (100-Math.round(Math.abs(currentPosition-visiblePosition)/offset*100)) +' %)';
      }
      //console.log(`PositionText2='${positionText}'`);

    } else {
      visiblePosition = offset ? Math.max(0, Math.round((currentPosition - offset) / (100-offset) * 100 )) : currentPosition;
      //console.log(`visiblePosition='${visiblePosition}'`);
      positionText = this.positionPercentToText(visiblePosition);
      //console.log(`PositionText3='${positionText}'`);

      if (visiblePosition == 0 && offset) {
        positionText += ' ('+ (100-Math.round(Math.abs(currentPosition-visiblePosition)/offset*100)) +' %)';
      }
      //console.log(`PositionText4='${positionText}'`);
    }
    //console.log(`PositionText='${positionText}'`);
    return positionText;
  }
  positionPercentToText(percent){
    let text='';
    if (typeof percent === 'number') {
      if (this.cfg.alwaysPercentage()) {
        text = percent + '%';
      }else{
        if (percent == 100 || !percent) {
          if (this.cfg.invertPercentage()) percent = 100-percent;
          if (percent == 100 ) {
            text = this.hass.localize('component.cover.entity_component._.state.open');
          } else if (!percent) {
            text = this.hass.localize('component.cover.entity_component._.state.closed');
          }
        } else{
          text = percent + '%';
        }
      }
    } else {
      text = this.hass.localize('state.default.unavailable');
    }
    return text;
  }


  static get styles() {
    return css`${unsafeCSS(SHUTTER_CSS)}
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

  #cfg={};
  #state={};
  constructor(hass,config,allImages,imageDimension=null)
  {
      let entityId = this.entityId(config[CONFIG_ENTITY_ID] ? config[CONFIG_ENTITY_ID] : config);

      this.state(hass.states[entityId]);
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

      this.partial(boundary(config[CONFIG_PARTIAL_CLOSE_PCT]));
      this.offset(boundary(config[CONFIG_OFFSET_CLOSED_PCT]));

      this.topOffsetPct(Math.round(boundary(config[CONFIG_TOP_OFFSET_PCT])/ 100 * this.windowHeightPx()));
      this.bottomOffsetPct(Math.round(boundary(config[CONFIG_BOTTOM_OFFSET_PCT])/ 100 * this.windowHeightPx()));

      this.canTilt(!!config[CONFIG_CAN_TILT]);

      this.defButtonPosition(config);

      this.titlePosition(config[CONFIG_TITLE_POSITION]);  //deprecated
      this.namePosition(config[CONFIG_NAME_POSITION]);
      this.nameDisabled(config[CONFIG_NAME_DISABLED]);

      this.openingPosition(config[CONFIG_OPENING_POSITION]);
      this.openingDisabled(config[CONFIG_OPENING_DISABLED]);

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
    if (value!== null) this.#cfg[key]= value;
    return this.#cfg[key];
  }
  getState(key,value= null){
    if (value!== null) this.#state[key]= value;
    return this.#state[key];
  }
  state(value = null){
    return this.getState(CONFIG_STATE,value);
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
    return this.getCfg(CONFIG_PASSIVE_MODE,value);
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
    return this.getCfg(CONFIG_WIDTH_PX,value);lo
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
    console.warn("Enhanced Shutter Card: 'title_position'-setting is deprecated, use 'name_position' !!");
    return this.getCfg(CONFIG_NAME_POSITION,value);
  }

  namePosition(value = null){
    return this.getCfg(CONFIG_NAME_POSITION,value);
  }
  openingDisabled(value = null){
    let disabled;
    if (!value && !this.getCfg(CONFIG_OPENING_DISABLED,value))
    {
      disabled=this.getCfg(CONFIG_NAME_DISABLED,value);
    }else{
      disabled=this.getCfg(CONFIG_OPENING_DISABLED,value);
    }
    return disabled;
  }
  openingPosition(value = null){
    let position;
    if (!value && !this.getCfg(CONFIG_OPENING_POSITION,value))
    {
      position=this.getCfg(CONFIG_NAME_POSITION,value);
    }else{
      position=this.getCfg(CONFIG_OPENING_POSITION,value);
    }
    return position;
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
    return this.stateAttributes().current_position;
  }
  movementState(){
    let state = (this.state() ? this.state().state : 'unknownMovement');
    if (state == SHUTTER_STATE_OPEN && this.currentPosition() != 100 && this.currentPosition() != 0){
      state= SHUTTER_STATE_PARTIAL_OPEN;
    }
    return state;
  }
  stateAttributes(){
    return (this.state() && this.state().attributes);
  }
  buttonsInRow(){
    return this.buttonsPosition() == LEFT || this.buttonsPosition() == RIGHT;
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

function boundary(value,min=0,max=100){
  return Math.max(min,Math.min(max,value));
}
function defImagePath(image_map,image)
{
 return (image.includes('/') ? image : `${image_map}/${image}`);
}

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
  console.log(formatDate("HH:mm:ss.SSS"),...args);

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
  console_log("Text data:",text,data);
  console_log("Text fontHeightData actualHeight:",fontHeightData,actualHeight);
  console_log("Text sizes w*h:",text,width,height);
  return {width,height};

}