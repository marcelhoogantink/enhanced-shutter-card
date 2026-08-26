import {html,nothing} from './lit/lit-core.min.js';
import * as C from './constants.js';
import {htmlStyleVars} from './htmlStyleVars.js';
import {xyPair} from './xyPair.js';
import {
  getTextSize,
  console_log
} from './functions.js';
import {
  shutterCfg,
  windowCfgNew,
  coverCfgNew,
  entityCfgNew
} from './cfg.js';
import {MessageManager, htmlCard} from './classes.js';


export class htmlBlock
{
  #xySize = new xyPair();
  #htmlString = ''

  static LEVELS = [
      { childKey: C.WINDOWS_CONFIG,     func: "defineHtmlCard"  },
      { childKey: C.COVERS_CONFIG,      func: "defineHtmlWindow"  },
      { childKey: C.ENTITIES_CONFIG,    func: "defineHtmlCover" },
      { childKey: "",                   func: "defineHtmlEntity"  },
    ];

  static escImages =null;

  static setImages(escImages) {
    htmlBlock.escImages = escImages;
  }

  constructor(shutter,cfg){
    //this.enhancedShutter=enhancedShutter;
    this.shutter = shutter;


    //this.cfg=shutter.cfg;
    this.cfg=cfg;
    //this.escImages= shutter.escImages ?? {};
    this.actualScreenPosition = shutter.actualScreenPosition;
    this.actualTiltPosition = shutter.actualTiltPosition;
    this.actualShutterPosition = shutter.actualShutterPosition;
    //console_log("====>>>",shutter.actualScreenPosition,shutter.actualTiltPosition,shutter.actualShutterPosition);
  }
  get escImages(){
    return htmlBlock.escImages;
  }
  show(){
    if (!this.getHtmlString()) this.defineHtml();
    return this.getHtmlString();
  }
  size(){
    if (!this.#xySize.size()) {
      this.defineSize()
    }
    this.displaySize(this.#xySize);
    return this.#xySize;
  }
  displaySize(xy){
    console_log (this.constructor.name,xy.x(),xy.y());
  }
  defineSize(){
    debugger;
    this.setXySize(new xyPair(-1,-1)); // this defineSize() should not be used direct from htmlBlock
  }
  setXySize(xy){
    this.#xySize = xy;
  }
  defineHtml(){
    this.setHtmlString(nothing);
  }
  defineHtmlCard(index,flatObj,children){
    debugger;
    return nothing;
  }
  defineHtmlWindow(index,flatObj,children){
    debugger;
    return nothing;
  }
  defineHtmlCover(index,flatObj,children){
    debugger;
    return nothing;
  }
  defineHtmlEntity(index,flatObj,children){
    debugger;
    return nothing;
  }
  setHtmlString(htmlString){
    this.#htmlString = htmlString;
  }
  getHtmlString(){
    return this.#htmlString;
  }
  passiveMode(value = null){
    let mode = this.cfg.passiveMode();
    if (value!== null && mode) console.warn('Passive mode, no action');
    return mode;
  }
  openingPosition(value = null){
    if (value !== null  && this.cfg.openingPosition(value) === null)
    {
      // Not definined ?? then take namePosition setting
      value = this.cfg.namePosition();
    }
    return this.cfg.openingPosition(value);
  }

  showPartialOpenButtons(){
    const show = this.cfg.showPartialOpenButtons();
    return show && this.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION);
  }

  partial(value = null){
    let partial = this.partial(); // wil never set the value, only return the value
    if (partial == C.SHUTTER_OPEN_PCT ||  partial == C.SHUTTER_CLOSED_PCT) partial = 0;
    partial = this.cfg.invertPosition(partial);
    // only when cover can set position
    return this.cfg.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION) ? partial : 0;
  }

  offset(value = null){
    let offset = this.offset(); // wil never set the value, only return the value
    if (offset == C.SHUTTER_OPEN_PCT ||  offset == C.SHUTTER_CLOSED_PCT) offset = 0;
    offset = this.cfg.invertPosition(offset);
    // only when cover can set position
    return this.cfg.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION) ? offset : 0;
  }
  buttonsLeftActive(){
    if (this.cfg.showStandardButtons() || this.partialActive())
      return true;
    else
      return false;
  }
  partialActive(){
    return this.cfg.partial() !=C.SHUTTER_OPEN_PCT && this.cfg.partial() != C.SHUTTER_CLOSED_PCT;
  }
  buildRenderRecursive(config, index, depth) {

    if (depth >= htmlBlock.LEVELS.length) return nothing;

    const {childKey,func} = htmlBlock.LEVELS[depth];
    const cfg=config.cfg;


    const children = childKey && Array.isArray(cfg[childKey])
      ? cfg[childKey].map((childCfg, i) => this.buildRenderRecursive(childCfg, i, depth + 1))
      : nothing;

    return this[func](index, config,children);
  }

  showTopBottomDiv(position){
    const shutter = this.shutter;
    let cfg = this.cfg;
    if (cfg instanceof windowCfgNew){
       //debugger;
       cfg = cfg.cfg.covers[0].cfg.entities; // TODO: works for now, but for just 1 cover... not for two or more defined coverd
    }
    else if (cfg instanceof coverCfgNew){
       //debugger;
       cfg = cfg.cfg.entities;
    }
    else if (cfg instanceof entityCfgNew){
       //debugger;
       cfg = [cfg]; // OK .....
    }else{
       cfg = [cfg]; // classic flat shutterCfg
    }

    const htmlOut = html`
      ${cfg.map(cfg => {
        const batteryIconBlock = new htmlBlockBatteryIcon(shutter,cfg);
        const nameAndStateBlock = new htmlBlockNameAndState(shutter,cfg);
        const signalIconBlock = new htmlBlockSignalIcon(shutter,cfg);
        return html`
          <div class="${C.ESC_CLASS_TOP_BOTTOM}">
            ${position == this.cfg.iconsPosition() ? batteryIconBlock.show() : nothing}
            ${nameAndStateBlock.show(position)}
            ${position == this.cfg.iconsPosition() ? signalIconBlock.show() : nothing}
          </div>
       `;
      })}
    `;
    return htmlOut;
  }
  sizeTopBottomDiv(position){
    const shutter = this.shutter;
    const cfg = this.cfg;

    const batteryIconBlock = new htmlBlockBatteryIcon(shutter,cfg);
    const nameAndStateBlock = new htmlBlockNameAndState(shutter,cfg);
    const signalIconBlock = new htmlBlockSignalIcon(shutter,cfg);

    let xyBattery = this.cfg.getIconsActive() && this.cfg.iconsPosition() === position ? batteryIconBlock.size() : new xyPair();
    let xyNameAndState = nameAndStateBlock.size(position);
    let xySignal  = this.cfg.getIconsActive() && this.cfg.iconsPosition() === position ? signalIconBlock.size() : new xyPair();

    let xy = this.gridAddHorizontal(xyBattery,xyNameAndState);
    xy = this.gridAddHorizontal(xy,xySignal);
    return xy;
  }
  gridAddVertical(size1,size2){ //  xyPair's
    return new xyPair (Math.max(size1.x(),size2.x()),size1.y()+size2.y());
  }
  gridAddHorizontal(size1,size2){ //  xyPair's
    return new xyPair(size1.x()+size2.x(),Math.max(size1.y(),size2.y()));
  }
  gridAddBoth(size1,size2){ //  xyPair's
    return new xyPair(size1.x()+size2.x(),size1.y()+size2.y());
  }
  sizeButton(){
    /*
    * size standard-buttons
    */
   let xy;
    if (this.cfg.showStandardButtons()) {
      const haButtonSize = this.cfg.iconButtonSize();
      xy = new xyPair(haButtonSize,haButtonSize);
    }else{
      xy = new xyPair();
    }
    return xy;
  }
  sizeIcon(){
    let xy= new xyPair(C.ICON_DIV_SIZE+2*C.ICON_MARGIN_LR,C.ICON_DIV_SIZE+2*C.ICON_MARGIN_TB);
    return xy;
  }
}
export class htmlBlockCard extends htmlBlock{

  constructor(shutter,cfg,action){
    super(shutter,cfg);
    this.htmlStyles = new htmlStyleVars(this.shutter,this.cfg);
    this.messageManager= shutter.messageManager;

  }
  defineHtml(){
    if (!this.cfg || !this.shutter.hass || !this.shutter.initializeReady){
      return this.setHtmlString(html`
       <ha-card>
          Waiting for Card to initialize...
       </ha-card>
      `);
    }
    this.showMessages = this.messageManager.countMessages() && this.shutter.inEditor();
    //this.shutterSeparateBlock= new HtmlBlocks.htmlBlockShutterSeparate(this.cardCfg,this.cardCfg.cfg);
    this.shutterSeparateBlock= new htmlBlockShutterSeparate(this.shutter,this.shutter.cardCfg);
    let htmlParts = new htmlCard(this.shutter);
    let htmlout;

    htmlout = html`
      ${this.showMessages ? html`${this.messageManager.displayGroupMessages('GridSize')} ` : ''}
      ${this.showMessages ? html`${this.messageManager.displayGroupMessages('General')} ` : ''}
      <ha-card .header=${this.cfg.title}>
        <div
          class="${C.ESC_CLASS_SHUTTERS}"
          style = "${htmlParts.defStyleVarsCard()}"
        >
          ${this.shutter.newConfig
              ? this.htmlOutNew()
              : this.htmlOutOld()}
        </div>
      </ha-card>
    `;
    this.setHtmlString(htmlout);
  }
  htmlOutNew(){
    const startLevel= 0; // start with covers, not card
    const htmlOut = html`
      ${this.buildRender(startLevel)}
    `;
    return htmlOut;
  }
  htmlOutOld(){
    const htmlOut = html`
      ${this.shutter.shutterCfgs.map(cfg => {
        // update the live states and attributes
        return html`
          <div class="${C.ESC_CLASS_SHUTTER_FLEX}">
            <enhanced-shutter
              .react_ShutterState=${cfg.getCoverState()}
              .react_BatteryState=${cfg.getState(cfg.getBatteryEntity())}
              .react_SignalState=${cfg.getState(cfg.getSignalEntity())}
              .react_ScreenOrientation=${this.shutter.screenOrientation}
              .react_InitializeReady=${this.shutter.initializeReady}

              .hass=${this.shutter.hass}
              .cfg=${cfg}
              .escImages=${this.escImages}
            >
            </enhanced-shutter>
            ${this.showMessages ? html`${this.messageManager.displayGroupMessages( cfg.id())} ` : ''}
          </div>
          ${this.shutterSeparateBlock.show()}
        `;
      })}`;
    return htmlOut;
  }
  buildRender(startLevel) {
    const htmlOut = html`${this.buildRenderRecursive(this.shutter.cardCfg,0, startLevel)}`;
    return htmlOut;
  }

  defineHtmlCard(index,flatObj,children){
    //return nothing;
    return html`${children}`;
  }
  defineHtmlWindow(index,flatObj,children){
    //return nothing;
    const cfg=flatObj;
    return html`
      <div class="${C.ESC_CLASS_SHUTTER_FLEX}">
        <enhanced-shutter
          .react_ShutterState=null
          .react_BatteryState=null
          .react_SignalState=null
          .react_ScreenOrientation=${this.shutter.screenOrientation}
          .react_InitializeReady=${this.shutter.initializeReady}

          .hass=${this.shutter.hass}
          .cfg=${cfg}
          .escImages=${this.escImages}
        >
        </enhanced-shutter>
        ${this.showMessages ? html`${this.messageManager.displayGroupMessages( cfg.id())} ` : ''}
      </div>
      ${this.shutterSeparateBlock.show()}
    `;
    //return html`<li><u>Window (${children}) window</u><br></li>`;
  }
  defineHtmlCover(index,flatObj,children){
    //return nothing;
    return html`<li><u>Cover (${children}) cover</u><br></li>`;
  }
  defineHtmlEntity(index,flatObj,children){
    const cfg=flatObj;
    return html`<li><u>Entity (${children}) entity</u><br></li>`;
  }

}
export class htmlBlockWindow extends htmlBlock{
  //entityId = this.cfg.entityId();


  constructor(shutter,cfg,action){
    super(shutter,cfg);
    this.htmlStyles = new htmlStyleVars(this.shutter,this.cfg);
  }

  defineHtml(){

    if (this.cfg instanceof shutterCfg){
      // Old cfg
      this.topBlock = new htmlBlockTop(this.shutter,this.cfg);
      this.middleBlock = new htmlBlockMiddle(this.shutter,this.cfg);
      this.bottomBlock = new htmlBlockBottom(this.shutter,this.cfg);
      this.setHtmlString(html`
        <div
          class=${C.ESC_CLASS_SHUTTER}
          style = "${this.htmlStyles.defStyleVarsAll()}"
        >
        ${this.topBlock.show()}
        ${this.middleBlock.show()}
        ${this.bottomBlock.show()}
        </div>
      `);
    }else{
      // New cfg with tree: card-windows[]-covers[]-entities[]
      const startLevel= 1; // start with covers, not card
      const htmlOut = html`
          ${this.buildRender(startLevel)}
        `;
      this.setHtmlString(htmlOut);
    }
  }
  defineSize(){
    //if (this.cfg instanceof shutterCfg)
    //{
      // old cfg
      this.topBlock = new htmlBlockTop(this.shutter,this.cfg);
      this.middleBlock = new htmlBlockMiddle(this.shutter,this.cfg);
      this.bottomBlock = new htmlBlockBottom(this.shutter,this.cfg);
      let xyTopDiv = this.topBlock.size();
      let xyMiddleDiv = this.middleBlock.size();
      let xyBottomDiv = this.bottomBlock.size();

      let xy = this.gridAddVertical(xyTopDiv,xyMiddleDiv);
      this.setXySize(this.gridAddVertical(xy,xyBottomDiv));
    //}else{
      // New cfg with tree: card-windows[]-covers[]-entities[]
      //debugger;
    //}
  }
// ============================================================
  buildRender(startLevel) {
    const htmlOut = html`${this.buildRenderRecursive(this.cfg,0,startLevel)}`;
    return htmlOut;
  }

  defineHtmlCard(index,flatObj,children){
    return html`${children}`;
  }
  defineHtmlWindow(index,flatObj,children){
    const cfg=flatObj;
    return html`
      <div
        class=${C.ESC_CLASS_WINDOW}
        style = "${this.htmlStyles.defStyleVarsWindow(cfg)}"
      >
        ${this.topBlock.show()}
        ${children}
        ${this.bottomBlock.show()}
      </div>
    `;
  }
  defineHtmlCover(index,flatObj,children){
    const cfg=flatObj;
    return html`
      <div
        class = ${C.ESC_CLASS_COVER}
        style = "${this.htmlStyles.defStyleVarsCover(cfg)}"
      >
        ${children}
      </div>
    `;
  }
  defineHtmlEntity(index,flatObj,children){
    // TODO: somewhwre here also this.htmlStyles.defStyleVarsEntity() ??
    const cfg=flatObj;
    this.topBlock = new htmlBlockTop(this.shutter,cfg);
    this.bottomBlock = new htmlBlockBottom(this.shutter,cfg);
    this.middleBlock = new htmlBlockMiddle(this.shutter,cfg); // TODO: does not work in the tree-cfg; cfg[] is array here ...
    return html`
      <div
        class = ${C.ESC_CLASS_ENTITY}
        style = "${this.htmlStyles.defStyleVarsEntity(cfg)}"
      >
        ${this.middleBlock.show()}
      </div>
    `;
  }

  // ============================================================
}
export class htmlBlockCardTitle extends htmlBlock{
  constructor(shutter,cfg){
    //this.enhancedShutter=enhancedShutter;
    let block = {cfg: shutter};
    super(block,cfg);
  }
  defineSize(){

    let xy = new xyPair();

    let title = this.cfg.title();
    if (title){
      const haCardTitleFontHeight= 24; // TODO: set constant or derive from constants
      const haTitleHeightPx = 76; // TODO: set constant or derive from constants
      const titleSize= getTextSize(title,C.HA_TITLE_FONT,haCardTitleFontHeight);
      xy = new xyPair(titleSize.width,haTitleHeightPx);
    }
    this.setXySize(xy);
  }

}
export class htmlBlockShutterSeparate extends htmlBlock{
  constructor(shutter,cfg){
    //this.enhancedShutter=enhancedShutter;
    let block = {cfg: shutter};
    super(block,cfg);
  }
  defineHtml(){
    this.setHtmlString (html`
      <div class="${C.ESC_CLASS_SHUTTER_SEPARATE}-${this.cfg.stacked()}"></div>
    `);
  }
  defineSize(){
    let xy = this.cfg.stacked()===C.VERTICAL
      ? new xyPair(C.SEPARATE_LENGHT,C.SEPARATE_MARGIN_TB*2+C.SEPARATE_BORDER_WIDTH*2)
      : new xyPair(C.SEPARATE_MARGIN_LR*2+C.SEPARATE_BORDER_WIDTH*2,C.SEPARATE_LENGHT);
    this.setXySize(xy);
  }
}
export class htmlBlockBatteryIcon extends htmlBlock{

  constructor(shutter,cfg){
    super(shutter,cfg);
    //debugger;
  }
  defineHtml(){
    this.setHtmlString(html`
        ${this.cfg.getIconsActive() ? html`
          ${this.cfg.getBatteryEntity() ? html`
            <div class="${C.ESC_CLASS_ICON_LEFT}">
              <ha-icon
                icon=${this.cfg.batteryLevelIcon()}
                class="${C.ESC_CLASS_HA_ICON}"
              >
              </ha-icon>
              <div class="${C.ESC_CLASS_TOP_ICON_TEXT}">
                ${this.cfg.batteryLevelText()}
              </div>
            </div>
            ` : html`
            <div class="${C.ESC_CLASS_ICON_LEFT}">
              <ha-icon
                icon="mdi:blank"
                class="${C.ESC_CLASS_HA_ICON}"
              >
              </ha-icon>
            </div>`
          }
          ` : nothing
        }
    `);

  }
  defineSize(){
    let xy= this.sizeIcon();
    this.setXySize(xy);
  }
}
export class htmlBlockSignalIcon extends htmlBlock{

  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  defineHtml(){
    this.setHtmlString(html`
      ${this.cfg.getIconsActive() ? html`
        ${this.cfg.getSignalEntity() ? html`
          <div class="${C.ESC_CLASS_ICON_RIGHT}">
            <ha-icon
              icon=${this.cfg.signalLevelIcon()}
              class="${C.ESC_CLASS_HA_ICON}"
            >
            </ha-icon>
            <div class="${C.ESC_CLASS_TOP_ICON_TEXT}">
              ${this.cfg.signalLevelText()}
            </div>
          </div>
          ` : html`
          <div class="${C.ESC_CLASS_ICON_RIGHT}">
            <ha-icon
              icon="mdi:blank"
              class="${C.ESC_CLASS_HA_ICON}"
            >
            </ha-icon>
          </div>`
        }
        ` : nothing
      }
    `);
  }
  defineSize(){
    let xy = this.sizeIcon();
    this.setXySize(xy);
  }
}
export class htmlBlockNameAndState extends htmlBlock{

  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  show(blockPosition=C.TOP){
    const cfg = this.cfg;
    const escClassName = blockPosition === C.TOP ? C.ESC_CLASS_TOP : C.ESC_CLASS_BOTTOM;
    const stateBlock= new htmlBlockState(this.shutter,cfg);
    const nameBlock = new htmlBlockName(this.shutter,cfg);
    return html`
      <div class = "${escClassName}">
        ${this.cfg.namePosition() === blockPosition ? nameBlock.show() : nothing}
        ${this.openingPosition() === blockPosition ? stateBlock.show() : nothing}
      </div>
    `;
  }
  size(blockPosition=C.TOP){

    const cfg = this.cfg;
    const stateBlock= new htmlBlockState(this.shutter,cfg);
    const nameBlock = new htmlBlockName(this.shutter,cfg);

    let xyName = this.cfg.namePosition() === blockPosition ? nameBlock.size() : new xyPair();
    let xyState = this.openingPosition() === blockPosition ? stateBlock.size() : new xyPair();
    let xy;
    if (this.cfg.inlineHeader()){
       xy = this.gridAddHorizontal(xyName,xyState);
    }else{
       xy = this.gridAddVertical(xyName,xyState);
    }
    xy = this.gridAddVertical(xy,new xyPair(0,16)); // padding = 16
    // TODO: Only margin if size is available
    // xy = xy.size() ? this.gridAddVertical(xy,new xyPair(0,16)) : xy; // padding = 16
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockName extends htmlBlock{

  constructor(shutter,cfg)
  {
    super(shutter,cfg);
    //debugger;
    if (this.cfg instanceof windowCfgNew){
       //debugger;
      // this.cfg = shutter.cfg.cfg.covers;
    }else{
      //this.cfg = [shutter.cfg];
    }
  }

  defineHtml(){
    this.setHtmlString(html`
      ${this.cfg.showName()
        ? html`
          <div class="${C.ESC_CLASS_LABEL} ${this.cfg.disabledGlobaly() ? `${C.ESC_CLASS_LABEL_DISABLED}` : ''}"
            @click="${() => this.shutter.doHassMoreInfoOpen(this.cfg.entityId())}"
            title="${this.cfg.getCoverEntity()?.getFriendlyName() || C.UNAVAILABLE}"
          >
            ${this.cfg.friendlyName()}
            ${this.passiveMode() ? html`
              <span class="${C.ESC_CLASS_HA_ICON_LOCK}">
                <ha-icon icon="mdi:lock"></ha-icon>
              </span>
            `:nothing}
          </div>
          `
        : nothing
      }
    `);
  }
  defineSize(){
    let xy= new xyPair();
    const shutterTitleHeight = C.FONT_SIZE_LABEL * this.cfg.textScaleFactor();

    if (this.cfg.showName()){
      let titleSize = getTextSize(this.cfg.friendlyName(),C.HA_TITLE_FONT,shutterTitleHeight,'400');
      let x1 = titleSize.width;
      let y1 = C.LINE_HEIGHT_LABEL * this.cfg.textScaleFactor();
      xy = new xyPair(x1,y1);
      if (this.passiveMode()) {
        xy = this.gridAddHorizontal(xy,new xyPair(C.ICON_SIZE_LOCK,C.ICON_SIZE_LOCK));
      }
    }
    this.setXySize(xy);
  }
}
export class htmlBlockState extends htmlBlock{
  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  defineHtml(){
    const positionText =this.cfg.createPositionText(this.actualShutterPosition,this.actualTiltPosition);

    this.setHtmlString(html`
      ${this.cfg.showOpening()
        ? html`
          <div class="${C.ESC_CLASS_POSITION} ${this.cfg.disabledGlobaly() ? `${C.ESC_CLASS_LABEL_DISABLED}` : ''}">
            <span style="white-space: pre-line;">${positionText}</span>
          </div>`
        : nothing
     }
    `);
  }
  defineSize(){
      let text="";
      //let x=0;
      let y1 = C.LINE_HEIGHT_POSITION * this.cfg.textScaleFactor() + 2*C.MARGIN_POSITION;  // including margin
      const shutterTitleHeight = C.FONT_SIZE_POSITION * this.cfg.textScaleFactor();
      if (this.cfg.alwaysPercentage()) {
        text += (100).toFixed(C.DISPLAY_DECIMALS) + '%';
          //console.log(text, this.stateSize);
      }else{
        let maxSize=0;
        let maxText="";
        C.SHUTTER_STATES.forEach(state => {
          let text1 = this.cfg.getLocalize(C.LOCALIZE_TEXT[state]);
          let size = getTextSize(text1,C.HA_TITLE_FONT,shutterTitleHeight,'400').width;
          if (size>maxSize) {
            maxSize = size;
            maxText = text1;
          }
        });
        text += maxText;
      }
      if (this.cfg.canTilt()){
        text += ' / Tilt: ' + (100).toFixed(C.DISPLAY_DECIMALS) + '%';
        //console.log(text, size);
      }
      this.text=text;
      let size =getTextSize(text,C.HA_TITLE_FONT,shutterTitleHeight,'400').width;
      let xy = new xyPair(size,y1);
      this.setXySize(xy);
  }
}
export class htmlBlockTop extends htmlBlock{
  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  defineHtml(){
    this.setHtmlString(this.showTopBottomDiv(C.TOP));
  }
  defineSize(){
    let xy = this.sizeTopBottomDiv(C.TOP);
    this.setXySize(xy);
  }
}
export class htmlBlockMiddle extends htmlBlock
{
  constructor(shutter,cfg)
  {
    super(shutter,cfg);
    //debugger;
    if (this.cfg instanceof windowCfgNew){
       //debugger;
       //this.cfg =
    }else{

    }
  }

  defineHtml()
  {
    const cfg = this.cfg;

    const leftButtonsBlock = new htmlBlockLeftButtons(this.shutter,cfg);
    const openCloseSliderBlock = new htmlBlockOpenCloseSlider(this.shutter,cfg);
    const centralWindowBlock = new htmlBlockCentralWindow(this.shutter,cfg);
    const tiltSectionBlock = new htmlBlockTiltSection(this.shutter,cfg);
    const rightButtonsBlock = new htmlBlockRightButtons(this.shutter,cfg);

    this.setHtmlString(html`
      <div class="${C.ESC_CLASS_MIDDLE}">
        ${this.buttonsLeftActive() ? leftButtonsBlock.show() : nothing}
        ${this.cfg.showOpenCloseSliderBlock() && this.cfg.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION)
           ? openCloseSliderBlock.show()
           : nothing}
        ${centralWindowBlock.show()}
        ${this.cfg.showPartialOpenButtons() || this.cfg.canTilt()
          ? html`
            ${(this.cfg.canTilt()) ? tiltSectionBlock.show():nothing}
            ${this.showPartialOpenButtons() ? rightButtonsBlock.show():nothing}
          `
          : nothing //`<div class='blankDiv'></div>`
        }
      </div>
    `);
  }

  defineSize()
  {
    const cfg = this.cfg;
    const leftButtonsBlock = new htmlBlockLeftButtons(this.shutter,cfg);
    const openCloseSliderBlock = new htmlBlockOpenCloseSlider(this.shutter,cfg);
    const centralWindowBlock = new htmlBlockCentralWindow(this.shutter,cfg);
    const tiltSectionBlock = new htmlBlockTiltSection(this.shutter,cfg);
    const rightButtonsBlock = new htmlBlockRightButtons(this.shutter,cfg);

    let xyLeftButtons = leftButtonsBlock.size();
    let xyOpenCloseSlider = this.cfg.showOpenCloseSliderBlock() ? openCloseSliderBlock.size() : new xyPair();
    let xyCentralWindow = centralWindowBlock.size();
    let xyTiltSection = tiltSectionBlock.size();
    let xyRightButtons = this.showPartialOpenButtons() ? rightButtonsBlock.size() : new xyPair();

    let xyRight = this.gridAddBoth(xyTiltSection,xyRightButtons);
    let xy;
    if (this.cfg.buttonGroupInRow()){
      xy = this.gridAddHorizontal(xyLeftButtons,xyOpenCloseSlider);
      xy = this.gridAddHorizontal(xy,xyCentralWindow);
      xy = this.gridAddHorizontal(xy,xyRight);
      //xy = this.gridAddHorizontal(xy,new xyPair(1,0));
    }else{
      xy = this.gridAddVertical(xyLeftButtons,xyOpenCloseSlider);
      xy = this.gridAddVertical(xy,xyCentralWindow);
      xy = this.gridAddVertical(xy,xyRight);
    }
    this.setXySize(xy);
  }
}
export class htmlBlockBottom extends htmlBlock{
  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  defineHtml(){
    this.setHtmlString(this.showTopBottomDiv(C.BOTTOM));
  }
  defineSize(){
    let xy = this.sizeTopBottomDiv(C.BOTTOM);
    this.setXySize(xy);
  }
}
export class htmlBlockLeftButtons extends htmlBlock{
  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  defineHtml(){

    const cfg = this.cfg;
    const buttonUpBlock = new htmlBlockButtonUp(this.shutter,cfg);
    const buttonDownBlock = new htmlBlockButtonDown(this.shutter,cfg);
    const buttonStopBlock = new htmlBlockButtonStop(this.shutter,cfg);
    const buttonPartialBlock = new htmlBlockButtonPartial(this.shutter,cfg);
    this.setHtmlString(html`
      ${this.buttonsLeftActive()
      ? html`
        <div class="${C.ESC_CLASS_BUTTONS}">
          ${buttonUpBlock.show()}
          ${buttonStopBlock.show()}
          ${buttonDownBlock.show()}
          ${buttonPartialBlock.show()}
        </div>
        ` : html`
        <div class='blankDiv'></div>
      `}
    `);
  }
  defineSize(){
    const cfg = this.cfg;
    const buttonUpBlock = new htmlBlockButtonUp(this.shutter,cfg);
    const buttonStopBlock = new htmlBlockButtonStop(this.shutter,cfg);
    const buttonDownBlock = new htmlBlockButtonDown(this.shutter,cfg);
    const buttonPartialBlock = new htmlBlockButtonPartial(this.shutter,cfg);

    let xyButtonUpBlock = buttonUpBlock.size();
    let xyButtonStopBlock = buttonStopBlock.size();
    let xyButtonDownBlock = buttonDownBlock.size();
    let xyButtonPartialBlock = this.partialActive() ? buttonPartialBlock.size() : new xyPair();

    let xy = this.gridAddVertical(xyButtonUpBlock,xyButtonStopBlock);
    xy = this.gridAddVertical(xy,xyButtonDownBlock);
    xy = this.gridAddVertical(xy,xyButtonPartialBlock);

    if (!this.cfg.buttonGroupInRow()) xy.switch();

    this.setXySize(xy);
  }
  showButtonUpDown(feature,action,upDown,icon){

    return html`
      ${this.cfg.showStandardButtons() &&
        !this.cfg.buttonOpenCloseHideStates(upDown).includes(this.cfg.positionToState()) &&
         this.cfg.isCoverFeatureActive(feature)
      ? html`
        <ha-icon-button
          label="${this.cfg.getLocalize(C.LOCALIZE_TEXT[this.cfg.applyInvertForShowButtonUpDownLabel(action)])}"
          .disabled=${this.cfg.disabledGlobaly() || this.cfg.coverButtonDisabled(upDown)}
          @click=${()=> this.shutter.doOnclick(`${this.cfg.applyInvertForShowButtonUpDownClick(action,true)}`)} >
          <ha-icon
            class="${C.ESC_CLASS_HA_ICON}"
            icon="${icon}">
          </ha-icon>
        </ha-icon-button>
      `
      : nothing}
    `;
  }
}
export class htmlBlockButtonUp extends htmlBlockLeftButtons{
  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  defineHtml(){
    this.setHtmlString(this.showButtonUpDown(C.ESC_FEATURE_OPEN,C.ACTION_SHUTTER_OPEN,C.UP,'mdi:arrow-up'));
  }
  defineSize(){
    let xy = this.cfg.showStandardButtons() ? this.sizeButton() : new xyPair();
    this.setXySize(xy);
  }
}
export class htmlBlockButtonStop extends htmlBlockLeftButtons{
  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  defineHtml(){
    const action = C.ACTION_SHUTTER_STOP;
    const feature = C.ESC_FEATURE_STOP;
    const icon = "mdi:stop"

    this.setHtmlString(html`
      ${this.cfg.showStandardButtons() &&
        !this.cfg.buttonStopHideStates().includes(this.cfg.positionToState()) &&
         this.cfg.isCoverFeatureActive(feature)
      ? html`
        <ha-icon-button
          label="${this.cfg.getLocalize(C.LOCALIZE_TEXT[action])}"
          .disabled=${this.cfg.disabledGlobaly()}
          @click=${()=> this.shutter.doOnclick(`${action}`)} >
          <ha-icon
            class="${C.ESC_CLASS_HA_ICON}"
            icon="${icon}">
          </ha-icon>
        </ha-icon-button>
      `
      : nothing
    }`);
  }
  defineSize(){
    let xy =this.cfg.showStandardButtons() ? this.sizeButton() : new xyPair();
    this.setXySize(xy);
  }

}
export class htmlBlockButtonDown extends htmlBlockLeftButtons{
  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  defineHtml(){
    this.setHtmlString(this.showButtonUpDown(C.ESC_FEATURE_CLOSE,C.ACTION_SHUTTER_CLOSE,C.DOWN,'mdi:arrow-down'))
  }
  defineSize(){
    let xy =this.cfg.showStandardButtons() ? this.sizeButton() : new xyPair();
    this.setXySize(xy);
  }
}
export class htmlBlockButtonPartial extends htmlBlockLeftButtons{
  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  defineHtml(){
    this.setHtmlString(html`
      ${this.partialActive() && this.cfg.showStandardButtons() /* TODO localize texts */
        ? html`
          <ha-icon-button
            label="Partially ${this.cfg.applyInvertOpenCloseUi(C.SHUTTER_STATE_CLOSED)} (${C.SHUTTER_OPEN_PCT- this.cfg.partial()}%)"
            .disabled=${this.cfg.disabledGlobaly()}
            @click="${()=> this.shutter.doOnclick(`${C.ACTION_SHUTTER_SET_POS}`, this.cfg.calcOffset(this.cfg.partial()))}" >
            <ha-icon class="${C.ESC_CLASS_HA_ICON}" icon="mdi:arrow-expand-vertical"></ha-icon>
          </ha-icon-button>
        ` : nothing}
    `);
  }
  defineSize(){
    let xy =  this.cfg.showStandardButtons()? this.sizeButton() : new xyPair() ;
    this.setXySize(xy);
  }
}
export class htmlBlockTiltButtons extends htmlBlock{
  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  defineHtml(){
    const cfg = this.cfg;

    const buttonTiltUpBlock = new htmlBlockButtonTiltUp(this.shutter,cfg);
    const tiltPositionBlock = new htmlBlockTiltPosition(this.shutter,cfg);
    const buttonTiltDownBlock = new htmlBlockButtonTiltDown(this.shutter,cfg);
    this.setHtmlString(html`
      <div class="${C.ESC_CLASS_TILT_BUTTONS}">
        ${buttonTiltUpBlock.show()}
        ${tiltPositionBlock.show()}
        ${buttonTiltDownBlock.show()}
      </div>
    `);
  }
  showButtonTilt(action,icon){
    return html`
          <ha-icon-button
            label="${this.cfg.getLocalize(C.LOCALIZE_TEXT[action])}"
            .disabled=${this.cfg.disabledGlobaly()}
            @click="${()=> this.shutter.doOnclick(`${action}`)}">
            <ha-icon class="${C.ESC_CLASS_HA_ICON_TILT}" icon="${icon}"></ha-icon>
          </ha-icon-button>
    `;
  }
  defineSize(){
    const cfg = this.cfg;

    const buttonTiltUpBlock = new htmlBlockButtonTiltUp(this.shutter,cfg);
    const tiltPositionBlock = new htmlBlockTiltPosition(this.shutter,cfg);
    const buttonTiltDownBlock = new htmlBlockButtonTiltDown(this.shutter,cfg);
    let xyButtonTiltUp = buttonTiltUpBlock.size();
    let xyTiltPosition = tiltPositionBlock.size();
    let xyButtonTiltDown = buttonTiltDownBlock.size();
    let xy;

    if (!this.cfg.buttonGroupInRow()) {
       xy = this.gridAddHorizontal(xyButtonTiltUp,xyTiltPosition);
       xy = this.gridAddHorizontal(xy,xyButtonTiltDown);
    }else{
       xy = this.gridAddVertical(xyButtonTiltUp,xyTiltPosition);
       xy = this.gridAddVertical(xy,xyButtonTiltDown);
    }
    this.setXySize(xy);
  }

}
export class htmlBlockButtonTiltDown extends htmlBlockTiltButtons{
  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  defineHtml(){
    const icon = this.cfg.buttonGroupInRow() ? "mdi:arrow-bottom-right":"mdi:arrow-bottom-left" ;
    this.setHtmlString(this.showButtonTilt(C.ACTION_SHUTTER_CLOSE_TILT,icon));
  }
  defineSize(){
    let xy = this.sizeButton();
    this.setXySize(xy);
  }
}
export class htmlBlockButtonTiltUp extends htmlBlockTiltButtons{
  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  defineHtml(){
    const icon = this.cfg.buttonGroupInRow() ? "mdi:arrow-top-right":"mdi:arrow-bottom-right" ;
    this.setHtmlString(this.showButtonTilt(C.ACTION_SHUTTER_OPEN_TILT,icon));
  }
  defineSize(){
    let xy = this.sizeButton();
    this.setXySize(xy);
  }
}
export class htmlBlockTiltPosition extends htmlBlockTiltButtons{
  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  defineHtml(){
    this.setHtmlString(html`
      <div class="${C.ESC_CLASS_TILT_CONTAINER}">
        <div class="${C.ESC_CLASS_TILT_CLASS}">
          <div class="${C.ESC_CLASS_TILT_LINE}"></div>
        </div>
        <div class="${C.ESC_CLASS_TILT_CLASS}">
          <div class="${C.ESC_CLASS_TILT_LINE}"></div>
        </div>
        <div class="${C.ESC_CLASS_TILT_CLASS}">
          <div class="${C.ESC_CLASS_TILT_LINE}"></div>
        </div>
      </div>
    `);
  }
  defineSize(){
    // question on box-sizing: border-box: can't see difference ..??
    let size = C.ICON_SIZE* this.cfg.buttonScaleFactor();
    let xy = new xyPair(size,3*size);
    if (!this.cfg.buttonGroupInRow()) xy.switch();
    this.setXySize(xy);
  }
}
export class htmlBlockTiltSlider extends htmlBlock{
  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  defineHtml(){
    this.setHtmlString(html`
      <div class="${C.ESC_CLASS_SLIDER_WRAP}">
        <input type="range" class ="${C.ESC_CLASS_SLIDER_CLASS} tilt" min="0" max="100" value="${this.actualTiltPosition}">
      </div>
    `);
  }
  defineSize(){
    /**
     * questions about size due to browswer definitions of <input> html
     */
    let width= 20; //default of chrome WATCH OUT POSSIBLE WRONG FOR ROTATING
    let height = 129; // default
    let zoom = this.cfg.buttonScaleFactor();

    let xy = new xyPair(zoom*width,zoom*height);
    if (!this.cfg.buttonGroupInRow()) xy.switch();
    this.setXySize(xy);
  }
}
export class htmlBlockOpenCloseSlider extends htmlBlock{
  constructor(shutter,cfg){
    super(shutter,cfg);
    //debugger;
    if (this.cfg instanceof windowCfgNew){
       //debugger;
       this.cfg = shutter.cfg.cfg.covers;
    }else{
      this.cfg = [shutter.cfg];
    }
  }

  defineHtml(){
/*
    this.setHtmlString(html`
      <div class="${C.ESC_CLASS_SLIDER_WRAP}">
        <input type="range" class ="${C.ESC_CLASS_SLIDER_CLASS} openclose" min="0" max="100" value="${this.actualScreenPosition}">
      </div>
    `);
*/
    this.setHtmlString(html`
      ${this.cfg.map(cfg => html`
      <div class="${C.ESC_CLASS_SLIDER_WRAP}">
        <input type="range" class ="${C.ESC_CLASS_SLIDER_CLASS} openclose" min="0" max="100" value="${this.actualScreenPosition}">
      </div>
      `)}
    `)
  }
  defineSize(){
    /**
     * questions about size due to browswer definitions of <input> html
     */
    let width= 20; //default of chrome WATCH OUT POSSIBLE WRONG FOR ROTATING
    let height = 129; // default
/*
    let zoom = this.cfg.buttonScaleFactor();

    let xy = new xyPair(zoom*width,zoom*height);
    if (!this.cfg.buttonGroupInRow()) xy.switch();
    this.setXySize(xy);
*/
    let xy = new xyPair();
    this.cfg.map(cfg => {
      if (cfg.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION)){
        let zoom = cfg.buttonScaleFactor();
        if (cfg.buttonGroupInRow()){
          let xy2 = new xyPair(zoom*width,zoom*height);
          xy = this.gridAddHorizontal(xy,xy2);
        }else{
          let xy2 = new xyPair(zoom*height,zoom*width);
          xy = this.gridAddVertical(xy,xy2);
        }
      }
    });
    this.setXySize(xy);

  }
}
export class htmlBlockTiltSection extends htmlBlock{

  constructor(shutter,cfg){
    super(shutter,cfg);
    //debugger;
    if (this.cfg instanceof windowCfgNew){
       //debugger;
       this.cfg = shutter.cfg.cfg.covers;
    }else{
      this.cfg = [shutter.cfg];
    }
  }

  defineHtml(){
    const cfg = this.cfg;

/*
    this.setHtmlString(html`
        ${this.cfg.showTiltButtonBlock() ? tiltButtonsBlock.show() : nothing}
        ${this.cfg.showTiltSliderBlock() && this.tilt_position ? tiltSliderBlock.show() :nothing}
    `);
*/
    this.setHtmlString(html`
      ${this.cfg.map(cfg => {
        const tiltSliderBlock= new htmlBlockTiltSlider(this.shutter,cfg);
        const tiltButtonsBlock = new htmlBlockTiltButtons(this.shutter,cfg);
        return html`
            ${cfg.showTiltButtonBlock() ? tiltButtonsBlock.show() : nothing}
            ${cfg.showTiltSliderBlock() && cfg.isCoverFeatureActive(C.ESC_FEATURE_SET_TILT_POSITION)
              ? tiltSliderBlock.show()
              :nothing}
          `;
      })}
    `)
  };

  defineSize(){
    const cfg = this.cfg;
    let xy = new xyPair();

    this.cfg.map(cfg => {
      if (cfg.canTilt()){
        const tiltSliderBlock= new htmlBlockTiltSlider(this.shutter,cfg);
        const tiltButtonsBlock = new htmlBlockTiltButtons(this.shutter,cfg);
        let xyTiltSlider = tiltSliderBlock.size();
        let xyTiltButtons = tiltButtonsBlock.size();
        //let tilt_active = cfg.isCoverFeatureActive(C.ESC_FEATURE_SET_TILT_POSITION); // this.
        let tilt_active = true;
        if (cfg.buttonGroupInRow()){
          xy = cfg.showTiltButtonBlock() ? this.gridAddHorizontal(xy,xyTiltButtons) : xy;
          xy = cfg.showTiltSliderBlock() && tilt_active ? this.gridAddHorizontal(xy,xyTiltSlider) :xy;
        }else{
          xy = cfg.showTiltButtonBlock() ? this.gridAddVertical(xy,xyTiltButtons) : xy;
          xy = cfg.showTiltSliderBlock() && tilt_active ? this.gridAddVertical(xy,xyTiltSlider) : xy;
        }
      }
    });
    this.setXySize(xy);
  }
}
export class htmlBlockCentralWindow extends htmlBlock{
  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  defineHtml(){
   /*
      Here a loop with possible 1 or more picker/cover situations should be created
   */
   this.setHtmlString(html`
      ${this.cfg.showWindow()
      ? html`
        <div class="${C.ESC_CLASS_SELECTOR}">
          <div class="${C.ESC_CLASS_SELECTOR_PICTURE}">
            ${this.showWindowImage()}
            ${this.showPartial()}

            ${this.showSlide()}
            ${this.showPicker()}
            ${this.showOverlay()}

            ${this.cfg.centerClosing()
              ? html`
                ${this.showSlide_2()}
                ${this.showPicker_2()}
                ${this.showOverlay_2()}
               `
              : nothing}
           </div>
        </div>
      `: nothing}
    `);
  }
  defineSize(){
    let xy = new xyPair();
    if (this.cfg.showWindow()){
      let x = this.cfg.windowWidthPx() + 2 * C.SELECTOR_MARGIN;
      let y = this.cfg.windowHeightPx() + 2 * C.SELECTOR_MARGIN;
      xy.fill(x,y);
    }
    this.setXySize(xy);
  }
  showWindowImage(){
    return this.escImages.getWindowImageSrc(this.cfg.id())
      ? html`<img src= "${this.escImages.getWindowImageSrc(this.cfg.id())}">`
      : nothing;
  }
  showPartial(){
    return this.partialActive()
      ? html`<div class="${C.ESC_CLASS_SELECTOR_PARTIAL}"></div>`
      : nothing;
  }
  showPicker(){
    return this.cfg.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION)
      ? html`<div class="${C.ESC_CLASS_SELECTOR_PICKER}"></div>`
      : nothing
  }
  showPicker_2(){
    return nothing; // temporary ....
    return this.cfg.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION)
      ? html`<div class="${C.ESC_CLASS_SELECTOR_PICKER}_2"></div>`
      : nothing
  }
  showSlide(){
     return html`
        <div class="${C.ESC_CLASS_SELECTOR_SLIDE}">
          ${this.showSlideSlats(this.shutter)}
          <div class="${C.ESC_CLASS_SELECTOR_SLIDE_EDGE}"></div>
        </div>
      `;
  }
  showSlide_2(){
     return html`
        <div class="${C.ESC_CLASS_SELECTOR_SLIDE}_2">
          ${this.showSlideSlats(this.shutter)}
          <div class="${C.ESC_CLASS_SELECTOR_SLIDE_EDGE}_2"></div>
        </div>
      `;
  }
  /**
   * Shows the up/down arrows while opening/closing the cover
   * @returns
   */
  showOverlay(){
    return html`
      <div class="${C.ESC_CLASS_MOVEMENT_OVERLAY}">
        <ha-icon class="${C.ESC_CLASS_MOVEMENT_UP}" icon="mdi:arrow-up"></ha-icon>
        <ha-icon class="${C.ESC_CLASS_MOVEMENT_DOWN}" icon="mdi:arrow-down"></ha-icon>
      </div>
    `;
  }
  showOverlay_2(){
    return html`
      <div class="${C.ESC_CLASS_MOVEMENT_OVERLAY}_2">
        <ha-icon class="${C.ESC_CLASS_MOVEMENT_UP}_2" icon="mdi:arrow-up"></ha-icon>
        <ha-icon class="${C.ESC_CLASS_MOVEMENT_DOWN}_2" icon="mdi:arrow-down"></ha-icon>
      </div>
    `;
  }
  showSlideSlats(){
    const output = this.cfg.canTilt() && this.shutter.canShowTilt()
     ? this.showSlatsTilt()
     : this.showSlats();
    return output;
  }
  showSlatsTilt(){
    const sizeSlide = this.shutter.windowSizeMovingDirectionPx();
    const sizeSlat = this.shutter.slatSizeMovingDirectionPx() ;
    const number = sizeSlat ? Math.ceil(sizeSlide / sizeSlat): 1;

    return html`
      <div class="${C.ESC_CLASS_TILT_SLAT1}">
      ${Array.from({ length: number }, () =>
        html`
          <div class="${C.ESC_CLASS_TILT_SLAT2}">
            <div class="${C.ESC_CLASS_TILT_EDGE}"></div>
            <div class="${C.ESC_CLASS_TILT_SLAT3}">
            </div>
          </div>
          `
      )}
      </div>
    `;
  }
  showSlats(){
    return html`
        <div class="${C.ESC_CLASS_SELECTOR_SLIDE_SLATS}">
        </div>
      `;
  }
}
export class htmlBlockRightButtons extends htmlBlock{
  constructor(shutter,cfg){
    super(shutter,cfg);
  }
  defineHtml(){
    const icons= {
      0: "M3 4H21V8H19V20H17V8H7V20H5V8H3V4Z",
      1: "M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9Z",
      2: "M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12Z",
      3: "M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15Z",
      4: "M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15M8 18H16V20H8V18Z",
      5: "M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V20H8V18Z",

    }
    const pct= {
      0: C.SHUTTER_OPEN_PCT,
      1: 75,
      2: 50,
      3: 25,
      4: 10,
      5: C.SHUTTER_CLOSED_PCT,
    }

    const pointer={
      0: 0,  // up
      1: 1,  // middle
      2: 1,  // middle
      3: 1,  // middle
      4: 1,  // middle
      5: 2,  // down
    };

    const labels={
      0: `Fully ${this.cfg.applyInvertOpenCloseUi(C.SHUTTER_STATE_OPEN)}`,
      1: `Partially ${this.cfg.applyInvertOpenCloseUi(C.SHUTTER_STATE_CLOSED)} ( ${this.cfg.invertPosition(pct[1])}% )`,
      2: `Partially ${this.cfg.applyInvertOpenCloseUi(C.SHUTTER_STATE_CLOSED)} ( ${this.cfg.invertPosition(pct[2])}% )`,
      3: `Partially ${this.cfg.applyInvertOpenCloseUi(C.SHUTTER_STATE_CLOSED)} ( ${this.cfg.invertPosition(pct[3])}% )`,
      4: `Partially ${this.cfg.applyInvertOpenCloseUi(C.SHUTTER_STATE_CLOSED)} ( ${this.cfg.invertPosition(pct[4])}% )`,
      5: `Fully ${this.cfg.applyInvertOpenCloseUi(C.SHUTTER_STATE_CLOSED)}`,
    };

    const disabled = {
      0: this.cfg.disabledGlobaly() || this.cfg.coverButtonUpDisabled(), // up
      1: this.cfg.disabledGlobaly(), // middle
      2: this.cfg.disabledGlobaly() || this.cfg.coverButtonDownDisabled(), // down
    };
    const click = Object.fromEntries(
      [0, 1, 2, 3, 4, 5].map(j => [j, () => this.shutter.doOnclick(`${C.ACTION_SHUTTER_SET_POS}`, this.cfg.calcOffset(pct[j]))])
    );

    this.setHtmlString(html`
        ${[0, 1].map(i => html`
          <div class="${C.ESC_CLASS_BUTTONS}">
            ${[i * 3, i * 3 + 1, i * 3 + 2].map(j => html`
              <ha-icon-button
                label=${labels[j]}
                .disabled=${disabled[pointer[j]]}
                @click=${click[j]}
                path=${icons[j]}>
              </ha-icon-button>
            `)}
          </div>
        `)}
    `);
  }
  defineSize(){

    const haButtonSize = this.cfg.iconButtonSize();

    let xy = new xyPair(haButtonSize*2,haButtonSize*3);
    if (!this.cfg.buttonGroupInRow()){
      xy.switch();
    }
    this.setXySize(xy);
  }
}