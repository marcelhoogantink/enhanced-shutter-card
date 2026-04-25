import {
  isRunningLocally,
} from './functions.js';


export const VERSION = 'v1.6.0b2';
export const IS_LOCAL = isRunningLocally();
export const DEBUG = VERSION.includes('b') && IS_LOCAL;
export const NONE = 'none';

export const HORIZONTAL = 'horizontal';
export const VERTICAL = 'vertical';
export const TOP = 'top';
export const BOTTOM = 'bottom';
export const UP = 'up';
export const DOWN = 'down';
export const LEFT = 'left';
export const RIGHT = 'right';
export const HA_TITLE_FONT = 'Roboto, Noto, sans-serif';
export const DISPLAY_DECIMALS = 0;

export const ESC_CLASS_BASE_NAME = 'esc-shutter';
export const ESC_CLASS_SHUTTER_SEPARATE = `${ESC_CLASS_BASE_NAME}-separate`
export const ESC_CLASS_TOP = `${ESC_CLASS_BASE_NAME}-${TOP}`;
export const ESC_CLASS_MIDDLE = `${ESC_CLASS_BASE_NAME}-middle`;
export const ESC_CLASS_BOTTOM = `${ESC_CLASS_BASE_NAME}-${BOTTOM}`;
export const ESC_CLASS_TOP_BOTTOM = `${ESC_CLASS_BASE_NAME}-${TOP}-${BOTTOM}`;
export const ESC_CLASS_LABEL = `${ESC_CLASS_BASE_NAME}-label`;
export const ESC_CLASS_POSITION = `${ESC_CLASS_BASE_NAME}-position`;
export const ESC_CLASS_LABEL_DISABLED = `${ESC_CLASS_LABEL}-disabled`;
export const ESC_CLASS_BUTTONS = `${ESC_CLASS_BASE_NAME}-buttons`;
export const ESC_CLASS_SHUTTER = `${ESC_CLASS_BASE_NAME}`;

export const ESC_CLASS_HA_ICON = `${ESC_CLASS_BASE_NAME}-ha-icon`;
export const ESC_CLASS_HA_ICON_LOCK = `${ESC_CLASS_HA_ICON}-lock`;
export const ESC_CLASS_HA_ICON_TILT = `${ESC_CLASS_HA_ICON}-tilt`;

export const ESC_CLASS_ICON_LEFT = `${ESC_CLASS_BASE_NAME}-icon-${LEFT}`;
export const ESC_CLASS_ICON_RIGHT = `${ESC_CLASS_BASE_NAME}-icon-${RIGHT}`;
export const ESC_CLASS_TOP_ICON_TEXT = `${ESC_CLASS_BASE_NAME}-icon-text`;


export const ESC_CLASS_SELECTOR = `${ESC_CLASS_BASE_NAME}-selector`;
export const ESC_CLASS_SELECTOR_PICTURE = `${ESC_CLASS_BASE_NAME}-selector-picture`;
export const ESC_CLASS_SELECTOR_PICKER = `${ESC_CLASS_BASE_NAME}-selector-picker`;
export const ESC_CLASS_SELECTOR_PARTIAL = `${ESC_CLASS_BASE_NAME}-selector-partial`;
export const ESC_CLASS_SELECTOR_SLIDE = `${ESC_CLASS_BASE_NAME}-selector-slide`;
export const ESC_CLASS_SELECTOR_SLIDE_SLATS = `${ESC_CLASS_SELECTOR_SLIDE}-slats`;
export const ESC_CLASS_SELECTOR_SLIDE_EDGE = `${ESC_CLASS_SELECTOR_SLIDE}-edge`;

export const ESC_CLASS_MOVEMENT_OVERLAY = `${ESC_CLASS_BASE_NAME}-movement-overlay`;
export const ESC_CLASS_MOVEMENT_UP = `${ESC_CLASS_BASE_NAME}-movement-up`;
export const ESC_CLASS_MOVEMENT_DOWN = `${ESC_CLASS_BASE_NAME}-movement-down`;


export const ESC_CLASS_TILT = `${ESC_CLASS_BASE_NAME}-tilt`;
export const ESC_CLASS_TILT_CONTAINER = `${ESC_CLASS_TILT}-container`;
export const ESC_CLASS_TILT_CLASS = `${ESC_CLASS_TILT}-class`;
export const ESC_CLASS_TILT_LINE = `${ESC_CLASS_TILT}-line`;
export const ESC_CLASS_TILT_SLAT1 = `${ESC_CLASS_TILT}-slat1`;
export const ESC_CLASS_TILT_SLAT2 = `${ESC_CLASS_TILT}-slat2`;
export const ESC_CLASS_TILT_SLAT3 = `${ESC_CLASS_TILT}-slat3`;
export const ESC_CLASS_TILT_EDGE = `${ESC_CLASS_TILT}-slat-edge`;

export const ESC_CLASS_SLIDER = `${ESC_CLASS_TILT}-slider`;
export const ESC_CLASS_SLIDER_WRAP = `${ESC_CLASS_SLIDER}-wrap`;
export const ESC_CLASS_SLIDER_CLASS = `${ESC_CLASS_SLIDER}-class`;


export const FONT_SIZE_LABEL = 20;
export const LINE_HEIGHT_LABEL = 30;
export const UNITY= 'px';
export const FONT_SIZE_POSITION = 14;
export const MARGIN_POSITION = 5;
export const ICON_SIZE = 24;
export const ICON_DIV_SIZE = 34;
export const LINE_HEIGHT_POSITION = 20;
export const SELECTOR_MARGIN = 4;

export const ESC_FEATURE_OPEN              = 0b00000001; // 1
export const ESC_FEATURE_CLOSE             = 0b00000010; // 2
export const ESC_FEATURE_SET_POSITION      = 0b00000100; // 4
export const ESC_FEATURE_STOP              = 0b00001000; // 8
export const ESC_FEATURE_OPEN_TILT         = 0b00010000; // 16
export const ESC_FEATURE_CLOSE_TILT        = 0b00100000; // 32
export const ESC_FEATURE_STOP_TILT         = 0b01000000; // 64
export const ESC_FEATURE_SET_TILT_POSITION = 0b10000000; // 128

export const ESC_FEATURE_ALL               = 0b11111111; // 255
export const ESC_FEATURE_NO_TILT           = 0b00001111; // 15

export const ACTION_SHUTTER_OPEN = 'open_cover';
export const ACTION_SHUTTER_OPEN_TILT = 'open_cover_tilt';
export const ACTION_SHUTTER_CLOSE = 'close_cover';
export const ACTION_SHUTTER_CLOSE_TILT = 'close_cover_tilt';
export const ACTION_SHUTTER_STOP = 'stop_cover';
export const ACTION_SHUTTER_STOP_TILT = 'stop_cover_tilt';
export const ACTION_SHUTTER_SET_POS = 'set_cover_position';
export const ACTION_SHUTTER_SET_POS_TILT = 'set_cover_tilt_position';

export const SHUTTER_STATE_OPEN = 'open';
export const SHUTTER_STATE_CLOSED = 'closed';
export const SHUTTER_STATE_OPENING = 'opening';
export const SHUTTER_STATE_CLOSING = 'closing';
export const SHUTTER_STATE_PARTIAL_OPEN = 'partial_open'; // speudo state


export const SHUTTER_STATES = [
  SHUTTER_STATE_OPEN,
  SHUTTER_STATE_CLOSED,
  SHUTTER_STATE_OPENING,
  SHUTTER_STATE_CLOSING
];


export const UNAVAILABLE = 'unavailable';

export const SHUTTER_OPEN_PCT = 100;
export const SHUTTER_CLOSED_PCT = 0;


export const LOCALIZE_TEXT= {
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
export const CONFIG_NAME = 'name';
export const CONFIG_PASSIVE_MODE = 'passive_mode';
export const CONFIG_IMAGE_MAP = 'image_map';
export const CONFIG_WINDOW_IMAGE = 'window_image';
export const CONFIG_VIEW_IMAGE = 'view_image';
export const CONFIG_SHUTTER_SLAT_IMAGE = 'shutter_slat_image';
export const CONFIG_SHUTTER_BOTTOM_IMAGE = 'shutter_bottom_image';
export const CONFIG_ROTATE_SLATS_SHUTTER_IMAGE = 'rotate_slat_image';
export const CONFIG_STRETCH_EDGE_SHUTTER_IMAGE = 'stretch_bottom_image';
export const CONFIG_BASE_HEIGHT_PX = 'base_height_px';
export const CONFIG_BASE_WIDTH_PX = 'base_width_px';
export const CONFIG_RESIZE_HEIGHT_PCT = 'resize_height_pct';
export const CONFIG_RESIZE_WIDTH_PCT = 'resize_width_pct';

export const IMAGE_TYPES = [
  CONFIG_WINDOW_IMAGE,
  CONFIG_VIEW_IMAGE,
  CONFIG_SHUTTER_SLAT_IMAGE,
  CONFIG_SHUTTER_BOTTOM_IMAGE,
];

export const HA_CARD_NAME = "enhanced-shutter-card";
export const HA_SHUTTER_NAME = `enhanced-shutter`;
export const HA_HUI_VIEW = 'hui-view';
export const SPACE = ' ';

export const UNKNOWN = 'unknown';
export const NOT_KNOWN =[UNAVAILABLE,UNKNOWN,undefined, null ];


export const MOUSEUP = 'mouse-up';
export const MOUSEDOWN = 'mouse-down';
export const MOUSEMOVE = 'mouse-move';

export const ADD_EVENT = 'add';
export const REMOVE_EVENT = 'remove';


export const IS_HORIZONTAL = [LEFT,RIGHT];
export const IS_VERTICAL = [UP,DOWN];

export const AUTO = 'auto';

export const AUTO_TL = `${AUTO}-${TOP}-${LEFT}`;
export const AUTO_TR = `${AUTO}-${TOP}-${RIGHT}`;
export const AUTO_BL = `${AUTO}-${BOTTOM}-${LEFT}`;
export const AUTO_BR = `${AUTO}-${BOTTOM}-${RIGHT}`;

export const POSITIONS =[AUTO,AUTO_BL,AUTO_BR,AUTO_TL,AUTO_TR,LEFT,RIGHT,TOP,BOTTOM,NONE];


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
export const HA_GRID_PX_HEIGHT = 56;
export const HA_GRID_PX_WIDTH = 24; // beween 17 and 30 ???
export const HA_GRID_PX_GAP = 8;

export const ENTITY_REGISTRY_LIST = "config/entity_registry/list";

export const DEVICE_CLASS_BATTERY = "battery";
export const DEVICE_CLASS_SIGNAL = "signal_strength";

export const DEVICES_CLASSES_SUB_ENTITIES =[DEVICE_CLASS_BATTERY, DEVICE_CLASS_SIGNAL];
export const PORTRAIT ="P";
export const LANDSCAPE ="L";

// derived from:
// https://github.com/home-assistant/core/blob/dev/homeassistant/components/cover/const.py
//               lines 20-27 (class CoverEntityFeatures(enum.IntFlag)):
export const ESC_CLASS_SHUTTERS = `${ESC_CLASS_BASE_NAME}s`;
export const ESC_CLASS_SHUTTER_FLEX = `${ESC_CLASS_BASE_NAME}-flex`;
export const ESC_CLASS_TITLE_DISABLED = `${ESC_CLASS_BASE_NAME}-title-disabled`
export const ESC_CLASS_TILT_BUTTONS = `${ESC_CLASS_BASE_NAME}-tilt-buttons`;
export const ESC_CLASS_BUTTONS_TOP = `${ESC_CLASS_BUTTONS}-${TOP}`;
export const ESC_CLASS_BUTTONS_BOTTOM = `${ESC_CLASS_BUTTONS}-${BOTTOM}`;
export const ESC_CLASS_BUTTONS_LEFT = `${ESC_CLASS_BUTTONS}-${LEFT}`;
export const ESC_CLASS_BUTTONS_RIGHT = `${ESC_CLASS_BUTTONS}-${RIGHT}`;
export const ESC_CLASS_BUTTON = `${ESC_CLASS_BASE_NAME}-button`;


export const ICON_BUTTON_SIZE = 36; // original: 48


export const CONFIG_TYPE = "type";
export const CONFIG_STACKED = "stacked";
export const CONFIG_SHUTTER_PRESET = 'shutter_preset';
export const CONFIG_TITLE = "title";
export const CONFIG_ENTITIES = 'entities';
export const CONFIG_ID = "id";
export const CONFIG_GROUP = "group";

export const HA_ALERT_SUCCESS = 'success';
export const HA_ALERT_WARNING = 'warning';
export const HA_ALERT_ERROR = 'error';
export const HA_ALERT_INFO = 'info';

export const CONFIG_DEBUG = 'debug';
export const CONFIG_ENTITY_ID = 'entity';
export const CONFIG_HEIGHT_PX = 'height_px';
export const CONFIG_WIDTH_PX = 'width_px';

export const CONFIG_SUPPORTED_FEATURES = 'supported_features';
export const CONFIG_BATTERY_ENTITY_ID = 'battery_entity';
export const CONFIG_SIGNAL_ENTITY_ID = 'signal_entity';

export const CONFIG_SHOW_GROUP_MEMBERS = 'show_group_members';


export const CONFIG_SCALE_ICONS = 'scale_icons';
export const CONFIG_SCALE_TEXTS = 'scale_texts';
export const CONFIG_SCALE_BUTTONS = 'scale_buttons';
export const CONFIG_OFFSET_OPENED_PCT = 'top_offset_pct'; // TODO  rename: top->opened
export const CONFIG_OFFSET_CLOSED_PCT = 'bottom_offset_pct'; // TODO rename bottom->closed
export const CONFIG_BUTTONS_POSITION = 'buttons_position';
export const CONFIG_NAME_POSITION = 'name_position';
export const CONFIG_OPENING_POSITION = 'opening_position';
export const CONFIG_ICONS_POSITION = 'icons_position';

export const CONFIG_INLINE_HEADER = 'inline_header';

export const CONFIG_INVERT_PCT       = 'invert_percentage'; // deprecated
export const CONFIG_INVERT_PCT_COVER = 'invert_percentage_cover'; // new
export const CONFIG_INVERT_PCT_UI    = 'invert_percentage_ui'; //

export const CONFIG_INVERT_PCT_TILT_UI    = 'invert_percentage_tilt_ui'; //
export const CONFIG_INVERT_PCT_TILT_COVER = 'invert_percentage_tilt_cover'; // new

export const CONFIG_INVERT_OPEN_CLOSE       = 'invert_open_close'; // deprecated
export const CONFIG_INVERT_OPEN_CLOSE_UI    = 'invert_open_close_ui'; // new
export const CONFIG_INVERT_OPEN_CLOSE_COVER = 'invert_open_close_cover';

export const CONFIG_SHOW_TILT = 'show_tilt'; // deprecated
export const CONFIG_TILT_ANGLE_MIN = 'tilt_angle_min';
export const CONFIG_TILT_ANGLE_MAX = 'tilt_angle_max';

export const CONFIG_CLOSING_DIRECTION = 'closing_direction'
export const CONFIG_PARTIAL_CLOSE_PCT = 'partial_close_percentage';
export const CONFIG_OFFSET_IS_CLOSED_PCT = 'offset_closed_percentage'; // TODO rename
export const CONFIG_ALWAYS_PCT = 'always_percentage';
//======
export const CONFIG_NAME_DISABLED = 'name_disabled'; //deprecated SHOW 1
export const CONFIG_OPENING_DISABLED = 'opening_disabled';  // deprecated SHOW 2
export const CONFIG_TILT_SLIDER_ONLY = 'tilt_slider_only';  // deprecated SHOW 4
export const CONFIG_DISABLE_STANDARD_BUTTONS = 'disable_standard_buttons'; // deprecated SHOW 5
export const CONFIG_DISABLE_PARTIAL_OPEN_BUTTONS = 'disable_partial_open_buttons'; // deprecated SHOW 6

export const CONFIG_SHOW_NAME = 'show_name'; // new    SHOW 1
export const CONFIG_SHOW_OPENING = "show_opening"; //new SHOW 2
export const CONFIG_SHOW_TILT_BUTTONS = 'show_tilt_buttons'; // SHOW 4
export const CONFIG_SHOW_STANDARD_BUTTONS = 'show_standard_buttons'; //SHOW 5
export const CONFIG_SHOW_PARTIAL_OPEN_BUTTONS = 'show_partial_open_buttons';//SHOW 6

export const CONFIG_SHOW_TILT_SLIDER = 'show_tilt_slider'; // new SHOW 3 new
export const CONFIG_SHOW_OPEN_CLOSE_SLIDER = 'show_open_close_slider'; // new SHOW 3 new
export const CONFIG_SHOW_WINDOW = 'show_window'; // SHOW 7 new
//======
export const CONFIG_DISABLE_END_BUTTONS = 'disable_end_buttons'; // grey out the endbuttons when not functional

export const CONFIG_PICKER_OVERLAP_PX = 'picker_overlap_px';
export const CONFIG_CURRENT_POSITION = 'current_position';

export const CONFIG_BUTTON_STOP_HIDE_STATES = 'button_stop_hide_states';
export const CONFIG_BUTTON_OPENED_HIDE_STATES = 'button_up_hide_states';  // TODO rename up->opened
export const CONFIG_BUTTON_CLOSED_HIDE_STATES = 'button_down_hide_states'; // TODO rename down->closed

export const invertBoolean = (value) => !value;
export const DEPRECATED={
  [CONFIG_NAME_DISABLED]: {new: CONFIG_SHOW_NAME, value: invertBoolean},
  [CONFIG_OPENING_DISABLED]: {new: CONFIG_SHOW_OPENING, value: invertBoolean},
  [CONFIG_TILT_SLIDER_ONLY]: {new: CONFIG_SHOW_TILT_BUTTONS, value: invertBoolean},
  [CONFIG_SHOW_TILT]: {new: CONFIG_SHOW_TILT_SLIDER}, // only name change, value remains the same
  [CONFIG_DISABLE_STANDARD_BUTTONS]: {new: CONFIG_SHOW_STANDARD_BUTTONS, value: invertBoolean},
  [CONFIG_DISABLE_PARTIAL_OPEN_BUTTONS]: {new: CONFIG_SHOW_PARTIAL_OPEN_BUTTONS, value: invertBoolean},
};
export const REMOVED={
  [CONFIG_INVERT_PCT]: {new: CONFIG_INVERT_PCT_COVER}, // april 2026 v1.6.0 // jan 2026 1.4.0-alpha
  [CONFIG_INVERT_OPEN_CLOSE]: {new: CONFIG_INVERT_OPEN_CLOSE_UI}, // april 2026 v1.6.0 // jan 2026 1.4.0-alpha
};
export const ICONCOLORS = {
      '-1': "grey",
      0: "red",
      1: "#FF4D00",// deep orange,
      2: "#FF7F00", // amber
      3: "orange",
      4: "#66B266", // sligly dim green
      5: "green",
    };

export const Z_INDEX_PARTIAL = 5;
export const Z_INDEX_PICKER  = 3;
export const Z_INDEX_PICTURE = 1;
export const Z_INDEX_MOVEMENT_ICON = 2;  // !important ??
export const Z_INDEX_SLIDE  = -1;
export const Z_INDEX_OVERLAY =-1;

export const ESC_ENTITY_ID = null;

export const ESC_BATTERY_ENTITY_ID = null;
export const ESC_SIGNAL_ENTITY_ID = null;

export const ESC_SHOW_GROUP_MEMBERS = false;

export const ESC_SUPPORTED_FEATURES = ESC_FEATURE_ALL;

export const ESC_AWNING = 'awning';
export const ESC_CURTAIN = 'curtain';
export const ESC_TEST = 'test';
export const ESC_COMPACT = 'compact';
export const ESC_SHADE = 'shade';
export const ESC_BLIND = 'blind';
export const ESC_ROLLER_SHUTTER = 'roller-shutter';
export const ESC_TYPES =
  [ESC_AWNING, ESC_CURTAIN, ESC_ROLLER_SHUTTER,ESC_SHADE,ESC_BLIND];

export const ESC_SHUTTER_PRESET = ESC_ROLLER_SHUTTER;
export const ESC_STACKED = VERTICAL;
export const ESC_NAME = null;
export const ESC_PASSIVE_MODE = false;
export const ESC_IMAGE_MAP = `/local/community/${HA_CARD_NAME}/images`;
export const ESC_IMAGE_WINDOW = 'esc-window.png';
export const ESC_IMAGE_VIEW = 'esc-view.png';
export const ESC_IMAGE_SHUTTER_SLAT   = 'esc-shutter-slat.png';
export const ESC_IMAGE_SHUTTER_BOTTOM = 'esc-shutter-bottom.png';
export const ESC_ROTATE_MAIN_SHUTTER_IMAGE = true; // true: rotate slat image, false: use slat image as is
export const ESC_STRETCH_EDGE_SHUTTER_IMAGE = true; // true: stretch bottom image, false: use bottom image as is
export const ESC_BASE_HEIGHT_PX = 150; // image-height
export const ESC_BASE_WIDTH_PX = 150;  // image-width
export const ESC_RESIZE_HEIGHT_PCT = 100;
export const ESC_RESIZE_WIDTH_PCT  = 100;

export const ESC_DEBUG = DEBUG || false;
export const ESC_SCALE_ICONS = true;
export const ESC_SCALE_TEXTS = false;
export const ESC_SCALE_BUTTONS = false;
export const ESC_OPENED_OFFSET_PCT = 13;
export const ESC_CLOSED_OFFSET_PCT = 0;
export const ESC_BUTTONS_POSITION = LEFT;
export const ESC_NAME_POSITION =TOP;
export const ESC_NAME_DISABLED = false;
export const ESC_SHOW_NAME = true;
export const ESC_OPENING_POSITION = TOP;
export const ESC_ICONS_POSITION = TOP;
export const ESC_OPENING_DISABLED = false;
export const ESC_SHOW_OPENING = true;
export const ESC_INLINE_HEADER = false;
export const ESC_INVERT_PCT_COVER = false;
export const ESC_INVERT_PCT_UI = false;
export const ESC_INVERT_OPEN_CLOSE_UI = false
export const ESC_INVERT_OPEN_CLOSE_COVER = false

export const ESC_INVERT_PCT_TILT_UI    = false;
export const ESC_INVERT_PCT_TILT_COVER = false;

export const ESC_TILT_SLIDER_ONLY = false; // deprecated
export const ESC_SHOW_OPEN_CLOSE_SLIDER = false;
export const ESC_SHOW_TILT_SLIDER = true;
export const ESC_SHOW_TILT_BUTTONS = true;

export const ESC_SHOW_TILT = true;
export const ESC_TILT_ANGLE_MIN = 0;
export const ESC_TILT_ANGLE_MAX = 180;

export const ESC_CLOSING_DIRECTION = DOWN;
export const ESC_PARTIAL_CLOSE_PCT = 0;
export const ESC_OFFSET_CLOSED_PCT = 0;
export const ESC_ALWAYS_PCT = false;
export const ESC_DISABLE_END_BUTTONS = false;
export const ESC_DISABLE_STANDARD_BUTTONS = false;
export const ESC_SHOW_STANDARD_BUTTONS = true;
export const ESC_DISABLE_PARTIAL_OPEN_BUTTONS = true;
export const ESC_SHOW_PARTIAL_OPEN_BUTTONS = false;
export const ESC_SHOW_WINDOW = true;
export const ESC_PICKER_OVERLAP_PX = 20;
export const ESC_CURRENT_POSITION = 0;

export const ESC_MIN_RESIZE_WIDTH_PCT  =  20;
export const ESC_MAX_RESIZE_WIDTH_PCT  = 500;
export const ESC_MIN_RESIZE_HEIGHT_PCT =  20;
export const ESC_MAX_RESIZE_HEIGHT_PCT = 500;

export const ESC_BUTTON_STOP_HIDE_STATES = [];
export const ESC_BUTTON_OPENED_HIDE_STATES = [];
export const ESC_BUTTON_CLOSED_HIDE_STATES = [];

export const INVERT_OPEN_CLOSE_SETTING ={
  [SHUTTER_STATE_OPEN]: SHUTTER_STATE_CLOSED,
  [SHUTTER_STATE_CLOSED]: SHUTTER_STATE_OPEN,
  [SHUTTER_STATE_OPENING]: SHUTTER_STATE_CLOSING,
  [SHUTTER_STATE_CLOSING]: SHUTTER_STATE_OPENING,
  [ACTION_SHUTTER_OPEN]: ACTION_SHUTTER_CLOSE,
  [ACTION_SHUTTER_CLOSE]: ACTION_SHUTTER_OPEN,
  [SHUTTER_OPEN_PCT]: SHUTTER_CLOSED_PCT,
  [SHUTTER_CLOSED_PCT]: SHUTTER_OPEN_PCT,
  [UP]: DOWN,
  [DOWN]: UP,
};

export const CONFIG_DEFAULT ={
  [CONFIG_SUPPORTED_FEATURES]: ESC_SUPPORTED_FEATURES,
  [CONFIG_TYPE]: "",
  [CONFIG_TITLE]: "",
  [CONFIG_ID]:"",
  [CONFIG_GROUP]: "",
  [CONFIG_ENTITIES]: "",

  [CONFIG_DEBUG]: ESC_DEBUG,
  [CONFIG_STACKED]: ESC_STACKED,

  [CONFIG_SHUTTER_PRESET]: ESC_SHUTTER_PRESET,
  [CONFIG_ENTITY_ID]: ESC_ENTITY_ID,
  [CONFIG_SHOW_GROUP_MEMBERS]: ESC_SHOW_GROUP_MEMBERS,

  [CONFIG_BATTERY_ENTITY_ID]: ESC_BATTERY_ENTITY_ID,
  [CONFIG_SIGNAL_ENTITY_ID]: ESC_SIGNAL_ENTITY_ID,

  [CONFIG_NAME]: ESC_NAME,
  [CONFIG_PASSIVE_MODE]: ESC_PASSIVE_MODE,
  [CONFIG_IMAGE_MAP]: ESC_IMAGE_MAP,
  [CONFIG_WINDOW_IMAGE]: ESC_IMAGE_WINDOW,
  [CONFIG_VIEW_IMAGE]: ESC_IMAGE_VIEW,
  [CONFIG_SHUTTER_SLAT_IMAGE]: ESC_IMAGE_SHUTTER_SLAT,
  [CONFIG_SHUTTER_BOTTOM_IMAGE]: ESC_IMAGE_SHUTTER_BOTTOM,
  [CONFIG_ROTATE_SLATS_SHUTTER_IMAGE]: ESC_ROTATE_MAIN_SHUTTER_IMAGE,
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
  [CONFIG_NAME_POSITION]: ESC_NAME_POSITION,
  [CONFIG_OPENING_POSITION]: ESC_OPENING_POSITION,
  [CONFIG_ICONS_POSITION]: ESC_ICONS_POSITION,
  [CONFIG_INLINE_HEADER]: ESC_INLINE_HEADER,

  [CONFIG_INVERT_PCT]   : ESC_INVERT_PCT_UI,
  [CONFIG_INVERT_PCT_UI]   : ESC_INVERT_PCT_UI,
  [CONFIG_INVERT_PCT_COVER]: ESC_INVERT_PCT_COVER,
  [CONFIG_INVERT_OPEN_CLOSE]   : ESC_INVERT_OPEN_CLOSE_UI,
  [CONFIG_INVERT_OPEN_CLOSE_UI]   : ESC_INVERT_OPEN_CLOSE_UI,
  [CONFIG_INVERT_OPEN_CLOSE_COVER]: ESC_INVERT_OPEN_CLOSE_COVER,

  [CONFIG_INVERT_PCT_TILT_UI]: ESC_INVERT_PCT_TILT_UI,
  [CONFIG_INVERT_PCT_TILT_COVER]: ESC_INVERT_PCT_TILT_COVER,

  [CONFIG_SHOW_TILT]: ESC_SHOW_TILT,  // deprecated
  [CONFIG_TILT_ANGLE_MIN]: ESC_TILT_ANGLE_MIN,
  [CONFIG_TILT_ANGLE_MAX]: ESC_TILT_ANGLE_MAX,

  [CONFIG_CLOSING_DIRECTION]: ESC_CLOSING_DIRECTION,
  [CONFIG_PARTIAL_CLOSE_PCT]: ESC_PARTIAL_CLOSE_PCT,
  [CONFIG_OFFSET_IS_CLOSED_PCT]: ESC_OFFSET_CLOSED_PCT,
  [CONFIG_ALWAYS_PCT]: ESC_ALWAYS_PCT,
  [CONFIG_DISABLE_END_BUTTONS]: ESC_DISABLE_END_BUTTONS,
// ===================
  [CONFIG_NAME_DISABLED]: ESC_NAME_DISABLED,   // deprecated
  [CONFIG_OPENING_DISABLED]: ESC_OPENING_DISABLED,  // deprecated
  [CONFIG_TILT_SLIDER_ONLY]: ESC_TILT_SLIDER_ONLY, // deprecated
  [CONFIG_DISABLE_STANDARD_BUTTONS]: ESC_DISABLE_STANDARD_BUTTONS, // deprecated
  [CONFIG_DISABLE_PARTIAL_OPEN_BUTTONS]: ESC_DISABLE_PARTIAL_OPEN_BUTTONS, // deprecated

  [CONFIG_SHOW_NAME]: ESC_SHOW_NAME, // replace
  [CONFIG_SHOW_OPENING]: ESC_SHOW_OPENING, // replace
  [CONFIG_SHOW_TILT_BUTTONS]: ESC_SHOW_TILT_BUTTONS, // replace
  [CONFIG_SHOW_STANDARD_BUTTONS]: ESC_SHOW_STANDARD_BUTTONS, // replace
  [CONFIG_SHOW_PARTIAL_OPEN_BUTTONS]: ESC_SHOW_PARTIAL_OPEN_BUTTONS, // replace

  [CONFIG_SHOW_WINDOW]: ESC_SHOW_WINDOW, // new
  [CONFIG_SHOW_TILT_SLIDER]: ESC_SHOW_TILT_SLIDER, // new
  [CONFIG_SHOW_OPEN_CLOSE_SLIDER]: ESC_SHOW_OPEN_CLOSE_SLIDER, // new
//==========================
  [CONFIG_PICKER_OVERLAP_PX]: ESC_PICKER_OVERLAP_PX,
  [CONFIG_CURRENT_POSITION]: ESC_CURRENT_POSITION,

  [CONFIG_BUTTON_STOP_HIDE_STATES]: ESC_BUTTON_STOP_HIDE_STATES,
  [CONFIG_BUTTON_OPENED_HIDE_STATES]: ESC_BUTTON_OPENED_HIDE_STATES,
  [CONFIG_BUTTON_CLOSED_HIDE_STATES]: ESC_BUTTON_CLOSED_HIDE_STATES,
// Home assistant key words, not used but to prevent warnings
  ['view_layout']: null,
  ['grid_options']: null,



};
export const ESC_PRESET = {
  [ESC_ROLLER_SHUTTER] :
    CONFIG_DEFAULT, //  using CONFIG_DEFAULT
  [ESC_AWNING]: {
    [CONFIG_INVERT_OPEN_CLOSE_UI]: true,
    [CONFIG_INVERT_PCT_UI]: true,
    [CONFIG_SHUTTER_SLAT_IMAGE]: 'esc-awning.png',
    [CONFIG_SHUTTER_BOTTOM_IMAGE]: 'esc-awning-bottom.png',
    [CONFIG_ROTATE_SLATS_SHUTTER_IMAGE]: true,
    [CONFIG_STRETCH_EDGE_SHUTTER_IMAGE]: false,
    [CONFIG_OFFSET_CLOSED_PCT]: 50,
    [CONFIG_CLOSING_DIRECTION]: DOWN,
    [CONFIG_NAME]: 'Awning',
  },
  [ESC_CURTAIN]: {
    [CONFIG_CLOSING_DIRECTION]: RIGHT,
    [CONFIG_SHUTTER_SLAT_IMAGE]: 'esc-curtain.png',
    [CONFIG_SHUTTER_BOTTOM_IMAGE]: '',
    [CONFIG_ROTATE_SLATS_SHUTTER_IMAGE]: false,
    [CONFIG_NAME]: 'Curtain',
  },
  [ESC_SHADE]: {
    [CONFIG_SHUTTER_SLAT_IMAGE]: '#00000080',
    [CONFIG_CLOSING_DIRECTION]: DOWN,
    [CONFIG_SHOW_TILT]: false,
    [CONFIG_NAME]: 'Shade',
  },
  [ESC_BLIND]: {
    [CONFIG_CLOSING_DIRECTION]: RIGHT,
    [CONFIG_SHUTTER_SLAT_IMAGE]: 'esc-blind.png',
    [CONFIG_ROTATE_SLATS_SHUTTER_IMAGE]: false,
    [CONFIG_WINDOW_IMAGE]: 'esc-window2.png',
    [CONFIG_SHUTTER_BOTTOM_IMAGE]: '',
    [CONFIG_NAME]: 'Blind',
  },
  [ESC_TEST]: {
    [CONFIG_WINDOW_IMAGE]: '',
    [CONFIG_OFFSET_OPENED_PCT]: 2,
    [CONFIG_SHUTTER_SLAT_IMAGE]: 'rode_rechthoek.png',
    [CONFIG_SHUTTER_BOTTOM_IMAGE]: 'gele_rechthoek.png',
    [CONFIG_NAME]: 'Test',
  },
  [ESC_COMPACT]: {
    [CONFIG_SHOW_NAME]: true,
    [CONFIG_SHOW_OPENING]: true,
    [CONFIG_SHOW_STANDARD_BUTTONS]: true,
    [CONFIG_SHOW_WINDOW]: false,
    [CONFIG_SHOW_TILT_BUTTONS]: true,
    [CONFIG_SHOW_TILT_SLIDER]: true,
    [CONFIG_SHOW_OPEN_CLOSE_SLIDER]: true,
    [CONFIG_SHOW_PARTIAL_OPEN_BUTTONS]: false,
    [CONFIG_NAME]: 'Compact',
  }
}

export const SHUTTER_CSS =`

      .${ESC_CLASS_SHUTTER} {
        overflow: visible;
        position: relative;
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
      .${ESC_CLASS_TILT_BUTTONS} {
        display: flex;
        flex: none;
        flex-flow: var(--esc-buttons-flex-flow-tilt);
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
        margin: ${SELECTOR_MARGIN}px;
        justify-content: center;
        position: relative;
        align-items: center;
        overflow: var(--esc-overflow); /* prevents image overflow */
        background-color: var(--esc-window-background-color);
        background-image: var(--esc-window-background-image);
        background-size: cover;
        background-position: center;
        flex: none;
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
        overflow: var(--esc-overflow);
        bottom: 100%;
        transform-origin: bottom;
        transform: var(--esc-transform-slide);
        image-rendering: auto;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
        image-rendering: -webkit-optimize-contrast;
      }


      .${ESC_CLASS_SELECTOR_SLIDE_SLATS} {
        height: var(--esc-slide-slats-height);
        background-position: var(--esc-slide-background-main-position);
        background-image: var(--esc-slide-background-main-image);
        background-color: var(--esc-slide-background-main-color);
        background-repeat: repeat;
        background-size: var(--esc-slide-background-slats-size);
        transform: var(--esc-transform-undo-slats-rotate);
      }
      .${ESC_CLASS_TILT_SLAT1} {
        height: var(--esc-slide-slats-height);
        display: flex;
        flex-direction: column-reverse;
        overflow: var(--esc-overflow);
      }
      .${ESC_CLASS_TILT_SLAT2} {
        height: var(--esc-slat-height);
        width: 100%;
        flex-shrink: 0;
        overflow: var(--esc-overflow);
        perspective: 500px;
      }
      .${ESC_CLASS_TILT_EDGE} {
        z-index: 1;
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: grey;
      }
      .${ESC_CLASS_TILT_SLAT3} {
        z-index: 2;
        position: absolute;
        height: var(--esc-tilt-slat-height);
        width: var(--esc-tilt-slat-width);
        background-size: var(--esc-tilt-slat-background-size);
        transform-origin: var(--esc-tilt-slat-origin);
        transform: rotateX(var(--esc-tilt-angle-deg)) var(--esc-transform-tilt-slat-rotate);
        background-repeat: repeat;
        background-position: var(--esc-slide-background-main-position);
        background-color: var(--esc-slide-background-main-color);
        background-image: var(--esc-slide-background-main-image);
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
      .${ESC_CLASS_TOP_BOTTOM} {
        display: flex;
        white-space: nowrap;
      }
      .${ESC_CLASS_TOP_BOTTOM} > :last-child {
        margin-left: auto;
      }
      .${ESC_CLASS_TOP_BOTTOM} > :first-child {
        margin-right: auto;
      }
      .${ESC_CLASS_TOP_BOTTOM} > :only-child {
        margin-left: auto;
        margin-right: auto;
      }
      .${ESC_CLASS_TOP}, .${ESC_CLASS_BOTTOM} {
        display: flex;
        flex-flow: var(--esc-flex-name_opening-flow);
        align-items: center;
        white-space: nowrap;
        position: relative;
        text-align: center;
        padding-top: calc(${8}px*var(--esc-text-scale));
        padding-bottom: calc(${8}px*var(--esc-text-scale));
      }
      .${ESC_CLASS_LABEL} {
        clear: both;
        font-size: calc(${FONT_SIZE_LABEL}px*var(--esc-text-scale));
        line-height: calc(${LINE_HEIGHT_LABEL}px*var(--esc-text-scale));
        bottom: 0;
        position: relative;
        cursor: pointer;
      }
      .${ESC_CLASS_LABEL_DISABLED} {
        color: var(--secondary-text-color);
      }
      .${ESC_CLASS_TITLE_DISABLED} {
        display: none;
      }
      .${ESC_CLASS_POSITION} {
        vertical-align: top;
        clear: both;
        font-size: calc(${FONT_SIZE_POSITION}px*var(--esc-text-scale));
        line-height: calc(${LINE_HEIGHT_POSITION}px*var(--esc-text-scale));
        height:      calc(${LINE_HEIGHT_POSITION}px*var(--esc-text-scale));
        border-radius: 5px;
        margin: ${MARGIN_POSITION}px;

      }
      .${ESC_CLASS_POSITION}>span {
        background-color: var(--secondary-background-color);
        padding: 2px 5px 2px 5px;
      }
      .${ESC_CLASS_HA_ICON} {
        padding-bottom: 10px;
      }
      ha-icon-button {
        transform: var(--esc-button-rotate);
      }
      .${ESC_CLASS_HA_ICON_TILT} {
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
      .${ESC_CLASS_ICON_LEFT}, .${ESC_CLASS_ICON_RIGHT} {
        --mdc-icon-size: var(--esc-icon-size-wifi-battery, 24px);
        margin: var(--esc-icons-margins);
        display: inline-block;
        text-align: center;
        width: var(--esc-icon-div-size);
      }
      .${ESC_CLASS_ICON_LEFT} {
        color: var(--esc-top-left-color);
        left: -3px;
      }
      .${ESC_CLASS_ICON_RIGHT} {
        color: var(--esc-top-right-color);
        right: -3px;
      }
      .${ESC_CLASS_TOP_ICON_TEXT} {
        text-align: center;
        line-height: var(--esc-top-icon-text-line-height);
        font-size: var(--esc-top-icon-text-font-size);
      }

    .${ESC_CLASS_SLIDER_WRAP} {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .${ESC_CLASS_SLIDER_CLASS} {
      writing-mode: var(--esc-slider-writing-mode);
      direction: var(--esc-slider-direction);
      zoom: var(--esc-button-scale);
    }

    .${ESC_CLASS_TILT_CONTAINER} {
      position: relative;
      box-sizing: border-box;
      border: 1px solid grey;
      border-radius: 5px;
      display: flex;
      flex: none;
      flex-flow: var(--esc-buttons-flex-flow-tilt);
      align-items: center;
      justify-content: center;
      background: #f9f9f9;
    }

    .${ESC_CLASS_TILT_CLASS} {
      width: calc(var(--esc-button-scale)*${ICON_SIZE}px);
      height: calc(var(--esc-button-scale)*${ICON_SIZE}px);
      position: relative;
      transform: rotate(var(--esc-tilt-angle-deg-graph));
    }

    .${ESC_CLASS_TILT_LINE} {
      width: calc(var(--esc-button-scale)*2px);
      height: calc(var(--esc-button-scale)*${ICON_BUTTON_SIZE-ICON_SIZE/2}px);
      background: red;
      position: absolute;
      top: calc(var(--esc-button-scale)*${ -(ICON_BUTTON_SIZE-ICON_SIZE)/2 +ICON_SIZE/4}px);
      left: calc(var(--esc-button-scale)*${ICON_SIZE/2}px);
      transform: translateX(-50%);
    }
`;
