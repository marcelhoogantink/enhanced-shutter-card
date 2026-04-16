export const VERTICAL = 'vertical';
export const ESC_CLASS_BASE_NAME = 'esc-shutter';
export const ESC_CLASS_SHUTTER_SEPARATE = `${ESC_CLASS_BASE_NAME}-separate`
export const TOP = 'top';
export const BOTTOM = 'bottom';
export const UP = 'up';
export const DOWN = 'down';

export const ESC_CLASS_TOP = `${ESC_CLASS_BASE_NAME}-${TOP}`;
export const ESC_CLASS_MIDDLE = `${ESC_CLASS_BASE_NAME}-middle`;
export const ESC_CLASS_BOTTOM = `${ESC_CLASS_BASE_NAME}-${BOTTOM}`;
export const ESC_CLASS_TOP_BOTTOM = `${ESC_CLASS_BASE_NAME}-${TOP}-${BOTTOM}`;
export const ESC_CLASS_LABEL = `${ESC_CLASS_BASE_NAME}-label`;
export const ESC_CLASS_POSITION = `${ESC_CLASS_BASE_NAME}-position`;
export const ESC_CLASS_LABEL_DISABLED = `${ESC_CLASS_LABEL}-disabled`;
export const ESC_CLASS_BUTTONS = `${ESC_CLASS_BASE_NAME}-buttons`;
export const FONT_SIZE_LABEL = 20;
export const ESC_CLASS_SHUTTER = `${ESC_CLASS_BASE_NAME}`;
export const ESC_CLASS_HA_ICON = `${ESC_CLASS_BASE_NAME}-ha-icon`;
export const ESC_CLASS_HA_ICON_LOCK = `${ESC_CLASS_HA_ICON}-lock`;
export const ESC_CLASS_HA_ICON_TILT = `${ESC_CLASS_HA_ICON}-tilt`;
export const ESC_CLASS_SELECTOR = `${ESC_CLASS_BASE_NAME}-selector`;
export const ESC_CLASS_SELECTOR_PICTURE = `${ESC_CLASS_BASE_NAME}-selector-picture`;
export const ESC_CLASS_SELECTOR_PICKER = `${ESC_CLASS_BASE_NAME}-selector-picker`;
export const ESC_CLASS_SELECTOR_PARTIAL = `${ESC_CLASS_BASE_NAME}-selector-partial`;
export const ESC_CLASS_SELECTOR_SLIDE = `${ESC_CLASS_BASE_NAME}-selector-slide`;
export const ESC_CLASS_SELECTOR_SLIDE_SLATS = `${ESC_CLASS_SELECTOR_SLIDE}-slats`;
export const ESC_CLASS_SELECTOR_SLIDE_EDGE = `${ESC_CLASS_SELECTOR_SLIDE}-edge`;

export const ESC_CLASS_TILT = `${ESC_CLASS_BASE_NAME}-tilt`;
export const ESC_CLASS_TILT_CONTAINER = `${ESC_CLASS_TILT}-container`;
export const ESC_CLASS_TILT_CLASS = `${ESC_CLASS_TILT}-class`;
export const ESC_CLASS_TILT_LINE = `${ESC_CLASS_TILT}-line`;
export const ESC_CLASS_SLIDER = `${ESC_CLASS_TILT}-slider`;
export const ESC_CLASS_SLIDER_WRAP = `${ESC_CLASS_SLIDER}-wrap`;
export const ESC_CLASS_SLIDER_CLASS = `${ESC_CLASS_SLIDER}-class`;
export const ESC_CLASS_TILT_SLAT1 = `${ESC_CLASS_TILT}-slat1`;
export const ESC_CLASS_TILT_SLAT2 = `${ESC_CLASS_TILT}-slat2`;
export const ESC_CLASS_TILT_SLAT3 = `${ESC_CLASS_TILT}-slat3`;
export const ESC_CLASS_TILT_EDGE = `${ESC_CLASS_TILT}-slat-edge`;



export const LINE_HEIGHT_LABEL = 30;
export const UNITY= 'px';
export const FONT_SIZE_POSITION = 14;
export const MARGIN_POSITION = 2;
export const ICON_SIZE = 24;
export const ICON_DIV_SIZE = 34;
export const LINE_HEIGHT_POSITION = 20;
export const SELECTOR_MARGIN = 4;
export const NONE = 'none';

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


