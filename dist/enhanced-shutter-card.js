const SHUTTER_UP = 'open_cover';
const SHUTTER_DOWN = 'close_cover';
const SHUTTER_STOP = 'stop_cover';
const SHUTTER_PARTIAL = 'set_cover_position';
const SHUTTER_TILT_OPEN = 'open_cover_tilt';
const SHUTTER_TILT_DOWN = 'close_cover_tilt';

const ESC_IMAGE_MAP = "/local/community/hass-shutter-card/images";

const WINDOW_IMAGE  = 'window_image';
const VIEW_IMAGE = 'view_image';
const SLIDE_IMAGE = 'slide_image';
const SLIDE_BOTTON_IMAGE = 'slide_bottom_image';

const IMAGE_TYPES = [WINDOW_IMAGE,VIEW_IMAGE,SLIDE_IMAGE,SLIDE_BOTTON_IMAGE];

const ESC_IMAGE_BACK_VIEW = 'esc-back-view.png';
const ESC_IMAGE_SHUTTER_SLAT = 'esc-shutter-slat.png';
const ESC_IMAGE_SHUTTER_BOTTOM = 'esc-shutter-bottom.png';
const ESC_IMAGE_WINDOW = 'esc-window.png';

const IMAGES =
{
  [WINDOW_IMAGE]: ESC_IMAGE_WINDOW,
  [VIEW_IMAGE]: ESC_IMAGE_BACK_VIEW,
  [SLIDE_IMAGE]: ESC_IMAGE_SHUTTER_SLAT,
  [SLIDE_BOTTON_IMAGE]: ESC_IMAGE_SHUTTER_BOTTOM
};

const ESC_BASE_WIDTH_PX =100;
const ESC_BASE_HEIGHT_PX = 100;

const ESC_RESIZE_WIDTH_PCT =100;
const ESC_RESIZE_HEIGHT_PCT =100;

const ESC_MIN_CLOSING_POSITION = 0;
const ESC_MAX_CLOSING_POSITION = 100; //??


const ESC_PARTIAL = 0;
const ESC_OFFSET = 0;
const ESC_TILT = false

const LEFT = 'left';
const RIGHT = 'right';
const BOTTOM = 'bottom';
const TOP = 'top';

const POSITIONS =[LEFT,RIGHT,TOP,BOTTOM];

const ESC_INVERT_PERCENTAGE = false;

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

      let base_image_map = config.image_map || ESC_IMAGE_MAP;
      this.allImages={};
      IMAGE_TYPES.forEach((image_type) =>
      {
        let images={};
        let base_image = config[image_type] ? defImagePath(base_image_map,config[image_type]) : `${ESC_IMAGE_MAP}/${IMAGES[image_type]}`;
        entities.forEach((entity) =>
        {
          base_image_map = entity.image_map || config.image_map || ESC_IMAGE_MAP;
          let entityId = entity.entity ? entity.entity : entity;

          let image = entity[image_type] ? this.defImagePath(base_image_map,entity[image_type]) : base_image;
          let src = image || `${ESC_IMAGE_MAP}/${IMAGES[image_type]}`;
          images[entityId]={entityId,src};

        });
        this.allImages[image_type]=images;
      });

      const promisesForImageSizes = getPromisesForImageSizes(this.allImages[WINDOW_IMAGE]);

      Promise.all(promisesForImageSizes)
          .then(results => {
              const dimensions = Object.assign({}, ...results);
              this.buildShutters(hass,config,dimensions);
              this.cardReady=true;
          })
          .catch(error => console.error(error));
    }

    //Update the shutters UI
    if (this.cardReady) this.updateShutters(hass,config);
  }
// end main

  defImagePath(image_map,image)
  {
    return (image.includes('/') ? image : `${image_map}/${image}`);
  }

  buildShutters(hass,config,windowImages)
  {
    const entities = config.entities;

    let allShutters = document.createElement('div');
    allShutters.className = 'sc-shutters';
    let pickPoint =-1;

    entities.forEach((entity) =>
      {
      let entityId = entity.entity ? entity.entity : entity;

      let esc_window_image       = this.allImages[WINDOW_IMAGE][entityId].src;
      let esc_view_image         = this.allImages[VIEW_IMAGE][entityId].src;
      let esc_slide_image        = this.allImages[SLIDE_IMAGE][entityId].src;
      let esc_slide_bottom_image = this.allImages[SLIDE_BOTTON_IMAGE][entityId].src;

      let base_height = config.base_height_px || entity.base_height_px || windowImages[entityId]?.height || ESC_BASE_HEIGHT_PX;
      let base_width  = config.base_width_px  || entity.base_width_px  || windowImages[entityId]?.width  || ESC_BASE_WIDTH_PX;

      let resize_height_pct = config.resize_height_pct || entity.resize_height_pct || ESC_RESIZE_HEIGHT_PCT;
      let resize_width_pct  = config.resize_width_pct || entity.resize_width_pct   || ESC_RESIZE_WIDTH_PCT;

      let esc_window_height = Math.round(this.boundary(resize_height_pct)/100*base_height);
      let esc_window_width  = Math.round(this.boundary(resize_width_pct) /100*base_width);

      let buttonsPosition
        = (entity.buttons_position && !POSITIONS.includes(entity.buttons_position.toLowerCase()))
        ? entity.buttons_position.toLowerCase()
        : LEFT;
      let invertPercentage = entity.invert_percentage ?  entity.invert_percentage : ESC_INVERT_PERCENTAGE;

      let partial = entity.partial_close_percentage ? this.boundary(entity.partial_close_percentage) : ESC_PARTIAL;
      let offset  = entity.offset_closed_percentage ? this.boundary(entity.offset_closed_percentage) : ESC_OFFSET;

      let min_closing_position = entity.min_closing_position ? Math.round(this.boundary(entity.min_closing_position)/100*esc_window_height) : ESC_MIN_CLOSING_POSITION;
      let max_closing_position = entity.max_closing_position ? Math.round(this.boundary(entity.max_closing_position)/100*esc_window_height) : esc_window_height;

      let tilt = entity.can_tilt ? entity.can_tilt : ESC_TILT;

      const buttonsInRow = buttonsPosition == 'top' || buttonsPosition == 'bottom';
      const buttonsContainerReversed = buttonsPosition == 'bottom' || buttonsPosition == 'right';

      let shutter = document.createElement('div');

      shutter.className = 'sc-shutter';
      shutter.dataset.shutter = entityId;
      shutter.dataset.min_closing_position = min_closing_position;
      shutter.dataset.max_closing_position = max_closing_position;

      shutter.innerHTML = `
        <div class="${shutter.className}-top">
          <div class="${shutter.className}-label"></div>
          <div class="${shutter.className}-position">
          </div>
        </div>
        <div class="${shutter.className}-middle" style="flex-flow: ${ (buttonsInRow ? 'column': 'row') + (buttonsContainerReversed ? '-reverse' : '') } nowrap;">
          <div class="${shutter.className}-buttons" style="flex-flow: ` + (buttonsInRow ? 'row': 'column') + ` wrap;">
            `+(partial?`<ha-icon-button label="Partially close (${partial}%)" class="${shutter.className}-button ${shutter.className}-button-partial" data-command="${SHUTTER_PARTIAL}" data-position="${partial}"><ha-icon icon="mdi:arrow-expand-vertical"></ha-icon></ha-icon-button>`:``)+`
            ` + (tilt?`
            <ha-icon-button label="` + hass.localize(`ui.dialogs.more_info_control.cover.open_tilt_cover`) +`" class="${shutter.className}-button ${shutter.className}-button-tilt-open" data-command="${SHUTTER_TILT_OPEN}"><ha-icon icon="mdi:arrow-top-right"></ha-icon></ha-icon-button>
            <ha-icon-button label="` + hass.localize(`ui.dialogs.more_info_control.cover.close_tilt_cover`) +`"class="${shutter.className}-button ${shutter.className}-button-tilt-down" data-command="${SHUTTER_TILT_DOWN}"><ha-icon icon="mdi:arrow-bottom-left"></ha-icon></ha-icon-button>
            `:``) + `
          </div>
          <div class="${shutter.className}-buttons" style="flex-flow: ` + (buttonsInRow ? 'row': 'column') + ` wrap;">
            <ha-icon-button label="` + hass.localize(`ui.dialogs.more_info_control.cover.open_cover`) +`" class="${shutter.className}-button ${shutter.className}-button-up" data-command="${SHUTTER_UP}"><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
            <ha-icon-button label="` + hass.localize(`ui.dialogs.more_info_control.cover.stop_cover`) +`"class="${shutter.className}-button ${shutter.className}-button-stop" data-command="${SHUTTER_STOP}"><ha-icon icon="mdi:stop"></ha-icon></ha-icon-button>
            <ha-icon-button label="` + hass.localize(`ui.dialogs.more_info_control.cover.close_cover`) +`" class="${shutter.className}-button ${shutter.className}-button-down" data-command="${SHUTTER_DOWN}"><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
          </div>
          <div class="${shutter.className}-selector">
            <div class="${shutter.className}-selector-picture" style="background-image: url(${esc_view_image})";>
              <img src= "${esc_window_image}" style="width: ${esc_window_width}px; height: ${esc_window_height}px">
              <div class="${shutter.className}-selector-slide" style="height: ${min_closing_position}px; background-image: url(${esc_slide_image});">
                <img src="${esc_slide_bottom_image}"; style="width: 100%; position: absolute; bottom: 0";>
              </div>
              <div class="${shutter.className}-selector-picker" style="top: ${shutter.dataset.min_closing_position-this.picker_overlap}px;"></div>`+
              (partial&&!offset?
                `<div class="${shutter.className}-selector-partial" style="top:${this.calculatePositionFromPercent(partial, invertPercentage, offset, shutter.dataset)}px"></div>`:``
              ) + `
              <div class="${shutter.className}-movement-overlay">
                <ha-icon class="${shutter.className}-movement-open" icon="mdi:arrow-up"></ha-icon>
                <ha-icon class="${shutter.className}-movement-close" icon="mdi:arrow-down"></ha-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="${shutter.className}-bottom">
          <div class="${shutter.className}-label"></div>
          <div class="${shutter.className}-position"></div>
        </div>
      `;

      let picture = shutter.querySelector(`.${shutter.className}-selector-picture`);

      let slide = shutter.querySelector(`.${shutter.className}-selector-slide`);
      let picker = shutter.querySelector(`.${shutter.className}-selector-picker`);
      let labels = shutter.querySelectorAll(`.${shutter.className}-label`);

      if (entity.title_position){
        const reverse_position={
          'top' : 'bottom',
          'bottom' : 'top',
        }
        let title =shutter.querySelector(`.${shutter.className}-${entity.title_position}`);
        let no_title =shutter.querySelector(`.${shutter.className}-${reverse_position[entity.title_position]}`);
        if (title) title.style.display = "block";
        if (no_title) no_title.style.display = "none";
      }

      let detailOpen = (event) =>{
          let e = new Event('hass-more-info', { composed: true });
          e.detail = {
            entityId
          };
          this.dispatchEvent(e);
      }

      labels.forEach((labelDOM) => {
          labelDOM.addEventListener('click', detailOpen);
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
        let newPosition = event.pageY - pickPoint;
        this.setPickerPosition(newPosition, picker, slide, shutter.dataset);
      };

      let mouseUp = (event) =>{
        if (event.pageY === undefined) return;
        let min = parseInt(shutter.dataset.min_closing_position);
        let max = parseInt(shutter.dataset.max_closing_position);

        this.isUpdating = false;
        let newPosition = event.pageY - pickPoint;

        newPosition = this.boundary(newPosition,min,max);
        let percentagePosition = (newPosition - min) * (100-offset) / (max - min);

        this.updateShutterPosition(hass, entityId, percentagePosition,invertPercentage);

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
      shutter.querySelectorAll(`.${shutter.className}-button`).forEach( (button) =>{

        button.onclick = function () {

          const command = this.dataset.command;
          const services ={
            [SHUTTER_UP] : {'args': ''},
            [SHUTTER_DOWN] : {'args': ''},
            [SHUTTER_STOP] : {'args': ''},
            [SHUTTER_PARTIAL] : {'args': {position: this.dataset.position}},
            [SHUTTER_TILT_OPEN] : {'args': ''},
            [SHUTTER_TILT_DOWN] : {'args': ''},
          }

          hass.callService('cover', command, {
            entity_id: entityId,
            ...services[command].args
          });
        };
      });

      allShutters.appendChild(shutter);
    });
    this.card.appendChild(allShutters);

    const style = document.createElement('style');
    style.textContent = `
      .sc-shutters { padding: 16px; }
        .${shutter.className} { margin-top: 1rem; overflow: visible; }
        .${shutter.className}:first-child { margin-top: 0; }
        .${shutter.className}-middle { display: flex; width: fit-content; max-width: 100%; margin: auto; }
          .${shutter.className}-buttons { flex: 1; text-align: center; margin-top: 0.4rem; display: flex; max-width: 100% }
          .${shutter.className}-buttons ha-icon-button { display: block; width: min-content }
          .${shutter.className}-selector {
              flex: 1;
              }
            .${shutter.className}-selector-partial { position: absolute; top:0; left: 0px; width: 100%; height: 1px; background-color: gray; }
            .${shutter.className}-selector-picture {
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
            .${shutter.className}-selector-window
            {
              z-index: 2;
              position: absolute;
              background-size: 100% 100%;
              width: 100%;
              height: 100%;
            }
            .${shutter.className}-selector-slide
            {
              z-index: -1;
              position: absolute;
              background-position: bottom;
              overflow: hidden;
              top: 0;
              width: 100%;
            }
            .${shutter.className}-selector-picker
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
            .${shutter.className}-movement-overlay {
              display: none;
              position: absolute; top: 19px; left: 0%; width: 100%; height: 118px;
              background-color: rgba(0,0,0,0.3); text-align: center; --mdc-icon-size: 60px
            }
              .${shutter.className}-movement-open {display: none}
              .${shutter.className}-movement-close {display: none}
        .${shutter.className}-top { text-align: center; margin-bottom: 1rem; }
        .${shutter.className}-bottom { text-align: center; margin-top: 1rem; display:none}
          .${shutter.className}-label { display: inline-block; font-size: 20px; vertical-align: middle; cursor: pointer;}
          .${shutter.className}-position { display: inline-block; vertical-align: middle; padding: 0 6px; margin-left: 1rem; border-radius: 2px; background-color: var(--secondary-background-color); }
    `;
    this.appendChild(style);

  }
  updateShutters(hass,config)
  {
    const entities = config.entities;
    entities.forEach((entity) =>
    {
      let entityId = entity.entity ? entity.entity : entity;

      const shutter = this.card.querySelector('div[data-shutter="' + entityId +'"]');
      const slide = shutter.querySelector(`.${shutter.className}-selector-slide`);
      const picker = shutter.querySelector(`.${shutter.className}-selector-picker`);
      const dataset = shutter.dataset;
      const state = hass.states[entityId];
      const friendlyName = entity.name ? entity.name : state ? state.attributes.friendly_name : 'unknown';
      const currentPosition = state ? state.attributes.current_position : 'unknown';
      const movementState = state? state.state : 'unknown';

      let invertPercentage = entity.invert_percentage ?  entity.invert_percentage : false;
      let offset  = entity.offset_closed_percentage ? Math.max(0,Math.min(100,entity.offset_closed_percentage)) : 0;
      let alwaysPercentage = entity.always_percentage ? entity.always_percentage : false;
      let disableEnd = entity.disable_end_buttons ? entity.disable_end_buttons : false;

      shutter.querySelectorAll(`.${shutter.className}-label`).forEach((shutterLabel) =>{
          shutterLabel.innerHTML = friendlyName;
      })

      if (!this.isUpdating) {
        shutter.querySelectorAll(`.${shutter.className}-position`).forEach( (shutterPosition) =>{
          let visiblePosition;
          let positionText;
          if (invertPercentage) {
            visiblePosition = offset?Math.min(100, Math.round(currentPosition / offset * 100 )):currentPosition;
            positionText = this.positionPercentToText(visiblePosition, invertPercentage, alwaysPercentage, hass);
            if (disableEnd) {
              this.changeButtonState(shutter, currentPosition, invertPercentage);
            }
            if (visiblePosition == 100 && offset) {
              positionText += ' ('+ (100-Math.round(Math.abs(currentPosition-visiblePosition)/offset*100)) +' %)';
            }
          }
          else  {
            visiblePosition = offset?Math.max(0, Math.round((currentPosition - offset) / (100-offset) * 100 )):currentPosition;
            positionText = this.positionPercentToText(visiblePosition, invertPercentage, alwaysPercentage, hass);
            if (disableEnd) {
              this.changeButtonState(shutter, currentPosition, invertPercentage);
            }
            if (visiblePosition == 0 && offset) {
              positionText += ' ('+ (100-Math.round(Math.abs(currentPosition-visiblePosition)/offset*100)) +' %)';
            }
          }
          shutterPosition.innerHTML = positionText;
        })

        this.setPickerPositionPercentage(currentPosition, picker, slide, invertPercentage, offset, dataset);


        this.setMovement(movementState, shutter);
      }
    });
  }

  changeButtonState(shutter, percent, inverted) {
    if (percent == 0) {
      shutter.querySelectorAll(`.${shutter.className}-button-up`).forEach((button) =>{
        button.disabled = inverted;
      });
      shutter.querySelectorAll(`.${shutter.className}-button-down`).forEach((button) =>{
        button.disabled = !inverted;
      });
    }
    else if (percent == 100) {
      shutter.querySelectorAll(`.${shutter.className}-button-up`).forEach((button) =>{
        button.disabled = !inverted;
      });
      shutter.querySelectorAll(`.${shutter.className}-button-down`).forEach((button) =>{
        button.disabled = inverted;
      }) ;
    }
    else {
      shutter.querySelectorAll(`.${shutter.className}-button-up`).forEach((button) =>{
        button.disabled = false;
      });
      shutter.querySelectorAll(`.${shutter.className}-button-down`).forEach((button) =>{
        button.disabled = false;
      }) ;
    }
  }

  positionPercentToText(percent, inverted, alwaysPercentage, hass) {
    if (!alwaysPercentage) {
      if (percent == 100) {
        return hass.localize(inverted?'ui.components.logbook.messages.was_closed':'ui.components.logbook.messages.was_opened');
      }
      else if (percent == 0) {
        return hass.localize(inverted?'ui.components.logbook.messages.was_opened':'ui.components.logbook.messages.was_closed');
      }
    }
    return percent + ' %';
  }

  calculatePositionFromPercent(percent, inverted, offset,dataset) {
    let visiblePosition;
    let min = parseInt(dataset.min_closing_position);
    let max = parseInt(dataset.max_closing_position);

    if (inverted) {
      visiblePosition = offset?Math.min(100, Math.round(percent / offset * 100 )):percent;
    }
    else  {
      visiblePosition = offset?Math.max(0, Math.round((percent - offset) / (100-offset) * 100 )):percent;
    }

    let position =(max - min) * (inverted?visiblePosition:100-visiblePosition) / 100 + min;

    return position;
  }

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
      shutter.querySelectorAll(`.${shutter.className}-movement-overlay`).forEach(
        (overlay) => overlay.style.display = "block"
      )
      shutter.querySelectorAll(`.${shutter.className}-movement-open`).forEach(
        (overlay) => overlay.style.display = opening?"block":"none"
      )
      shutter.querySelectorAll(`.${shutter.className}-movement-close`).forEach(
        (overlay) => overlay.style.display = opening?"none":"block"
      )
    }
    else {
      shutter.querySelectorAll(`.${shutter.className}-movement-overlay`).forEach(
        (overlay) => overlay.style.display = "none"
      )
    }
  }

  setPickerPositionPercentage(percentage, picker, slide, inverted, offset, dataset) {
    let realPosition = this.calculatePositionFromPercent(percentage, inverted, offset,dataset);

    this.setPickerPosition(realPosition, picker, slide, dataset);
  }

  setPickerPosition(position, picker, slide, dataset) {

    let min = dataset.min_closing_position;
    let max = dataset.max_closing_position;
    position= this.boundary(position,min,max);

    picker.style.top = (position - this.picker_overlap) + 'px';
    slide.style.height = (position ) + 'px';
  }

  updateShutterPosition(hass, entityId, position,invertPercentage) {
    let shutterPosition = Math.round(invertPercentage ?position: 100 - position);

    hass.callService('cover', SHUTTER_PARTIAL, {
      entity_id: entityId,
      position: shutterPosition
    });
  }

  setConfig(config) {
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

