const ESC_BASE_CLASS_NAME = 'esc-shutter';

const LEFT = 'left';
const RIGHT = 'right';
const BOTTOM = 'bottom';
const TOP = 'top';

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

const ESC_RESIZE_WIDTH_PCT =100;
const ESC_RESIZE_HEIGHT_PCT =100;

const ESC_MIN_CLOSING_POSITION = 0;
const ESC_MAX_CLOSING_POSITION = 100; //??

const ESC_CAN_TILT = false; // OK

const ESC_BUTTONS_POSITION =LEFT;
const ESC_TITLE_POSITION = TOP;
const ESC_INVERT_PERCENTAGE = false;

const ESC_ALWAYS_PCT = false;
const ESC_SHUTTER_WIDTH_PX = 153; //??

const ESC_PARTIAL_CLOSE_PCT = 0;
const ESC_OFFSET_CLOSED_PCT = false;

const ESC_DISABLE_END_BUTTONS = false;

class EnhancedShutterCard extends HTMLElement {

  set hass(hass)
  {
    const config = this.config
    const entities = config.entities;

    console.log('******* START EnhancedShutterCard');
    console.log(new Date().toLocaleTimeString());


    //Init the card
    //console.log('Build cardReady: ',this.cardReady);
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
            console.log('dimensions:', imageDimensions);
            this.processConfig(hass,imageDimensions);
            this.buildShutters(hass,config,imageDimensions);
            this.cardReady = true;
            this.updateShutters(hass, config);
            //console.log('after  buidShutters cardReady:', this.cardReady);
          })
          .catch(error => console.error(error));
    }
    //console.log('Update cardReady: ',this.cardReady);

    //Update the shutters UI
    if (this.cardReady) this.updateShutters(hass,config);
  }
  // end main

  processConfig(hass,imageDimensions) {
    this.entityCfg = [];
    const config = this.config
    const entities = config.entities;


    entities.forEach((entity) => {
      let entityId = entity.entity ? entity.entity : entity;

      let cfg = {};

      const state = hass.states[entityId];
      cfg.friendly_name = entity.name ? entity.name : state ? state.attributes.friendly_name : 'unknown';

      cfg.esc_window_image       = this.allImages[WINDOW_IMAGE_TYPE][entityId].src;
      cfg.esc_view_image         = this.allImages[VIEW_IMAGE_TYPE][entityId].src;
      cfg.esc_slide_image        = this.allImages[SHUTTER_SLAT_IMAGE_TYPE][entityId].src;
      cfg.esc_slide_bottom_image = this.allImages[SHUTTER_BOTTON_IMAGE_TYPE][entityId].src;

      let base_height = entity.base_height_px || config.base_height_px || imageDimensions[entityId]?.height || ESC_BASE_HEIGHT_PX;
      let base_width  = entity.base_width_px  || config.base_width_px  || imageDimensions[entityId]?.width  || ESC_BASE_WIDTH_PX;

      let resize_height_pct = entity.resize_height_pct || config.resize_height_pct || ESC_RESIZE_HEIGHT_PCT;
      let resize_width_pct  = entity.resize_width_pct   || config.resize_width_pct || ESC_RESIZE_WIDTH_PCT;
      cfg.esc_window_height = Math.round(this.boundary(resize_height_pct)/100*base_height);
      cfg.esc_window_width  = Math.round(this.boundary(resize_width_pct) /100*base_width);

      cfg.invert_percentage = entity.invert_percentage ||  config.invert_percentage || ESC_INVERT_PERCENTAGE;

      cfg.partial = this.boundary(entity.partial_close_percentage || config.partial_close_percentage || ESC_PARTIAL_CLOSE_PCT);
      cfg.offset  = this.boundary(entity.offset_closed_percentage || config.offset_closed_percentage || ESC_OFFSET_CLOSED_PCT);

      cfg.min_closing_position = Math.round(this.boundary(entity.min_closing_position || config.min_closing_position || ESC_MIN_CLOSING_POSITION)/100*cfg.esc_window_height);
      cfg.max_closing_position = Math.round(this.boundary(entity.max_closing_position || config.max_closing_position || ESC_MAX_CLOSING_POSITION)/100*cfg.esc_window_height);

      cfg.tilt = entity.can_tilt || config.can_tilt || ESC_CAN_TILT;

      cfg.buttons_position = this.setButtonPosition(config,entity);
      cfg.title_position = entity.title_position || config.title_position || ESC_TITLE_POSITION;

      cfg.always_percentage = entity.always_percentage || config.always_percentage || ESC_ALWAYS_PCT;
      cfg.disable_end_buttons = entity.disable_end_buttons || config.disable_end_buttons || ESC_DISABLE_END_BUTTONS;

      this.entityCfg[entityId] = cfg;
    });
    console.log('entityCfg: ', this.entityCfg);

  }

  buildShutters(hass,config,imageDimensions)
  {
    const entities = config.entities;
    //console.log('Build shutters');
    let allShutters = document.createElement('div');
    allShutters.className = `${ESC_BASE_CLASS_NAME}s`;
    let pickPoint = -1;

    entities.forEach((entity) =>
    {
      let entityId = entity.entity ? entity.entity : entity;
      let cfg = this.entityCfg[entityId];
      //console.log('Build shutters, entity',entityId);

      const buttonsInRow = cfg.buttons_position == TOP || cfg.buttons_position == BOTTOM;
      const buttonsContainerReversed = cfg.buttons_position == BOTTOM || cfg.buttons_position == RIGHT;

      let shutter = document.createElement('div');

      shutter.className = ESC_BASE_CLASS_NAME;
      shutter.dataset.shutter = entityId;

      shutter.innerHTML = `
        <div class="${ESC_BASE_CLASS_NAME}-top">
          <div class="${ESC_BASE_CLASS_NAME}-label"></div>
          <div class="${ESC_BASE_CLASS_NAME}-position">
          </div>
        </div>
        <div class="${ESC_BASE_CLASS_NAME}-middle" style="flex-flow: ${ (buttonsInRow ? 'column': 'row') + (buttonsContainerReversed ? '-reverse' : '') } nowrap;">
          <div class="${ESC_BASE_CLASS_NAME}-buttons" style="flex-flow: ` + (buttonsInRow ? 'row': 'column') + ` wrap;">
            `+(cfg.partial?`<ha-icon-button label="Partially close (${cfg.partial}%)" class="${ESC_BASE_CLASS_NAME}-button ${ESC_BASE_CLASS_NAME}-button-partial" data-command="${SERVICE_SHUTTER_PARTIAL}" data-position="${cfg.partial}"><ha-icon icon="mdi:arrow-expand-vertical"></ha-icon></ha-icon-button>`:``)+`
            ` + (cfg.tilt?`
            <ha-icon-button label="` + hass.localize(`ui.card.cover.open_tilt_cover`)  +`" class="${ESC_BASE_CLASS_NAME}-button ${ESC_BASE_CLASS_NAME}-button-tilt-open" data-command="${SERVICE_SHUTTER_TILT_OPEN}"><ha-icon icon="mdi:arrow-top-right"></ha-icon></ha-icon-button>
            <ha-icon-button label="` + hass.localize(`ui.card.cover.close_tilt_cover`) +`" class="${ESC_BASE_CLASS_NAME}-button ${ESC_BASE_CLASS_NAME}-button-tilt-down" data-command="${SERVICE_SHUTTER_TILT_CLOSE}"><ha-icon icon="mdi:arrow-bottom-left"></ha-icon></ha-icon-button>
            `:``) + `
          </div>
          <div class="${ESC_BASE_CLASS_NAME}-buttons" style="flex-flow: ` + (buttonsInRow ? 'row': 'column') + ` wrap;">
            <ha-icon-button label="` + hass.localize(`ui.card.cover.open_cover`) +`" class="${ESC_BASE_CLASS_NAME}-button ${ESC_BASE_CLASS_NAME}-button-up" data-command="${SERVICE_SHUTTER_UP}"><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
            <ha-icon-button label="` + hass.localize(`ui.card.cover.stop_cover`) +`"class="${ESC_BASE_CLASS_NAME}-button ${ESC_BASE_CLASS_NAME}-button-stop" data-command="${SERVICE_SHUTTER_STOP}"><ha-icon icon="mdi:stop"></ha-icon></ha-icon-button>
            <ha-icon-button label="` + hass.localize(`ui.card.cover.close_cover`) +`" class="${ESC_BASE_CLASS_NAME}-button ${ESC_BASE_CLASS_NAME}-button-down" data-command="${SERVICE_SHUTTER_DOWN}"><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
          </div>
          <div class="${ESC_BASE_CLASS_NAME}-selector">
            <div class="${ESC_BASE_CLASS_NAME}-selector-picture" style="width: ${cfg.esc_window_width}px; height: ${cfg.esc_window_height}px; background-image: url(${cfg.esc_view_image})";>
              <img src= "${cfg.esc_window_image}" style="width: 100%; height: 100%">
              <div class="${ESC_BASE_CLASS_NAME}-selector-slide" style="height: ${cfg.min_closing_position}px; background-image: url(${cfg.esc_slide_image});">
                <img src="${cfg.esc_slide_bottom_image}"; style="width: 100%; position: absolute; bottom: 0";>
              </div>
              <div class="${ESC_BASE_CLASS_NAME}-selector-picker" style="top: ${cfg.min_closing_position-this.picker_overlap}px;"></div>`+
              (cfg.partial&&!cfg.offset?
                `<div class="${ESC_BASE_CLASS_NAME}-selector-partial" style="top:${this.calculatePositionFromPercent(cfg,cfg.partial)}px"></div>`:``
              ) + `
              <div class="${ESC_BASE_CLASS_NAME}-movement-overlay">
                <ha-icon class="${ESC_BASE_CLASS_NAME}-movement-open" icon="mdi:arrow-up"></ha-icon>
                <ha-icon class="${ESC_BASE_CLASS_NAME}-movement-close" icon="mdi:arrow-down"></ha-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="${ESC_BASE_CLASS_NAME}-bottom">
          <div class="${ESC_BASE_CLASS_NAME}-label"></div>
          <div class="${ESC_BASE_CLASS_NAME}-position"></div>
        </div>
      `;

      let slide = shutter.querySelector(`.${ESC_BASE_CLASS_NAME}-selector-slide`);
      let picker = shutter.querySelector(`.${ESC_BASE_CLASS_NAME}-selector-picker`);
      let labels = shutter.querySelectorAll(`.${ESC_BASE_CLASS_NAME}-label`);

      let title_position = entity.title_position || config.title_position || ESC_TITLE_POSITION;
      const reverse_position={
          [TOP] : BOTTOM,
          [BOTTOM] : TOP,
        }
      shutter.querySelector(`.${ESC_BASE_CLASS_NAME}-${title_position}`).style.display = "block";
      shutter.querySelector(`.${ESC_BASE_CLASS_NAME}-${reverse_position[title_position]}`).style.display = "none";

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
        console.log('Mouse Down EnhancedShutterCard');

        pickPoint = event.pageY - parseInt(slide.style.height);

        this.isUpdating = true;

        this.card.addEventListener('mousemove', mouseMove);
        this.card.addEventListener('touchmove', mouseMove);
        this.card.addEventListener('pointermove', mouseMove);

        this.card.addEventListener('mouseup', mouseUp);
        this.card.addEventListener('touchend', mouseUp);
        this.card.addEventListener('pointerup', mouseUp);
      };

      let mouseMove = (event) =>{
        if (event.pageY === undefined) return;

        let min = cfg.min_closing_position;
        let max = cfg.max_closing_position;
        let newPosition = this.boundary(event.pageY - pickPoint,min,max);

        this.setPickerPositionScreen(cfg,newPosition, picker, slide);

        let percentagePosition = (newPosition - min) * (100-cfg.offset) / (max - min);

        shutter.querySelectorAll(`.${ESC_BASE_CLASS_NAME}-position`).forEach( (shutterPosition) =>{
          this.setShutterPositionText(hass,cfg,shutter,shutterPosition, percentagePosition);
          console.log('mouseMove, shutterPosition=', shutterPosition);
        })

        //let entity = this.entity[entityId];

      };

      let mouseUp = (event) => {

        if (event.pageY === undefined) return;
        console.log('Enhanced ShutterCard Mous Up');
        let min = cfg.min_closing_position;
        let max = cfg.max_closing_position;

        this.isUpdating = false;
        let newPosition = event.pageY - pickPoint;

        newPosition = this.boundary(newPosition,min,max);
        let percentagePosition = (newPosition - min) * (100-cfg.offset) / (max - min);

        this.updateShutterPosition(hass, cfg,entityId, percentagePosition);

        this.card.removeEventListener('mousemove', mouseMove);
        this.card.removeEventListener('touchmove', mouseMove);
        this.card.removeEventListener('pointermove', mouseMove);

        this.card.removeEventListener('mouseup', mouseUp);
        this.card.removeEventListener('touchend', mouseUp);
        this.card.removeEventListener('pointerup', mouseUp);
      };

      //Manage slider update
      picker.addEventListener('mousedown', mouseDown);
      picker.addEventListener('touchstart', mouseDown);
      picker.addEventListener('pointerdown', mouseDown);

      //Manage click on buttons
      shutter.querySelectorAll(`.${ESC_BASE_CLASS_NAME}-button`).forEach( (button) =>{

        button.onclick = function () {

          const command = this.dataset.command;
          const services ={
            [SERVICE_SHUTTER_UP] : {'args': ''},
            [SERVICE_SHUTTER_DOWN] : {'args': ''},
            [SERVICE_SHUTTER_STOP] : {'args': ''},
            [SERVICE_SHUTTER_PARTIAL] : {'args': {position: this.dataset.position}},
            [SERVICE_SHUTTER_TILT_OPEN] : {'args': ''},
            [SERVICE_SHUTTER_TILT_CLOSE] : {'args': ''},
          }

//          hass.callService('cover', command, {
//            entity_id: entityId,
//            ...services[command].args
//          });
        };
      });

      allShutters.appendChild(shutter);
    });
    this.card.appendChild(allShutters);

    const style = document.createElement('style');
    style.textContent = `
      .${ESC_BASE_CLASS_NAME}s { padding: 16px; }
        .${ESC_BASE_CLASS_NAME} { margin-top: 1rem; overflow: visible; }
        .${ESC_BASE_CLASS_NAME}:first-child { margin-top: 0; }
        .${ESC_BASE_CLASS_NAME}-middle { display: flex; width: fit-content; max-width: 100%; margin: auto; }
          .${ESC_BASE_CLASS_NAME}-buttons { flex: 1; text-align: center; margin-top: 0.4rem; display: flex; max-width: 100% }
          .${ESC_BASE_CLASS_NAME}-buttons ha-icon-button { display: block; width: min-content }
          .${ESC_BASE_CLASS_NAME}-selector {
              flex: 1;
              }
            .${ESC_BASE_CLASS_NAME}-selector-partial {
              z-index: 3;
              position: absolute;
              top: 0;
              left: 0px;
              width: 100%;
              height: 1px;
              background-color: gray;
            }
            .${ESC_BASE_CLASS_NAME}-selector-picture {
              z-index: 1;
              position: relative;
              margin: auto;
              background-size: cover;
              background-position: center;
              min-height: 10px;
              min-width: 10px;
              max-height: 2000px;
              line-height: 0;
            }
            .${ESC_BASE_CLASS_NAME}-selector-window
            {
              z-index: 2;
              position: absolute;
              background-size: 100% 100%;
              width: 100%;
              height: 100%;
            }
            .${ESC_BASE_CLASS_NAME}-selector-slide
            {
              z-index: -1;
              position: absolute;
              background-position: bottom;
              overflow: hidden;
              top: 0;
              width: 100%;
            }
            .${ESC_BASE_CLASS_NAME}-selector-picker
            {
              z-index: 30;
              position: absolute;
              top: 7px;
              left: 0%;
              width: 100%;
              cursor: pointer;
              height: 30px;
              border-width: 1px;
              border-color: black;
              border-style: solid;
            }
            .${ESC_BASE_CLASS_NAME}-movement-overlay {
              display: none;
              position: absolute; top: 19px; left: 0%; width: 100%; height: 118px;
              background-color: rgba(0,0,0,0.3); text-align: center; --mdc-icon-size: 60px
            }
              .${ESC_BASE_CLASS_NAME}-movement-open {display: none}
              .${ESC_BASE_CLASS_NAME}-movement-close {display: none}
        .${ESC_BASE_CLASS_NAME}-top { text-align: center; margin-bottom: 1rem; }
        .${ESC_BASE_CLASS_NAME}-bottom { text-align: center; margin-top: 1rem; display:none}
          .${ESC_BASE_CLASS_NAME}-label { display: inline-block; font-size: 20px; vertical-align: middle; cursor: pointer;}
          .${ESC_BASE_CLASS_NAME}-position { display: inline-block; vertical-align: middle; padding: 0 6px; margin-left: 1rem; border-radius: 2px; background-color: var(--secondary-background-color); }
    `;
    this.appendChild(style);

  }
  updateShutters(hass,config)
  {
    //console.log('Enhanced ShutterCard: Update shutters');
    const entities = config.entities;
    entities.forEach((entity) =>
    {
      let entityId = entity.entity ? entity.entity : entity;
      let cfg = this.entityCfg[entityId];
      //console.log('Update shutters, entity',entityId);

      const shutter = this.card.querySelector('div[data-shutter="' + entityId +'"]');
      const slide = shutter.querySelector(`.${ESC_BASE_CLASS_NAME}-selector-slide`);
      const picker = shutter.querySelector(`.${ESC_BASE_CLASS_NAME}-selector-picker`);

      const state = hass.states[entityId];
      const currentPosition = state ? state.attributes.current_position : 100;
      const movementState = state? state.state : 'Demo';
      const labels = shutter.querySelectorAll(`.${ESC_BASE_CLASS_NAME}-label`);

      labels.forEach((shutterLabel) =>{
          shutterLabel.innerHTML = cfg.friendly_name;
      })

      if (!this.isUpdating) {
        //console.log('is NOT Updating');
        shutter.querySelectorAll(`.${ESC_BASE_CLASS_NAME}-position`).forEach( (shutterPosition) =>{
          this.setShutterPositionText(hass,cfg,shutter,shutterPosition, currentPosition);
        })
        this.setPickerPositionPercentage(cfg,currentPosition, picker, slide);


        this.setMovement(movementState, shutter);
      }else{
        //console.log('is Updating');
      }
    });
  }

  setShutterPositionText(hass,cfg,shutter,shutterPosition, currentPosition)
  {
    let visiblePosition;
    let positionText;
    //console.log('cfg.offset=', cfg.offset);

    if (cfg.invert_percentage) {
      visiblePosition = cfg.offset ? Math.min(100, Math.round(currentPosition / cfg.offset * 100)) : currentPosition;
      positionText = this.positionPercentToText(visiblePosition, cfg, hass);
      if (visiblePosition == 100 && cfg.offset) {
        positionText += ' (' + (100 - Math.round(Math.abs(currentPosition - visiblePosition) / cfg.offset * 100)) + ' %)';
      }
    }
    else {
      visiblePosition = cfg.offset ? Math.max(0, Math.round((currentPosition - cfg.offset) / (100 - cfg.offset) * 100)) : currentPosition;
      positionText = this.positionPercentToText(visiblePosition, cfg, hass);
      if (visiblePosition == 0 && cfg.offset) {
        positionText += ' (' + (100 - Math.round(Math.abs(currentPosition - visiblePosition) / cfg.offset * 100)) + ' %)';
      }
    }
    if (cfg.disable_end_buttons) {
      this.changeButtonState(shutter, currentPosition, cfg);
    }
  shutterPosition.innerHTML = positionText;
  }

  setButtonPosition(config,entity) {
    let buttonsPosition = entity.buttons_position || config.buttons_position || ESC_BUTTONS_POSITION;
    buttonsPosition
      = (buttonsPosition && POSITIONS.includes(buttonsPosition.toLowerCase()))
      ? buttonsPosition.toLowerCase()
      : ESC_BUTTONS_POSITION;
    return buttonsPosition;
  }

  changeButtonState(shutter, percent, cfg) {
    if (percent == 0) {
      shutter.querySelectorAll(`.${ESC_BASE_CLASS_NAME}-button-up`).forEach((button) =>{
        button.disabled = cfg.inverted;
      });
      shutter.querySelectorAll(`.${ESC_BASE_CLASS_NAME}-button-down`).forEach((button) =>{
        button.disabled = !cfg.inverted;
      });
    }
    else if (percent == 100) {
      shutter.querySelectorAll(`.${ESC_BASE_CLASS_NAME}-button-up`).forEach((button) =>{
        button.disabled = !cfg.inverted;
      });
      shutter.querySelectorAll(`.${ESC_BASE_CLASS_NAME}-button-down`).forEach((button) =>{
        button.disabled = cfg.inverted;
      }) ;
    }
    else {
      shutter.querySelectorAll(`.${ESC_BASE_CLASS_NAME}-button-up`).forEach((button) =>{
        button.disabled = false;
      });
      shutter.querySelectorAll(`.${ESC_BASE_CLASS_NAME}-button-down`).forEach((button) =>{
        button.disabled = false;
      }) ;
    }
  }

  positionPercentToText(percent, cfg, hass) {
    if (!cfg.always_percentage) {
      if (percent == 100) {
        return hass.localize(cfg.inverted?'ui.components.logbook.messages.was_closed':'ui.components.logbook.messages.was_opened');
      }
      else if (percent == 0) {
        return hass.localize(cfg.inverted?'ui.components.logbook.messages.was_opened':'ui.components.logbook.messages.was_closed');
      }
    }
    return Math.round(percent) + ' %';
  }

  calculatePositionFromPercent(cfg,percent) {
    let visiblePosition;
    let min = cfg.min_closing_position;
    let max = cfg.max_closing_position;

    if (cfg.inverted) {
      visiblePosition = cfg.offset ? Math.min(100, Math.round(percent / cfg.offset * 100 )) : percent;
    }
    else  {
      visiblePosition = cfg.offset ? Math.max(0, Math.round((percent - cfg.offset) / (100-cfg.offset) * 100 )) : percent;
    }

    let position =(max - min) * (cfg.inverted?visiblePosition:100-visiblePosition) / 100 + min;

    return position;
  }
  // not Used anymore ...
  getPictureTop(picture) {
      let pictureBox = picture.getBoundingClientRect();
      let body = document.body;
      let docEl = document.documentElement;
      let scrollTop = window.scrollY || docEl.scrollTop || body.scrollTop;
      let clientTop = docEl.clientTop || body.clientTop || 0;
      let pictureTop  = pictureBox.top + scrollTop - clientTop;
      return pictureTop;
  }

  setMovement(movement, shutter) {
    if (movement == "opening" || movement == "closing") {
      let opening = movement == "opening"
      shutter.querySelectorAll(`.${ESC_BASE_CLASS_NAME}-movement-overlay`).forEach(
        (overlay) => overlay.style.display = "block"
      )
      shutter.querySelectorAll(`.${ESC_BASE_CLASS_NAME}-movement-open`).forEach(
        (overlay) => overlay.style.display = opening?"block":"none"
      )
      shutter.querySelectorAll(`.${ESC_BASE_CLASS_NAME}-movement-close`).forEach(
        (overlay) => overlay.style.display = opening?"none":"block"
      )
    }
    else {
      shutter.querySelectorAll(`.${ESC_BASE_CLASS_NAME}-movement-overlay`).forEach(
        (overlay) => overlay.style.display = "none"
      )
    }
  }

  setPickerPositionPercentage(cfg,percentage, picker, slide) {
    let realPosition = this.calculatePositionFromPercent(cfg,percentage);

    this.setPickerPositionScreen(cfg,realPosition, picker, slide);
  }

  setPickerPositionScreen(cfg,position, picker, slide) {

    let min = cfg.min_closing_position;
    let max = cfg.max_closing_position;
    position = this.boundary(position, min, max);
    //console.log('position,min,max', position, min, max);

    picker.style.top = (position - this.picker_overlap) + 'px';
    slide.style.height = (position ) + 'px';
  }

  updateShutterPosition(hass, cfg,entityId, position) {
    let shutterPosition = Math.round(cfg.invert_percentage ?position: 100 - position);

//    hass.callService('cover', SERVICE_SHUTTER_PARTIAL, {
//      entity_id: entityId,
//      position: shutterPosition
//    });
  }

  setConfig(config) {
    console.log('EnhancedShutterCard config');
    if (!config.entities) {
      throw new Error('You need to define entities');
    }
    this.config = config;
    this.picker_overlap = 7;
    this.cardReady= false;
    this.isUpdating = false;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return this.config.entities.length + 1;
  }
  boundary(value,min=0,max=100){
    return Math.max(min,Math.min(max,value));
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

