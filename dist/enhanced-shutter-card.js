

const LEFT = 'left';
const RIGHT = 'right';
const BOTTOM = 'bottom';
const TOP = 'top';

const ESC_BASE_CLASS_NAME = 'esc-shutter';
const ESC_CLASS_SHUTTERS = `${ESC_BASE_CLASS_NAME}s`;
const ESC_CLASS_TOP = `${ESC_BASE_CLASS_NAME}-${TOP}`;
const ESC_CLASS_MIDDLE = `${ESC_BASE_CLASS_NAME}-middle`;
const ESC_CLASS_BOTTOM = `${ESC_BASE_CLASS_NAME}-${BOTTOM}`;
const ESC_CLASS_LABEL = `${ESC_BASE_CLASS_NAME}-label`;
const ESC_CLASS_POSITION = `${ESC_BASE_CLASS_NAME}-position`;
const ESC_CLASS_BUTTONS = `${ESC_BASE_CLASS_NAME}-buttons`;
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
const ESC_CLASS_SELECTOR_WINDOW = `${ESC_BASE_CLASS_NAME}-selector-window`; // ?? not used
const ESC_CLASS_SELECTOR_PARTIAL = `${ESC_BASE_CLASS_NAME}-selector-partial`;
const ESC_CLASS_MOVEMENT_OVERLAY = `${ESC_BASE_CLASS_NAME}-movement-overlay`;
const ESC_CLASS_MOVEMENT_OPEN = `${ESC_BASE_CLASS_NAME}-movement-open`;
const ESC_CLASS_MOVEMENT_CLOSE = `${ESC_BASE_CLASS_NAME}-movement-close`;

const POSITIONS =[LEFT,RIGHT,TOP,BOTTOM];

const ESC_IMAGE_MAP = "/local/community/enhanced-shutter-card/images";

const WINDOW_IMAGE_TYPE  = 'window_image';
const VIEW_IMAGE_TYPE = 'view_image';
const SHUTTER_SLAT_IMAGE_TYPE = 'shutter_slat_image';
const SHUTTER_BOTTON_IMAGE_TYPE = 'shutter_bottom_image';

const IMAGE_TYPES = [WINDOW_IMAGE_TYPE,VIEW_IMAGE_TYPE,SHUTTER_SLAT_IMAGE_TYPE,SHUTTER_BOTTON_IMAGE_TYPE];

const ESC_IMAGE_VIEW = 'esc-view.png';
const ESC_IMAGE_SHUTTER_SLAT = 'esc-shutter-slat.png';
const ESC_IMAGE_SHUTTER_BOTTOM = 'esc-shutter-bottom.png';
const ESC_IMAGE_WINDOW = 'esc-window.png';

const ESC_IMAGES =
{
  [WINDOW_IMAGE_TYPE]: ESC_IMAGE_WINDOW,
  [VIEW_IMAGE_TYPE]: ESC_IMAGE_VIEW,
  [SHUTTER_SLAT_IMAGE_TYPE]: ESC_IMAGE_SHUTTER_SLAT,
  [SHUTTER_BOTTON_IMAGE_TYPE]: ESC_IMAGE_SHUTTER_BOTTOM
};

const SERVICE_SHUTTER_UP = 'open_cover';
const SERVICE_SHUTTER_DOWN = 'close_cover';
const SERVICE_SHUTTER_STOP = 'stop_cover';
const SERVICE_SHUTTER_PARTIAL = 'set_cover_position';
const SERVICE_SHUTTER_TILT_OPEN = 'open_cover_tilt';
const SERVICE_SHUTTER_TILT_CLOSE = 'close_cover_tilt';



const ESC_BASE_WIDTH_PX =100;
const ESC_BASE_HEIGHT_PX = 100;

const ESC_RESIZE_WIDTH_PCT  = 100;
const ESC_RESIZE_HEIGHT_PCT = 100;
const ESC_MIN_RESIZE_WIDTH_PCT  =  50;
const ESC_MAX_RESIZE_WIDTH_PCT  = 200;
const ESC_MIN_RESIZE_HEIGHT_PCT =  50;
const ESC_MAX_RESIZE_HEIGHT_PCT = 200;

const ESC_TOP_OFFSET_PCT = 0;
const ESC_BOTTOM_OFFSET_PCT = 0; //??

const ESC_CAN_TILT = false; // OK

const ESC_BUTTONS_POSITION =LEFT;
const ESC_TITLE_POSITION = TOP;
const ESC_INVERT_PERCENTAGE = false;

const ESC_ALWAYS_PCT = false;
const ESC_SHUTTER_WIDTH_PX = 153; //??

const ESC_PARTIAL_CLOSE_PCT = 0;
const ESC_OFFSET_CLOSED_PCT = false;

const ESC_DISABLE_END_BUTTONS = false;

//const UNKNOWN =999;

class shutterCfg {

  #friendly_name;
  #buttons_position;
  #disable_end_buttons;
  #invert_percentage;
  #current_position;
//  #previous_position;
  #window_image;
  #view_image;
  #slide_image;
  #slide_bottom_image;

  #window_height_px;
  #window_width_px;
  #partial;
  #offset;
  #top_offset_px;
  #bottom_offset_px;
  #tilt;
  #title_position;
  #always_percentage;



  constructor(hass,entity, config,imageDimensions,allImages)
  {
      let entityId = entity.entity ? entity.entity : entity;

      const state = hass.states[entityId];
      this.friendlyName(entity.name ? entity.name : (state && state.attributes) ? state.attributes.friendly_name : 'unknown');

      this.invertPercentage(entity.invert_percentage ||  config.invert_percentage || ESC_INVERT_PERCENTAGE);

      this.currentPosition((state && state.attributes) ? state.attributes.current_position : 0);
      //this.previousPosition(UNKNOWN);

      this.windowImage(allImages[WINDOW_IMAGE_TYPE][entityId].src);
      this.viewImage(allImages[VIEW_IMAGE_TYPE][entityId].src);
      this.slideImage(allImages[SHUTTER_SLAT_IMAGE_TYPE][entityId].src);
      this.slideBottomImage(allImages[SHUTTER_BOTTON_IMAGE_TYPE][entityId].src);

      let base_height_px = entity.base_height_px || config.base_height_px || imageDimensions[entityId]?.height || ESC_BASE_HEIGHT_PX;
      let base_width_px  = entity.base_width_px  || config.base_width_px  || imageDimensions[entityId]?.width  || ESC_BASE_WIDTH_PX;

      let resize_height_pct = entity.resize_height_pct || config.resize_height_pct || ESC_RESIZE_HEIGHT_PCT;
      let resize_width_pct  = entity.resize_width_pct  || config.resize_width_pct  || ESC_RESIZE_WIDTH_PCT;
      this.windowHeightPx(Math.round(boundary(resize_height_pct,ESC_MIN_RESIZE_HEIGHT_PCT,ESC_MAX_RESIZE_HEIGHT_PCT) / 100 * base_height_px));
      this.windowWidthPx(Math.round(boundary(resize_width_pct, ESC_MIN_RESIZE_WIDTH_PCT ,ESC_MAX_RESIZE_WIDTH_PCT)  / 100 * base_width_px));

      this.partial(boundary(entity.partial_close_percentage || config.partial_close_percentage || ESC_PARTIAL_CLOSE_PCT));
      this.offset(boundary(entity.offset_closed_percentage || config.offset_closed_percentage || ESC_OFFSET_CLOSED_PCT));

      this.topOffsetPx(Math.round(boundary(entity.top_offset_pct || config.top_offset_pct || ESC_TOP_OFFSET_PCT)/ 100 * this.windowHeightPx()));
      this.bottomOffsetPx(Math.round(boundary(entity.bottom_offset_pct || config.bottom_offset_pct || ESC_BOTTOM_OFFSET_PCT)/ 100 * this.windowHeightPx()));

      this.tilt(entity.can_tilt || config.can_tilt || ESC_CAN_TILT);

      this.defButtonPosition(config,entity);
      this.titlePosition(entity.title_position || config.title_position || ESC_TITLE_POSITION);

      this.alwaysPercentage(entity.always_percentage || config.always_percentage || ESC_ALWAYS_PCT);
      this.disableEndButtons(entity.disable_end_buttons || config.disable_end_buttons || ESC_DISABLE_END_BUTTONS);

      Object.preventExtensions(this);
  }
  /*
   ** getters/setters
   */
  buttonPosition(buttonPosition = null){
    if (buttonPosition) this.#buttons_position= buttonPosition;
    return this.#buttons_position;
  }
  disableEndButtons(value = null){
    if (value!==null) this.#disable_end_buttons= value;
    return this.#disable_end_buttons;
  }
  invertPercentage(value = null){
    if (value!==null) this.#invert_percentage= value;
    return this.#invert_percentage;
  }
  friendlyName(value = null){
    if (value!==null) this.#friendly_name= value;
    return this.#friendly_name;
  }
  currentPosition(value = null){
    if (value!==null) this.#current_position= value;
    return this.#current_position;
  }
/*
  previousPosition(value = null){
    if (value!==null) this.#previous_position= value;
    return this.#previous_position;
  }
*/
  windowImage(value = null){
    if (value!==null) this.#window_image= value;
    return this.#window_image;
  }
  viewImage(value = null){
    if (value!==null) this.#view_image= value;
    return this.#view_image;
  }
  slideImage(value = null){
    if (value!==null) this.#slide_image= value;
    return this.#slide_image;
  }
  slideBottomImage(value = null){
    if (value!==null) this.#slide_bottom_image= value;
    return this.#slide_bottom_image;
  }

  windowHeightPx(value = null){
    if (value!==null) this.#window_height_px= value;
    return this.#window_height_px;
  }
  windowWidthPx(value = null){
    if (value!==null) this.#window_width_px= value;
    return this.#window_width_px;
  }
  partial(value = null){
    if (value!==null) this.#partial= value;
    return this.#partial;
  }
  offset(value = null){
    if (value!==null) this.#offset= value;
    return this.#offset;
  }
  topOffsetPx(value = null){
    if (value!==null) this.#top_offset_px= value;
    return this.#top_offset_px;
  }
  bottomOffsetPx(value = null){
    if (value!==null) this.#bottom_offset_px= value;
    return this.#bottom_offset_px;
  }
  tilt(value = null){
    if (value!==null) this.#tilt= value;
    return this.#tilt;
  }
  titlePosition(value = null){
    if (value!==null) this.#title_position= value;
    return this.#title_position;
  }
  alwaysPercentage(value = null){
    if (value!==null) this.#always_percentage= value;
    return this.#always_percentage;
  }

  /*
  ** end getters/setters
  */
  defButtonPosition(config,entity) {
    let buttonsPosition = entity.buttons_position || config.buttons_position || ESC_BUTTONS_POSITION;
    buttonsPosition
      = (buttonsPosition && POSITIONS.includes(buttonsPosition.toLowerCase()))
      ? buttonsPosition.toLowerCase()
      : ESC_BUTTONS_POSITION;

      this.buttonPosition(buttonsPosition);
  }
  // test
  testLog(text,value){
    console.log(`${text}: value=${value} cfg = `,this);
  }

  defPercentagPositionFromScreenposition(screenPosition){
    let percentagePosition = Math.round((screenPosition - this.topOffsetPx()) / this.coverHeightPx() * (100-this.offset()));
    percentagePosition = this.getDisplayedPctPosition(percentagePosition);
    return percentagePosition;
  }
  getDisplayedPctPosition(position=this.current_position){
    let pctPosition = Math.round(this.invert_percentage ? position : 100 - position);
    return pctPosition;
  }
  updatePosition(percentagePosition){
    //this.previousPosition(this.currentPosition());
    this.currentPosition(percentagePosition);
  }
  defScreenPositionFromPercent(position_pct) {
    let visiblePosition;
    if (this.invertPercentage()) {
      visiblePosition = this.offset() ? Math.min(100, Math.round(position_pct / this.offset() * 100 )) : position_pct;
    }
    else  {
      visiblePosition = this.offset() ? Math.max(0, Math.round((position_pct - this.offset()) / (100-this.offset()) * 100 )) : position_pct;
    }

    let position =this.coverHeightPx() * (this.invertPercentage()?visiblePosition:100-visiblePosition) / 100 + this.topOffsetPx();

    return position;

  }
  coverHeightPx(){
    return this.windowHeightPx()-this.bottomOffsetPx() - this.topOffsetPx();
  }
  coverTopPx(){
    return this.topOffsetPx();
  }
  coverBottomPx(){
    return this.windowHeightPx()-this.bottomOffsetPx();
  }

}

class EnhancedShutterCard extends HTMLElement {

  set hass(hass)
  {
    const config = this.config
    const entities = config.entities;

    //Init the card
    if (!this.card) {
      this.cardReady=false;
      const card = document.createElement('ha-card');

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
        let base_image = config[image_type] ? this.defImagePath(base_image_map,config[image_type]) : `${ESC_IMAGE_MAP}/${ESC_IMAGES[image_type]}`;
        entities.forEach((entity) =>
        {
          base_image_map = entity.image_map || config.image_map || ESC_IMAGE_MAP;
          let entityId = entity.entity ? entity.entity : entity;

          let image = entity[image_type] ? this.defImagePath(base_image_map,entity[image_type]) : base_image;
          let src = image || `${ESC_IMAGE_MAP}/${ESC_IMAGES[image_type]}`;
          images[entityId]={entityId,src};

        });
        this.allImages[image_type]=images;
      });


      const promisesForImageSizes = getPromisesForImageSizes(this.allImages[WINDOW_IMAGE_TYPE]);

      Promise.all(promisesForImageSizes)
          .then(results => {
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

  buildShutters(hass,config,imageDimensions)
  {
    console.log('buildShutters() ....');
    const entities = config.entities;
    let allShutters = document.createElement('div');
    allShutters.className = `${ESC_CLASS_SHUTTERS}`;
    this.entityCfg = [];
    let pickPoint = -1;

    entities.forEach((entity) =>
    {
      let entityId = entity.entity ? entity.entity : entity;
      let cfg = this.entityCfg[entityId] = new shutterCfg(hass,entity,config,imageDimensions,this.allImages);
      const buttonsInRow = cfg.buttonPosition() == TOP || cfg.buttonPosition() == BOTTOM;
      const buttonsContainerReversed = cfg.buttonPosition() == BOTTOM || cfg.buttonPosition() == RIGHT;

      let shutter = document.createElement('div');

      shutter.className = ESC_BASE_CLASS_NAME;
      shutter.dataset.shutter = entityId;

      shutter.innerHTML = `
        <div class="${ESC_CLASS_TOP}">
          <div class="${ESC_CLASS_LABEL}"></div>
          <div class="${ESC_CLASS_POSITION}">
          </div>
        </div>
        <div class="${ESC_CLASS_MIDDLE}" style="flex-flow: ${ (buttonsInRow ? 'column': 'row') + (buttonsContainerReversed ? '-reverse' : '') } nowrap;">
          <div class="${ESC_CLASS_BUTTONS}" style="flex-flow: ` + (buttonsInRow ? 'row': 'column') + ` wrap;">
            `+(cfg.partial()?`<ha-icon-button label="Partially close (${cfg.partial()}%)" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_PARTIAL} " data-command="${SERVICE_SHUTTER_PARTIAL}" data-position="${cfg.partial()}"><ha-icon icon="mdi:arrow-expand-vertical"></ha-icon></ha-icon-button>`:``)+`
            ` + (cfg.tilt()?`
            <ha-icon-button label="` + hass.localize(`ui.card.cover.open_tilt_cover`)  +`" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_TILT_OPEN} " data-command="${SERVICE_SHUTTER_TILT_OPEN}"><ha-icon icon="mdi:arrow-top-right"></ha-icon></ha-icon-button>
            <ha-icon-button label="` + hass.localize(`ui.card.cover.close_tilt_cover`) +`" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_TILT_DOWN} " data-command="${SERVICE_SHUTTER_TILT_CLOSE}"><ha-icon icon="mdi:arrow-bottom-left"></ha-icon></ha-icon-button>
            `:``) + `
          </div>
          <div class="${ESC_CLASS_BUTTONS}" style="flex-flow: ` + (buttonsInRow ? 'row': 'column') + ` wrap;">
            <ha-icon-button label="` + hass.localize(`ui.card.cover.open_cover`) +`" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_UP} " data-command="${SERVICE_SHUTTER_UP}"><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
            <ha-icon-button label="` + hass.localize(`ui.card.cover.stop_cover`) +`"class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_STOP} " data-command="${SERVICE_SHUTTER_STOP}"><ha-icon icon="mdi:stop"></ha-icon></ha-icon-button>
            <ha-icon-button label="` + hass.localize(`ui.card.cover.close_cover`) +`" class="${ESC_CLASS_BUTTON} ${ESC_CLASS_BUTTON_DOWN} " data-command="${SERVICE_SHUTTER_DOWN}"><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
          </div>
          <div class="${ESC_CLASS_SELECTOR}">
            <div class="${ESC_CLASS_SELECTOR_PICTURE} " style="width: ${cfg.windowWidthPx()}px; height: ${cfg.windowHeightPx()}px; background-image: url(${cfg.viewImage()})";>
              <img src= "${cfg.windowImage()}" style="width: 100%; height: 100%">
              <div class="${ESC_CLASS_SELECTOR_SLIDE}" style="height: ${cfg.topOffsetPx()}px; background-image: url(${cfg.slideImage()});">
                <img src="${cfg.slideBottomImage()}"; style="width: 100%; position: absolute; bottom: 0";>
              </div>
              <div class="${ESC_CLASS_SELECTOR_PICKER}" style="top: ${cfg.topOffsetPx()-this.picker_overlap_px}px;"></div>`+
              (cfg.partial()&&!cfg.offset()?
                `<div class="${ESC_CLASS_SELECTOR_PARTIAL}" style="top:${cfg.defScreenPositionFromPercent(cfg.partial())}px"></div>`:``
              ) + `
              <div class="${ESC_CLASS_MOVEMENT_OVERLAY}" style="top: ${cfg.topOffsetPx()-7}px; height: ${cfg.coverHeightPx() + 7}px;">
                <ha-icon class="${ESC_CLASS_MOVEMENT_OPEN}" icon="mdi:arrow-up"></ha-icon>
                <ha-icon class="${ESC_CLASS_MOVEMENT_CLOSE}" icon="mdi:arrow-down"></ha-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="${ESC_CLASS_BOTTOM}">
          <div class="${ESC_CLASS_LABEL}"></div>
          <div class="${ESC_CLASS_POSITION}"></div>
        </div>
      `;

      let slide = shutter.querySelector(`.${ESC_CLASS_SELECTOR_SLIDE}`);
      let picker = shutter.querySelector(`.${ESC_CLASS_SELECTOR_PICKER}`);
      let labels = shutter.querySelectorAll(`.${ESC_CLASS_LABEL}`);

      const reverse_position={
          [TOP] : BOTTOM,
          [BOTTOM] : TOP,
        }
      shutter.querySelector(`.${ESC_BASE_CLASS_NAME}-${cfg.titlePosition()}`).style.display = "block";
      shutter.querySelector(`.${ESC_BASE_CLASS_NAME}-${reverse_position[cfg.titlePosition()]}`).style.display = "none";

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

        //document.addEventListener('mousemove', mouseMove);
        //document.addEventListener('touchmove', mouseMove);
        document.addEventListener('pointermove', mouseMove);

        //document.addEventListener('mouseup', mouseUp);
        //document.addEventListener('touchend', mouseUp);
        document.addEventListener('pointerup', mouseUp);
      };

      let mouseMove = (event) =>{
        if (event.pageY === undefined) return;

        let newScreenPosition = Math.round(boundary(event.pageY - pickPoint,cfg.coverTopPx(),cfg.coverBottomPx()));

        this.setPickerPositionScreen(cfg,newScreenPosition, picker, slide);

        let percentagePosition=cfg.defPercentagPositionFromScreenposition(newScreenPosition);

        shutter.querySelectorAll(`.${ESC_CLASS_POSITION}`).forEach( (shutterPositionText) =>{
          this.setShutterPositionText(hass,cfg,percentagePosition,shutter,shutterPositionText);
        })
      };

      let mouseUp = (event) => {
        if (event.pageY === undefined) return;


        this.isUpdating = false;
        let newPosition = Math.round(boundary(event.pageY - pickPoint,cfg.coverTopPx(),cfg.coverBottomPx()));

        let position = (newPosition - cfg.topOffsetPx()) * (100-cfg.offset()) / cfg.coverHeightPx();
        position = Math.round(cfg.invertPercentage() ?position: 100 - position);//invert

        this.sendShutterPosition(hass, cfg,entityId, position);

        //document.removeEventListener('mousemove', mouseMove);
        //document.removeEventListener('touchmove', mouseMove);
        document.removeEventListener('pointermove', mouseMove);

        //document.removeEventListener('mouseup', mouseUp);
        //document.removeEventListener('touchend', mouseUp);
        document.removeEventListener('pointerup', mouseUp);
      };

      //Manage slider update
      //picker.addEventListener('mousedown', mouseDown);
      //picker.addEventListener('touchstart', mouseDown);
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
          this.callHassCoverService(hass,entityId,command,services[command].args);
        };
      });

      allShutters.appendChild(shutter);
    });
    this.card.appendChild(allShutters);

    const style = document.createElement('style');
    style.textContent = `
      .${ESC_CLASS_SHUTTERS} { padding: 16px; }
        .${ESC_BASE_CLASS_NAME} { margin-top: 1rem; overflow: visible; }
        .${ESC_BASE_CLASS_NAME}:first-child { margin-top: 0; }
        .${ESC_CLASS_MIDDLE} {
            display: flex;
            width: fit-content;
            max-width: 100%;
            margin: auto;
            overflow: hidden;
           }
          .${ESC_CLASS_BUTTONS} { flex: 1; text-align: center; margin-top: 0.4rem; display: flex; max-width: 100% }
          .${ESC_CLASS_BUTTONS} ha-icon-button { display: block; width: min-content }
          .${ESC_CLASS_SELECTOR} {
              flex: 1;
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
            .${ESC_CLASS_SELECTOR_PICTURE}  {
              z-index: 1;
              position: relative;
              margin: auto;
              background-size: cover;
              background-position: center;
              min-height: 10px;
              min-width: 10px;
              max-height: 2000px;
              line-height: 0;
              ooverflow: auto;
            }
            .${ESC_CLASS_SELECTOR_WINDOW}
            {
              z-index: 2;
              position: absolute;
              background-size: 100% 100%;
              width: 100%;
              height: 100%;
            }
            .${ESC_CLASS_SELECTOR_SLIDE}
            {
              z-index: -1;
              position: absolute;
              background-position: bottom;
              overflow: hidden;
              top: 0;
              width: 100%;
            }
            .${ESC_CLASS_SELECTOR_PICKER}
            {
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
              position: absolute; top: 0; width: 100%; height: 100%;
              background-color: rgba(0,0,0,0.3); text-align: center; --mdc-icon-size: 60px;
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
        .${ESC_CLASS_TOP} { text-align: center; margin-bottom: 1rem; }
        .${ESC_CLASS_BOTTOM} { text-align: center; margin-top: 1rem; display:none}
          .${ESC_CLASS_LABEL} { display: inline-block; font-size: 20px; vertical-align: middle; cursor: pointer;}
          .${ESC_CLASS_POSITION} { display: inline-block; vertical-align: middle; padding: 0 6px; margin-left: 1rem; border-radius: 2px; background-color: var(--secondary-background-color); }
    `;
    this.appendChild(style);

  }
  updateShutters(hass,config)
  {
    const entities = config.entities;
    entities.forEach((entity) =>
    {
      let entityId = entity.entity ? entity.entity : entity;
      let cfg = this.entityCfg[entityId];

      const state = hass.states[entityId];
      let statePosition = (state && state.attributes) ? state.attributes.current_position : cfg.currentPosition();

      const movementState = state ? state.state : 'Demo';
      const shutter = this.card.querySelector('div[data-shutter="' + entityId +'"]');
      this.setMovement(movementState, shutter);

      //if (statePosition != cfg.currentPosition() || cfg.previousPosition() == UNKNOWN)
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
            this.setShutterPositionText(hass,cfg,cfg.currentPosition(),shutter,shutterPosition, statePosition);
          })
          let screenPosition = this.getPickerPositionScreenFromPercentage(cfg,statePosition, picker, slide);
          this.setPickerPositionScreen(cfg,screenPosition, picker, slide);

        }
      }
    });
  }

  setShutterPositionText(hass,cfg,position_pct,shutter,shutterPosition)
  {
    let visiblePosition;
    let positionText;

    if (cfg.invertPercentage()) {//invert
      visiblePosition = cfg.offset() ? Math.min(100, Math.round(position_pct / cfg.offset() * 100)) : position_pct;
      positionText = this.positionPercentToText(visiblePosition, cfg, hass);
      if (visiblePosition == 100 && cfg.offset()) {
        positionText += ' (' + (100 - Math.round(Math.abs(position_pct - visiblePosition) / cfg.offset() * 100)) + ' %)';
      }
    }
    else { //invert
      visiblePosition = cfg.offset() ? Math.max(0, Math.round((position_pct - cfg.offset()) / (100 - cfg.offset()) * 100)) : position_pct;
      positionText = this.positionPercentToText(visiblePosition, cfg, hass);

      if (visiblePosition == 0 && cfg.offset()) {
        positionText += ' (' + (100 - Math.round(Math.abs(position_pct - visiblePosition) / cfg.offset() * 100)) + ' %)';
      }
    }
    shutterPosition.innerHTML = positionText;
    this.changeButtonState(shutter, position_pct, cfg);
  }

  changeButtonState(shutter, percent, cfg)
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

  positionPercentToText(percent, cfg, hass) {
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

  setMovement(movement, shutter) {
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

  getPickerPositionScreenFromPercentage(cfg,percentage, picker, slide) {
    let screenPosition = cfg.defScreenPositionFromPercent(percentage);

    return screenPosition;
  }

  setPickerPositionScreen(cfg,screenPosition, picker, slide) {

    screenPosition = boundary(screenPosition, cfg.coverTopPx(), cfg.coverBottomPx());

    slide.style.height = (screenPosition ) + 'px';
    picker.style.top = (screenPosition - this.picker_overlap_px) + 'px';
  }

  sendShutterPosition(hass, cfg,entityId, position)
  {
    this.callHassCoverService(hass,entityId,SERVICE_SHUTTER_PARTIAL, { position: position });
  }
  setConfig(config) {
    if (!config.entities) {
      throw new Error('You need to define entities');
    }
    this.config = config;
    this.picker_overlap_px = 20; // obsoletee ???
    this.cardReady= false;
    this.isUpdating = false;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return this.config.entities.length + 1;
  }
  callHassCoverService(hass,entityId,command,args='')
  {
    if (this.checkServiceAvailability(hass,'cover', command)) {
      hass.callService('cover', command, {
        entity_id: entityId,
        ...args
      });
    } else {
      console.warn(`Service 'cover'-'${command}' not available`);
    }

  }
  checkServiceAvailability(hass,serviceDomain, serviceName) {
    const services = hass.services;
    let check = services[serviceDomain]?.[serviceName] !== undefined;
    return check;
  }
  defImagePath(image_map,image)
  {
   return (image.includes('/') ? image : `${image_map}/${image}`);
  }
}

customElements.define("enhanced-shutter-card", EnhancedShutterCard);

//###########################################

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

