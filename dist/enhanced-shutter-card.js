
const VERSION = 'v1.3.0';
const DEBUG = false;
// // local copy of RELEASE 3.0.1 of
// https://www.jsdelivr.com/package/gh/lit/dist

import {LitElement, html, css, unsafeCSS } from './lit/lit-core.min.js';

// import {html, css, unsafeCSS } from './lit/lit-core.min.js';
// import {LitElement} from './lit/lit-debug.js'; // <-- dit is nu de debug versie


const HA_CARD_NAME = "enhanced-shutter-card";
const HA_SHUTTER_NAME = `enhanced-shutter`;
const HA_HUI_VIEW = 'hui-view';
const SPACE = '';

const UNAVAILABLE = 'unavailable';
const UNKNOWN = 'unknown';
const NOT_KNOWN =[UNAVAILABLE,UNKNOWN,undefined, null ];

const AUTO = 'auto';
const LEFT = 'left';
const RIGHT = 'right';
const BOTTOM = 'bottom';
const TOP = 'top';
const UP = 'up';
const DOWN = 'down';
const IS_HORIZONTAL = [LEFT,RIGHT];
const IS_VERTICAL = [UP,DOWN];
const HORIZONTAL = 'horizontal';
const VERTICAL = 'vertical';
const NONE = 'none';
const AUTO_TL = `${AUTO}-${TOP}-${LEFT}`;
const AUTO_TR = `${AUTO}-${TOP}-${RIGHT}`;
const AUTO_BL = `${AUTO}-${BOTTOM}-${LEFT}`;
const AUTO_BR = `${AUTO}-${BOTTOM}-${RIGHT}`;
/*
    from https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/#sizing-in-sections-view
    for getLayoutOptions() {
      size off cells.
      width:
         layout: between 80px and 120px depending on the screen size
      height: 56px
      gap between cells: 8px

    for getGridOptions() (used here)
      width:
         layout: between 27px and 40px depending on the screen size (width for code: size is LayoutWidth/3 )
      height: 56px
      gap between cells: 8px
*/
const HA_GRID_PX_HEIGHTt = 56;
const HA_GRID_PX_WIDTH = 24; // beween 17 and 30 ???
const HA_GRID_PX_GAP = 8;



const PORTRAIT ="P";
const LANDSCAPE ="L";

// derived from: https://github.com/home-assistant/core/blob/dev/homeassistant/components/cover/__init__.py
//               lines 101-108

const ESC_FEATURE_OPEN              = 0b00000001; // 1
const ESC_FEATURE_CLOSE             = 0b00000010; // 2
const ESC_FEATURE_SET_POSITION      = 0b00000100; // 4
const ESC_FEATURE_STOP              = 0b00001000; // 8
const ESC_FEATURE_OPEN_TILT         = 0b00010000; // 16
const ESC_FEATURE_CLOSE_TILT        = 0b00100000; // 32
const ESC_FEATURE_STOP_TILT         = 0b01000000; // 64
const ESC_FEATURE_SET_TILT_POSITION = 0b10000000; // 128

const ESC_FEATURE_ALL               = 0b11111111; // 255
const ESC_FEATURE_NO_TILT           = 0b00001111; // 15

const SHUTTER_STATE_OPEN = 'open';
const SHUTTER_STATE_CLOSED = 'closed';
const SHUTTER_STATE_OPENING = 'opening';
const SHUTTER_STATE_CLOSING = 'closing';
const SHUTTER_STATE_PARTIAL_OPEN = 'partial_open'; // speudo state

const SHUTTER_OPEN_PCT = 100;
const SHUTTER_CLOSED_PCT = 0;

const ESC_CLASS_BASE_NAME = 'esc-shutter';

const ESC_CLASS_SHUTTER = `${ESC_CLASS_BASE_NAME}`;
const ESC_CLASS_SHUTTER_SEPERATE = `${ESC_CLASS_BASE_NAME}-seperate`
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
const ESC_CLASS_SELECTOR_PICKER = `${ESC_CLASS_BASE_NAME}-selector-picker`;
const ESC_CLASS_SELECTOR_PARTIAL = `${ESC_CLASS_BASE_NAME}-selector-partial`;
const ESC_CLASS_SELECTOR_SLIDE = `${ESC_CLASS_BASE_NAME}-selector-slide`;
const ESC_CLASS_SELECTOR_SLIDE_MAIN = `${ESC_CLASS_SELECTOR_SLIDE}-main`;
const ESC_CLASS_SELECTOR_SLIDE_EDGE = `${ESC_CLASS_SELECTOR_SLIDE}-edge`;
const ESC_CLASS_MOVEMENT_OVERLAY = `${ESC_CLASS_BASE_NAME}-movement-overlay`;
const ESC_CLASS_MOVEMENT_UP = `${ESC_CLASS_BASE_NAME}-movement-up`;
const ESC_CLASS_MOVEMENT_DOWN = `${ESC_CLASS_BASE_NAME}-movement-down`;
const ESC_CLASS_HA_ICON = `${ESC_CLASS_BASE_NAME}-ha-icon`;
const ESC_CLASS_HA_ICON_LOCK = `${ESC_CLASS_HA_ICON}-lock`;
const ESC_CLASS_TOP_LEFT = `${ESC_CLASS_BASE_NAME}-${TOP}-${LEFT}`;
const ESC_CLASS_TOP_RIGHT = `${ESC_CLASS_BASE_NAME}-${TOP}-${RIGHT}`;
const ESC_CLASS_TOP_ICON_TEXT = `${ESC_CLASS_BASE_NAME}-icon-text`;

const POSITIONS =[AUTO,AUTO_BL,AUTO_BR,AUTO_TL,AUTO_TR,LEFT,RIGHT,TOP,BOTTOM,NONE];

const ACTION_SHUTTER_OPEN = 'open_cover';
const ACTION_SHUTTER_OPEN_TILT = 'open_cover_tilt';
const ACTION_SHUTTER_CLOSE = 'close_cover';
const ACTION_SHUTTER_CLOSE_TILT = 'close_cover_tilt';
const ACTION_SHUTTER_STOP = 'stop_cover';
const ACTION_SHUTTER_STOP_TILT = 'stop_cover_tilt';
const ACTION_SHUTTER_SET_POS = 'set_cover_position';
const ACTION_SHUTTER_SET_POS_TILT = 'set_cover_tilt_position';

const ICON_BUTTON_SIZE = 36; // original: 48
const ICON_SIZE = 24;

const UNITY= 'px';

const CONFIG_TYPE = "type";
const CONFIG_SHUTTER_PRESET = 'shutter_preset';
const CONFIG_TITLE = "title";
const CONFIG_ENTITIES = 'entities';

const HA_ALERT_SUCCESS = 'success';
const HA_ALERT_WARNING = 'warning';
const HA_ALERT_ERROR = 'error';
const HA_ALERT_INFO = 'info';

const CONFIG_ENTITY_ID = 'entity';
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
const CONFIG_ROTATE_MAIN_SHUTTER_IMAGE = 'rotate_slat_image';
const CONFIG_STRETCH_EDGE_SHUTTER_IMAGE = 'stretch_bottom_image';
const CONFIG_BASE_HEIGHT_PX = 'base_height_px';
const CONFIG_BASE_WIDTH_PX = 'base_width_px';
const CONFIG_RESIZE_HEIGHT_PCT = 'resize_height_pct';
const CONFIG_RESIZE_WIDTH_PCT = 'resize_width_pct';

const CONFIG_SCALE_ICONS = 'scale_icons';
const CONFIG_SCALE_TEXTS = 'scale_texts';
const CONFIG_SCALE_BUTTONS = 'scale_buttons';
const CONFIG_OFFSET_OPENED_PCT = 'top_offset_pct'; // TODO  rename: top->opened
const CONFIG_OFFSET_CLOSED_PCT = 'bottom_offset_pct'; // TODO rename bottom->closed
const CONFIG_BUTTONS_POSITION = 'buttons_position';
const CONFIG_TITLE_POSITION = 'title_position';  // removed
const CONFIG_NAME_POSITION = 'name_position';
const CONFIG_NAME_DISABLED = 'name_disabled';
const CONFIG_OPENING_POSITION = 'opening_position';
const CONFIG_OPENING_DISABLED = 'opening_disabled';
const CONFIG_INLINE_HEADER = 'inline_header';

const CONFIG_INVERT_PCT = 'invert_percentage';
const CONFIG_INVERT_OPEN_CLOSE = 'invert_open_close';
const CONFIG_CAN_TILT = 'can_tilt';
const CONFIG_SHOW_TILT = 'show_tilt';
const CONFIG_CLOSING_DIRECTION = 'closing_direction'
const CONFIG_PARTIAL_CLOSE_PCT = 'partial_close_percentage';
const CONFIG_OFFSET_IS_CLOSED_PCT = 'offset_closed_percentage'; // TODO rename
const CONFIG_ALWAYS_PCT = 'always_percentage';
const CONFIG_DISABLE_END_BUTTONS = 'disable_end_buttons';
const CONFIG_DISABLE_STANDARD_BUTTONS = 'disable_standard_buttons';
const CONFIG_DISABLE_PARTIAL_OPEN_BUTTONS = 'disable_partial_open_buttons';
const CONFIG_PICKER_OVERLAP_PX = 'picker_overlap_px';
const CONFIG_CURRENT_POSITION = 'current_position';

const CONFIG_BUTTON_STOP_HIDE_STATES = 'button_stop_hide_states';
const CONFIG_BUTTON_OPENED_HIDE_STATES = 'button_up_hide_states';  // TODO rename up->opened
const CONFIG_BUTTON_CLOSED_HIDE_STATES = 'button_down_hide_states'; // TODO rename down->closed

const DEPRECATED={
  //[CONFIG_TITLE_POSITION]: {new: CONFIG_NAME_POSITION},
  [CONFIG_CAN_TILT]: {new: CONFIG_SHOW_TILT}
};
const REMOVED={
  [CONFIG_TITLE_POSITION]: {new: CONFIG_NAME_POSITION},
  //[CONFIG_CAN_TILT]: {new: CONFIG_SHOW_TILT}
};
    const ICONCOLORS = {
      '-1': "grey",
      0: "red",
      1: "#FF4D00",// deep orange,
      2: "#FF7F00", // amber
      3: "orange",
      4: "#66B266", // sligly dim green
      5: "green",
    };

const Z_INDEX_PARTIAL = 5;
const Z_INDEX_PICKER  = 3;
const Z_INDEX_PICTURE = 1;
const Z_INDEX_MOVEMENT_ICON = 2;  // !important ??
const Z_INDEX_SLIDE  = -1;
const Z_INDEX_OVERLAY =-1;


const ESC_ENTITY_ID = null;

const ESC_BATTERY_ENTITY_ID = null;
const ESC_SIGNAL_ENTITY_ID = null;

const ESC_AWNING = 'awning';
const ESC_CURTAIN = 'curtain';
const ESC_TEST = 'test'; // used for testing purposes
const ESC_SHADE = 'shade';
const ESC_ROLLER_SHUTTER = 'roller-shutter';
const ESC_TYPES =
  [ESC_AWNING, ESC_CURTAIN, ESC_ROLLER_SHUTTER,ESC_SHADE];

const ESC_SHUTTER_PRESET = ESC_ROLLER_SHUTTER;
const ESC_NAME = null;
const ESC_PASSIVE_MODE = false;
const ESC_IMAGE_MAP = `/local/community/${HA_CARD_NAME}/images`;
const ESC_IMAGE_WINDOW = 'esc-window.png';
const ESC_IMAGE_VIEW = 'esc-view.png';
const ESC_IMAGE_SHUTTER_SLAT   = 'esc-shutter-slat.png';
const ESC_IMAGE_SHUTTER_BOTTOM = 'esc-shutter-bottom.png';
const ESC_ROTATE_MAIN_SHUTTER_IMAGE = true; // true: rotate slat image, false: use slat image as is
const ESC_STRETCH_EDGE_SHUTTER_IMAGE = true; // true: stretch bottom image, false: use bottom image as is
const ESC_BASE_HEIGHT_PX = 150; // image-height
const ESC_BASE_WIDTH_PX = 150;  // image-width
const ESC_RESIZE_HEIGHT_PCT = 100;
const ESC_RESIZE_WIDTH_PCT  = 100;

const ESC_SCALE_ICONS = true;
const ESC_SCALE_TEXTS = false;
const ESC_SCALE_BUTTONS = false;
const ESC_OPENED_OFFSET_PCT = 0;
const ESC_CLOSED_OFFSET_PCT = 0;
const ESC_BUTTONS_POSITION = LEFT;
const ESC_TITLE_POSITION = null;  // deprecated
const ESC_NAME_POSITION =TOP;
const ESC_NAME_DISABLED = false;
const ESC_OPENING_POSITION = TOP;
const ESC_OPENING_DISABLED = false;
const ESC_INLINE_HEADER = false;
const ESC_INVERT_PCT = false;
const ESC_INVERT_OPEN_CLOSE = false
const ESC_CAN_TILT = false;
const ESC_SHOW_TILT = true;
const ESC_CLOSING_DIRECTION = DOWN;
const ESC_PARTIAL_CLOSE_PCT = 0;
const ESC_OFFSET_CLOSED_PCT = 0;
const ESC_ALWAYS_PCT = false;
const ESC_DISABLE_END_BUTTONS = false;
const ESC_DISABLE_STANDARD_BUTTONS = false;
const ESC_DISABLE_PARTIAL_OPEN_BUTTONS = true;
const ESC_PICKER_OVERLAP_PX = 20;
const ESC_CURRENT_POSITION = 0;


const ESC_MIN_RESIZE_WIDTH_PCT  =  20;
const ESC_MAX_RESIZE_WIDTH_PCT  = 500;
const ESC_MIN_RESIZE_HEIGHT_PCT =  20;
const ESC_MAX_RESIZE_HEIGHT_PCT = 500;

const ESC_BUTTON_STOP_HIDE_STATES = [];
const ESC_BUTTON_OPENED_HIDE_STATES = [];
const ESC_BUTTON_CLOSED_HIDE_STATES = [];

const INVERT_OPEN_CLOSE ={
  [SHUTTER_STATE_OPEN]: SHUTTER_STATE_CLOSED,
  [SHUTTER_STATE_CLOSED]: SHUTTER_STATE_OPEN,
  [SHUTTER_STATE_OPENING]: SHUTTER_STATE_CLOSING,
  [SHUTTER_STATE_CLOSING]: SHUTTER_STATE_OPENING,
  [ACTION_SHUTTER_OPEN]: ACTION_SHUTTER_CLOSE,
  [ACTION_SHUTTER_CLOSE]: ACTION_SHUTTER_OPEN,

};

const CONFIG_DEFAULT ={
  [CONFIG_TYPE]: "",
  [CONFIG_TITLE]: "",
  [CONFIG_ENTITIES]: "",

  [CONFIG_SHUTTER_PRESET]: ESC_SHUTTER_PRESET,
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
  [CONFIG_ROTATE_MAIN_SHUTTER_IMAGE]: ESC_ROTATE_MAIN_SHUTTER_IMAGE,
  [CONFIG_STRETCH_EDGE_SHUTTER_IMAGE]: ESC_STRETCH_EDGE_SHUTTER_IMAGE,
  [CONFIG_BASE_HEIGHT_PX]: ESC_BASE_HEIGHT_PX,
  [CONFIG_BASE_WIDTH_PX]: ESC_BASE_WIDTH_PX,
  [CONFIG_RESIZE_HEIGHT_PCT]: ESC_RESIZE_HEIGHT_PCT,
  [CONFIG_RESIZE_WIDTH_PCT]: ESC_RESIZE_WIDTH_PCT,

  [CONFIG_SCALE_ICONS]: ESC_SCALE_ICONS,
  [CONFIG_SCALE_BUTTONS]: ESC_SCALE_BUTTONS,
  [CONFIG_SCALE_TEXTS]: ESC_SCALE_TEXTS,
  [CONFIG_OFFSET_OPENED_PCT]: ESC_OPENED_OFFSET_PCT,
  [CONFIG_OFFSET_CLOSED_PCT]: ESC_CLOSED_OFFSET_PCT,
  [CONFIG_BUTTONS_POSITION]: ESC_BUTTONS_POSITION,
  [CONFIG_TITLE_POSITION]: ESC_TITLE_POSITION,  // deprecated
  [CONFIG_NAME_POSITION]: ESC_NAME_POSITION,
  [CONFIG_NAME_DISABLED]: ESC_NAME_DISABLED,
  [CONFIG_OPENING_POSITION]: ESC_OPENING_POSITION,
  [CONFIG_OPENING_DISABLED]: ESC_OPENING_DISABLED,
  [CONFIG_INLINE_HEADER]: ESC_INLINE_HEADER,

  [CONFIG_INVERT_PCT]: ESC_INVERT_PCT,
  [CONFIG_INVERT_OPEN_CLOSE]: ESC_INVERT_OPEN_CLOSE,

  [CONFIG_CAN_TILT]: ESC_CAN_TILT,
  [CONFIG_SHOW_TILT]: ESC_SHOW_TILT,

  [CONFIG_CLOSING_DIRECTION]: ESC_CLOSING_DIRECTION,
  [CONFIG_PARTIAL_CLOSE_PCT]: ESC_PARTIAL_CLOSE_PCT,
  [CONFIG_OFFSET_IS_CLOSED_PCT]: ESC_OFFSET_CLOSED_PCT,
  [CONFIG_ALWAYS_PCT]: ESC_ALWAYS_PCT,
  [CONFIG_DISABLE_END_BUTTONS]: ESC_DISABLE_END_BUTTONS,
  [CONFIG_DISABLE_STANDARD_BUTTONS]: ESC_DISABLE_STANDARD_BUTTONS,
  [CONFIG_DISABLE_PARTIAL_OPEN_BUTTONS]: ESC_DISABLE_PARTIAL_OPEN_BUTTONS,

  [CONFIG_PICKER_OVERLAP_PX]: ESC_PICKER_OVERLAP_PX,
  [CONFIG_CURRENT_POSITION]: ESC_CURRENT_POSITION,

  [CONFIG_BUTTON_STOP_HIDE_STATES]: ESC_BUTTON_STOP_HIDE_STATES,
  [CONFIG_BUTTON_OPENED_HIDE_STATES]: ESC_BUTTON_OPENED_HIDE_STATES,
  [CONFIG_BUTTON_CLOSED_HIDE_STATES]: ESC_BUTTON_CLOSED_HIDE_STATES,
// Home assistant key words, not used but to prevent warnings
  ['view_layout']: null,
  ['grid_options']: null,



};
const ESC_PRESET = {
  [ESC_ROLLER_SHUTTER] : {
    [CONFIG_ROTATE_MAIN_SHUTTER_IMAGE]: true,
  }  // default is using CONFIG_DEFAULT
  ,
  [ESC_AWNING]: {
    [CONFIG_INVERT_OPEN_CLOSE]: true,
    [CONFIG_SHUTTER_SLAT_IMAGE]: 'esc-awning.png',
    [CONFIG_SHUTTER_BOTTOM_IMAGE]: 'esc-awning-bottom.png',
    [CONFIG_ROTATE_MAIN_SHUTTER_IMAGE]: true,
    [CONFIG_STRETCH_EDGE_SHUTTER_IMAGE]: false,
    [CONFIG_OFFSET_CLOSED_PCT]: 50
  },
  [ESC_CURTAIN]: {
    [CONFIG_CLOSING_DIRECTION]: RIGHT,
    [CONFIG_SHUTTER_SLAT_IMAGE]: 'esc-curtain.png',
    [CONFIG_SHUTTER_BOTTOM_IMAGE]: '',
    [CONFIG_ROTATE_MAIN_SHUTTER_IMAGE]: false,
  },
  [ESC_SHADE]: {
    [CONFIG_SHUTTER_SLAT_IMAGE]: '#00000080',
  },
  [ESC_TEST]: {
    [CONFIG_SHUTTER_SLAT_IMAGE]: 'rode_rechthoek.png',
    [CONFIG_SHUTTER_BOTTOM_IMAGE]: 'gele_rechthoek.png',
  },
}

const LOCALIZE_TEXT= {
  // Search for this in Lokalise.com : component::cover::entity_component::_::state::
  [SHUTTER_STATE_OPEN]:    'component.cover.entity_component._.state.open',
  [SHUTTER_STATE_CLOSED]:  'component.cover.entity_component._.state.closed',
  [SHUTTER_STATE_CLOSING]: 'component.cover.entity_component._.state.closing',
  [SHUTTER_STATE_OPENING]: 'component.cover.entity_component._.state.opening',
  [ACTION_SHUTTER_OPEN]:       'ui.card.cover.open_cover',
  [ACTION_SHUTTER_OPEN_TILT]:  'ui.card.cover.open_cover_tilt',
  [ACTION_SHUTTER_STOP]:       'ui.card.cover.stop_cover',
  [ACTION_SHUTTER_CLOSE]:      'ui.card.cover.close_cover',
  [ACTION_SHUTTER_CLOSE_TILT]: 'ui.card.cover.close_cover_tilt',

  [UNAVAILABLE]: 'state.default.unavailable',
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
        flex-flow: var(--esc-flex-flow-middle);
        justify-content: center;
        align-items: center;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
      }
      .${ESC_CLASS_BUTTONS} {
        display: flex;
        flex: none;
        flex-flow: var(--esc-buttons-flex-flow);
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
        margin: 2px;
        justify-content: center;
        position: relative;
        align-items: center;
        background-color: var(--esc-window-background-color);
        background-image: var(--esc-window-background-image);
        background-size: cover;
        background-position: center;
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: var(--esc-selector-flex-basis);
      }
      .${ESC_CLASS_SELECTOR_PICTURE} {
        width: var(--esc-window-width);
        height: var(--esc-window-height);
        max-width: 100%;
        z-index: ${Z_INDEX_PICTURE};
        justify-content: center;
        position: relative;
        margin: auto;
        line-height: 0;
        overflow: hidden; /* prevents image overflow */
        image-rendering: auto;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
        image-rendering: -webkit-optimize-contrast;
      }
      .${ESC_CLASS_SELECTOR_PICTURE}>img {
        justify-content: center;
        margin: auto;
        width: 100%;
        height: 100%;
      }
      .${ESC_CLASS_SELECTOR_PICKER} {
        z-index: ${Z_INDEX_PICKER};
        position: absolute;
        left: -50%;
        width: 100%;
        top: var(--esc-picker-top);
        height: var(--esc-picker-height);
        cursor: pointer;
        transform-origin: center;
        transform: var(--esc-transform-picker);
        touch-action: none;
        user-select: none;
      }
      .${ESC_CLASS_SELECTOR_SLIDE} {
        z-index: ${Z_INDEX_SLIDE};
        text-align: start;` /* align to left, solves #104 */ +`
        position: absolute;
        left: -50%;
        width: 100%;
        overflow: hidden;
        bottom: 100%;
        height: var(--esc-slide-height);
        transform-origin: bottom;
        transform: var(--esc-transform-slide);
        image-rendering: auto;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
        image-rendering: -webkit-optimize-contrast;
      }
      .${ESC_CLASS_SELECTOR_SLIDE_MAIN} {
        height: var(--esc-slide-main-height);
        background-position: var(--esc-slide-background-main-position);
        background-image: var(--esc-slide-background-main-image);
        background-color: var(--esc-slide-background-main-color);

        background-repeat: repeat;
        background-size: var(--esc-slide-background-main-size);
        transform: var(--esc-transform-undo-rotate);
      }
      .${ESC_CLASS_SELECTOR_SLIDE_EDGE} {
        height: var(--esc-slide-edge-height);
        background-position: var(--esc-slide-background-edge-position);
        background-image: var(--esc-slide-background-edge-image);
        background-color: var(--esc-slide-background-edge-color);

        background-repeat: repeat;
        background-size: var(--esc-slide-background-edge-size);
      }
      .${ESC_CLASS_SELECTOR_PARTIAL} {
        z-index: ${Z_INDEX_PARTIAL};
        position: absolute;
        top: 0;
        ttop: var(--esc-partial-top);
        left: -50%;
        width: 100%;
        height: 1px;
        background-color: grey;
        transform-origin: center center;
        transform: var(--esc-transform-partial);
      }
      .${ESC_CLASS_MOVEMENT_OVERLAY} {
        z-index: ${Z_INDEX_OVERLAY};
        display: var(--esc-movement-overlay-display);

        top : 0;
        height: 100%;
        width: 100%;
        position: absolute;
        background-color: rgba(0,0,0,0.3);
        text-align: center;
        --mdc-icon-size: 60px;
        transform-origin: center center;
      }
      .${ESC_CLASS_MOVEMENT_UP},
      .${ESC_CLASS_MOVEMENT_DOWN} {
        z-index: ${Z_INDEX_MOVEMENT_ICON} !important;
        transform: var(--esc-transform-movement);
        position: absolute;
        display: block;
      }
      .${ESC_CLASS_MOVEMENT_UP} {
        display: var(--esc-movement-overlay-up-display);
      }
      .${ESC_CLASS_MOVEMENT_DOWN} {
        display: var(--esc-movement-overlay-down-display);
      }
      .${ESC_CLASS_TOP}, .${ESC_CLASS_BOTTOM} {
        text-align: center;
        padding-top: calc(8px*var(--esc-text-scale));
        padding-bottom: calc(8px*var(--esc-text-scale));
      }
      .${ESC_CLASS_TOP}>.${ESC_CLASS_LABEL} {
         display: var(--esc-display-name-top);
      }
      .${ESC_CLASS_BOTTOM}>.${ESC_CLASS_LABEL}  {
         display: var(--esc-display-name-bottom);
      }
      .${ESC_CLASS_TOP}>.${ESC_CLASS_POSITION} {
         display: var(--esc-display-position-top);
      }
      .${ESC_CLASS_BOTTOM}>.${ESC_CLASS_POSITION}  {
         display: var(--esc-display-position-bottom);
      }
      .${ESC_CLASS_LABEL} {
        display: inline-block;
        clear: both;
        font-size: calc(20px*var(--esc-text-scale));
        line-height: calc(30px*var(--esc-text-scale));
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
        clear: both;
        font-size: calc(14px*var(--esc-text-scale));
        line-height: calc(20px*var(--esc-text-scale));
        height: calc(20px*var(--esc-text-scale));
        border-radius: 5px;
        margin: 5px;

      }
      .${ESC_CLASS_POSITION}>span {
        background-color: var(--secondary-background-color);
        padding: 2px 5px 2px 5px;
      }
      .${ESC_CLASS_HA_ICON} {
        padding-bottom: 10px;
        transform: var(--esc-button-rotate);

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
      .${ESC_CLASS_TOP_LEFT}, .${ESC_CLASS_TOP_RIGHT} {
        --mdc-icon-size: var(--icon-size-wifi-battery, 24px);
        position: absolute;
        padding: 0 10px 10px 10px;
        text-align: center;
      }
      .${ESC_CLASS_TOP_LEFT} {
        color: var(--esc-top-left-color);
        left: 0;
      }
      .${ESC_CLASS_TOP_RIGHT} {
        color: var(--esc-top-right-color);
        right: 0;
      }
      .${ESC_CLASS_TOP_ICON_TEXT} {
        text-align: center;
        line-height: var(--esc-top-icon-text-line-height);
        font-size: var(--esc-top-icon-text-font-size);
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
      escImagesLoaded: {type: Boolean, state: true},

    };
  }

  constructor() {
    super(); //  mandetory by Lit-element
    console_log('Card constructor');

    this.escImagesLoaded = false;
    this.isShutterConfigLoaded = false;
    this.isResizeInProgress = false;
    this.screenOrientation= LANDSCAPE;
    this.messageManager= new MessageManager();

    console_log('Card constructor ready');
  }
  #defAllShutterConfig()
  {
    this.globalCfg = this.#buildConfig(CONFIG_DEFAULT,this.config);
    this.localCfgs = {};
    this.config.entities.map((currEntityCfg) => {
      let escCfg = this.#buildConfig(this.globalCfg,currEntityCfg);
      this.localCfgs[escCfg.entity] = new shutterCfg(this.hass,escCfg);
    });
    this.isShutterConfigLoaded = true;
  }

  #buildConfig(configBase,configSub)
  {
    const entityId = configSub.entity || 'General';
    if (typeof configSub !== 'object' || configSub === null){
      configSub={[CONFIG_ENTITY_ID]: configSub};
    }
    let uniqueKeys = this.getUniqueKeysFromObjects(configSub,configBase);
    // handle unkown keywords
    if (uniqueKeys.length > 0){
      uniqueKeys.forEach((key) =>
      {
        this.messageManager.addMessage(`Unknown keyword: [${key}], check your input!`,HA_ALERT_WARNING,entityId);
      });
    };
    // handle PRESET TYPE
    //
    let config = { ...ESC_PRESET[configSub[CONFIG_SHUTTER_PRESET]]} || {};

    Object.keys(configBase).forEach(keyMain =>{
      if (keyMain === CONFIG_SHUTTER_PRESET) return; // skip shutter type
      // first, handle deprecations ....
      let keySub = keyMain;

      if (keyMain in DEPRECATED && configSub[keyMain] != null){
        this.messageManager.addMessage(`Deprecated: [${keyMain}], use '${DEPRECATED[keyMain].new}'!`,HA_ALERT_WARNING,entityId);
      }
      if (keyMain in REMOVED && configSub[keyMain] != null){
        this.messageManager.addMessage(`Removed: [${keyMain}], use '${REMOVED[keyMain].new}'!`,HA_ALERT_ERROR,entityId);
      }
      // check already defined by deprecation handling ...
      //if (!config[keySub]) {
      if (!(keySub in config)) {
        config[keySub] =
          (typeof configSub[keyMain] === 'undefined' || configSub[keyMain]=== null || configSub[keyMain]==='null')
            ? configBase[keyMain]
            : configSub[keyMain];
      }
    });
    return config;
  }
  getUniqueKeysFromObjects(obj1, obj2) {
    // Get all keys from both objects
    const keysObj1 = Object.keys(obj1);
    const keysObj2 = Object.keys(obj2);

    // Check if obj1 has keys not in obj2
    const uniqueKeysInObj1 = keysObj1.filter(key => !keysObj2.includes(key));

    return uniqueKeysInObj1;
  }

/*
* OVERRIDE FUNCTIONS LIT ELEMENT
*/
  shouldUpdate(changedProperties) {

    console_log('Card shouldUpdate Start');
    let doUpdate =false;

    if (this.isShutterConfigLoaded){

      changedProperties.forEach((oldValue, propName) => {
        console_log(`Card shouldUpdate, Property ${propName} changed. oldValue: `,oldValue,`; new: `,this[propName]);
        // ******
        // TODO: improve select/search states
        // ******

        if (propName=='hass'){
          /* On hass update, check if there is a cover change */
            const liveStates = this[propName].states;

            Object.keys(this.localCfgs).forEach(entityId =>{
              const liveEntityFromHass = liveStates[entityId];
              if (liveEntityFromHass) {
                const cfg = this.localCfgs[entityId];
                let shutterState = `${liveEntityFromHass.state}-${liveEntityFromHass.attributes.current_position}`;
                if (shutterState != cfg.shutterState){
                  cfg.shutterState = shutterState;
                  doUpdate =true;
                }
                // check battery entity change
                const batteryEntityId = cfg.getBatteryEntity()?.getEntityId() ?? null;
                const liveBatteryEntityFromHass = liveStates[batteryEntityId];
                if (liveBatteryEntityFromHass != cfg.getBatteryEntity() || !liveBatteryEntityFromHass){
                  cfg.setBatteryEntity(this.hass,batteryEntityId);
                  cfg.batteryState = NOT_KNOWN.includes(liveBatteryEntityFromHass) ? UNAVAILABLE : liveBatteryEntityFromHass.state;
                  doUpdate =true;
                }
                // check signal entity change
                const signalEntityId = cfg.getSignalEntity()?.getEntityId() ?? null;
                const signalEntityFromHass = liveStates[signalEntityId];
                if (signalEntityFromHass != cfg.getSignalEntity() || !signalEntityFromHass){
                  cfg.setSignalEntity(this.hass,signalEntityId);
                  cfg.signalState = NOT_KNOWN.includes(signalEntityFromHass) ? UNAVAILABLE : signalEntityFromHass.state;
                  doUpdate =true;
                }
              }
            });

        }else{
          /* On any other property change, do the update */
          doUpdate =true;
        }
      });
    }
    console_log('Card shouldUpdate End: doUpdate=',doUpdate);
    console_log('Card shouldUpdate ========================\n');
    return doUpdate;
  //    return changedProperties.has('prop1');
  }
  willUpdate(changedProperties){
    super.willUpdate();
  }
  update(changedProperties)
  {
    console_log('Card Update');
    super.update(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      console_log(`Card Update, Property ${propName} changed. oldValue: ${oldValue}; new: ${this[propName]}`);

    });
    console_log('Card Update ready');
  }
  updated(changedProperties) {
    console_log('Card updated Start');
    super.updated(changedProperties);
    console_log('Card updated End');
  }
  firstUpdated() {
    console_log('Card firstUpdated Start');
    console_log('Card firstUpdated End');
  }
  connectedCallback() {
    super.connectedCallback();
    console_log('Card connectedCallback Start');

    /* get element of hui-view to detect resizing */
    Globals.huiView = findElementInBody(HA_HUI_VIEW);

    if (!this.isShutterConfigLoaded) {
      this.#defAllShutterConfig();
    }
    this.getGridOptionsInternal();
    this.messageManager.addMessage(`GridSize: rows: ${this.nbRows}, columns: ${this.nbCols}`,HA_ALERT_SUCCESS,'GridSize');
    this.startResizeObserver();
    console_log('Card connectedCallback End');
  }
  startResizeObserver() {

    const onResize = (entries) => {
      /* Things todo when risize is detected */
      console_log('Card Resize detected',Globals.huiView?.getBoundingClientRect());
      if (!this.isResizeInProgress) {
        entries.forEach(entry => {
          this.checkOrientation(entry); // check orientation on huiView resize
        });
      }
    }
    this.resizeObserver = new ResizeObserver(onResize);
    this.resizeObserver.observe(Globals.huiView);
  }
  // Check the orientation based on the window and div visibility
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  checkOrientation(element) {

    this.isResizeInProgress = true; // Set flag to indicate a resize operation is in progress

    // Get the window size
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Get the bounding rect of the element
    const rect = element.contentRect;

    // Calculate the visible width and height of the element within the viewport
    const visibleWidth = Math.max(0, Math.min(rect.right, windowWidth) - Math.max(rect.left, 0));
    const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));

    // Determine the orientation based on visible area and window size
    Globals.screenOrientation = {value: visibleWidth*1.4 > visibleHeight ? LANDSCAPE : PORTRAIT};
    this.screenOrientation = Globals.screenOrientation.value;
    console_log('Card Resize checkOrientation: screenOrientation:',this.screenOrientation);

    // After orientation check is done, reset the flag
    this.isResizeInProgress = false;
  }
  closestElement(selector, base = this) {
  // from https://stackoverflow.com/questions/54520554/custom-element-getrootnode-closest-function-crossing-multiple-parent-shadowd
    function __closestFrom(el) {
      if (!el || el === document || el === window) return null;
      let found = el.closest(selector);
      return found ? found : __closestFrom(el.getRootNode().host);
    }
    return __closestFrom(base);
  }

  render() {
    console_log('Card Render');
    if (!this.config || !this.hass || !this.isShutterConfigLoaded) {
      console.warn('ShutterCard  .. no content ..');
      return html`Waiting ...`;
    }
    let showMessages = this.messageManager.countMessages() && this.closestElement('.element-preview',this) !== null;

    let htmlout = html`
        ${showMessages ? html`${this.messageManager.displayGroupMessages('GridSize')} ` : ''}
        ${showMessages ? html`${this.messageManager.displayGroupMessages('General')} ` : ''}
        <ha-card .header=${this.config.title}>
          <div class="${ESC_CLASS_SHUTTERS}">
            ${this.config.entities.map( // TODO replace config by global.cfg ??
              (currEntity) => {
                const entityId = currEntity.entity || currEntity;

                this.localCfgs[entityId].setCoverEntity(this.hass,entityId);
                this.localCfgs[entityId].setBatteryEntity(this.hass,currEntity.battery_entity);
                this.localCfgs[entityId].setSignalEntity(this.hass,currEntity.signal_entity);

                return html`
                  <enhanced-shutter
                    .isShutterConfigLoaded=${this.isShutterConfigLoaded}
                    .hass=${this.hass}
                    .config=${currEntity}
                    .cfg=${this.localCfgs[entityId]}
                    .shutterState=${this.localCfgs[entityId].shutterState}
                    .batteryState=${this.localCfgs[entityId].batteryState}
                    .signalState=${this.localCfgs[entityId].signalState}
                    .screenOrientation=${this.screenOrientation}
                    .escImagesLoaded=${this.escImages.escImagesLoaded}
                    .escImages=${this.escImages}
                  >
                  </enhanced-shutter>
                  ${showMessages ? html`${this.messageManager.displayGroupMessages(entityId)} ` : ''}
                  <div class="${ESC_CLASS_SHUTTER_SEPERATE}"></div>
                `;$
              }
            )}
          </div>
        </ha-card>
      `;

    console_log('Card Render ready');
    return htmlout;
  }

  static get styles() {
    const CSS = `
     .${ESC_CLASS_SHUTTERS} {
      padding: 16px;
     }
    .${ESC_CLASS_SHUTTER_SEPERATE}:not(:last-child) {
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
  async setConfig(config)
  {
    //throw new Warn('Test warning');
    console_log('setconfig Start');

    if (!config.entities) {
      throw new Error('You need to define entities');
    }
    this.config = config;
    this.escImages = new EscImages(this.config);
    this.escImagesLoaded = await this.escImages.processImages();
  }
  getCardSize() {
    console_log('Card getCardSize');
    return this.config.entities.length + 1;
  }

  //Section layout : we compute the size of the card. (experimental)
  getGridOptions(){
    console_log('Card getGridOptions Start');
    /**
     * load config is needed.
     */
    if (!this.isShutterConfigLoaded)
      this.#defAllShutterConfig();

    let options = this.getGridOptionsInternal();
    console_log('Card getGridOptions End',options);
    return options;
  }




  getGridOptionsInternal(){

    const debug=0;

    console_log('Card getGridOptionsInternal');

    let cardSize;
    let seperate=0;

    if (this.config && this.config.entities && this.isShutterConfigLoaded){
      cardSize= this.gridSizeCardTitle();

      Object.keys(this.localCfgs).forEach(key =>{
        let cfg = this.localCfgs[key];

        let sizeCardTop = this.gridSizeCardTop(cfg);
        cardSize = this.gridAddVertical(cardSize,sizeCardTop);

        let sizeCardMiddle = this.gridSizeCardMiddle(cfg);
        cardSize = this.gridAddVertical(cardSize,sizeCardMiddle);

        let sizeCardBottom = this.gridSizeCardBottom(cfg);
        cardSize = this.gridAddVertical(cardSize,sizeCardBottom);

        cardSize = this.gridAddVertical(cardSize,{localWidthPx: 0,localHeightPx: seperate});
        seperate=8;  // size of seperation bar

      });
      // add padding
      cardSize = this.gridAddBoth(cardSize,{localWidthPx: 16,localHeightPx: 32});
    }else{
      console.warn('ShutterCard  .. no content ??..');
    }
    const gridContainer = this.closest('.container');
    /*
    *
    * Calculate the number of rows and columns
    * Based on the card size and the grid size
    * of the container
    * Looks not working OK.
    * Therefore use sizes from calculated cardSize and HA grid sizes
    */

//  if (gridContainer){
    if (false){
      const styles = getComputedStyle(gridContainer);
      const column = parseFloat(styles.gridTemplateColumns.split(" ", 1)[0]);
      const row = parseFloat(styles.gridTemplateRows.split(" ", 1)[0]);
      const column_gap = parseFloat(styles.columnGap);
      const row_gap = parseFloat(styles.rowGap);

      this.nbRows= Math.ceil((cardSize.localHeightPx+row_gap)/(row+row_gap));
      this.nbCols= Math.ceil((cardSize.localWidthPx+column_gap)/(column+column_gap));
    }
    else{
      this.nbRows= Math.ceil((cardSize.localHeightPx+HA_GRID_PX_GAP)/(HA_GRID_PX_HEIGHTt+HA_GRID_PX_GAP));
      this.nbCols= Math.ceil((cardSize.localWidthPx+HA_GRID_PX_GAP)/(HA_GRID_PX_WIDTH+HA_GRID_PX_GAP));
    }
    return {
      rows: this.nbRows,
      min_rows: this.nbRows-1,
      max_rows: this.nbRows+1,
      columns: this.nbCols,
      min_columns: this.nbCols-1,
      max_columns: this.nbCols+1,
    };
 }
  gridSizeCardTitle(){

    // HA basic sizes for calculations:

    const haCardTitleFontHeight= 24;
    const haTitleHeightPx = 76;
    const haTitleFont = 'Roboto, Noto, sans-serif';

    let localHeightPx=0;
    let localWidthPx=0;

    let titleSize;
    if (this.config.title){
      // TODO: Add Card title to globalCfg
      titleSize= getTextSize(this.config.title,haTitleFont,haCardTitleFontHeight);
      localHeightPx = haTitleHeightPx;
      localWidthPx  = titleSize.width;
    }
    return {localWidthPx,localHeightPx};
  }

  gridSizeCardTop(cfg){

    // HA basic sizes for calculations:

    const haTitleFont = 'Roboto, Noto, sans-serif';
    const shutterTitleHeight = 20;

    let localHeightPx=0;
    let localWidthPx =0;
    /*
    * Size shutter title row
    */
    if (!cfg.nameDisabled()){
      let titleSize = getTextSize(cfg.friendlyName(),haTitleFont,shutterTitleHeight,'400');
      let partHeightPx = 30;
      let partWidthPx = titleSize.width;

      localHeightPx += partHeightPx;
      localWidthPx  += partWidthPx;
    }
    /*
    * Size shutter-opening row
    */
    if (!cfg.openingDisabled() && !cfg.inlineHeader()){
      let pctSize = getTextSize(cfg.computePositionText(),haTitleFont,14);
      let partHeightPx = 30;  // including margin
      let partWidthPx = pctSize.width;
      localHeightPx += partHeightPx;
      localWidthPx = Math.max(localWidthPx,partWidthPx);
    }
    localHeightPx += 16; // padding
    return {localWidthPx,localHeightPx};
  }
  gridSizeCardMiddle(cfg){
    /*
    * size image
    */
    let sizeStandardButtons = this.gridSizeStandardButtons(cfg);
    let sizeTiltButtons = this.gridSizeTiltButtons(cfg);
    let sizeWindowImage = this.gridSizeWindowImage(cfg);
    let sizePartialOpenButtons = this.gridSizePartialOpenButtons(cfg);

    let cardSize;
    if (cfg.buttonsInRow()){
      cardSize = this.gridAddHorizontal(sizeStandardButtons,sizeTiltButtons);
      cardSize = this.gridAddHorizontal(cardSize,sizeWindowImage);
      cardSize = this.gridAddHorizontal(cardSize,sizePartialOpenButtons);
    }else{
      cardSize = this.gridAddVertical(sizeStandardButtons,sizeTiltButtons);
      cardSize = this.gridAddVertical(cardSize,sizeWindowImage);
      cardSize = this.gridAddVertical(cardSize,sizePartialOpenButtons);
    }
    return cardSize;
  }
  gridSizeCardBottom(cfg){

    // HA basic sizes for calculations:

    let localHeightPx=0;
    let localWidthPx =0;
    // TODO: Add definition
    localHeightPx += 16; // padding

    return {localWidthPx,localHeightPx};
  }
  gridSizeStandardButtons(cfg){
    // HA basic sizes for calculations:

    let localHeightPx=0;
    let localWidthPx =0;

    const haButtonSize = cfg.iconButtonSize();
    /*
    * size standard-buttons
    */
    if (!cfg.disableStandardButtons()) {
      if (cfg.buttonsInRow()){
        localHeightPx = haButtonSize*3;
        localWidthPx = haButtonSize;
      }else{
        localHeightPx = haButtonSize;
        localWidthPx = haButtonSize*3;
      }
    }
    return {localWidthPx,localHeightPx};
  };
  gridSizeTiltButtons(cfg){
    // HA basic sizes for calculations:

    let localHeightPx=0;
    let localWidthPx =0;

    const haButtonSize = cfg.iconButtonSize();

    /*
    * size tilt-buttons
    */
    if (cfg.showTilt() || cfg.partial()) {
      if (cfg.buttonsInRow()){
        if  (cfg.showTilt()) localHeightPx+=haButtonSize*2;
        if  (cfg.partial())  localHeightPx+=haButtonSize;
        localWidthPx += haButtonSize;
      }else{
        if  (cfg.showTilt()) localWidthPx+=haButtonSize*2;
        if  (cfg.partial())  localWidthPx+=haButtonSize;
        localHeightPx = haButtonSize;
      }
    }
    return {localWidthPx,localHeightPx};
  };
  gridSizeWindowImage(cfg){
    /*
    * size image
    */
    let localHeightPx = cfg.windowHeightPx();
    let localWidthPx = cfg.windowWidthPx();

    return {localWidthPx,localHeightPx};
  };
  gridSizePartialOpenButtons(cfg){
    // HA basic sizes for calculations:

    let localHeightPx=0;
    let localWidthPx =0;

    const haButtonSize = cfg.iconButtonSize();

    /*
    * size partial-open-buttons
    */
    if (!cfg.disablePartialOpenButtons()) {
      if (cfg.buttonsInRow()){
        localHeightPx += haButtonSize*3;
        localWidthPx += haButtonSize*2;
      }else{
        localHeightPx += haButtonSize*2;
        localWidthPx += haButtonSize*3;
      }
    }
    return {localWidthPx,localHeightPx};
  };
  gridAddVertical(size1,size2){
    return {localWidthPx: Math.max(size1.localWidthPx,size2.localWidthPx),localHeightPx: size1.localHeightPx+size2.localHeightPx};
  }
  gridAddHorizontal(size1,size2){
    return {localWidthPx: size1.localWidthPx+size2.localWidthPx,localHeightPx: Math.max(size1.localHeightPx,size2.localHeightPx)};
  }
  gridAddBoth(size1,size2){
    return {localWidthPx: size1.localWidthPx+size2.localWidthPx,localHeightPx: size1.localHeightPx+size2.localHeightPx};
  }

  // ############################################################################################################
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
        "name": "My First Enhanced Shutter Card",
        "top_offset_pct": 13,
        "button_up_hide_states": [
          SHUTTER_STATE_OPEN,
          SHUTTER_STATE_OPENING,
          SHUTTER_STATE_CLOSING
        ],
        "button_stop_hide_states": [
          SHUTTER_STATE_OPEN,
          SHUTTER_STATE_CLOSED,
          SHUTTER_STATE_PARTIAL_OPEN
        ],
        "button_down_hide_states": [
          SHUTTER_STATE_CLOSED,
          SHUTTER_STATE_OPENING,
          SHUTTER_STATE_CLOSING
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
      screenPosition: {state: true},       // for dragging shutter onscreen
      screenOrientation: {type: Object},   // for chnage in screen orientation  by resize window or rotate device
      shutterState: {type: String},        // for detecting state of shutter (open close etc)
      batteryState: {type: String},        // for detecting battery state change
      signalState: {type: String},         // for detecting signal state change
      //resizeDivShutterSelector: {type: Boolean}, // for detecting resize of shutter div by responsive design
      resizeDivShutterSelector: {state: true,type: Boolean}, // for detecting resize of shutter div by responsive design
      escImagesLoaded: {type: Boolean}
    };
  }
  constructor(){
    //console_log('Shutter constructor');
    super(); //  mandetory by Lit-element
    this.screenPosition=-1;
    this.resizeDivShutterSelector= false;
    this.actualScreenPosition=-1;
    this.positionText ='';
    this.action = '#';

    this[ESC_CLASS_SELECTOR]=null;

    console_log('Version:',VERSION);

    //console_log('Shutter constructor ready');
  }
  shouldUpdate(changedProperties)
  {
    changedProperties.forEach((oldValue, propName) => {
      console_log(`Shutter shouldUpdate, Property ${propName} changed. oldValue: `,oldValue,`; new: `,this[propName]);
    });
    return this.escImagesLoaded?true:false;
  }
  connectedCallback() {
    //console_log('Shutter connectedCallback');
    super.connectedCallback();

    //console_log('Shutter connectedCallback ready');
  }
  disconnectedCallback() {
    //console_log('Shutter disconnectedCallback');
    super.disconnectedCallback();
    if (this.resizeObserver) this.resizeObserver.disconnect();
    //console_log('Shutter disconnectedCallback ready');
  }
  update(changedProperties) {
    //console_log('Shutter Update');
    super.update(changedProperties);  // this calls the render() function.
    //console_log('Shutter Resize detected',this[ESC_CLASS_SELECTOR]?.getBoundingClientRect());
    //console_log('Shutter Update ready');
  }
  firstUpdated(changedProperties) {
    this[ESC_CLASS_SELECTOR] = findElement(this, `.${ESC_CLASS_SELECTOR}`);
    // NOTE: drop the old lit‐decorated @touchstart from the template
    //      so we can re‑attach it manually below
    const picker = findElement(this, `.${ESC_CLASS_SELECTOR_PICKER}`);
    if (picker) {
      // detach any lit‐added touchstart so we don’t double‐fire
      //picker.removeEventListener('touchstart', this.mouseDown);
      // re‐attach as non‑passive so event.preventDefault() works
      // NOTE: this is a workaround for the lit‐element bug where touchstart is always passive
      picker.addEventListener('touchstart', this.mouseDown, { passive: false });
      picker.addEventListener('pointerdown', this.mouseDown);
      picker.addEventListener('mousedown',  this.mouseDown);
    }

    this.startResizeObserver();
  }

  startResizeObserver() {

    const onResize = (entries) => {
      /* Things todo when resize is detected */
      entries.forEach(entry =>{
        // keep size due to start-up sizing problem in card-editor.
        // TODO this should be solved by some async/await, but don't know how (yet)
        this.actualWidthEdit = Math.floor(entry.contentRect.width);
        this.actualHeightEdit= Math.floor(entry.contentRect.height);
      })
      this.resizeDivShutterSelector = !this.resizeDivShutterSelector;
    }
    this.resizeObserver = new ResizeObserver(onResize);
    this.resizeObserver.observe(this[ESC_CLASS_SELECTOR]);
  }

  updated(changedProperties) {
    // Log the properties that were updated
    //console_log('Shutter Updated');
    super.updated(changedProperties);
    this.action='cover-update';
    //console_log('Shutter Updated ready');
  }
  render()
  {
    //console_log('Shutter Render',this.cfg.entityId(),this.cfg.friendlyName(),this.action,this.cfg);
    //console_log('Shutter Render actualGlobalWidthPx:',this[ESC_CLASS_SELECTOR]?.getBoundingClientRect().width);
    //console_log('Shutter Render actualWidth2:',this.actualGlobalWidthPx());
    //console_log('Shutter Resize detected',this[ESC_CLASS_SELECTOR]?.getBoundingClientRect());
    let entityId = this.cfg.entityId();
    let positionText;

    if (this.action=='user-drag'){
      // position from screen-dragging shown
      positionText =  this.positionText;
      this.actualScreenPosition = this.screenPosition
    }else{
      // position cover shown.
      positionText =  this.cfg.computePositionText();
      this.actualScreenPosition =  this.defScreenPositionFromCurrentPosition();
    }

    let htmlParts = new htmlCard(this,positionText);

    console_log('Shutter Render ready');
    return html`
      <div
        class=${ESC_CLASS_SHUTTER}
        data-shutter="${entityId}"
        style = "${htmlParts.defStyleVars()}"
      >
        ${htmlParts.showBatteryIcon()}
        ${htmlParts.showSignalIcon()}

        ${htmlParts.showTopDiv()}

        <div class="${ESC_CLASS_MIDDLE}">
          ${htmlParts.showLeftButtons()}
          ${htmlParts.showCentralWindow()}
          ${htmlParts.showRightButtons()}
        </div>

        ${htmlParts.showBottomDiv()}
      </div>
    `;
  }
  transformDiv(actualScreenPosition){
    // TODO: improve handling actualScreenPosition
    const size_x = this.actualGlobalWidthPx();
    const size_y = this.actualGlobalHeightPx();
    const size_global = new xyPair(size_x,size_y);
    const size_local=this.cfg.switchAxis(size_global);
    return [
      this.cfg.transformTranslate(size_global.x/2,size_global.y/2), // to mid-point
      this.cfg.transformRotate(), // rotate around div transform-origin
      this.cfg.transformScale(size_global.x,size_global.y), // correct local sizes
      this.cfg.transformTranslate(0,-size_local.y/2 + actualScreenPosition),  // Move to correct position
    ].join(SPACE);
  }
  transformPicker(actualScreenPosition){
    // TODO: improve handling actualScreenPosition
    const size_x = this.actualGlobalWidthPx();
    const size_y = this.actualGlobalHeightPx();
    const size_global = new xyPair(size_x,size_y);
    const size_local=this.cfg.switchAxis(size_global);
    return [
      this.cfg.transformTranslate(size_global.x/2,size_global.y/2), // to mid-point
      this.cfg.transformRotate(), // rotate around div transform-origin
      this.cfg.transformScalePicker(size_global.x,size_global.y), // correct local width of the Picker
      this.cfg.transformTranslate(0,-size_local.y/2 + actualScreenPosition),  // Move to correct position

    ].join(SPACE);
  }
  transformSlide(actualScreenPosition){
    // TODO: improve handling actualScreenPosition
    const size_x = this.actualGlobalWidthPx();
    const size_y = this.actualGlobalHeightPx();
    const size_global = new xyPair(size_x,size_y);
    const size_local=this.cfg.switchAxis(size_global);
    return [
      this.cfg.transformTranslate(size_global.x/2,size_global.y/2), // to mid-point
      this.cfg.transformRotate(), // rotate around div transform-origin
      //this.cfg.transformScale(size_global.x,size_global.y), // correct local width of the Picker
      this.cfg.transformScalePicker(size_global.x,size_global.y), // correct local width of the Picker
      this.cfg.transformTranslate(0,-size_local.y/2 + actualScreenPosition),  // Move to correct position

    ].join(SPACE);
  }
  transformUndoMainRotate(){

    let rotate = this.cfg.rotateMainImage() ? 0 : -this.cfg.getCloseAngle();
    let size_global;
    let size_x;
    let size_y;
    if (this.cfg.rotateMainImage()){
      size_x = 1;
      size_y = 1;
      rotate =  0;
    }else{
      size_x = this.actualGlobalWidthPx();
      size_y = this.mainSlideHeightPx();
      rotate = -this.cfg.getCloseAngle();
    }
    return [
      this.cfg.transformRotate(rotate), // rotate around div transform-origin
      this.cfg.transformScale(size_x,size_y), // correct local width of the main
    ].join(SPACE);
  }
  transformPartial(){
    const size_x = this.actualGlobalWidthPx();
    const size_y = this.actualGlobalHeightPx();
    const size_global = new xyPair(size_x,size_y);
    const size_local=this.cfg.switchAxis(size_global);
    const position = this.defScreenPositionFromCurrentPosition(this.cfg.partial());
    return [
      this.cfg.transformTranslate(size_global.x/2,size_global.y/2), // to mid-point
      this.cfg.transformRotate(), // rotate around div transform-origin
      this.cfg.transformScale(size_global.x,size_global.y), // correct local sizes
      this.cfg.transformTranslate(0,-size_local.y/2+position),  // Move to correct position
    ].join(SPACE);
  }
  transformMovement(){
    const size_x = this.actualGlobalWidthPx();
    const size_y = this.actualGlobalHeightPx();
    const size_global = new xyPair(size_x,size_y);
    const size_local=this.cfg.switchAxis(size_global);
    const position = this.offsetOpenedPx()+this.coverSizeMovingDirectionPx()/2.0;
    //const rotate = this.cfg.getCloseAngle()= this.invertPercentage()?180:0 // ##TODO: check if this is correct
    return [
      'translate(-50%, -50%)',
      this.cfg.transformTranslate(size_global.x/2,size_global.y/2), // to mid-point
      this.cfg.transformRotate(), // rotate around div transform-origin
      this.cfg.transformTranslate(0,-size_local.y/2+position),  // Move to correct position
    ].join(SPACE);
  }

  coverSizeMovingDirectionPx(){
    return this.cfg.verticalMovement() ? this.coverHeightPx():this.coverWidthPx();
  }
  windowSizeMovingDirectionPx(){
    return this.cfg.verticalMovement()
      ? this.actualGlobalHeightPx()
      : this.actualGlobalWidthPx();
  }

  coverHeightPx(){
    return this.actualGlobalHeightPx()-this.offsetClosedPx() - this.offsetOpenedPx();
  }
  coverWidthPx(){
    return this.actualGlobalWidthPx()-this.offsetClosedPx() - this.offsetOpenedPx();
  }
  shutterBottomSize(){
    const imageSize = this.escImages.getShutterBottomImageSize(this.cfg.entityId());
    return imageSize;
  };

  shutterBackgroundPosition(){

    const direction=this.cfg.unrollUnfoldDirection();
    const dirs={
      [DOWN]:BOTTOM,
      [UP]:TOP,
      [LEFT]:LEFT,
      [RIGHT]:RIGHT
    };
    const position = this.cfg.rotateMainImage() ? BOTTOM : dirs[direction] || BOTTOM;
    return position;
  }
  shutterMainBackgroundPosition(){

    const direction=this.cfg.unrollUnfoldDirection();
    const dirs={
      [DOWN]:BOTTOM,
      [UP]:TOP,
      [LEFT]:LEFT,
      [RIGHT]:RIGHT
    };
    const position = this.cfg.rotateMainImage() ? BOTTOM : dirs[direction] || BOTTOM;
    return position;
  }
  shutterEdgeBackgroundPosition(){
    const position = BOTTOM
    return position;
  }
/*
      const y_size_bottom= this.escImages.getShutterBottomImageSize(this.cfg.entityId()).y+'px';
      [DOWN]:'center bottom '+y_size_bottom,
      [UP]:'center top '+y_size_bottom,
      [LEFT]:'left '+y_size_bottom+' center',
      [RIGHT]:'right '+y_size_bottom+' center',
*/

  shutterSlatSizePercentage(){
    let imageSize = this.escImages.getShutterSlatImageSize(this.cfg.entityId())
    let imagePercentage;
    if (this.cfg.rotateMainImage()) {
      imagePercentage = this.sizePercentage(imageSize);
    }else{
      if (!this.cfg.verticalMovement()) imageSize =  new xyPair(imageSize.y, imageSize.x);
      imagePercentage = this.sizePercentage(imageSize);
      if (!this.cfg.verticalMovement()) imagePercentage = new xyPair(imagePercentage.y, imagePercentage.x);
    }
    let size = `${imagePercentage.x} ${imagePercentage.y}`;
    return size;
  }
  shutterBottomSizePercentage(){
    const imageSize = this.escImages.getShutterBottomImageSize(this.cfg.entityId())
    let size;
    if (this.cfg.stretchEdgeImage()){
      size= `100% ${imageSize.y}px`;
    }else{
       let imagePercentage = this.sizePercentage(imageSize);
       size = `${imagePercentage.x} ${imagePercentage.y}`;
    }
    return size;
  }
  sizePercentage(imageSize){
    //const min=Math.max(Math.min( imageSize.x,imageSize.y),6); // TODO why 6 here?
    let width;
    //if (!this.cfg.rotateMainImage()){
    if (this.cfg.verticalMovement()) {
      width = this.cfg.windowWidthPx();
    }else{
      width = this.cfg.windowHeightPx();
    }

    let factor = width / imageSize.x;
    let x = `calc(100% / (${width}/${imageSize.x}))`; // TODO stretch_bottom_image
    let y= imageSize.y+ 'px';
    let size = new xyPair(x,y);
    return size;

  }


  offsetOpenedPx(){
    return Math.round(this.cfg.offsetOpenedPct()/ 100 * this.windowSizeMovingDirectionPx());
  }
  offsetClosedPx(){
    return Math.round(this.cfg.offsetClosedPct())/ 100 * this.windowSizeMovingDirectionPx();
  }
  mainSlideHeightPx(){
    return this.slideHeightPx()-this.shutterBottomSize().y;
  }
  slideHeightPx(){
    return this.windowSizeMovingDirectionPx();
  }
  coverOpenedPx(){
    return this.offsetOpenedPx();
  }
  coverClosedPx(){
    const size_global = new xyPair(this.actualGlobalWidthPx(),this.actualGlobalHeightPx());
    const size_local=this.cfg.switchAxis(size_global);

    return size_local.y-this.offsetClosedPx();
  }


  defScreenPositionFromCurrentPosition(currentPosition=this.cfg.currentPosition()) {

    let visiblePosition = this.cfg.visiblePosition(currentPosition);
    let screenPosition = this.offsetOpenedPx() + (this.coverSizeMovingDirectionPx() * (100-visiblePosition) / 100) ;
    return screenPosition;

  }

  actualGlobalWidthPx() {
    let width;
    if (this.actualWidthEdit) {
      width= this.actualWidthEdit; // Should be solved by an async /await / promise ...
    }else{
      width = this[ESC_CLASS_SELECTOR]?.getBoundingClientRect()?.width ?? this.cfg.windowWidthPx();
    }
    return width;

  }
  actualGlobalHeightPx() {
    let height;
    if (this.actualHeightEdit) {
      height = this.actualHeightEdit; // Should be solved an by asymc /await / promise ...
    }else{
      height = this[ESC_CLASS_SELECTOR]?.getBoundingClientRect()?.height ?? this.cfg.windowHeightPx();
      //height = this.cfg.windowHeightPx();
    }
    return height;
  }

 //##########################################

  doHassMoreInfoOpen(entityIdValue) {
    if (!this.cfg.passiveMode()){
      let e = new Event('hass-more-info', { composed: true});
      e.detail= { entityId : entityIdValue};
      this.dispatchEvent(e);
    }
  }
  doOnclick(command, position=null) {

    this.action='user-pick';
    let entityId= this.cfg.entityId();

    if (position !==null) position = this.cfg.applyInvertPercentageToPosition(position);
    //command = this.cfg.applyInvertToCommand(command);

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
  getBasePickPoint(event){
    /* get picked point */
    this.basePickPoint = this.getPoint(event);
    /* get current shutter position on screen */
    this.basePickPoint.shutterScreenPos = this.defScreenPositionFromCurrentPosition();

    console_log('screenPos: basePickPoint:',this.basePickPoint);
  }

  getShutterPosFromScreenPos(screenPosition){
    let shutterPosition = SHUTTER_OPEN_PCT - Math.round((screenPosition - this.offsetOpenedPx()) * (100-this.cfg.offset()) / this.coverSizeMovingDirectionPx());
    return shutterPosition;
  }

  getScreenPosFromPickPoint(pickPoint){
    let delta = {x: pickPoint.x - this.basePickPoint.x ,
                 y: pickPoint.y - this.basePickPoint.y};
    let delta_local = this.cfg.rotateBackOrtho(delta);

    let newScreenPosition =
      Math.round(boundary(
        this.basePickPoint.shutterScreenPos+delta_local.y,
        this.coverOpenedPx(),
        this.coverClosedPx()
    ));
    return newScreenPosition;
  }
  getPoint(event){
    let point ={
      x: event.pageX ,
      y: event.pageY,
      coord: new xyPair(event.pageX,event.pageY),
      movementVertical: this.cfg.verticalMovement(),
      closingDir: this.cfg.unrollUnfoldDirection()
    };
    return point;
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

    this.getBasePickPoint(event);

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
    // console_log('mouseMove: this.action',this.action);

    this.action='user-drag';
    this.screenPosition = this.getScreenPosFromPickPoint(this.getPoint(event)); // this.screenPosition triggers refresh
    let pointedShutterPosition = this.getShutterPosFromScreenPos(this.screenPosition);
    this.positionText = this.cfg.computePositionText(pointedShutterPosition);

  };

  mouseUp = (event) =>
  {
    console_log('mouseUp:',event.type,event);
    if (event.pageY === undefined) return;

    this.action='user-pick';
    this.removeEventListener('mousemove', this.mouseMove);
    this.removeEventListener('touchmove', this.mouseMove);
    this.removeEventListener('pointermove', this.mouseMove);

    this.removeEventListener('mouseup', this.mouseUp);
    this.removeEventListener('touchend', this.mouseUp);
    this.removeEventListener('pointerup', this.mouseUp);

    let screenPosition = this.getScreenPosFromPickPoint(this.getPoint(event));
    let shutterPosition = this.getShutterPosFromScreenPos(screenPosition);

    if (this.cfg.isCoverFeatureActive(ESC_FEATURE_SET_POSITION)){
      // send position to shutter
      this.sendShutterPosition(this.cfg.entityId(), shutterPosition);
    }else{
      // no ESC_FEATURE_SET_POSITION, so send open- or close-action
      const actionToSend = (shutterPosition > 50) ? ACTION_SHUTTER_OPEN : ACTION_SHUTTER_CLOSE;
      this.callHassCoverService(this.cfg.entityId(),actionToSend);
    }
  };

  sendShutterPosition( entityId, position)
  {
    this.callHassCoverService(entityId,ACTION_SHUTTER_SET_POS, { position: this.cfg.applyInvertPercentageToPosition(position) });
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
  #coverEntity=null;
  #batteryEntity=null;
  #signalEntity=null;
  #localize={};
  shutterState = NONE;
  batteryState = NONE;
  signalState = NONE;

  constructor(hass,escConfig)
  {
    this.shutterState = NONE;
    this.batteryState = NONE;
    this.signalState =  NONE;
    let entityId = this.entityId(escConfig[CONFIG_ENTITY_ID] ? escConfig[CONFIG_ENTITY_ID] : escConfig);

      this.#setLocalize(hass.localize);
      this.setCoverEntity(hass,entityId);

      this.setBatteryEntity(hass,escConfig[CONFIG_BATTERY_ENTITY_ID]);
      this.setSignalEntity(hass,escConfig[CONFIG_SIGNAL_ENTITY_ID]);

      this.friendlyName(escConfig[CONFIG_NAME] || this.getCoverEntity()?.getFriendlyName() || UNKNOWN);

      this.invertPercentage(escConfig[CONFIG_INVERT_PCT]);
      this.invertOpenClose(escConfig[CONFIG_INVERT_OPEN_CLOSE]);

      this.passiveMode(escConfig[CONFIG_PASSIVE_MODE]);

      this.unrollUnfoldDirection(escConfig[CONFIG_CLOSING_DIRECTION]);

      let base_height_px = escConfig[CONFIG_BASE_HEIGHT_PX];
      let resize_height_pct = escConfig[CONFIG_RESIZE_HEIGHT_PCT];
      this.windowHeightPx(Math.round(boundary(resize_height_pct,ESC_MIN_RESIZE_HEIGHT_PCT,ESC_MAX_RESIZE_HEIGHT_PCT) / 100 * base_height_px));

      let base_width_px  = escConfig[CONFIG_BASE_WIDTH_PX];
      let resize_width_pct  = escConfig[CONFIG_RESIZE_WIDTH_PCT];
      this.windowWidthPx(Math.round(boundary(resize_width_pct, ESC_MIN_RESIZE_WIDTH_PCT ,ESC_MAX_RESIZE_WIDTH_PCT)  / 100 * base_width_px));

      this.rotateMainImage(escConfig[CONFIG_ROTATE_MAIN_SHUTTER_IMAGE]);
      this.stretchEdgeImage(escConfig[CONFIG_STRETCH_EDGE_SHUTTER_IMAGE]);

      this.scaleButtons(escConfig[CONFIG_SCALE_BUTTONS]);
      this.scaleIcons(escConfig[CONFIG_SCALE_ICONS]);
      this.scaleTexts(escConfig[CONFIG_SCALE_TEXTS]);

      this.partial(boundary(escConfig[CONFIG_PARTIAL_CLOSE_PCT]));
      this.offset(boundary(escConfig[CONFIG_OFFSET_IS_CLOSED_PCT]));

      this.offsetOpenedPct(boundary(escConfig[CONFIG_OFFSET_OPENED_PCT]));
      this.offsetClosedPct(boundary(escConfig[CONFIG_OFFSET_CLOSED_PCT]));

      this.canTilt(!!escConfig[CONFIG_CAN_TILT]);  // deprecated
      this.showTilt(!!escConfig[CONFIG_SHOW_TILT]);

      this.defButtonPosition(escConfig);

      this.titlePosition(escConfig[CONFIG_TITLE_POSITION]);  //deprecated
      this.namePosition(escConfig[CONFIG_NAME_POSITION]);
      this.nameDisabled(escConfig[CONFIG_NAME_DISABLED]);

      this.openingPosition(escConfig[CONFIG_OPENING_POSITION]);
      this.openingDisabled(escConfig[CONFIG_OPENING_DISABLED]);
      this.inlineHeader(escConfig[CONFIG_INLINE_HEADER]);

      this.alwaysPercentage(!!escConfig[CONFIG_ALWAYS_PCT]);
      this.disableEndButtons(!!escConfig[CONFIG_DISABLE_END_BUTTONS]);
      this.pickerOverlapPx(ESC_PICKER_OVERLAP_PX);
      this.disableStandardButtons(escConfig[CONFIG_DISABLE_STANDARD_BUTTONS]);
      this.disablePartialOpenButtons(escConfig[CONFIG_DISABLE_PARTIAL_OPEN_BUTTONS]);

      this.buttonStopHideStates(escConfig[CONFIG_BUTTON_STOP_HIDE_STATES]  ? escConfig[CONFIG_BUTTON_STOP_HIDE_STATES] : ESC_BUTTON_STOP_HIDE_STATES);
      this.buttonOpenHideStates(escConfig[CONFIG_BUTTON_OPENED_HIDE_STATES]  ? escConfig[CONFIG_BUTTON_OPENED_HIDE_STATES] : ESC_BUTTON_OPENED_HIDE_STATES);
      this.buttonCloseHideStates(escConfig[CONFIG_BUTTON_CLOSED_HIDE_STATES]  ? escConfig[CONFIG_BUTTON_CLOSED_HIDE_STATES] : ESC_BUTTON_CLOSED_HIDE_STATES);

      Object.preventExtensions(this);
  }

  /*
   ** getters/setters
   */
  #getCfg(key,value= null){
    if (value!== null && this.#cfg[key]!=value){
      this.#cfg[key]= value;
    }
    return this.#cfg[key];
  }
  isCoverFeatureActive(feature=ESC_FEATURE_ALL){
    return Boolean((this.getCoverEntity()?.getSupportedFeatures() ?? ESC_FEATURE_NO_TILT) & feature);
  }
  #setLocalize(localize){
    this.#localize=localize;
  }
  getLocalize(text){
    return this.#localize(text);
  }
  setCoverEntity(hass,entityId){
    this.#coverEntity = entityId ? new haEntity(hass,entityId) : null;
  }
  getCoverEntity(){
    return this.#coverEntity;
  }
  setBatteryEntity(hass,entityId){
    this.#batteryEntity = entityId ? new haEntity(hass,entityId) : null;
  }
  getBatteryEntity(){
    return this.#batteryEntity;
  }
  setSignalEntity(hass,entityId){
    this.#signalEntity = entityId ? new haEntity(hass,entityId) : null;
  }
  // Get SignalInfo
  getSignalEntity(){
    return this.#signalEntity;
  }


  batteryLevel(){
    let state = this.#batteryEntity?.getState()?? UNAVAILABLE;
    return NOT_KNOWN.includes (state) ? '?' : state ;
  }
  signalLevel(){
    let state = this.#signalEntity?.getState()?? UNAVAILABLE;
    return  NOT_KNOWN.includes (state) ? '?' : state ;
  }
  batteryUnit(){
    let unit = this.#batteryEntity?.getUnitOfMeasurement() ?? UNAVAILABLE;
    return NOT_KNOWN.includes (unit) ? '?' : unit ;
  }
  signalUnit(){
    let unit = this.#signalEntity?.getUnitOfMeasurement() ?? UNAVAILABLE;
    return NOT_KNOWN.includes (unit) ? '?' : unit ;
  }

  rotateOrtho(coord,angle=this.getCloseAngle()){
    switch (angle){
      case (90):
        return { x: -coord.y, y:  coord.x };
      case (180):
        return { x: -coord.x, y: -coord.y };
      case (270):
        return { x:  coord.y, y: -coord.x };
      case (360):
      case (0):
        return { x:  coord.x, y:  coord.y };
      default:
        throw new Error(`Angle must be a multiple of 90 degrees. (angle= ${angle})`);
    }
  }
  rotateBackOrtho(coord,angle=this.getCloseAngle()){
    switch (angle){
      case (90):
        return { x:  coord.y, y: -coord.x };
      case (180):
        return { x: -coord.x, y: -coord.y };
      case (270):
        return { x: -coord.y, y:  coord.x };
      case (360):
      case (0):
        return { x:  coord.x, y:  coord.y };
      default:
        throw new Error(`Angle must be a multiple of 90 degrees. (angle= ${angle})`);
    }
  }
  switchAxis(coord,angle=this.getCloseAngle()){
    switch (angle){
      case (90):
      case (270):
        return { x: coord.y, y: coord.x };
      case (360):
      case (180):
      case (0):
        return { x: coord.x, y: coord.y };
      default:
       throw new Error(`Angle must be a multiple of 90 degrees. (angle= ${angle})`);
    }
  }



  viewImageRotate(){
    let transform =this.transformRotate();
    return transform;
  }
  buttonRotate(){
    let r = this.getCloseAngle() % 180;
    let transform = this.transformRotate(r);
    return transform;
  }
  transformScalePicker(x = this.actualGlobalWidthPx(),y = this.actualGlobalHeightPx()){
    let transform =`${this.verticalMovement() ? '': `scale(${y/x},1)`}`;
    return transform;
  }
  transformScale(x = this.actualGlobalWidthPx(),y = this.actualGlobalHeightPx()){
    let transform =`${this.verticalMovement() ? '': `scale(${y/x},${x/y})`}`;
    return transform;
   }
  transformTranslate(x=this.actualGlobalWidthPx(),y=this.actualGlobalHeightPx()){
    let transform =`translate(${x}px,${y}px)`;
    return transform;
  }
  transformRotate(r = this.getCloseAngle()){
    let transform =`rotate(${r}deg)`;
    return transform;
  }



  buttonsPosition(value = null){
    return this.#getCfg(CONFIG_BUTTONS_POSITION,value);
  }
  disableStandardButtons(value = null){
    return this.#getCfg(CONFIG_DISABLE_STANDARD_BUTTONS,value);
  }
  disablePartialOpenButtons(value = null){
    const disable = this.#getCfg(CONFIG_DISABLE_PARTIAL_OPEN_BUTTONS,value);
    return disable || !this.isCoverFeatureActive(ESC_FEATURE_SET_POSITION);
  }
  disableEndButtons(value = null){
    return this.#getCfg(CONFIG_DISABLE_END_BUTTONS,value);
  }
  entityId(value = null){
    return this.#getCfg(CONFIG_ENTITY_ID,value);
  }
  friendlyName(value = null){
    return this.#getCfg(CONFIG_NAME,value);
  }
  invertPercentage(value = null){
    return this.#getCfg(CONFIG_INVERT_PCT,value);
  }
  invertOpenClose(value = null){
    return this.#getCfg(CONFIG_INVERT_OPEN_CLOSE,value);
  }
  openingDisabled(value = null){
    return this.#getCfg(CONFIG_OPENING_DISABLED,value);
  }
  passiveMode(value = null){
    let mode = this.#getCfg(CONFIG_PASSIVE_MODE,value)
    if (value!== null && mode) console.warn('Passive mode, no action');
    return mode;
  }
  windowHeightPx(value = null){
    return this.#getCfg(CONFIG_HEIGHT_PX,value);
  }
  windowWidthPx(value = null){
    return this.#getCfg(CONFIG_WIDTH_PX,value);
  }
  partial(value = null){
    // partial value should be entered in the defined shutter-percentage setting (inverted or not)
    // and is stored in the config as non-inverted.
    if (value !== null) value =this.applyInvertPercentageToPosition(value);
    var partial = this.#getCfg(CONFIG_PARTIAL_CLOSE_PCT,value);
    if (partial == SHUTTER_OPEN_PCT ||  partial == SHUTTER_CLOSED_PCT) partial = 0;

    // only when cover can set position
    return this.isCoverFeatureActive(ESC_FEATURE_SET_POSITION) ? partial : 0;
  }
  offset(value = null){
    if (value !== null && value !=0) value =this.applyInvertPercentageToPosition(value);
    return this.#getCfg(CONFIG_OFFSET_IS_CLOSED_PCT,value);
  }
  rotateMainImage(value = null){
    return this.#getCfg(CONFIG_ROTATE_MAIN_SHUTTER_IMAGE,value);
  }
  stretchEdgeImage(value = null){
    return this.#getCfg(CONFIG_STRETCH_EDGE_SHUTTER_IMAGE,value);
  }
  scaleButtons(value = null){
    return this.#getCfg(CONFIG_SCALE_BUTTONS,value);
  }
  scaleIcons(value = null){
    return this.#getCfg(CONFIG_SCALE_ICONS,value);
  }
  scaleTexts(value = null){
    return this.#getCfg(CONFIG_SCALE_TEXTS,value);
  }
  offsetOpenedPct(value = null){
    return this.#getCfg(CONFIG_OFFSET_OPENED_PCT,value);
  }
  offsetClosedPct(value = null){
    return this.#getCfg(CONFIG_OFFSET_CLOSED_PCT,value);
  }


  // TODO: setting can_tilt should be show_tilt. can_tilt() should depend on ESC_FEATURE_OPEN_TILT and/or ESC_FEATURE_CLOSE_TILT
  showTilt(value=null){
    return (this.canTilt()|| this.#getCfg(CONFIG_SHOW_TILT,value)) && this.isCoverFeatureActive(ESC_FEATURE_OPEN_TILT | ESC_FEATURE_CLOSE_TILT) ;
  }
  canTilt(value = null){
    return this.#getCfg(CONFIG_CAN_TILT,value );
  }


  unrollUnfoldDirection(value = null){
    return this.#getCfg(CONFIG_CLOSING_DIRECTION,value);
  }
  nameDisabled(value = null){
    return this.#getCfg(CONFIG_NAME_DISABLED,value);
  }
  buttonStopHideStates(value = null){
    return this.#getCfg(CONFIG_BUTTON_STOP_HIDE_STATES,value);
  }
  buttonOpenCloseHideStates(upDown){
    if (upDown == UP) return this.buttonOpenHideStates();
    if (upDown == DOWN) return this.buttonCloseHideStates();
  }



  buttonOpenHideStates(value = null){
    return this.#getCfg(CONFIG_BUTTON_OPENED_HIDE_STATES,value);
  }

  buttonCloseHideStates(value = null){
    return this.#getCfg(CONFIG_BUTTON_CLOSED_HIDE_STATES,value);
  }

  // deprecated
  titlePosition(value = null){
    return this.#getCfg(CONFIG_NAME_POSITION,value);
  }

  namePosition(value = null){
    return this.#getCfg(CONFIG_NAME_POSITION,value);
  }
  inlineHeader(value = null){
    return this.#getCfg(CONFIG_INLINE_HEADER,value);
  }
  openingDisabled(value = null){
    if (value !== null  && this.#getCfg(CONFIG_OPENING_DISABLED,value) === null)
    {
      value = this.#getCfg(CONFIG_NAME_DISABLED);
    }
    return this.#getCfg(CONFIG_OPENING_DISABLED,value);
  }
  openingPosition(value = null){
    if (value !== null  && this.#getCfg(CONFIG_OPENING_POSITION,value) === null)
    {
      value = this.#getCfg(CONFIG_NAME_POSITION);
    }
    return this.#getCfg(CONFIG_OPENING_POSITION,value);
  }
  alwaysPercentage(value = null){
    return this.#getCfg(CONFIG_ALWAYS_PCT,value);
  }
  pickerOverlapPx(value = null){
    return this.#getCfg(CONFIG_PICKER_OVERLAP_PX,value);
  }
  /*
  ** end getters/setters
  */
  verticalMovement(){
    return IS_VERTICAL.includes(this.unrollUnfoldDirection());
  }


  currentPosition(){
    // returns current position in non-inverted percentage
    let position;
    if (this.isCoverFeatureActive(ESC_FEATURE_SET_POSITION)){
      position = this.getCoverEntity()?.getCurrentPosition() ?? 0;
    }else{
      position= this.getCoverEntity()?.getState()==SHUTTER_STATE_OPEN ? SHUTTER_OPEN_PCT :  SHUTTER_CLOSED_PCT;
    }
    position = this.applyInvertPercentageToPosition(position);
    return position;
  }
  applyInvertPercentageToPosition(position){
    if (this.invertPercentage()) position = 100-position;
    return position;
  }
  applyInvertNone(setting){
    return setting;
  }
  applyInvertOpenCloseAndDirection(setting){
    setting = this.applyInvertOpenClose(setting);
    //setting = this.applyInvertPercentage(setting);
    setting = this.applyInvertDirection(setting);

    return setting;
  }
  applyInvertOpenCloseAndPercentage(setting){
    setting = this.applyInvertOpenClose(setting);
    setting = this.applyInvertPercentage(setting);
    //setting = this.applyInvertDirection(setting);

    return setting;
  }
  applyInvertPercentageAndDirection(setting){
    //setting = this.applyInvertOpenClose(setting);
    setting = this.applyInvertPercentage(setting);
    setting = this.applyInvertDirection(setting);

    return setting;
  }
  applyInvertAll(setting){
    setting = this.applyInvertOpenClose(setting);
    setting = this.applyInvertPercentage(setting);
    setting = this.applyInvertDirection(setting);

    return setting;
  }
  applyInvertDirection(setting){
    if (this.invertDirection()){
      setting = Object.keys(INVERT_OPEN_CLOSE).includes(setting) ? INVERT_OPEN_CLOSE[setting] : setting;
    }
    return setting;
  }
  invertDirection(){
    return this.unrollUnfoldDirection() == RIGHT || this.unrollUnfoldDirection() == UP;
  }

  applyInvertOpenClose(setting){
    if (this.invertOpenClose()) setting = Object.keys(INVERT_OPEN_CLOSE).includes(setting) ? INVERT_OPEN_CLOSE[setting] : setting;
    return setting;
  }
  applyInvertPercentage(setting){
    if (this.invertPercentage()) setting = Object.keys(INVERT_OPEN_CLOSE).includes(setting) ? INVERT_OPEN_CLOSE[setting] : setting;
    return setting;
  }
  applyInvertToCommand(command){
    if (this.invertPercentage()) {
      if (command == ACTION_SHUTTER_OPEN) command = ACTION_SHUTTER_CLOSE;
      else if (command == ACTION_SHUTTER_CLOSE) command = ACTION_SHUTTER_OPEN;
    }
    return command;
  }
  getCloseAngle(){
    const direction= {
      [DOWN]:0,
      [LEFT]:90,
      [RIGHT]:270,
      [UP]:180
    };
    return direction[this.unrollUnfoldDirection()] || 0;
  }

  getOrientation(){
    return Globals.screenOrientation.value; // global variable !!
  }

  positionToState(position = this.currentPosition()){
    // see for position and state definition:
    //  https://www.home-assistant.io/integrations/cover.template/#combining-value_template-and-position_template

    let state = this.getCoverEntity().getState() || UNAVAILABLE;
    let escState;
    if (state !== SHUTTER_STATE_OPENING && state !== SHUTTER_STATE_CLOSING) {
      //  shutter is not moving,
      if (position != SHUTTER_OPEN_PCT && position != SHUTTER_CLOSED_PCT){
        // shutter is not 0% or 100%
        escState= SHUTTER_STATE_PARTIAL_OPEN;
      }else{
        escState = position ? this.applyInvertOpenClose(SHUTTER_STATE_OPEN) : this.applyInvertOpenClose(SHUTTER_STATE_CLOSED);
      }
    }else  {
      escState = this.applyInvertOpenCloseAndPercentage(state);

    }
    // solve issue #54
    if (position == this.applyInvertPercentageToPosition(SHUTTER_OPEN_PCT) && escState == (this.applyInvertOpenCloseAndPercentage(SHUTTER_STATE_OPENING))) {

      escState = this.applyInvertAll(SHUTTER_STATE_OPEN);
    }else if (position == this.applyInvertPercentageToPosition(SHUTTER_CLOSED_PCT) && escState== (this.applyInvertOpenCloseAndPercentage(SHUTTER_STATE_CLOSING))) {
      escState = this.applyInvertAll(SHUTTER_STATE_CLOSED);
    }
    return escState;
  }

  buttonsLeftActive(){
    if (this.disableStandardButtons() && !this.showTilt() && !this.partial())
      return false;
    else
      return true;
  }

  buttonsRightActive(){
    if (this.disablePartialOpenButtons())
      return false;
    else
      return true;
  }
  buttonsInRow(){
    return this.getButtonsPosition() == LEFT || this.getButtonsPosition() == RIGHT;
  }
  buttonsContainerReversed(){
    return this.getButtonsPosition() == BOTTOM || this.getButtonsPosition() == RIGHT;
  }
  disabledGlobaly() {
    return false;
    // return (NOT_KNOWN.includes(this.getCoverEntity().getState()));
  }
  coverButtonUpDisabled(){
    let disabled = false;
    if (this.disableEndButtons()) {
      if (this.coverIsClosed()) {
        disabled = false;
      } else if (this.coverIsOpen()) {
        disabled = true;
      }
    }
    return disabled;
  }
  coverButtonDownDisabled(){
    let disabled = false;
    if (this.disableEndButtons()) {
      if (this.coverIsClosed()) {
        disabled = true;
      } else if (this.coverIsOpen()) {
        disabled = false;
      }
    }
    return disabled;
  }
  coverButtonDisabled(upDown){
    upDown = this.applyInvertDirection(upDown);
    if (upDown === UP) {
      if (this.invertDirection()) {
        return this.coverButtonDownDisabled();
      }else{
        return this.coverButtonUpDisabled();
      }
    }
    if (upDown === DOWN) {
      if (this.invertDirection()) {
        return this.coverButtonUpDisabled();
      }else{
        return this.coverButtonDownDisabled();
      }
    }
  }

  displayName(position){
      let displayType= this.inlineHeader() ? 'inline-block' : 'block';
      let display =(this.namePosition() != position || this.nameDisabled()) ? NONE : displayType;
      return display;
    }
  displayOpening(position){
    let displayType= this.inlineHeader() ? 'inline-block' : 'block';
    let display;
    if (this.inlineHeader()){
      display =(this.namePosition() != position || this.openingDisabled()) ? NONE : displayType;
    }else{
      display =(this.openingPosition() != position || this.openingDisabled()) ? NONE : displayType;
    }
    return display;
  }
  getButtonsPosition() {
    let position = this.buttonsPosition();
    if (position.startsWith(AUTO)) {
      const isLandscape = this.getOrientation() === LANDSCAPE;
      const isTopOrLeft = position === AUTO || position === AUTO_TL || position === AUTO_BL;
      position = isLandscape ? (isTopOrLeft ? LEFT : RIGHT) : (isTopOrLeft ? TOP : BOTTOM);
    }
    return position;
  }

  defButtonPosition(config) {
    const buttonsPosition = config[CONFIG_BUTTONS_POSITION]?.toLowerCase();
    this.buttonsPosition(POSITIONS.includes(buttonsPosition) ? buttonsPosition : ESC_BUTTONS_POSITION);
  }

  positionToText(position){
    let text='';
    if (this.isCoverFeatureActive(ESC_FEATURE_SET_POSITION)) {
      if (typeof position === 'number') {
        if (this.alwaysPercentage()) {
          text = position + '%';

        }else{
          let state= this.positionToState(this.applyInvertPercentageToPosition(position));
          if (state != SHUTTER_STATE_PARTIAL_OPEN){
            text = this.getLocalize(LOCALIZE_TEXT[(state)]);
            console.log('positionToText: state:',state,'text:',text, 'position',position);
          } else{
            text = position + '%';
          }
        }
      } else {
        text = this.getLocalize(LOCALIZE_TEXT[UNAVAILABLE]);
      }
    }else{
      if (this.applyInvertPercentageToPosition(position) > 50 ) {
        text = this.getLocalize(LOCALIZE_TEXT[this.applyInvertOpenClose(SHUTTER_STATE_OPEN)]);
      } else {
        text = this.getLocalize(LOCALIZE_TEXT[this.applyInvertOpenClose(SHUTTER_STATE_CLOSED)]);
      }
    }
    return text;
  }
  computePositionText(currentPosition =this.currentPosition()) {
    let positionText;
    if (NOT_KNOWN.includes(this.getCoverEntity().getState())){
      positionText = this.getLocalize(LOCALIZE_TEXT[UNAVAILABLE]);
    }else{
      const displayPosition = this.applyInvertPercentageToPosition(this.visiblePosition(currentPosition));
      positionText = this.positionToText(displayPosition);
      if (this.offset()>0 && this.offset()<100) {
        positionText += ` (${this.applyInvertPercentageToPosition(currentPosition)}%)`;
      }
    }
    return positionText;
  }
  visiblePosition(currentPosition) {
    const offset =this.offset();

    const visiblePosition = (offset)
      ? Math.max(0, Math.round((currentPosition - offset)     / (100-offset) * 100 ))
      : currentPosition;
    return visiblePosition;
  }
  coverIsOpen(){
    return (this.currentPosition() == SHUTTER_OPEN_PCT);
  }
  coverIsClosed(){
    return (this.currentPosition() == SHUTTER_CLOSED_PCT);
  }
  iconScaleFactor(){
    let scale_setting = this.scaleIcons();
    let scale = 1.0;
    switch(typeof(scale_setting)){
      case 'boolean':
        scale = scale_setting ? Math.min(this.windowWidthPx()/ESC_BASE_WIDTH_PX*1.25,1) : 1;
        break;
      case 'number':
        scale = boundary(scale_setting,0.1,2);
        break;
    }
    return scale;
  }
  textScaleFactor(){
    let scale_setting = this.scaleTexts();
    let scale = 1.0;
    switch(typeof(scale_setting)){
      case 'boolean':
        scale = scale_setting ? this.windowWidthPx()/ESC_BASE_WIDTH_PX : 1;
        break;
      case 'number':
        scale = boundary(scale_setting,0.1,2);
        break;
    }
    return scale;
  }
  iconScalePercent(){
    return Math.round(this.iconScaleFactor()*100)+'%';
  }

  iconButtonSize(){
    let size = ICON_BUTTON_SIZE;

    let scale_setting = this.scaleButtons();
    switch(typeof(scale_setting)){
      case 'boolean':
        if (scale_setting){
          let px;
          if (this.buttonsInRow()){
            px = this.windowHeightPx();
          }else{
            px = this.windowWidthPx();
          }
          size = Math.min(px/3.0,ICON_BUTTON_SIZE); // buttons fit in 1/3 of the size
        }
        break;
      case 'number':
        size = boundary(scale_setting,0.1,2)*ICON_BUTTON_SIZE;
        break;
    }

    return size;
  }
  iconSize(){
    let size = ICON_SIZE;

    let scale_setting = this.scaleButtons();
    switch(typeof(scale_setting)){
      case 'boolean':
        if (scale_setting){
          let px;
          if (this.buttonsInRow()){
            px = this.windowHeightPx();
          }else{
            px = this.windowWidthPx();
          }
          size = Math.min(px/(3.0*ICON_BUTTON_SIZE/ICON_SIZE),ICON_SIZE); // buttons fit in 1/3 of the size
        }
        break;
      case 'number':
        size = boundary(scale_setting,0.1,2)*ICON_SIZE;
        break;
    }
    return size;
  }
  iconSizeWifiBattery(){
    let size = ICON_SIZE;
    let scale_setting = this.scaleIcons();
    switch(typeof(scale_setting)){
      case 'boolean':
        if (scale_setting){
          let px = this.windowWidthPx();
          size = Math.min(px/6.0,ICON_SIZE);
        }
        break;
      case 'number':
        size = boundary(scale_setting,0.1,2)*ICON_SIZE;
        break;
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
    roundedLevel = isNaN(roundedLevel) ? -1 : Math.min(roundedLevel,100);

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
    return ICONCOLORS[roundedLevel];
  }
  signalIconColor(){
    let iconLevelIndex= this.signalLevelIndex();
    return ICONCOLORS[iconLevelIndex];
  }
  signalLevelIndex(){
    let level = this.signalLevel();
    let unit = this.signalUnit();
    if (unit != '?' && level != '?'){
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
    return 99;
  }
  signalLevelIcon(){
    let unit = this.signalUnit();
    let icon = 'mdi:wifi-strength-off-outline';
    if (unit != '?'){
      const iconStrength = {
        99: "alert-outline",
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


class htmlCard{

  constructor(enhancedShutter,positionText){
    this.enhancedShutter=enhancedShutter;
    this.cfg =enhancedShutter.cfg;
    this.positionText =positionText;
    this.actualScreenPosition = enhancedShutter.actualScreenPosition;
    this.escImages= enhancedShutter.escImages;
    this.cfg = enhancedShutter.cfg;
    //this.screenPosition =screenPosition;
  }

  defStyleVars(){
    let escState=this.cfg.positionToState();
    const viewImage=this.escImages.getViewImageSrc(this.cfg.entityId());

    // solves #103 see other lines with shutterSlatImage
    const shutterSlatImage=this.escImages.getShutterSlatImageSrc(this.cfg.entityId());
    const shutterBottomImage=this.escImages.getShutterBottomImageSrc(this.cfg.entityId());


    return `
      --mdc-icon-button-size: ${this.cfg.iconButtonSize()}${UNITY};
      --mdc-icon-size: ${this.cfg.iconSize()}${UNITY};
      --icon-size-wifi-battery: ${this.cfg.iconSizeWifiBattery()}${UNITY};
      --esc-display-name-top: ${this.cfg.displayName(TOP)};
      --esc-display-name-bottom: ${this.cfg.displayName(BOTTOM)};
      --esc-display-position-top: ${this.cfg.displayOpening(TOP)};
      --esc-display-position-bottom: ${this.cfg.displayOpening(BOTTOM)};
      --esc-flex-flow-middle: ${!this.cfg.buttonsInRow() ? 'column': 'row'}${this.cfg.buttonsContainerReversed() ? '-reverse' : ''} nowrap;
      --esc-window-width: ${this.cfg.buttonsInRow() ? '100%': this.cfg.windowWidthPx()+UNITY};
      --esc-window-height: ${this.cfg.windowHeightPx()+UNITY};
      --esc-window-background-image: ${viewImage.includes('.') ?  `url(${viewImage})` : ''};
      --esc-window-background-color: ${viewImage.includes('.') ? '' : `${viewImage}`};
      --esc-window-rotate: ${this.cfg.viewImageRotate()};
      --esc-button-rotate: ${this.cfg.buttonRotate()};

      --esc-transform-slide:  ${this.enhancedShutter.transformSlide(this.actualScreenPosition)};
      --esc-transform-undo-rotate:  ${this.enhancedShutter.transformUndoMainRotate()};
      --esc-transform-picker: ${this.enhancedShutter.transformPicker(this.actualScreenPosition)};

      --esc-transform-movement: ${this.enhancedShutter.transformMovement()};

      --esc-picker-top: -${this.cfg.pickerOverlapPx()+UNITY};
      --esc-picker-height: ${this.cfg.pickerOverlapPx()*2+UNITY};
      --esc-slide-height: ${this.enhancedShutter.slideHeightPx()+UNITY};
      --esc-slide-main-height: ${(this.enhancedShutter.mainSlideHeightPx())+UNITY};
      --esc-slide-edge-height: ${this.enhancedShutter.shutterBottomSize().y+UNITY};

      --esc-transform-partial: ${this.enhancedShutter.transformPartial()};

      --esc-buttons-flex-flow: ${!this.cfg.buttonsInRow() ? 'row' : 'column'} wrap;

      --esc-movement-overlay-display: ${(escState == SHUTTER_STATE_OPENING || escState == SHUTTER_STATE_CLOSING) ? 'block' : NONE};
      --esc-movement-overlay-up-display: ${escState == this.cfg.applyInvertOpenClose(SHUTTER_STATE_OPENING) ? 'block' : NONE};
      --esc-movement-overlay-down-display: ${escState == this.cfg.applyInvertOpenClose(SHUTTER_STATE_CLOSING) ? 'block' : NONE};
      --esc-movement-overlay-top: ${this.enhancedShutter.offsetOpenedPx()-7}${UNITY};
      --esc-movement-overlay-height: ${this.enhancedShutter.coverHeightPx() + 7}${UNITY};

      --esc-partial-top: ${this.enhancedShutter.defScreenPositionFromCurrentPosition(this.cfg.partial())}${UNITY};

      --esc-slide-background-main-image: ${shutterSlatImage.includes('.') ?  `url(${shutterSlatImage})` : ''};
      --esc-slide-background-edge-image: ${shutterBottomImage.includes('.') ?  `url(${shutterBottomImage})` : ''};

      --esc-slide-background-main-color: ${shutterSlatImage.includes('.') ? '' : `${shutterSlatImage}`};
      --esc-slide-background-edge-color: ${shutterBottomImage.includes('.') ? '' : `${shutterBottomImage}`};

      --esc-slide-background-main-size: ${this.enhancedShutter.shutterSlatSizePercentage()};
      --esc-slide-background-edge-size: ${this.enhancedShutter.shutterBottomSizePercentage()};

      --esc-slide-background-main-position: ${this.enhancedShutter.shutterMainBackgroundPosition()};
      --esc-slide-background-edge-position: ${this.enhancedShutter.shutterEdgeBackgroundPosition()};

      --esc-top-right-color: ${this.cfg.signalIconColor()};
      --esc-top-left-color: ${this.cfg.batteryIconColor()};

      --esc-top-icon-text-line-height: ${this.cfg.iconScalePercent()};
      --esc-top-icon-text-font-size: ${this.cfg.iconScalePercent()};
      --esc-text-scale: ${this.cfg.textScaleFactor()};

      --esc-selector-flex-basis: ${this.cfg.buttonsInRow() ? this.enhancedShutter.actualGlobalWidthPx():this.enhancedShutter.actualGlobalHeightPx()}${UNITY};
`;
  }


  showBatteryIcon(){
    return html`
        ${this.cfg.getBatteryEntity() ? html`
          <div class="${ESC_CLASS_TOP_LEFT}">
            <ha-icon
              icon=${this.cfg.batteryLevelIcon()}
              class="${ESC_CLASS_HA_ICON}"
            ></ha-icon>
            <div class="${ESC_CLASS_TOP_ICON_TEXT}">
              ${this.cfg.batteryLevelText()}
            </div>
          </div>
          ` : ''
        }
    `;
  }
  showSignalIcon(){
    return html`
        ${this.cfg.getSignalEntity() ? html`
          <div class="${ESC_CLASS_TOP_RIGHT}">
            <ha-icon
              class="${ESC_CLASS_HA_ICON}"
              icon=${this.cfg.signalLevelIcon()}
            ></ha-icon>
            <div class="${ESC_CLASS_TOP_ICON_TEXT}">
              ${this.cfg.signalLevelText()}
            </div>
          </div>
          ` : ''
        }
    `;
  }
  showTopDiv(){
    return this.showTopBottomDiv(ESC_CLASS_TOP);
  }
  showBottomDiv(){
    return this.showTopBottomDiv(ESC_CLASS_BOTTOM);
  }
  showTopBottomDiv(escClassName){
    return html`
        <div class="${escClassName}">
          <div class="${ESC_CLASS_LABEL} ${this.cfg.disabledGlobaly() ? `${ESC_CLASS_LABEL_DISABLED}` : ''}"
            @click="${() => this.enhancedShutter.doHassMoreInfoOpen(this.cfg.entityId())}"
          >
            ${this.cfg.friendlyName()}
            ${this.cfg.passiveMode() ? html`
              <span class="${ESC_CLASS_HA_ICON_LOCK}">
                <ha-icon icon="mdi:lock"></ha-icon>
              </span>
            `:''}
          </div>
          <div class="${ESC_CLASS_POSITION} ${this.cfg.disabledGlobaly() ? `${ESC_CLASS_LABEL_DISABLED}` : ''}">
            <span>${this.positionText}</span>
          </div>
        </div>
    `;
  }

  showButtonUp(){
    return this.showButtonUpDown(ESC_FEATURE_OPEN,ACTION_SHUTTER_OPEN,UP,'mdi:arrow-up');
   }
  showButtonDown(){
    return this.showButtonUpDown(ESC_FEATURE_CLOSE,ACTION_SHUTTER_CLOSE,DOWN,'mdi:arrow-down');
  }
  showButtonUpDown(feature,action,upDown,icon){
    return html`
      ${!this.cfg.disableStandardButtons() &&
        !this.cfg.buttonOpenCloseHideStates(upDown).includes(this.cfg.positionToState()) &&
         this.cfg.isCoverFeatureActive(feature)
      ? html`
        <ha-icon-button
          label="${this.cfg.getLocalize(LOCALIZE_TEXT[this.cfg.applyInvertOpenCloseAndDirection(action)])}"
          .disabled=${this.cfg.disabledGlobaly() || this.cfg.coverButtonDisabled(upDown)}
          @click=${()=> this.enhancedShutter.doOnclick(`${this.cfg.applyInvertPercentageAndDirection(action)}`)} >
          <ha-icon
            class="${ESC_CLASS_HA_ICON}"
            icon="${icon}">
          </ha-icon>
        </ha-icon-button>
      `
      : ''}
    `;
  }
  showButtonStop(){

    const action = ACTION_SHUTTER_STOP;
    const feature = ESC_FEATURE_STOP;
    const icon = "mdi:stop"

    return html`
      ${!this.cfg.disableStandardButtons() &&
        !this.cfg.buttonStopHideStates().includes(this.cfg.positionToState()) &&
         this.cfg.isCoverFeatureActive(feature)
      ? html`
        <ha-icon-button
          label="${this.cfg.getLocalize(LOCALIZE_TEXT[action])}"
          .disabled=${this.cfg.disabledGlobaly()}
          @click=${()=> this.enhancedShutter.doOnclick(`${action}`)} >
          <ha-icon
            class="${ESC_CLASS_HA_ICON}"
            icon="${icon}">
          </ha-icon>
        </ha-icon-button>
      `
      : ''
    }`;
  }
  showButtonPartial(){
    return html`
      ${this.cfg.partial()  /* TODO localize texts */
        ? html`
          <ha-icon-button
            label="Partially close (${SHUTTER_OPEN_PCT- this.cfg.partial()}% closed)"
            .disabled=${this.cfg.disabledGlobaly()}
            @click="${()=> this.enhancedShutter.doOnclick(`${ACTION_SHUTTER_SET_POS}`, this.cfg.partial())}" >
            <ha-icon class="${ESC_CLASS_HA_ICON}" icon="mdi:arrow-expand-vertical"></ha-icon>
          </ha-icon-button>
        ` : ''}
    `;
  }
  showButtonTilt(){
    return html`
      ${this.cfg.showTilt() ? html`
          <ha-icon-button
            label="${this.cfg.getLocalize(LOCALIZE_TEXT[ACTION_SHUTTER_OPEN_TILT])}"
            .disabled=${this.cfg.disabledGlobaly()}
            @click="${()=> this.enhancedShutter.doOnclick(`${ACTION_SHUTTER_OPEN_TILT}`)}">
            <ha-icon class="${ESC_CLASS_HA_ICON}" icon="mdi:arrow-top-right"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            label="${this.cfg.getLocalize(LOCALIZE_TEXT[ACTION_SHUTTER_CLOSE_TILT])}"
            .disabled=${this.cfg.disabledGlobaly()} @click="${()=> this.enhancedShutter.doOnclick(`${ACTION_SHUTTER_CLOSE_TILT}`)}">
            <ha-icon class="${ESC_CLASS_HA_ICON}" icon="mdi:arrow-bottom-left"></ha-icon>
          </ha-icon-button>
        ` : ''}
    `;
  }
  showLeftButtons(){
    return html`
      ${this.cfg.buttonsLeftActive()
      ? html`
        <div class="${ESC_CLASS_BUTTONS}">
          ${this.showButtonUp()}
          ${this.showButtonStop()}
          ${this.showButtonDown()}
        </div>
        <div class="${ESC_CLASS_BUTTONS}">
          ${this.showButtonPartial()}
          ${this.showButtonTilt()}
        </div>
        ` : html`
        <div class='blankDiv'></div>
      `}
    `;
  }
  showCentralWindow(){
    return html`
      <div class="${ESC_CLASS_SELECTOR}">
        <div class="${ESC_CLASS_SELECTOR_PICTURE}">


        ${this.escImages.getWindowImageSrc(this.cfg.entityId()) ? html`<img src= "${this.escImages.getWindowImageSrc(this.cfg.entityId())} ">` : ''}

          <div class="${ESC_CLASS_SELECTOR_SLIDE}">
            <div class="${ESC_CLASS_SELECTOR_SLIDE_MAIN}"></div>
            <div class="${ESC_CLASS_SELECTOR_SLIDE_EDGE}"></div>
          </div>
          ${this.cfg.partial() && !this.cfg.offset() //  show partial only if no offset is defined
            ? html`<div class="${ESC_CLASS_SELECTOR_PARTIAL}"></div>`
            : ''}
          <div class="${ESC_CLASS_MOVEMENT_OVERLAY}">
            <ha-icon class="${ESC_CLASS_MOVEMENT_UP}" icon="mdi:arrow-up">
            </ha-icon>
            <ha-icon class="${ESC_CLASS_MOVEMENT_DOWN}" icon="mdi:arrow-down">
            </ha-icon>
          </div>
        </div>
        ${this.cfg.isCoverFeatureActive(ESC_FEATURE_SET_POSITION)
          ? html`<div class="${ESC_CLASS_SELECTOR_PICKER}"></div>`
          : ''}
      </div>
    `;
  }
  showRightButtons(){
    return html`
      ${this.cfg.buttonsRightActive() && !this.cfg.disablePartialOpenButtons() /* TODO localize texts */
        ? html`
          <div class="${ESC_CLASS_BUTTONS}">
            <ha-icon-button
              label="Fully opened"
              .disabled=${this.cfg.disabledGlobaly() || this.cfg.coverButtonUpDisabled()}
              @click=${()=> this.enhancedShutter.doOnclick(`${ACTION_SHUTTER_SET_POS}`, SHUTTER_OPEN_PCT)}
              path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4Z">
            </ha-icon-button>
            <ha-icon-button
              label="Partially close (${25}% closed)"
              .disabled=${this.cfg.disabledGlobaly()}
              @click=${()=> this.enhancedShutter.doOnclick(`${ACTION_SHUTTER_SET_POS}`, 75)}
              path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9Z">
            </ha-icon-button>
            <ha-icon-button
              label="Partially close (${50}% closed)"
              .disabled=${this.cfg.disabledGlobaly()}
              @click=${()=> this.enhancedShutter.doOnclick(`${ACTION_SHUTTER_SET_POS}`, 50)}
              path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12Z">
            </ha-icon-button>
          </div>
          <div class="${ESC_CLASS_BUTTONS}">
            <ha-icon-button
              label="Partially close (${75}% closed)"
              .disabled=${this.cfg.disabledGlobaly()}
              @click=${()=> this.enhancedShutter.doOnclick(`${ACTION_SHUTTER_SET_POS}`, 25)}
              path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15Z">
            </ha-icon-button>
            <ha-icon-button
              label="Partially close (${90}% closed)"
              .disabled=${this.cfg.disabledGlobaly()}
              @click=${()=> this.enhancedShutter.doOnclick(`${ACTION_SHUTTER_SET_POS}`, 10)}
              path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15M8 18H16V20H8V18Z">
            </ha-icon-button>
            <ha-icon-button
              label="Fully closed"
              .disabled=${this.cfg.disabledGlobaly() || this.cfg.coverButtonDownDisabled()}
              @click=${()=> this.enhancedShutter.doOnclick(`${ACTION_SHUTTER_SET_POS}`, SHUTTER_CLOSED_PCT)}
              path="M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V20H8V18Z">
            </ha-icon-button>
          </div>
        `
        : html`
        <div class='blankDiv'></div>
      `}
    `;
  }
}

class xyPair{

  constructor(x,y){
    this.x=x;
    this.y=y;
  }
}

class haEntity{
  #state;
  #attributes;
  #lastChanged;
  #lastUpdated;
  #context;
  #entityId;
  constructor(hass,entityId)
  {
    let entityInfo = hass.states[entityId];
    if (typeof entityInfo !== "undefined") {
      this.#state = entityInfo.state;
      this.#attributes = entityInfo.attributes;
      this.#lastChanged = entityInfo.last_changed;
      this.#lastUpdated =  entityInfo.last_updated;
      this.#context =  entityInfo.context;
      this.#entityId = entityInfo.entity_id;
    }else{
      console.warn('haEntity: Entity [', entityId, '] not found');
      this.#state = UNAVAILABLE;
      this.#attributes = UNAVAILABLE;
      this.#entityId = entityId || UNAVAILABLE;
      this.#lastChanged = UNAVAILABLE;
      this.#lastUpdated = UNAVAILABLE;
      this.#context = UNAVAILABLE;
    }
  };

  getState(){
    return this.#state || UNAVAILABLE;
  }
  getAttributes(){
    return this.#attributes || UNAVAILABLE;
  }
  getEntityId(){
    return this.#entityId || UNAVAILABLE;
  }
  getCurrentPosition(){
    return this.getAttributes()?.current_position ?? null;
  }
  getFriendlyName(){
    return this.getAttributes()?.friendly_name ?? UNAVAILABLE;
  }
  getSupportedFeatures(){
    return this.getAttributes()?.supported_features ?? null;
  }
  getUnitOfMeasurement(){
    return this.getAttributes()?.unit_of_measurement ?? UNAVAILABLE;
  }
}
class MessageManager {
  constructor() {
    this.messageGroup = {};
  }

  // Add a message with subject
  addMessage(text, type= 'warning',subject = 'General') {
    const message = new Message(text, type, subject);
    if (!this.messageGroup[subject]) {
      this.messageGroup[subject] = { messages: []};
    }
    this.messageGroup[subject].messages.push(message);
    if (type == 'warning' || type == 'error'){
      console.warn(`Enhanced Shutter Card (${subject}): "${message.text}"`);
//    }else{
//      console.info(`Enhanced Shutter Card (${subject}): "${message.text}"`);
    }
  }

  // Display messages grouped by subject
  displayMessages() {
    let display= [];
    for (const subject in this.messageGroup) {
      const messages = this.messageGroup[subject].messages;

      if (messages.length > 0) {
        messages.forEach((message) => {
          //display.push (html`${message}`);
          display.push (message);
        });
      }
    }
    return html`${display.map(item => html`<ha-alert alert-type="${item.severity}">${item.text}</ha-alert>`)}`;
  }
  displayGroupMessages(subject) {
    let display= [];
    const messages = this.messageGroup[subject]?.messages ?? [];

    if (messages.length > 0) {
      messages.forEach((message) => {
          //display.push (html`${message}`);
          display.push (message);
      });
    }
    return html`${display.map(item => html`<ha-alert alert-type="${item.severity}">${item.text}</ha-alert>`)}`;
  }
  countMessages(){
    let counter=0;
    for (const subject in this.messageGroup) {
      counter += this.messageGroup[subject].messages.length;
    }
    return counter;
  }
}
class Message {
  constructor(text, severity = HA_ALERT_INFO, subject = 'General') {
    this.text = text;
    this.severity = severity;
    this.subject = subject;
  }
}
class EscImages{

  constructor(config){
    this.escImagesLoaded = false; // Mark images as not loaded
    this.images=[];
    this.imageTypes=[];
    this.width=[];
    this.height=[];
    var nImages=0;
    this.escImages={};
    let base_image_map = config[CONFIG_IMAGE_MAP] || ESC_IMAGE_MAP;
    let shutter_preset = config[CONFIG_SHUTTER_PRESET];

    //IMAGE_TYPES.forEach((image_type) =>
    for (const image_type of IMAGE_TYPES)
    {
      let imageRefs={};

      // Determine the initial image from CONFIG_DEFAULT
      let initImage = CONFIG_DEFAULT[image_type];

      // Check if a preset image exists for the shutter type, otherwise use the initial image
      let presetImage = (shutter_preset && ESC_PRESET[shutter_preset] && ESC_PRESET[shutter_preset][image_type]!== undefined)
        ? ESC_PRESET[shutter_preset][image_type]
        : initImage;

      // Use the config image if provided, otherwise use the preset image
      let configImage = (config[image_type]) ? config[image_type] : presetImage;

      // Resolve the final base image path or color
      let base_image = defImagePathOrColor(base_image_map, configImage, image_type);

      for (const entityConfig of config.entities)
      {
        let image_map = entityConfig[CONFIG_IMAGE_MAP] || base_image_map;
        const entityId = entityConfig[CONFIG_ENTITY_ID] || entityConfig;

        let image = NOT_KNOWN.includes(entityConfig[image_type])  ? base_image : defImagePathOrColor(image_map,entityConfig[image_type],image_type);
        if (image){
          let src = image.replace(/([^:]\/)\/+/g, "/").trim(); // Remove double slashes and trim
          var key;
          if (!(this.images.includes(src))){
            this.images[nImages]=src;
            this.imageTypes[nImages]=image_type;
            key= nImages++;
          }else{
            key = this.images.findIndex(element => element == src);
          }
          imageRefs[entityId]={entityId,key};
        }else{
          imageRefs[entityId]={entityId,key: -1};

        }
      };
      this.escImages[image_type]=imageRefs;

    };
  }
  getWindowImageSrc(entityId){
    return this.getImageSrc(CONFIG_WINDOW_IMAGE,entityId);
  }
  getViewImageSrc(entityId){
    return this.getImageSrc(CONFIG_VIEW_IMAGE,entityId);
  }
  getShutterSlatImageSrc(entityId){
    return this.getImageSrc(CONFIG_SHUTTER_SLAT_IMAGE,entityId);
  }
  getShutterBottomImageSrc(entityId){
    return this.getImageSrc(CONFIG_SHUTTER_BOTTOM_IMAGE,entityId);
  }
  getImageSrc(image_type,entityId){
    const key = this.escImages[image_type][entityId].key;
    if (key < 0 || key >= this.images.length) {
      return ''; // Return a default empty string if the key is invalid
    }
    return this.images[key];
  }

  getWindowImageSize(entityId){
    return this.getImageSize(CONFIG_WINDOW_IMAGE,entityId);
  }
  getViewImageSize(entityId){
    return this.getImageSize(CONFIG_VIEW_IMAGE,entityId);
  }
  getShutterSlatImageSize(entityId){
    let imageSize = this.getImageSize(CONFIG_SHUTTER_SLAT_IMAGE,entityId);
    return imageSize;
  }
  getShutterBottomImageSize(entityId){
    return this.getImageSize(CONFIG_SHUTTER_BOTTOM_IMAGE,entityId);
  }
  getImageSize(image_type, entityId) {
    const key = this.escImages[image_type][entityId]?.key;
    if (key == null || key < 0 || key >= this.images.length) {
      return new xyPair(0, 0);
    }
    const  xy = new xyPair(this.width[key] || 0, this.height[key] || 0);
    return xy;
  }

  async processImages() {
    try {
      const images=this.images;
      const imageDimensions = await readImageDimensions(this);
      imageDimensions.forEach((value,key,array)=>{
        //this.width[key] = value.width;
        //this.height[key]= value.height;
        this.width[value.index] = value.width;
        this.height[value.index]= value.height;
      });

      this.escImagesLoaded = true; // Mark images as loaded
    } catch (error) {
        console.error('Failed to load image dimensions:', error);
    }
    return this.escImagesLoaded;
  }


}
/**
 * global functions
 */

function boundary(value,val1=0,val2=100){
  let min = Math.min(val1,val2);
  let max = Math.max(val1,val2);
  return Math.max(min,Math.min(max,value));
}
function defImagePathOrColor(image_map,image,image_type)
{
  let result;
  if (!image) return '';

  if (!image.includes('.')){
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

  // Set the fontstyle
  context.font = `${fontWeight} ${fontHeight}px ${font}`;

  // Measure and return the width of the text
  let data = context.measureText(text);
  let width = Math.ceil(data.width);
  let height =  Math.ceil(data.fontBoundingBoxAscent + data.fontBoundingBoxDescent);
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


/**
 * function findElement() to find an element in DOM body, inluding shadow DOMs.
 * @param {*} selector
 * @returns
 */
function findElementInBody(selector) {
  return findElement(document.body,selector);
}


function findElement(base,selector) {
  // Search in the regular DOM
  let foundInDom = base.querySelector(selector);

  // If not found directly, search the element
  if (!foundInDom) foundInDom= recursiveSearch(base);
  //console_log('Found in recursiveSearch:',foundInDom.nodeName,foundInDom.className);
  return foundInDom;

  // Function to recursively search in shadow roots
  function searchInShadowDom(node) {
    // Check if the node has a shadow root
    if (node.shadowRoot) {
      // Search in the shadow root's DOM
      const foundInShadow = node.shadowRoot.querySelector(selector);
      if (foundInShadow) {
        //console_log('Found in recursiveSearch2:',foundInShadow.nodeName,foundInShadow.className);
        return foundInShadow;
      }
      // Recurse into any shadow DOMs within this shadow root
      const shadowHost = node.shadowRoot.host;
      for (const child of node.shadowRoot.children) {
        const result = searchInShadowDom(child);
        if (result) {
          //console_log('Found in recursiveSearch3:',result.nodeName,result.className);
          return result;
        }
      }
    }
    for (const child of node.children) {
      const result = recursiveSearch(child);
      if (result) {
        //console_log('Found in recursiveSearch4:',result.nodeName,result.className);
        return result;
      }
    }
    return null;
  }

  // Start the search in the whole document, including all shadow DOMs
  function recursiveSearch(node) {
    // Search in the node itself
    if (node.matches && node.matches(selector)) {
      //console_log('Found in recursiveSearch5:',node.nodeName,node.ClassName);
      return node;
    }

    // Recurse into child nodes, including shadow roots if present
    if (node.shadowRoot) {
      const result = searchInShadowDom(node);
      if (result) {
        //console_log('Found in recursiveSearch6:',result.nodeName,result.className);
        return result;
      }
    }

    // Recurse into child nodes (excluding shadow roots)
    for (const child of node.children) {
      const result = recursiveSearch(child);
      if (result) {
        //console_log('Found in recursiveSearch7:',result.nodeName,result.className);
        return result;
      }
    }

    return null;
  }

}
function displayNodePathToTopIncludingShadowAndClass(node) {
  let currentNode = node;
  const path = [];

  while (currentNode) {
    // If the node has a shadow root, include it in the path
    if (currentNode.host) {
        path.push(`#shadow-root`); // Include shadow root with its mode (open or closed)
        path.push(`${currentNode.host.nodeName}`); // Include shadow root with its mode (open or closed)
    }else{

      // Add the current node's tag name and class name (if any)
      let nodeDescription = currentNode.nodeName;

      // If the node has a className, add it to the description
      if (currentNode.className) {
          nodeDescription += `.${currentNode.className}`;
      }

      // Optionally, you can also add the ID, if you want
      if (currentNode.id) {
          nodeDescription += `#${currentNode.id}`;
      }

      path.push(nodeDescription);  // Add the node description to the path
    }
    // If we're inside a shadow DOM, go up to the shadow host
    //if (currentNode.shadowRoot) {
    if (currentNode.host) {
        currentNode = currentNode.host.parentNode  // Move to the shadow host
    } else {
        currentNode = currentNode.parentNode;  // Move to the regular parent node
    }
  }
}
function findParentNode(node, selector) {
  // Check if the node matches the selector itself
  if (node.matches(selector)) {
      return node;
  }
  let currentNode = node;

  while (currentNode && !currentNode.matches(selector)) {
    // If the node has a shadow root, include it in the path
    if (currentNode.host) {
        currentNode = currentNode.host.parentNode  // Move to the shadow host
    } else {
        currentNode = currentNode.parentNode;  // Move to the regular parent node
    }
  }
  return currentNode;

}
function console_log(...args){
  if (VERSION.indexOf('b') > 0){
    console.log(formatDate("HH:mm:ss.SSS"),...args);
  }
}
//*************************************************** */

function isUrl(fileName){
  // Check if the file is a URL (starts with http:// or https://)
  return fileName.includes('.');
}

async function readImageDimensions(escImages) {
  const promises = [];
  // Loop through each file URL in the provided array


  for (let i = 0; i < escImages.images.length; i++) {
    const fileUrl = escImages.images[i];
    if (isUrl(fileUrl)) {
      const promise = new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = function() {
            resolve({
                url: fileUrl,
                width: img.width,
                height: img.height,
                index: i // Store the index of the image in the original array
            });
        };
        img.onerror = function() {
//          hass.callService("persistent_notification", "create", {
//            title: "Notitie",
//            message: "Dit is mijn melding vanuit de card"
//          });
          const baseImage = `${ESC_IMAGE_MAP}/${CONFIG_DEFAULT[escImages.imageTypes[i]]}`;
          escImages.images[i]= baseImage; // Replace with default image on error

          console.warn(`Failed to load image: ${fileUrl}, using default image: ${baseImage}`);

          const fallbackImg = new Image();

          fallbackImg.onload = function () {
            resolve({
              url: baseImage,
              width: fallbackImg.width,
              height: fallbackImg.height,
              index: i
            });
          };
          fallbackImg.src = baseImage;
        };

        img.src = fileUrl; // Set the src to the image URL directly

      });
      promises.push(promise);
    }
  }

  try {
      // Wait for all image dimensions to be loaded
      const results = await Promise.all(promises);
      return results;  // Return results with dimensions
  } catch (error) {
      console.error('Error loading images:', error);
      throw error;
  }
}




