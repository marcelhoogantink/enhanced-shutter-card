import * as C from './constants.js';
import {xyPair} from './xyPair.js';
import {haEntity,haSubEntity} from './haEntity.js';

import {
  boundary,
//  findElementInBody,
//  findElement,
//  console_log,
//  getDebug,
//  resizeDebugger
} from './functions.js';


class cfg{
  cfg={};
  coverEntity=null;
  localize={};
  subEntity={};
  group=null;
  //id=null;
  enhancedShutter=null;


  static CFG_METHODS_TEST = {
    buttonsPosition:   { key: C.CONFIG_BUTTONS_POSITION, default: C.ESC_BUTTONS_POSITION },
    centerClosing:     { key: 'center_closing',   default: false},
  };


  static CFG_METHODS = {
    buttonsPosition:   C.CONFIG_BUTTONS_POSITION,
    centerClosing:     C.CONFIG_CENTER_CLOSING,
    nDevices:          C.CONFIG_NUMBER_DEVICES,
    supportedFeatures: C.CONFIG_SUPPORTED_FEATURES,
    stacked:           C.CONFIG_STACKED,
    title:             C.CONFIG_TITLE,

    showName:                 C.CONFIG_SHOW_NAME,
    showOpening:              C.CONFIG_SHOW_OPENING,
    showTiltButtonBlock:      C.CONFIG_SHOW_TILT_BUTTONS,
    showStandardButtons:      C.CONFIG_SHOW_STANDARD_BUTTONS,
    showTiltSliderBlock:      C.CONFIG_SHOW_TILT_SLIDER,
    showOpenCloseSliderBlock: C.CONFIG_SHOW_OPEN_CLOSE_SLIDER,
    showWindow:               C.CONFIG_SHOW_WINDOW,

    disableEndButtons: C.CONFIG_DISABLE_END_BUTTONS,
    entityId:          C.CONFIG_ENTITY_ID,
    batteryEntityId:   C.CONFIG_BATTERY_ENTITY_ID,
    signalEntityId:    C.CONFIG_SIGNAL_ENTITY_ID,
    showGroupMembers:  C.CONFIG_SHOW_GROUP_MEMBERS,
    imageMap:          C.CONFIG_IMAGE_MAP,
    windowImage:       C.CONFIG_WINDOW_IMAGE,
    viewImage:         C.CONFIG_VIEW_IMAGE,
    shutterSlatImage:  C.CONFIG_SHUTTER_SLAT_IMAGE,
    shutterBottomImage:C.CONFIG_SHUTTER_BOTTOM_IMAGE,
    friendlyName:      C.CONFIG_NAME,
    debug:             C.CONFIG_DEBUG,
    type:              C.CONFIG_TYPE,
    cardMod:           C.CONFIG_CARD_MOD,

    invertPercentageUi:        C.CONFIG_INVERT_PCT_UI,
    invertPercentageCover:     C.CONFIG_INVERT_PCT_COVER,
    invertPercentageTiltUi:    C.CONFIG_INVERT_PCT_TILT_UI,
    invertPercentageTiltCover: C.CONFIG_INVERT_PCT_TILT_COVER,
    invertOpenCloseUi:         C.CONFIG_INVERT_OPEN_CLOSE_UI,
    invertOpenCloseCover:      C.CONFIG_INVERT_OPEN_CLOSE_COVER,

    baseHeightPx:      C.CONFIG_BASE_HEIGHT_PX,
    baseWidthPx:       C.CONFIG_BASE_WIDTH_PX,
    resizeHeightPct:   C.CONFIG_RESIZE_HEIGHT_PCT,
    resizeWidthPct:    C.CONFIG_RESIZE_WIDTH_PCT,
    windowHeightPx:    C.CONFIG_HEIGHT_PX,  // will never be called from fillCfg();
    windowWidthPx:     C.CONFIG_WIDTH_PX,   // will never be calle from fillCfg();

    rotateSlatsImage:  C.CONFIG_ROTATE_SLATS_SHUTTER_IMAGE,
    stretchEdgeImage:  C.CONFIG_STRETCH_EDGE_SHUTTER_IMAGE,
    scaleButtons:      C.CONFIG_SCALE_BUTTONS,
    scaleIcons:        C.CONFIG_SCALE_ICONS,
    scaleTexts:        C.CONFIG_SCALE_TEXTS,
    offsetOpenedPct:   C.CONFIG_OFFSET_OPENED_PCT,
    offsetClosedPct:   C.CONFIG_OFFSET_CLOSED_PCT,
    tiltAngleMin:      C.CONFIG_TILT_ANGLE_MIN,
    tiltAngleMax:      C.CONFIG_TILT_ANGLE_MAX,

    unrollUnfoldDirection:  C.CONFIG_CLOSING_DIRECTION,
    buttonStopHideStates:   C.CONFIG_BUTTON_STOP_HIDE_STATES,
    buttonOpenHideStates:   C.CONFIG_BUTTON_OPENED_HIDE_STATES,
    buttonCloseHideStates:  C.CONFIG_BUTTON_CLOSED_HIDE_STATES,
    namePosition:           C.CONFIG_NAME_POSITION,
    inlineHeader:           C.CONFIG_INLINE_HEADER,
    iconsPosition:          C.CONFIG_ICONS_POSITION,
    alwaysPercentage:       C.CONFIG_ALWAYS_PERCENTAGE,
    pickerOverlapPx:        C.CONFIG_PICKER_OVERLAP_PX,
    showPartialOpenButtons: C.CONFIG_SHOW_PARTIAL_OPEN_BUTTONS,
    passiveMode:            C.CONFIG_PASSIVE_MODE,
    id:                     C.CONFIG_ID,
    group:                  C.CONFIG_GROUP,

    mirrorX:                C.CONFIG_MIRROR_X,
    mirrorY:                C.CONFIG_MIRROR_Y,

    ppartial:                C.CONFIG_PARTIAL_CLOSE_PCT,
    ooffset:                 C.CONFIG_OFFSET_IS_CLOSED_PCT,
  };

  constructor()
  {
    for (const [method, key] of Object.entries(cfg.CFG_METHODS)) {
      this[method] = (value = null) => this.getCfg(key, value);
      if (method != key){
        this[key]  = (value = null) => this.getCfg(key, value);
      }
    }
  }
  fillCfg(escConfig){
    Object.entries(escConfig).forEach( ([key, value]) => {
      if (typeof this[key] !== 'function') {
        return;
      }
      let test= this[key](value);
      let test2 =1;
    });
  }
  getCfg(key,value= null){
    if (value!== null && this.cfg[key]!=value){
      this.cfg[key]= value;
    }
    return this.cfg[key];
  }
  /*
   ** getters/setters
   */

   /*
   stacked(value = null){
    return this.getCfg(C.CONFIG_STACKED,value);
  }
  title(value = null){
    return this.getCfg(C.CONFIG_TITLE,value);
  }
  showName(value = null){
    return this.getCfg(C.CONFIG_SHOW_NAME,value);
  }
  showOpening(value = null){
    return this.getCfg(C.CONFIG_SHOW_OPENING,value);
   }
  showTiltButtonBlock(value = null){
    return this.getCfg(C.CONFIG_SHOW_TILT_BUTTONS,value);
  }
  showStandardButtons(value = null){
    return this.getCfg(C.CONFIG_SHOW_STANDARD_BUTTONS,value);
  }
  showTiltSliderBlock(value = null){
    return this.getCfg(C.CONFIG_SHOW_TILT_SLIDER,value);
  }
  showOpenCloseSliderBlock(value = null){
    return this.getCfg(C.CONFIG_SHOW_OPEN_CLOSE_SLIDER,value);
  }
  showWindow(value = null){
    return this.getCfg(C.CONFIG_SHOW_WINDOW,value);
  }
 // buttonsPosition(value = null){
 //  return this.getCfg(C.CONFIG_BUTTONS_POSITION,value);
 // }
 // supportedFeatures(value = null){
 //   return this.getCfg(C.CONFIG_SUPPORTED_FEATURES,value);
 // }
  disableEndButtons(value = null){
    return this.getCfg(C.CONFIG_DISABLE_END_BUTTONS,value);
  }
  entityId(value = null){
    return this.getCfg(C.CONFIG_ENTITY_ID,value);
  }
  batteryEntityId(value = null){
    return this.getCfg(C.CONFIG_BATTERY_ENTITY_ID,value);
  }
  signalEntityId(value = null){
    return this.getCfg(C.CONFIG_SIGNAL_ENTITY_ID,value);
  }
  showGroupMembers(value = null){
    return this.getCfg(C.CONFIG_SHOW_GROUP_MEMBERS,value);
  }
  imageMap(value = null){
    return this.getCfg(C.CONFIG_IMAGE_MAP,value);
  }
  windowImage(value = null){
    return this.getCfg(C.CONFIG_WINDOW_IMAGE,value);
  }
  viewImage(value = null){
    return this.getCfg(C.CONFIG_VIEW_IMAGE,value);
  }
  shutterSlatImage(value = null){
    return this.getCfg(C.CONFIG_SHUTTER_SLAT_IMAGE,value);
  }
  shutterBottomImage(value = null){
    return this.getCfg(C.CONFIG_SHUTTER_BOTTOM_IMAGE,value);
  }
  friendlyName(value = null){
    return this.getCfg(C.CONFIG_NAME,value);
  }
  debug(value = null){
    return this.getCfg(C.CONFIG_DEBUG,value);
  }
  invertPercentageUi(value = null){
    return this.getCfg(C.CONFIG_INVERT_PCT_UI,value);
  }
  invertPercentageCover(value = null){
    return this.getCfg(C.CONFIG_INVERT_PCT_COVER,value);
  }
  invertPercentageTiltUi(value = null){
    return this.getCfg(C.CONFIG_INVERT_PCT_TILT_UI,value);
  }
  invertPercentageTiltCover(value = null){
    return this.getCfg(C.CONFIG_INVERT_PCT_TILT_COVER,value);
  }
  invertOpenCloseUi(value = null){
    return this.getCfg(C.CONFIG_INVERT_OPEN_CLOSE_UI,value);
  }
  invertOpenCloseCover(value = null){
    return this.getCfg(C.CONFIG_INVERT_OPEN_CLOSE_COVER,value);
  }
  windowHeightPx(value = null){
    return this.getCfg(C.CONFIG_HEIGHT_PX,value);
  }
  windowWidthPx(value = null){
    return this.getCfg(C.CONFIG_WIDTH_PX,value);
  }
  rotateSlatsImage(value = null){
    return this.getCfg(C.CONFIG_ROTATE_SLATS_SHUTTER_IMAGE,value);
  }
  stretchEdgeImage(value = null){
    return this.getCfg(C.CONFIG_STRETCH_EDGE_SHUTTER_IMAGE,value);
  }
  scaleButtons(value = null){
    return this.getCfg(C.CONFIG_SCALE_BUTTONS,value);
  }
  scaleIcons(value = null){
    return this.getCfg(C.CONFIG_SCALE_ICONS,value);
  }
  scaleTexts(value = null){
    return this.getCfg(C.CONFIG_SCALE_TEXTS,value);
  }
  offsetOpenedPct(value = null){
    return this.getCfg(C.CONFIG_OFFSET_OPENED_PCT,value);
  }
  offsetClosedPct(value = null){
    return this.getCfg(C.CONFIG_OFFSET_CLOSED_PCT,value);
  }
//showTilt(value=null){
//  return (this.getCfg(C.CONFIG_SHOW_TILT,value)) && this.canTilt()
// }
  tiltAngleMin(value = null){
    return this.getCfg(C.CONFIG_TILT_ANGLE_MIN,value );
  }
  tiltAngleMax(value = null){
    return this.getCfg(C.CONFIG_TILT_ANGLE_MAX,value );
  }
  unrollUnfoldDirection(value = null){
    return this.getCfg(C.CONFIG_CLOSING_DIRECTION,value);
  }
  buttonStopHideStates(value = null){
    return this.getCfg(C.CONFIG_BUTTON_STOP_HIDE_STATES,value);
  }
  buttonOpenHideStates(value = null){
    return this.getCfg(C.CONFIG_BUTTON_OPENED_HIDE_STATES,value);
  }
  buttonCloseHideStates(value = null){
    return this.getCfg(C.CONFIG_BUTTON_CLOSED_HIDE_STATES,value);
  }
  namePosition(value = null){
    return this.getCfg(C.CONFIG_NAME_POSITION,value);
  }
  inlineHeader(value = null){
    return this.getCfg(C.CONFIG_INLINE_HEADER,value);
  }
  iconsPosition(value = null){
    return this.getCfg(C.CONFIG_ICONS_POSITION,value);
  }
  alwaysPercentage(value = null){
    return this.getCfg(C.CONFIG_ALWAYS_PCT,value);
  }
  pickerOverlapPx(value = null){
    return this.getCfg(C.CONFIG_PICKER_OVERLAP_PX,value);
  }
  showPartialOpenButtons(value = null){
    return this.getCfg(C.CONFIG_SHOW_PARTIAL_OPEN_BUTTONS,value);
  }
  passiveMode(value = null){
    return this.getCfg(C.CONFIG_PASSIVE_MODE,value)
  }

*/

  isCoverFeatureActive(feature=C.ESC_FEATURE_ALL){
    const features =(this.getCoverEntity()?.getSupportedFeatures() ?? C.ESC_FEATURE_NO_TILT) & feature & this.supportedFeatures();
    return Boolean(features);
  }
  setLocalize(localize){
    this.localize=localize;
  }
  getLocalize(text){
    return this.localize(text);
  }
  setCoverEntity(hass,entityId){
    this.coverEntity = entityId ? new haEntity(hass,entityId) : null;
  }
  updateCoverEntity(haEntity){
    this.coverEntity = haEntity;
  }
  getCoverEntity(){
    return this.coverEntity;
  }
  getCoverState(haEntity=this.getCoverEntity()){
     let coverState = `${haEntity.getState()}-${haEntity.getCurrentPosition()}-${haEntity.getCurrentTiltPosition()}`;
     return coverState;
  }
  getState(haEntity){
     const state = C.NOT_KNOWN.includes(haEntity?.getState()) ? C.UNAVAILABLE : haEntity.getState();
     return state;
  }
  getBatteryEntity(){
    const entity = this.subEntity[C.DEVICE_CLASS_BATTERY].entity;
    return entity;
  }
  // Get SignalInfo
  getSignalEntity(){
    const entity = this.subEntity[C.DEVICE_CLASS_SIGNAL].entity;
    return entity;
  }
  getIconsActive(){
    return (this.getBatteryEntity() || this.getSignalEntity()) ? true : false;
  }

  batteryLevel(){
    let state = this.subEntity[C.DEVICE_CLASS_BATTERY].entity?.getState() ?? C.UNAVAILABLE;
    state = parseFloat(state).toFixed(C.DISPLAY_DECIMALS);
    return C.NOT_KNOWN.includes (state) ? '?' : state ;
  }
  signalLevel(){
    let state = this.subEntity[C.DEVICE_CLASS_SIGNAL].entity?.getState() ?? C.UNAVAILABLE;
    state = parseFloat(state).toFixed(C.DISPLAY_DECIMALS);
    return  C.  NOT_KNOWN.includes (state) ? '?' : state ;
  }
  batteryUnit(){
    let unit = this.subEntity[C.DEVICE_CLASS_BATTERY].entity?.getUnitOfMeasurement() ?? C.UNAVAILABLE;
    return C.NOT_KNOWN.includes (unit) ? '?' : unit ;
  }
  signalUnit(){
    let unit = this.subEntity[C.DEVICE_CLASS_SIGNAL].entity?.getUnitOfMeasurement() ?? C.UNAVAILABLE;
    return C.NOT_KNOWN.includes (unit) ? '?' : unit ;
  }

  rotateOrtho(coord,angle=this.getCloseAngle()){
    switch (angle){
      case (90):
        return new xyPair(-coord.y(),coord.x() );
      case (180):
        return new xyPair(-coord.x(),-coord.y());
      case (270):
        return new xyPair(coord.y(),-coord.x());
      case (360):
      case (0):
        return new xyPair(coord.x(),coord.y());
      default:
        throw new Error(`ESC: Angle must be a multiple of 90 degrees. (angle= ${angle})`);
    }
  }
  rotateBackOrtho(coord,angle=this.getCloseAngle()){
    switch (angle){
      case (90):
        return new xyPair(coord.y(),-coord.x());
      case (180):
        return new xyPair(-coord.x(),-coord.y());
      case (270):
        return new xyPair(-coord.y(),coord.x());
      case (360):
      case (0):
        return new xyPair(coord.x(),coord.y());
      default:
        throw new Error(`ESC: Angle must be a multiple of 90 degrees. (angle= ${angle})`);
    }
  }
  switchAxis(coord,angle=this.getCloseAngle()){
    switch (angle){
      case (90):
      case (270):
        return new xyPair(coord.y(),coord.x() );
      case (360):
      case (180):
      case (0):
        return new xyPair(coord.x(),coord.y() );
      default:
       throw new Error(`ESC: Angle must be a multiple of 90 degrees. (angle= ${angle})`);
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
  transformMirrorY(){
    let transform =`scale(1,-1)`;
    return transform;
   }
  transformMirrorX(){
    let transform =`scale(-1,1)`;
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



  getImage(imageType){
    let image;
    switch (imageType){
      case C.CONFIG_WINDOW_IMAGE:
        image = this.windowImage();
        break;
      case C.CONFIG_VIEW_IMAGE:
        image = this.viewImage();
        break;
      case C.CONFIG_SHUTTER_SLAT_IMAGE:
        image = this.shutterSlatImage();
        break;
      case C.CONFIG_SHUTTER_BOTTOM_IMAGE:
        image = this.shutterBottomImage();
        break;
      default:
        throw new Error(`ESC: Unknown imageType: ${imageType}`);
    }
    return image;
  }
  //group(){
  //  return this[C.CONFIG_GROUP];
 // }
 // id(){
 //   return this[C.CONFIG_ID];
 // }

  partial(value = null){
    let partial = this.getCfg(C.CONFIG_PARTIAL_CLOSE_PCT,value);
    if (partial == C.SHUTTER_OPEN_PCT ||  partial == C.SHUTTER_CLOSED_PCT) partial = 100;
    //partial = this.invertPosition(partial);
    // only when cover can set position
    return this.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION) ? partial : 0;
  }



  offset(value = null){
    let offset = this.getCfg(C.CONFIG_OFFSET_IS_CLOSED_PCT,value);
    if (offset == C.SHUTTER_OPEN_PCT ||  offset == C.SHUTTER_CLOSED_PCT) offset = 100;
    //offset = this.invertPosition(offset);
    // only when cover can set position
    return this.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION) ? offset : 0;
  }

  offsetActive(){
    return this.offset() !=C.SHUTTER_OPEN_PCT && this.offset() != C.SHUTTER_CLOSED_PCT;
  }

  canTilt(){
    return this.isCoverFeatureActive(C.ESC_FEATURE_OPEN_TILT | C.ESC_FEATURE_CLOSE_TILT | C.ESC_FEATURE_SET_TILT_POSITION ) ;

  }
  buttonOpenCloseHideStates(upDown){
    upDown = this.applyInvertForButtonOpenCloseHideStates(upDown);
    if (upDown == C.UP) return this.buttonOpenHideStates();
    if (upDown == C.DOWN) return this.buttonCloseHideStates();
  }



  openingPosition(value = null){
    if (value !== null  && this.getCfg(C.CONFIG_OPENING_POSITION,value) === null)
    {
      value = this.getCfg(C.CONFIG_NAME_POSITION);
    }
    return this.getCfg(C.CONFIG_OPENING_POSITION,value);
  }
  verticalMovement(){
    return C.IS_VERTICAL.includes(this.unrollUnfoldDirection());
  }


  currentUiPosition(position = this.currentDevicePosition()){
    position = this.applyInvertToUiPosition(position);
    return position;
  }
  currentDevicePosition(){
    let position = this.currentBasePosition();
    position = this.applyInvertToPosition(position);
    return position;
  }
  currentBasePosition(){
    let position;
    if (this.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION)){
      // known position
      position = this.getCoverEntity()?.getCurrentPosition() ?? 0;
    }else{
      // unknown position, so estimate from state
      position= this.getCoverEntity()?.getState()==C.SHUTTER_STATE_OPEN ? C.SHUTTER_OPEN_PCT :  C.SHUTTER_CLOSED_PCT;
    }
    return position;
  }

  currentUiTiltPosition(position = this.currentDeviceTiltPosition()){
    position = this.applyInvertToUiTiltPosition(position);
    return position;
  }
  currentDeviceTiltPosition(){
    let position = this.currentBaseTiltPosition();
    position = this.applyInvertToTiltPosition(position);
    return position;
  }
  currentBaseTiltPosition(){
    let position;
    if (this.canTilt()){
      // known position
      position = this.getCoverEntity()?.getCurrentTiltPosition() ?? null;
    }else{
      position= null;
    }
    return position;
  }

  applyInvertToPosition(position){
    if (this.invertPercentageCover()) position= this.invertPosition(position);
    return position;
  }
  applyInvertToTiltPosition(tiltPosition){
    if (this.invertPercentageTiltCover()) tiltPosition= this.invertPosition(tiltPosition);
    return tiltPosition;
  }
  applyInvertToUiPosition(position){
    if (this.invertPercentageUi()) position = this.invertPosition(position);
    return position;
  }
  applyInvertToUiTiltPosition(position){
    if (this.invertPercentageTiltUi()) position = this.invertPosition(position);
    return position;
  }
  invertPosition(position){
    position = 100-position;
    return position;
  }

  applyInvertForPositionToText(setting,debug=false){
    //setting = this.applyInvertOpenCloseUi(setting,debug);
    //setting = this.applyInvertOpenCloseCover(setting,debug);
    setting = this.applyInvertPercentageUi(setting,debug);
    setting = this.applyInvertPercentageCover(setting,debug);
    return setting;
  }
  applyInvertForOverlayDisplay(setting,debug=false){
    //setting = this.applyInvertOpenCloseUi(setting,debug);
    //setting = this.applyInvertOpenCloseCover(setting,debug);
    //setting = this.applyInvertPercentageUi(setting,debug);
    setting = this.applyInvertPercentageCover(setting,debug);
    return setting;
  }
  applyInvertForShowButtonUpDownLabel(setting,debug=false){
    setting = this.applyInvertOpenCloseUi(setting,debug);
    setting = this.applyInvertDirection(setting,debug);
    return setting;
  }
  applyInvertForShowButtonUpDownClick(setting,debug){
    setting = this.applyInvertDirection(setting,debug);
    setting = this.applyInvertOpenCloseCover(setting,debug);
    return setting;
  }
  applyInvertForButtonOpenCloseHideStates(setting,debug=false){
    setting = this.applyInvertOpenCloseUi(setting,debug);
    setting = this.applyInvertDirection(setting,debug);
    return setting;
  }
  applyInvertNone(setting){
    return setting;
  }
  applyInvertOpenCloseAndPercentage(setting,debug=false){
    setting = this.applyInvertOpenCloseUi(setting,debug);
    setting = this.applyInvertPercentageCover(setting,debug);
    return setting;
  }
  applyInvertAll(setting,debug=false){
    setting = this.applyInvertOpenCloseUi(setting,debug);
    setting = this.applyInvertPercentageCover(setting,debug);
    setting = this.applyInvertDirection(setting,debug);
    setting = this.applyInvertOpenCloseCover(setting,debug);
    return setting;
  }

  applyInvertDirection(setting){
    if (this.#invertDirection()) setting = Object.keys(C.INVERT_OPEN_CLOSE_SETTING).includes(setting) ? C.INVERT_OPEN_CLOSE_SETTING[setting] : setting;
    return setting;
  }

  applyInvertOpenCloseUi(setting){
    if (this.invertOpenCloseUi()) setting = Object.keys(C.INVERT_OPEN_CLOSE_SETTING).includes(setting) ? C.INVERT_OPEN_CLOSE_SETTING[setting] : setting;
    return setting;
  }
  applyInvertOpenCloseCover(setting){
    if (this.invertOpenCloseCover()) setting = Object.keys(C.INVERT_OPEN_CLOSE_SETTING).includes(setting) ? C.INVERT_OPEN_CLOSE_SETTING[setting] : setting;
    return setting;
  }
  applyInvertPercentageCover(setting){
    if (this.invertPercentageCover()) setting = Object.keys(C.INVERT_OPEN_CLOSE_SETTING).includes(setting) ? C.INVERT_OPEN_CLOSE_SETTING[setting] : setting;
    return setting;
  }
  applyInvertPercentageUi(setting){
    if (this.invertPercentageUi()) setting = Object.keys(C.INVERT_OPEN_CLOSE_SETTING).includes(setting) ? C.INVERT_OPEN_CLOSE_SETTING[setting] : setting;
    return setting;
  }

  #invertDirection(){
    return this.unrollUnfoldDirection() == C.RIGHT || this.unrollUnfoldDirection() == C.UP;
  }

  getCloseAngle(){
    const direction= {
      [C.DOWN]:0,
      [C.LEFT]:90,
      [C.RIGHT]:270,
      [C.UP]:180
    };
    return direction[this.unrollUnfoldDirection()] || 0;
  }

  getOrientation(){
    return C.Globals.screenOrientation.value; // global variable !!
  }

  positionToState(position = this.currentDevicePosition()){
    // see for position and state definition:
    //  https://www.home-assistant.io/integrations/cover.template/#combining-value_template-and-position_template

    let state = this.getCoverEntity().getState() || C.UNAVAILABLE;
    let escState;
    if (state !== C.SHUTTER_STATE_OPENING && state !== C.SHUTTER_STATE_CLOSING) {
      //  shutter is not moving,
      if (position != C.SHUTTER_OPEN_PCT && position != C.SHUTTER_CLOSED_PCT){
        // shutter is not 0% or 100%
        escState= C.SHUTTER_STATE_PARTIAL_OPEN;
      }else{
        // shutter is 0% or 100%
        escState = position ? this.applyInvertOpenCloseUi(C.SHUTTER_STATE_OPEN) : this.applyInvertOpenCloseUi(C.SHUTTER_STATE_CLOSED);
      }
    }else  {
      //  shutter is moving,
      escState = this.applyInvertForPositionToText(state);
    }
    // solve issue #54
    if (position == this.applyInvertToPosition(C.SHUTTER_OPEN_PCT) && escState == (this.applyInvertOpenCloseAndPercentage(C.SHUTTER_STATE_OPENING))) {
      escState = this.applyInvertOpenCloseAndPercentage(C.SHUTTER_STATE_OPEN);

    }else if (position == this.applyInvertToPosition(C.SHUTTER_CLOSED_PCT) && escState== (this.applyInvertOpenCloseAndPercentage(C.SHUTTER_STATE_CLOSING))) {
      escState = this.applyInvertOpenCloseAndPercentage(C.SHUTTER_STATE_CLOSED);
    }
    return escState;
  }

  buttonGroupInRow(){
    return this.getButtonsPosition() == C.LEFT || this.getButtonsPosition() == C.RIGHT;
  }
  buttonsContainerReversed(){
    return this.getButtonsPosition() == C.BOTTOM || this.getButtonsPosition() == C.RIGHT;
  }
  disabledGlobaly() {
    return false;
    // return (C.NOT_KNOWN.includes(this.getCoverEntity().getState()));
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
  coverButtonDisabled(upDown) {
    const isUp = upDown === C.UP;
    const isDown = upDown === C.DOWN;
    const inverted = this.#invertDirection();

    if (isUp) {
      return inverted ? this.coverButtonDownDisabled() : this.coverButtonUpDisabled();
    }
    if (isDown) {
      return inverted ? this.coverButtonUpDisabled() : this.coverButtonDownDisabled();
    }
    return false;
  }


  getButtonsPosition() {
    let position = this.buttonsPosition();
    if (position.startsWith(C.AUTO)) {
      const isLandscape = this.getOrientation() === C.LANDSCAPE ;
      const isTopOrLeft = position === C.AUTO || position === C.AUTO_TL || position === C.AUTO_BL;
      position = isLandscape ? (isTopOrLeft ? C.LEFT : C.RIGHT) : (isTopOrLeft ? C.TOP : C.BOTTOM);
    }
    return position;
  }

  defButtonsPosition(config) {
    const buttonsPosition = config[C.CONFIG_BUTTONS_POSITION]?.toLowerCase();
    this.buttonsPosition(C.POSITIONS.includes(buttonsPosition) ? buttonsPosition : C.ESC_BUTTONS_POSITION);
  }

  positionToText(position){
    let text;
    if (this.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION)) {
      // position support
      if (typeof position === 'number') {
        if (this.alwaysPercentage()) {
          text = position + '%';

        }else{
          const UiPosition = this.applyInvertToUiPosition(position)
          let state= this.positionToState(UiPosition);
//          if (!this.debug()){
            if (state != C.SHUTTER_STATE_PARTIAL_OPEN){
              text = this.getLocalize(C.LOCALIZE_TEXT[(state)]);
            } else{
              text = position.toFixed(C.DISPLAY_DECIMALS) + '%';
            }
//          }else{
//            text = `Dev: ${this.getCoverEntity().getState()} (${this.currentDevicePosition()}%)\nCard: ${state} (${position}%)`;
//          }
        }
      } else {
        text = this.getLocalize(C.LOCALIZE_TEXT[C.UNAVAILABLE]);
      }
    }else{
      // no position support, so only open/closed
      if (this.applyInvertToPosition(position) > 50 ) {
        text = this.getLocalize(C.LOCALIZE_TEXT[this.applyInvertForPositionToText(C.SHUTTER_STATE_OPEN)]);
      } else {
        text = this.getLocalize(C.LOCALIZE_TEXT[this.applyInvertForPositionToText(C.SHUTTER_STATE_CLOSED)]);
      }
    }
    return text;
  }
  createPositionText(position,tiltPosition){
    let positionText;
    if (C.NOT_KNOWN.includes(this.getCoverEntity().getState())){
      positionText = this.getLocalize(C.LOCALIZE_TEXT[C.UNAVAILABLE]);
    }else{
      let displayPosition = this.visiblePosition(position);
      displayPosition = this.currentUiPosition(displayPosition);
      positionText = this.positionToText(displayPosition);
      if (this.offsetActive()) {
        positionText += ` (${this.currentUiPosition(position).toFixed(C.DISPLAY_DECIMALS)}%)`;
      }
      if (this.canTilt()) {
        tiltPosition = this.currentUiTiltPosition(tiltPosition).toFixed(C.DISPLAY_DECIMALS);
        positionText += ` / Tilt: ${tiltPosition}%`;
      }
    }
    return positionText;
  }
  visiblePosition(currentDevicePosition) {
    // compute visible position from current position and offset
    let visiblePosition;
    //const offset =this.offset();
    visiblePosition = this.calcVisualOffset(currentDevicePosition)
    return visiblePosition;
  }

  calcOffset(pct){
    let pct2;
    if (this.offsetActive()){
      pct2 =  Math.round(100 -  this.invertPosition(pct) * this.offset() / 100 );
      return pct2;
    }else{
      return pct;
    }
  }
  calcVisualOffset(pct){
    let pct2;
    if (this.offsetActive()) {
      pct2 = Math.max(0, Math.round((pct - this.invertPosition(this.offset())) * 100 / this.offset() ));
      return pct2;
    }else{
      return pct;
    }
  }
  coverIsOpen(){
    return (this.currentDevicePosition() == C.SHUTTER_OPEN_PCT);
  }
  coverIsClosed(){
    return (this.currentDevicePosition() == C.SHUTTER_CLOSED_PCT);
  }
  iconScaleFactor(){
    let scale_setting = this.scaleIcons();
    let scale = 1.0;
    switch(typeof(scale_setting)){
      case 'boolean':
        scale = scale_setting ? Math.min(this.windowWidthPx()/C.ESC_BASE_WIDTH_PX*1.25,1) : 1;
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
        scale = scale_setting ? this.windowWidthPx()/C.ESC_BASE_WIDTH_PX : scale;
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
    let size = C.ICON_BUTTON_SIZE;

    let scale_setting = this.scaleButtons();
    switch(typeof(scale_setting)){
      case 'boolean':
        if (scale_setting){
          let px;
          if (this.buttonGroupInRow()){
            px = this.windowHeightPx();
          }else{
            px = this.windowWidthPx();
          }
          size = Math.min(px/3.0,C.ICON_BUTTON_SIZE); // buttons fit in 1/3 of the size
        }
        break;
      case 'number':
        size = boundary(scale_setting,0.1,2)*C.ICON_BUTTON_SIZE;
        break;
    }
    return size;
  }
  buttonScaleFactor(){
    let scale=1;
    let scale_setting = this.scaleButtons();
    switch(typeof(scale_setting)){
      case 'boolean':
        if (scale_setting){
          let px;
          if (this.buttonGroupInRow()){
            px = this.windowHeightPx();
          }else{
            px = this.windowWidthPx();
          }
          scale = Math.min(px/3.0/C.ICON_BUTTON_SIZE,1);
        }
        break;
      case 'number':
        scale = boundary(scale_setting,0.1,2);
        break;
    }
    return scale;
  }
  iconSize(){
    let size = C.ICON_SIZE;

    let scale_setting = this.scaleButtons();
    switch(typeof(scale_setting)){
      case 'boolean':
        if (scale_setting){
          let px;
          if (this.buttonGroupInRow()){
            px = this.windowHeightPx();
          }else{
            px = this.windowWidthPx();
          }
          size = Math.min(px/(3.0*C.ICON_BUTTON_SIZE/C.ICON_SIZE),C.ICON_SIZE); // buttons fit in 1/3 of the size
        }
        break;
      case 'number':
        size = boundary(scale_setting,0.1,2)*C.ICON_SIZE;
        break;
    }
    return size;
  }
  iconSizeWifiBattery(){
    let size = C.ICON_SIZE;
    let scale_setting = this.scaleIcons();
    switch(typeof(scale_setting)){
      case 'boolean':
        if (scale_setting){
          let px = this.windowWidthPx();
          size = Math.min(px/6.0,C.ICON_SIZE);
        }
        break;
      case 'number':
        size = boundary(scale_setting,0.1,2)*C.ICON_SIZE;
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
    return C.ICONCOLORS[roundedLevel];
  }
  signalIconColor(){
    let iconLevelIndex= this.signalLevelIndex();
    return C.ICONCOLORS[iconLevelIndex];
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
    return -1;
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

export class cardCfg extends cfg{

  constructor(escConfig)
  {
    super();

    this.stacked(escConfig[C.CONFIG_STACKED]);
    this.title(escConfig[C.CONFIG_TITLE]);

    Object.preventExtensions(this);
  }

}
export class cardCfgNew extends cfg{

  constructor(escConfig)
  {
    super();
    this.fillCfg(escConfig);
  }
}

export class windowCfgNew extends cfg{
  constructor(hass,escConfig)
  {
    super();
    this.fillCfg(escConfig);

  }
}
export class coverCfgNew extends cfg{
  constructor(hass,escConfig)
  {
    super();
    this.fillCfg(escConfig);

  }
}
export class entityCfgNew extends cfg{
  constructor(hass,escConfig)
  {
    super();
    this.fillCfg(escConfig);

  }
}
export class shutterCfg extends cfg{


  constructor(hass,escConfig)
  {
    super();

    let entityId = this.entityId(escConfig[C.CONFIG_ENTITY_ID] ? escConfig[C.CONFIG_ENTITY_ID] : escConfig);

    this.hass = hass;

    this.group(escConfig[C.CONFIG_GROUP]);
    this.id(escConfig[C.CONFIG_ID]);

    this.setLocalize(hass.localize);
    this.setCoverEntity(hass,entityId);

    Object.entries(escConfig).forEach( ([key, value]) => {
      if (typeof this[key] !== 'function') return;
      let test= this[key](value);
      let test2 =1;
    });

    this.showGroupMembers(escConfig[C.CONFIG_SHOW_GROUP_MEMBERS]);
    this.imageMap(escConfig[C.CONFIG_IMAGE_MAP]);
    this.windowImage(escConfig[C.CONFIG_WINDOW_IMAGE]);
    this.viewImage(escConfig[C.CONFIG_VIEW_IMAGE]);
    this.shutterSlatImage(escConfig[C.CONFIG_SHUTTER_SLAT_IMAGE]);
    this.shutterBottomImage(escConfig[C.CONFIG_SHUTTER_BOTTOM_IMAGE]);

    this.batteryEntityId(escConfig[C.CONFIG_BATTERY_ENTITY_ID]);
    this.signalEntityId(escConfig[C.CONFIG_SIGNAL_ENTITY_ID]);

    this.subEntity[C.DEVICE_CLASS_BATTERY] = new haSubEntity(hass,C.DEVICE_CLASS_BATTERY,this.batteryEntityId());
    this.subEntity[C.DEVICE_CLASS_SIGNAL]  = new haSubEntity(hass,C.DEVICE_CLASS_SIGNAL,this.signalEntityId());
    this.debug(!!escConfig[C.CONFIG_DEBUG]);

    this.friendlyName(escConfig[C.CONFIG_NAME] || this.getCoverEntity()?.getFriendlyName() || C.UNKNOWN);

    this.supportedFeatures(escConfig[C.CONFIG_SUPPORTED_FEATURES]);
    this.invertPercentageCover(escConfig[C.CONFIG_INVERT_PCT_COVER]);
    this.invertPercentageUi(escConfig[C.CONFIG_INVERT_PCT_UI]);
    this.invertPercentageTiltCover(escConfig[C.CONFIG_INVERT_PCT_TILT_COVER]);
    this.invertPercentageTiltUi(escConfig[C.CONFIG_INVERT_PCT_TILT_UI]);
    this.invertOpenCloseUi(escConfig[C.CONFIG_INVERT_OPEN_CLOSE_UI]);
    this.invertOpenCloseCover(escConfig[C.CONFIG_INVERT_OPEN_CLOSE_COVER]);
    this.passiveMode(escConfig[C.CONFIG_PASSIVE_MODE]);

    this.unrollUnfoldDirection(escConfig[C.CONFIG_CLOSING_DIRECTION]);

    let base_height_px = escConfig[C.CONFIG_BASE_HEIGHT_PX];
    let resize_height_pct = escConfig[C.CONFIG_RESIZE_HEIGHT_PCT];
    this.windowHeightPx(Math.round(boundary(resize_height_pct,C.ESC_MIN_RESIZE_HEIGHT_PCT,C.ESC_MAX_RESIZE_HEIGHT_PCT) / 100 * base_height_px));

    let base_width_px  = escConfig[C.CONFIG_BASE_WIDTH_PX];
    let resize_width_pct  = escConfig[C.CONFIG_RESIZE_WIDTH_PCT];
    this.windowWidthPx(Math.round(boundary(resize_width_pct, C.ESC_MIN_RESIZE_WIDTH_PCT ,C.ESC_MAX_RESIZE_WIDTH_PCT)  / 100 * base_width_px));

    this.rotateSlatsImage(escConfig[C.CONFIG_ROTATE_SLATS_SHUTTER_IMAGE]);
    this.stretchEdgeImage(escConfig[C.CONFIG_STRETCH_EDGE_SHUTTER_IMAGE]);

    this.centerClosing(escConfig[C.CONFIG_CENTER_CLOSING]);

    this.scaleButtons(escConfig[C.CONFIG_SCALE_BUTTONS]);
    this.scaleIcons(escConfig[C.CONFIG_SCALE_ICONS]);
    this.scaleTexts(escConfig[C.CONFIG_SCALE_TEXTS]);

    this.partial(boundary(this.invertPosition(escConfig[C.CONFIG_PARTIAL_CLOSE_PCT])));
    this.offset(boundary(this.invertPosition(escConfig[C.CONFIG_OFFSET_IS_CLOSED_PCT])));

    this.offsetOpenedPct(boundary(escConfig[C.CONFIG_OFFSET_OPENED_PCT]));
    this.offsetClosedPct(boundary(escConfig[C.CONFIG_OFFSET_CLOSED_PCT]));

    //this.showTilt(!!escConfig[C.CONFIG_SHOW_TILT]);

    this.tiltAngleMin(escConfig[C.CONFIG_TILT_ANGLE_MIN]);
    this.tiltAngleMax(escConfig[C.CONFIG_TILT_ANGLE_MAX]);

    this.defButtonsPosition(escConfig);

    this.namePosition(escConfig[C.CONFIG_NAME_POSITION]);

    this.iconsPosition(escConfig[C.CONFIG_ICONS_POSITION]);

    this.openingPosition(escConfig[C.CONFIG_OPENING_POSITION]);

    this.inlineHeader(escConfig[C.CONFIG_INLINE_HEADER]);

    this.alwaysPercentage(!!escConfig[C.CONFIG_ALWAYS_PCT]);
    this.disableEndButtons(!!escConfig[C.CONFIG_DISABLE_END_BUTTONS]);
    this.pickerOverlapPx(C.ESC_PICKER_OVERLAP_PX);

    this.showName(escConfig[C.CONFIG_SHOW_NAME]);
    this.showOpening(escConfig[C.CONFIG_SHOW_OPENING]);
    this.showTiltButtonBlock(escConfig[C.CONFIG_SHOW_TILT_BUTTONS]);
    this.showStandardButtons(escConfig[C.CONFIG_SHOW_STANDARD_BUTTONS]);
    this.showPartialOpenButtons(escConfig[C.CONFIG_SHOW_PARTIAL_OPEN_BUTTONS]);

    this.showTiltSliderBlock(escConfig[C.CONFIG_SHOW_TILT_SLIDER]);
    this.showOpenCloseSliderBlock(escConfig[C.CONFIG_SHOW_OPEN_CLOSE_SLIDER]);
    this.showWindow(escConfig[C.CONFIG_SHOW_WINDOW]);

    this.buttonStopHideStates(escConfig[C.CONFIG_BUTTON_STOP_HIDE_STATES]
      ? escConfig[C.CONFIG_BUTTON_STOP_HIDE_STATES]
      : C.ESC_BUTTON_STOP_HIDE_STATES);
    this.buttonOpenHideStates(escConfig[C.CONFIG_BUTTON_OPENED_HIDE_STATES]
      ? escConfig[C.CONFIG_BUTTON_OPENED_HIDE_STATES]
      : C.ESC_BUTTON_OPENED_HIDE_STATES);
    this.buttonCloseHideStates(escConfig[C.CONFIG_BUTTON_CLOSED_HIDE_STATES]
      ? escConfig[C.CONFIG_BUTTON_CLOSED_HIDE_STATES]
      : C.ESC_BUTTON_CLOSED_HIDE_STATES);

    Object.preventExtensions(this);
  }
}
