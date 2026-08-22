import * as C from './constants.js';
import {LitElement, html, css, unsafeCSS,nothing } from './lit/lit-core.min.js';
import {
  windowCfgNew,
} from './cfg.js';

import {
  boundary,
  findElement,
  getDebug,
  resizeDebugger,
} from './functions.js';

import * as HtmlBlocks from './htmlBlocks.js';
import {xyPair} from './xyPair.js';
import {haEntity} from './haEntity.js';


export class EnhancedShutterWindow extends LitElement
{
  // loaded from EnhancedShutterCardNew():
  // - react_ShutterState
  // - react_BatteryState
  // - react_SignalState
  // - react_ScreenOrientation

  // - hass
  // - cfg
  // - escImages

  //reactive properties
  static properties = {
    // reactive variables from parent card
    react_ShutterState: {
      //state: true,
      type: String
    },        // for detecting state of shutter (open close etc)
    react_BatteryState: {type: String},        // for detecting battery state change
    react_SignalState: {type: String},         // for detecting signal state change
    react_ScreenOrientation: {type: Object},   // for change in screen orientation  by resize window or rotate device
    react_InitializeReady: {type: Boolean},

    // local reactive variables
    react_ShutterPosition: {state: true},      // for dragging shutter onscreen
    react_TiltPosition: {state: true},         // for dragging tilt-shutter onscreen
    react_ResizeDivShutterSelector: {state: true, type: Boolean}, // for detecting resize of shutter div by responsive design
  };
  constructor(){
    super(); //  mandetory by Lit-element


    this.screenPosition=-1;
    this.actualScreenPosition=-1; // position on the computerscreen
    this.actualTiltPosition=-1; // real tilt position
    this.positionText ='';
    this.action = '#';

    this[C.ESC_CLASS_SELECTOR]=null;
  }
  shouldUpdate(changedProperties)
  {
    let doUpdate =false;
    //debugger; // test cfg here...
    changedProperties.forEach((oldValue, propName) => { // eslint-disable-line no-unused-vars
      console.log(`  Cover shouldUpdate, Property [${propName}] changed. oldValue: ${oldValue} newValue: ${this[propName]}, name: ${this.cfg.friendlyName()}`);
      const cfgWindow = this.cfg;

      if (cfgWindow instanceof windowCfgNew){

        outer: // label for break outer, see below:
        for (const cfgCover of cfgWindow.cfg.covers) {
          if (cfgCover.entityId()) {
            debugger;
          }
          for (const cfgEntity of cfgCover.cfg.entities) {
            const coverEntityId = cfgEntity.entityId();
            if (cfgEntity.entityId()) {
              //debugger;
              doUpdate = this.checkShutterState(cfgEntity);
              doUpdate = this.checkSubEntityStates(cfgEntity,doUpdate);
              if (doUpdate){
                break outer;
              }
            }
          }
        }
      }
    });
    doUpdate =(this.react_InitializeReady) ? true : doUpdate;
    return doUpdate;
  }
  checkShutterState(cfg)
  {
    let doUpdate=false;
    const coverEntityId = cfg.entityId();
    const currentShutterEntity =cfg.getCoverEntity();
    let shutterStateOld= cfg.getCoverState();
    // get new state
    const liveCoverEntity = new haEntity(this.hass,coverEntityId);
    let shutterStateNew= cfg.getCoverState(liveCoverEntity);
    if (shutterStateNew != shutterStateOld){
      doUpdate =true;
      cfg.updateCoverEntity(liveCoverEntity);
    }
    return doUpdate;
  }
  checkSubEntityStates(cfg,doUpdate)
  {
    for (let type of C.DEVICES_CLASSES_SUB_ENTITIES) {
      const subEntity = cfg.subEntity[type];
      const currentEntity = subEntity?.entity;
      if (currentEntity) {
        //const entityId = subEntity?.entityId;
        const entityId = currentEntity.getEntityId();
        const liveEntity = new haEntity(this.hass,entityId);
        if (liveEntity && liveEntity.getState() !== currentEntity.getState() ){
          doUpdate =true;
          subEntity.update(liveEntity);
        }
      }
    }
    return doUpdate;
  }
  connectedCallback() {
    super.connectedCallback();
    this.cfg.enhancedShutter=this;
    //let test=1;
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  startResizeObserver() {
    const onResize = (entries) => {
      if (getDebug()) resizeDebugger(entries,this.cfg.friendlyName());

      /* Things todo when resize is detected */
      entries.forEach(entry =>{
        // keep size due to start-up sizing problem in card-editor.
        // TODO this should be solved by some async/await, but don't know how (yet)
        this.actualWidthEdit = Math.floor(entry.contentRect.width);
        this.actualHeightEdit= Math.floor(entry.contentRect.height);
      })
      this.react_ResizeDivShutterSelector = !this.react_ResizeDivShutterSelector;
    }
    this.resizeObserver = new ResizeObserver(onResize);
    this.resizeObserver.observe(this[C.ESC_CLASS_SELECTOR]);
  }
  update(changedProperties) {
    super.update(changedProperties);  // this calls the render() function.
    /*
    changedProperties.forEach((oldValue, propName) => {
      console_log(`${this.cfg.friendlyName()}: Shutter Update, Property ${propName} changed. oldValue: ${oldValue}; new: ${this[propName]}`);
    });
    */
    this.action='cover-update';
  }

  render()
  {
    //let entityId = this.cfg.entityId();
    //let positionText;
    //console.log('action: ',this.action);
    if (this.action=='user-drag-picker'){
      // position from screen-dragging shown
      this.actualScreenPosition = this.screenPosition;  // old
      this.actualShutterPosition = this.react_ShutterPosition;
      this.actualTiltPosition = this.cfg.currentBaseTiltPosition();
    }else if (this.action=='user-drag-slider'){
      // position from screen-dragging of the shown slider
      this.actualScreenPosition =  this.defScreenPositionFromCurrentPosition(this.react_ShutterPosition);
      this.actualShutterPosition = this.react_ShutterPosition;
      this.actualTiltPosition = this.cfg.currentBaseTiltPosition();
    }else if (this.action=='user-drag-tilt'){
      // tilt position from slider-dragging shown
      this.actualScreenPosition =  this.defScreenPositionFromCurrentPosition(); //old
      this.actualShutterPosition = this.cfg.currentDevicePosition();
      this.actualTiltPosition = this.react_TiltPosition;
    }else{
      // physical position cover shown.
      this.actualScreenPosition =  this.defScreenPositionFromCurrentPosition();
      this.actualShutterPosition = this.cfg.currentDevicePosition()?? 0;
      this.actualTiltPosition = this.cfg.currentDeviceTiltPosition() ?? 0;
    }
    this.react_TiltPosition = this.actualTiltPosition; // TODO: logical not needed, but actual it does: check
    this.react_ShutterPosition = this.actualShutterPosition;
    //console_log(`Render Cover ${this.cfg.friendlyName()}, action: ${this.action}, actualScreenPosition: ${this.actualScreenPosition}, actualShutterPosition: ${this.actualShutterPosition}, actualTiltPosition: ${this.actualTiltPosition}`);
    //console_log(`${this.cfg.friendlyName()} HtmLblock for Show`);


    const windowBlock = new HtmlBlocks.htmlBlockWindow(this,this.cfg,this.action);

    return windowBlock.show();
  }
  firstUpdated() {
    // openClosePicker
    const openClosePicker = findElement(this, `.${C.ESC_CLASS_SELECTOR_PICKER}`);
    if (openClosePicker) {
      this.manageEvents(C.ADD_EVENT, C.MOUSEDOWN, openClosePicker, this.mouseDownOpenClosePicker);
    }
/*
    // possible picker2 detection, not sure yet (MHA)

    const openClosePicker_2 = findElement(this, `.${C.ESC_CLASS_SELECTOR_PICKER}_2`);
    if (openClosePicker_2) {
      this.manageEvents(C.ADD_EVENT, C.MOUSEDOWN, openClosePicker_2, this.mouseDownOpenClosePicker_2);

    }
*/
    // openCloseSlider
    if (this.cfg.showOpenCloseSliderBlock() && this.cfg.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION)){
      this.openCloseSlider = findElement(this,`.${C.ESC_CLASS_SLIDER_CLASS}.openclose`);
      if (this.openCloseSlider) {
        this.manageEvents(C.ADD_EVENT, C.MOUSEDOWN, this.openCloseSlider, this.mouseDownOpenCloseSlider);
      }
    }
    // tiltSlider
    if (this.cfg.canTilt()&& this.cfg.showTiltSliderBlock()){
      this.tiltSlider = findElement(this,`.${C.ESC_CLASS_SLIDER_CLASS}.tilt`);
      if (this.tiltSlider) {
        this.manageEvents(C.ADD_EVENT, C.MOUSEDOWN, this.tiltSlider, this.mouseDownTiltSlider);
      }
    }
    // main window
    this[C.ESC_CLASS_SELECTOR] = findElement(this, `.${C.ESC_CLASS_SELECTOR}`);
    if (this[C.ESC_CLASS_SELECTOR]) {
      this.startResizeObserver();
    }
  }

  manageEvents(action, mouseState, target, handler) {

    const EVENTS = {
      [C.MOUSEDOWN]: ['touchstart', 'mousedown', 'pointerdown'],
      [C.MOUSEMOVE]: ['touchmove', 'mousemove', 'pointermove'],
      [C.MOUSEUP]:   ['touchend', 'mouseup', 'pointerup']
    };
    const eventMethod = {
       [C.ADD_EVENT]:    target.addEventListener.bind(target),
       [C.REMOVE_EVENT]: target.removeEventListener.bind(target)
    }
    for (const type of EVENTS[mouseState]) {
      if (mouseState === C.MOUSEDOWN && type === 'touchstart' && action === C.ADD_EVENT) {
        // Workaround: reattach touchstart as non-passive
        target.removeEventListener(type, handler);
        eventMethod[action](type, handler, { passive: false });
      } else {
        //method(type, handler);
        eventMethod[action](type, handler);
      }
    }
  }
  getOverflow(){
    return 'hidden';
    return this.cfg.debug()?'visible':'hidden';
  }

  getTiltAngleDeg(sliderPosition){
    const angleDeg = this.getTiltAngle(sliderPosition)+'deg';
    return angleDeg;
  }
  getTiltAngleDegGraph(sliderPosition){
    const angleDeg =Math.min(-4,(Math.max(-176,this.getTiltAngle(sliderPosition))))+this.tiltIconRotate2()+'deg';
    return angleDeg;
  }
  getTiltAngle(sliderPosition){
    const angle = -(this.cfg.tiltAngleMin() + (sliderPosition / 100) * (this.cfg.tiltAngleMax() - this.cfg.tiltAngleMin()));
    return angle;
  }

  updated(changedProperties) {
    // after update and render
    super.updated(changedProperties);
    if (this.cfg.canTilt()){
      if (this.tiltSlider) this.tiltSlider.value = this.react_TiltPosition  ; // TODO !!!!! Special ..Bug ??...
    }
    if (this.cfg.showOpenCloseSliderBlock()){
      if (this.openCloseSlider) this.openCloseSlider.value = this.react_ShutterPosition; // TODO !!!!! Special ..Bug ??...
    }
    this.action='cover-updated';
  }


/**
 * TRANSFORM FUNCTIONS
 */

  transformDiv(screenPosition){
    // TODO: improve handling screenPosition
    const size_x = this.actualGlobalWidthPx();
    const size_y = this.actualGlobalHeightPx();
    const size_global = new xyPair(size_x,size_y);
    const size_local=this.cfg.switchAxis(size_global);
    return [
      this.cfg.transformTranslate(size_global.x()/2,size_global.y()/2), // to mid-point
      this.cfg.transformRotate(), // rotate around div transform-origin
      this.cfg.transformScale(size_global.x,size_global.y), // correct local sizes
      this.cfg.transformTranslate(0,-size_local.y()/2 + screenPosition),  // Move to correct position
    ].join(C.SPACE);
  }
  transformPicker(screenPosition,mirror=false){
    // TODO: improve handling screenPosition
    const size_x = this.actualGlobalWidthPx();
    const size_y = this.actualGlobalHeightPx();
    const size_global = new xyPair(size_x,size_y);
    const size_local=this.cfg.switchAxis(size_global);
    return [
      this.cfg.transformTranslate(size_global.x()/2,size_global.y()/2), // to mid-point
      this.cfg.transformRotate(), // rotate around div transform-origin
      mirror ? this.cfg.transformMirrorY() : '',
      this.cfg.transformScalePicker(size_global.x(),size_global.y()), // correct local width of the Picker
      this.cfg.transformTranslate(0,-size_local.y()/2 + screenPosition),  // Move to correct position

    ].join(C.SPACE);
  }
  transformSlide(screenPosition,mirror=false){
    // TODO: improve handling screenPosition
    const size_x = this.actualGlobalWidthPx();
    const size_y = this.actualGlobalHeightPx();
    const size_global = new xyPair(size_x,size_y);
    const size_local=this.cfg.switchAxis(size_global);
    return [
      this.cfg.transformTranslate(size_global.x()/2,size_global.y()/2), // to mid-point
      this.cfg.transformRotate(), // rotate around div transform-origin
      mirror ? this.cfg.transformMirrorY() : '',
      this.cfg.transformScalePicker(size_global.x(),size_global.y()), // correct local width of the Picker
      this.cfg.transformTranslate(0,-size_local.y()/2 + screenPosition),  // Move to correct position

    ].join(C.SPACE);
  }

  transformUndoSlatsRotate(){

    let rotate;
    let size_x;
    let size_y;
    if (this.cfg.rotateSlatsImage()){
      size_x = 1;
      size_y = 1;
      rotate =  0;
    }else{
      size_x = this.actualGlobalWidthPx();
      size_y = this.slatsSlideHeightPx();
      rotate = -this.cfg.getCloseAngle();
    }
    return [
      this.cfg.transformRotate(rotate), // rotate around div transform-origin
      this.cfg.transformScale(size_x,size_y), // correct local width of the main
    ].join(C.SPACE);
  }
  transformTiltSlatRotate(){
    // --esc-transform-tilt-slat-rotate
    let rotate;
    if (this.cfg.rotateSlatsImage()){
      rotate = 0;
    }else{
      rotate = -90;
    }
    return [
      this.cfg.transformRotate(rotate), // rotate around div transform-origin
    ].join(C.SPACE);
  }
  sliderWritingMode(){
    const mode= this.cfg.buttonGroupInRow() ? 'vertical-rl' : 'horizontal';
    return mode;
  }
  sliderDirection(){
    const direction= this.cfg.buttonGroupInRow() ? 'rtl' : 'ltr';
    return direction;
  }
  tiltIconRotate2(){
    let rotate= this.cfg.buttonGroupInRow() ? 0 : -90;
    return rotate;
  }
  tiltSlatOrigin(){
    // --esc-tilt-slat-origin
    let origin;
    if (this.cfg.rotateSlatsImage()) {
      origin = '50% 50%';
    }else{
      const width = ((this.shutterSlatSize().x())/2)+C.UNITY;
      origin = `${width} ${width}`;
    }
    return origin;
  }
  transformPartial(){
    const size_x = this.actualGlobalWidthPx();
    const size_y = this.actualGlobalHeightPx();
    const size_global = new xyPair(size_x,size_y);
    const size_local=this.cfg.switchAxis(size_global);
    const position = this.defScreenPositionFromCurrentPosition(this.cfg.calcOffset(this.cfg.partial()));
    return [
      this.cfg.transformTranslate(size_global.x()/2,size_global.y()/2), // to mid-point
      this.cfg.transformRotate(), // rotate around div transform-origin
      this.cfg.transformScale(size_global.x(),size_global.y()), // correct local sizes
      this.cfg.transformTranslate(0,-size_local.y()/2+position),  // Move to correct position
    ].join(C.SPACE);
  }
  transformMovement(mirror=false){
    const size_x = this.actualGlobalWidthPx();
    const size_y = this.actualGlobalHeightPx();
    const size_global = new xyPair(size_x,size_y);
    const size_local=this.cfg.switchAxis(size_global);
    const position = this.offsetOpenedPx()+this.coverSizeMovingDirectionPx()/2.0;
    return [
      'translate(-50%, -50%)',
      this.cfg.transformTranslate(size_global.x()/2,size_global.y()/2), // to mid-point
      this.cfg.transformRotate(), // rotate around div transform-origin
      mirror ? this.cfg.transformMirrorY() : '',
      this.cfg.transformTranslate(0,-size_local.y()/2+position),  // Move to correct position
    ].join(C.SPACE);
  }


  coverSizeMovingDirectionPx(){
    return this.cfg.verticalMovement() ? this.coverHeightPx():this.coverWidthPx();
  }
  windowSizeMovingDirectionPx(){
    return this.cfg.verticalMovement()
      ? this.actualGlobalHeightPx()
      : this.actualGlobalWidthPx();
  }
  slatsSizeMovingDirectionPx(){
    const value = this.cfg.rotateSlatsImage()
      ? this.slideHeightPx()-this.shutterBottomSize().y()
      : this.slideHeightPx();
    return value;
  }

  coverHeightPx(){
    return this.actualGlobalHeightPx()-this.offsetClosedPx() - this.offsetOpenedPx();
  }
  coverWidthPx(){
    return this.actualGlobalWidthPx()-this.offsetClosedPx() - this.offsetOpenedPx();
  }
  shutterBottomSize(){
    const imageSize = this.escImages.getShutterBottomImageSize(this.cfg.id());
    return imageSize;
  };

  shutterMainBackgroundPosition(){

    const direction=this.cfg.unrollUnfoldDirection();
    const dirs={
      [C.DOWN]:C.BOTTOM,
      [C.UP]:C.TOP,
      [C.LEFT]:C.LEFT,
      [C.RIGHT]:C.RIGHT
    };
    const position = this.cfg.rotateSlatsImage() ? C.BOTTOM : dirs[direction] || C.BOTTOM;
    return position;
  }
  shutterEdgeBackgroundPosition(){
    const position = C.BOTTOM
    return position;
  }
  shutterSlatSizePercentage(){
    let imageSize = new xyPair();
    let imagePercentage = new xyPair();
    imageSize.fill2(this.shutterSlatSize());
    if (this.cfg.rotateSlatsImage()) {
      imagePercentage.fill2(this.sizePercentageSlat(imageSize));
    }else{
      //if (!this.cfg.verticalMovement()) imageSize =  new xyPair(imageSize.y(), imageSize.x());
      if (!this.cfg.verticalMovement()) imageSize.switch();
      imagePercentage.fill2(this.sizePercentageSlat(imageSize));
      //if (!this.cfg.verticalMovement()) imagePercentage = new xyPair(imagePercentage.y(), imagePercentage.x());
      if (!this.cfg.verticalMovement()) imagePercentage.switch();
      imagePercentage.fill("50%","50%");
    }
    let sizeText = `${imagePercentage.x()} ${imagePercentage.y()}`;
    return sizeText;
  }
  shutterSlatsSizePercentage(){
    let imageSize = new xyPair();
    let imagePercentage = new xyPair();
    imageSize.fill2(this.shutterSlatSize());
    if (this.cfg.rotateSlatsImage()) {
      imagePercentage.fill2(this.sizePercentage(imageSize));
    }else{
      //if (!this.cfg.verticalMovement()) imageSize =  new xyPair(imageSize.y(), imageSize.x());
      if (!this.cfg.verticalMovement()) imageSize.switch();
      imagePercentage.fill2(this.sizePercentage(imageSize));
      //if (!this.cfg.verticalMovement()) imagePercentage = new xyPair(imagePercentage.y(), imagePercentage.x());
      if (!this.cfg.verticalMovement()) imagePercentage.switch();
    }
    let sizeText = `${imagePercentage.x()} ${imagePercentage.y()}`;
    return sizeText;
  }
  canShowTilt(){
    // when no size, no Tilt show possible
    return this.slatSizeMovingDirectionPx()? true:false;
  }
  slatSizeMovingDirectionPx(){
    //const value = this.cfg.verticalMovement() || this.cfg.rotateSlatsImage()
    const value = this.cfg.rotateSlatsImage()
      ? this.shutterSlatSize().y()
      : this.shutterSlatSize().x();
    return value;
  }
  shutterSlatSize(){
    const imageSize = this.escImages.getShutterSlatImageSize(this.cfg.id())
    return imageSize;
  }


  shutterBottomSizePercentage(){
    const imageSize = this.escImages.getShutterBottomImageSize(this.cfg.id())
    let size;
    if (this.cfg.stretchEdgeImage()){
      size= `100% ${imageSize.y()}px`;
    }else{
      size= `${imageSize.x()}px ${imageSize.y()}px`;
    }
    return size;
  }
  sizePercentage(imageSize){
    let width;
    let height = this.slatsSlideHeightPx();
    if (this.cfg.verticalMovement()) {
      width = this.cfg.windowWidthPx();
    }else{
      width = this.cfg.windowHeightPx();
    }
    let x = 100/(width/imageSize.x())+ "%"; // TODO stretch_bottom_image
    let y = 100/(height/imageSize.y())+ "%"; // TODO stretch_bottom_image
    let size = new xyPair(x,y);
    return size;

  }
  sizePercentageSlat(imageSize){
    let width;
    let height = this.shutterSlatSize().y();
    if (this.cfg.verticalMovement()) {
      width = this.cfg.windowWidthPx();
    }else{
      width = this.cfg.windowHeightPx();
    }

    // let factor = width / imageSize.x;
    let x = `calc(100% / (${width}/${imageSize.x()}))`; // TODO stretch_bottom_image
    let y = `calc(100% / (${height}/${imageSize.y()}))`; // TODO stretch_bottom_image
    let size = new xyPair(x,y);
    return size;

  }


  offsetOpenedPx(){
    return Math.round(this.cfg.offsetOpenedPct()/ 100 * this.windowSizeMovingDirectionPx());
  }
  offsetClosedPx(){
    return Math.round(this.cfg.offsetClosedPct())/ 100 * this.windowSizeMovingDirectionPx();
  }
  /**
   *
   * @returns Netto local height of the slats-part (= total - edge)
   */
  slatsSlideHeightPx(){
    return this.slideHeightPx()-this.shutterBottomSize().y();
  }
  /**
   * @return Local height of the slide-part
   */
  slideHeightPx(){
    const size = this.windowSizeMovingDirectionPx();
    return size;
  }
  slatHeightPx(){
    return this.slatSizeMovingDirectionPx();
  }
  slatHeightPx1(){
    return this.slatsSizeMovingDirectionPx();
  }
  coverOpenedPx(){
    return this.offsetOpenedPx();
  }
  coverClosedPx(){
    const size_global = new xyPair(this.actualGlobalWidthPx(),this.actualGlobalHeightPx());
    const size_local=this.cfg.switchAxis(size_global);

    return size_local.y()-this.offsetClosedPx();
  }
  tiltSlatHeightPx(){
    let value;
    if (this.cfg.rotateSlatsImage()){
      value = this.shutterSlatSize().y();
    }else{
      value =this.slatHeightPx1();
    }
    return value;
  }
  tiltSlatWidthPx(){
    let value;

    if (this.cfg.rotateSlatsImage()){
      value = '100%';
    }else{
      value = (this.shutterSlatSize().x()/this.cfg.windowWidthPx()*100)+'%';
    }
    return value;
  }
  tiltSlatBackgroundSize(){
    let value;
    if (this.cfg.rotateSlatsImage()){
      value = this.shutterSlatSizePercentage();
    }else{
      // value = '100% '+(this.shutterSlatSize().y()/this.cfg.windowHeightPx()*100)+'%';
      value = '100% 100%';
    }
    return value;
  }

  defScreenPositionFromCurrentPosition(currentDevicePosition=this.cfg.currentDevicePosition()) {

    let visiblePosition = this.cfg.visiblePosition(currentDevicePosition);
    let screenPosition = this.offsetOpenedPx() + (this.coverSizeMovingDirectionPx() * (this.cfg.invertPosition(visiblePosition)) / 100) ;
    return screenPosition;

  }

  actualGlobalWidthPx() {
    let width;
    if (this.actualWidthEdit) {
      width = this.actualWidthEdit; // Should be solved by an async /await / promise ...
    }else{
      width = this[C.ESC_CLASS_SELECTOR]?.getBoundingClientRect()?.width ?? this.cfg.windowWidthPx();
    }
    return width;

  }
  actualGlobalHeightPx() {
    let height;
    if (this.actualHeightEdit) {
      height = this.actualHeightEdit; // Should be solved an by asymc /await / promise ...
    }else{
      height = this[C.ESC_CLASS_SELECTOR]?.getBoundingClientRect()?.height ?? this.cfg.windowHeightPx();
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

    this.action='user-pick-on-click';
    // for New cfg: multiple covers... 
    let entityId= this.cfg.entityId();

    if (position !==null) position = this.cfg.applyInvertToPosition(position);

    const services ={
      [C.ACTION_SHUTTER_OPEN] : {'args': ''},
      [C.ACTION_SHUTTER_CLOSE] : {'args': ''},
      [C.ACTION_SHUTTER_STOP] : {'args': ''},
      [C.ACTION_SHUTTER_SET_POS] : {'args': {position: position}},
      [C.ACTION_SHUTTER_OPEN_TILT] : {'args': ''},
      [C.ACTION_SHUTTER_CLOSE_TILT] : {'args': ''},
      [C.ACTION_SHUTTER_SET_POS_TILT] : {'args': {tilt_position: position}},
    }
    //console.log('=> doOnclick: command:',command,'position:',position,'entityId:',entityId);
    this.callHassCoverService(entityId,command,services[command].args);
  }
  getBasePickPoint(event){
    /* get picked point */
    this.basePickPoint = this.getPoint(event);
    /* get current shutter position on screen */
    this.basePickPoint.shutterScreenPos = this.defScreenPositionFromCurrentPosition();

  }

  getShutterOnScreenPosition(event){
    const screenPosition = this.getScreenPosFromPickPoint(event);
    //console.log('    ==> getShutterOnScreenPosition: screenPosition:',screenPosition);
    const shutterPosition = this.getShutterPosFromScreenPos(screenPosition);
    //console.log('    ==> getShutterOnScreenPosition: shutterPosition:',shutterPosition);
    return shutterPosition; // between 0-100
  }
  getTiltOnScreenPosition(){
    // since Tilt uses Slider, event is not needed
    const  tiltPosition = parseFloat(this.tiltSlider.value) ?? 0;
    return tiltPosition; // between 0-100
  }
  getOpenCloseOnScreenPosition(){
    // since Tilt uses Slider, event is not needed
    const  shutterPosition =  parseFloat(this.openCloseSlider.value) ?? 0;
    return shutterPosition; // between 0-100
  }

  getShutterPosFromScreenPos(screenPosition){
    let shutterPosition = C.SHUTTER_OPEN_PCT - Math.round((screenPosition - this.offsetOpenedPx()) * (this.cfg.offset()) / this.coverSizeMovingDirectionPx());
    //console.log('this.offsetOpenedPx() ',this.offsetOpenedPx());
    //console.log('this.cfg.offset() ',this.cfg.offset());
    //console.log('this.coverSizeMovingDirectionPx() ',this.coverSizeMovingDirectionPx());

    return shutterPosition;
  }

  getScreenPosFromPickPoint(event){
    const pickPoint = this.getPoint(event);
    //console.log('   =====>>> getScreenPosFromPickPoint: pickPoint:',pickPoint);
    //console.log('   =====>>> getScreenPosFromPickPoint: this.basePickPoint:',this.basePickPoint);
    let delta = new xyPair(pickPoint.coord.x() - this.basePickPoint.coord.x() ,
                           pickPoint.coord.y() - this.basePickPoint.coord.y());
    let delta_local = this.cfg.rotateBackOrtho(delta);
    //console.log('   =====>>> getScreenPosFromPickPoint: delta:',delta);
    //console.log('   =====>>> getScreenPosFromPickPoint: delta_local:',delta_local);

    let newScreenPosition =
      Math.round(boundary(
        this.basePickPoint.shutterScreenPos + delta_local.y(),
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
/**
 * MOUSE DOWN
 */
  mouseDownOpenClosePicker = (event) =>
  {
    if (event.pageY === undefined || this.cfg.passiveMode()) return;
    if (event.cancelable) {
      //Disable default drag event
      event.preventDefault();
    }
    this.action='user-drag-picker';
    this.getBasePickPoint(event);
    this.manageEvents(C.ADD_EVENT, C.MOUSEMOVE, this, this.mouseMoveOpenClosePicker);
    this.manageEvents(C.ADD_EVENT, C.MOUSEUP, window, this.mouseUpOpenClosePicker);
    //console.log('mouseDownOpenClosePicker:',this.react_ShutterPosition,this.positionText);
  };
  mouseDownTiltSlider = () => {
    this.action='user-drag-tilt';
    this.manageEvents(C.ADD_EVENT, C.MOUSEMOVE, this, this.mouseMoveTiltSlider);
    this.manageEvents(C.ADD_EVENT, C.MOUSEUP, window, this.mouseUpTiltSlider);
  }
  mouseDownOpenCloseSlider = () => {
    this.action='user-drag-slider';
    this.manageEvents(C.ADD_EVENT, C.MOUSEMOVE, this, this.mouseMoveOpenCloseSlider);
    this.manageEvents(C.ADD_EVENT, C.MOUSEUP, window, this.mouseUpOpenCloseSlider);
  }
/**
 * MOUSE MOVE
 */
  mouseMoveOpenClosePicker = (event) =>
  {
    if (event.pageY === undefined) return;
    this.action='user-drag-picker';
    this.screenPosition = this.getScreenPosFromPickPoint(event); //old
    const tiltPosition = this.cfg.currentDeviceTiltPosition();
    //console.log('mouseMoveOpenClosePicker1:',this.react_ShutterPosition,tiltPosition,this.positionText);
    this.react_ShutterPosition = this.getShutterOnScreenPosition(event);
    this.positionText = this.cfg.createPositionText(this.react_ShutterPosition,tiltPosition);
    //console.log('mouseMoveOpenClosePicker2:',this.react_ShutterPosition,tiltPosition,this.positionText);
  };
  mouseMoveTiltSlider = (event) => { // mouseMoveTilt
    this.action='user-drag-tilt';
    this.react_TiltPosition = this.getTiltOnScreenPosition(event);
    const shutterPosition = this.cfg.currentDevicePosition();
    this.positionText = this.cfg.createPositionText(shutterPosition,this.react_TiltPosition);
    //console.log('mouseMoveTiltSlider:',shutterPosition,this.react_TiltPosition,this.positionText);
  }
  mouseMoveOpenCloseSlider = (event) => { // mouseMoveTilt
    this.action='user-drag-slider';
    this.react_ShutterPosition = this.getOpenCloseOnScreenPosition(event); // TODO
    const tiltPosition = this.cfg.currentDeviceTiltPosition();
    this.positionText = this.cfg.createPositionText(this.react_ShutterPosition,tiltPosition);
    //console.log('mouseMoveOpenCloseSlider:',this.react_ShutterPosition,tiltPosition,this.positionText);
  }
/**
 * MOUSE UP
 */

  mouseUpTiltSlider = (event) => {
    this.action='user-drag-tilt';
    this.manageEvents(C.REMOVE_EVENT, C.MOUSEMOVE, this, this.mouseMoveTiltSlider);
    this.manageEvents(C.REMOVE_EVENT, C.MOUSEUP, window, this.mouseUpTiltSlider);
    this.react_TiltPosition = this.getTiltOnScreenPosition(event)
    this.sendTilt(this.react_TiltPosition);
  }
  mouseUpOpenCloseSlider = (event) => {
    this.action='user-drag-slider';
    this.manageEvents(C.REMOVE_EVENT, C.MOUSEMOVE, this, this.mouseMoveOpenCloseSlider);
    this.manageEvents(C.REMOVE_EVENT, C.MOUSEUP, window, this.mouseUpOpenCloseSlider);
    this.react_ShutterPosition =  this.getOpenCloseOnScreenPosition(event);
    this.sendOpenClose(this.react_ShutterPosition);
  }
  mouseUpOpenClosePicker = (event) => {
    if (event.pageY === undefined) return;
    this.action='user-drag-picker';
    this.manageEvents(C.REMOVE_EVENT, C.MOUSEMOVE, this, this.mouseMoveOpenClosePicker);
    this.manageEvents(C.REMOVE_EVENT, C.MOUSEUP, window, this.mouseUpOpenClosePicker);
    //console.log('mouseUpOpenClosePicker1:',this.react_ShutterPosition,this.positionText);
    this.react_ShutterPosition = this.getShutterOnScreenPosition(event);
    this.sendOpenClose(this.react_ShutterPosition);
    //console.log('mouseUpOpenClosePicker2:',this.react_ShutterPosition,this.positionText);
    console.log("=================");
  };
  sendOpenClose(shutterPosition){
    if (this.cfg.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION)){
      // send position to shutter
      this.sendShutterPosition(this.cfg.entityId(), shutterPosition);
    }else{
      // no ESC_FEATURE_SET_POSITION, so send open- or close-action
      const actionToSend = (shutterPosition > 50) ? C.ACTION_SHUTTER_OPEN : C.ACTION_SHUTTER_CLOSE;
      this.callHassCoverService(this.cfg.entityId(),actionToSend);
      //this.requestUpdate();
    }
  }
  sendTilt(tiltPosition){
    if (this.cfg.isCoverFeatureActive(C.ESC_FEATURE_SET_TILT_POSITION)){
      // send tilt position to shutter
      this.sendShutterTiltPosition(this.cfg.entityId(), tiltPosition);
    }else{
      // no ESC_FEATURE_SET_TILT_POSITION, so send open- or close-action
      const actionToSend = (tiltPosition > 50) ? C.ACTION_SHUTTER_OPEN_TILT : C.ACTION_SHUTTER_CLOSE_TILT;
      this.callHassCoverService(this.cfg.entityId(),actionToSend);
      //this.requestUpdate();
    }
  }

  sendShutterPosition( entityId, position)
  {
    this.callHassCoverService(entityId,C.ACTION_SHUTTER_SET_POS, { position: this.cfg.applyInvertToPosition(position) });
  }
  sendShutterTiltPosition( entityId, position)
  {
    this.callHassCoverService(entityId,C.ACTION_SHUTTER_SET_POS_TILT, { tilt_position: this.cfg.applyInvertToTiltPosition(position) });
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
    return css`${unsafeCSS(C.SHUTTER_CSS)}
    `
  }
}
