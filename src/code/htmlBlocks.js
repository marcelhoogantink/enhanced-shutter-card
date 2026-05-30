import {html,nothing} from './lit/lit-core.min.js';
import * as C from './constants.js';
import {htmlShutter} from './htmlShutter.js';
import {xyPair} from './xyPair.js';
import {
  getTextSize,
  console_log
} from './functions.js';


export class htmlBlock
{
  #xySize = new xyPair();
  #htmlString = ''

  constructor(shutter){
    //this.enhancedShutter=enhancedShutter;
    this.shutter =shutter;
    this.cfg=shutter.cfg;
    this.escImages= shutter.escImages ?? {};
    this.actualScreenPosition = shutter.actualScreenPosition;
    this.actualTiltPosition = shutter.actualTiltPosition;
    this.actualShutterPosition = shutter.actualShutterPosition;
    //console_log("====>>>",shutter.actualScreenPosition,shutter.actualTiltPosition,shutter.actualShutterPosition);
  }
  show(){
    if (!this.#htmlString) this.defineHtml();
    return this.#htmlString;
  }
  size(){
    if (!this.#xySize.size()) {
      this.defineSize()
      this.displaySize(this.#xySize);
    }else{
      this.displaySize(this.#xySize);
    }
    this.displaySize(this.#xySize);
    return this.#xySize;
  }
  displaySize(xy){
    console_log (this.constructor.name,xy.x(),xy.y());
  }
  defineSize(){
    this.setXySize(new xyPair(-1,-1));
  }
  setXySize(xy){
    this.#xySize = xy;
  }
  defineHtml(){
    this.setHtmlString(nothing);
  }
  setHtmlString(htmlString){
    this.#htmlString = htmlString;
  }
  showTopBottomDiv(position){
    const batteryIconBlock = new htmlBlockBatteryIcon(this.shutter);
    const signalIconBlock = new htmlBlockSignalIcon(this.shutter);
    const nameAndStateBlock = new htmlBlockNameAndState(this.shutter);

    return html`
        <div class="${C.ESC_CLASS_TOP_BOTTOM}">
          ${position == this.cfg.iconsPosition() ? batteryIconBlock.show() : ''}
          ${nameAndStateBlock.show(position)}
          ${position == this.cfg.iconsPosition() ? signalIconBlock.show() : ''}
        </div>
    `;
  }
  sizeTopBottomDiv(position){
    const batteryIconBlock = new htmlBlockBatteryIcon(this.shutter);
    const signalIconBlock = new htmlBlockSignalIcon(this.shutter);
    const nameAndStateBlock = new htmlBlockNameAndState(this.shutter);

    let xyBattery = this.cfg.getIconsActive() && this.cfg.iconsPosition() === position ? batteryIconBlock.size() : new xyPair();
    let xySignal  = this.cfg.getIconsActive() && this.cfg.iconsPosition() === position ? signalIconBlock.size() : new xyPair();
    let xyNameAndState = nameAndStateBlock.size(position);

    let xy = this.gridAddHorizontal(xyBattery,xyNameAndState);
    xy = this.gridAddHorizontal(xy,xySignal);
    return xy;
  }
  gridAddVertical(size1,size2){ //  xyPair's
    return new xyPair (Math.max(size1.x(),size2.x()),size1.y()+size2.y())
  };
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
export class htmlBlockShutter extends htmlBlock{
  htmlParts = new htmlShutter(this.shutter);
  entityId = this.cfg.entityId();
  htmlParts = new htmlShutter(this.shutter);
  topBlock = new htmlBlockTop(this.shutter);
  middleBlock = new htmlBlockMiddle(this.shutter);
  bottomBlock = new htmlBlockBottom(this.shutter);

  defineHtml(){
    this.setHtmlString(html`
      <div
        class=${C.ESC_CLASS_SHUTTER}
        data-shutter="${this.entityId}"
        style = "${this.htmlParts.defStyleVarsShutter()}"
      >
      ${this.topBlock.show()}
      ${this.middleBlock.show()}
      ${this.bottomBlock.show()}
      </div>
    `);
  }
  defineSize(){
    let xyTopDiv = this.topBlock.size();
    let xyMiddleDiv = this.middleBlock.size();
    let xyBottomDiv = this.bottomBlock.size();

    let xy = this.gridAddVertical(xyTopDiv,xyMiddleDiv);
    this.setXySize(this.gridAddVertical(xy,xyBottomDiv));
  }
}
export class htmlBlockCardTitle extends htmlBlock{
  constructor(cfg){
    //this.enhancedShutter=enhancedShutter;
    let block = {cfg: cfg};
    super(block);
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
  constructor(cfg){
    //this.enhancedShutter=enhancedShutter;
    let block = {cfg: cfg};
    super(block);
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

  defineHtml(){
    // dummy code, done by HA
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
        ` : ''
      }
    `);
  }
  defineSize(){
    let xy = this.sizeIcon();
    this.setXySize(xy);
  }
}
export class htmlBlockNameAndState extends htmlBlock{

  show(position=C.TOP){
    const escClassName = position === C.TOP ? C.ESC_CLASS_TOP : C.ESC_CLASS_BOTTOM;
    const stateBlock= new htmlBlockState(this.shutter);
    const nameBlock = new htmlBlockName(this.shutter);
    return html`
      <div class = "${escClassName}">
        ${this.cfg.namePosition() === position ? nameBlock.show() : nothing}
        ${this.cfg.openingPosition() === position ? stateBlock.show() : nothing}
      </div>
    `;
  }
  size(position=C.TOP){

    const stateBlock= new htmlBlockState(this.shutter);
    const nameBlock = new htmlBlockName(this.shutter);

    let xyName = this.cfg.openingPosition() === position ? nameBlock.size() : new xyPair();
    let xyState = this.cfg.namePosition() === position ? stateBlock.size() : new xyPair();
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
  defineHtml(){
    // dummy code, done by HA
    this.setHtmlString(html`
      ${this.cfg.showName()
        ? html`
          <div class="${C.ESC_CLASS_LABEL} ${this.cfg.disabledGlobaly() ? `${C.ESC_CLASS_LABEL_DISABLED}` : ''}"
            @click="${() => this.shutter.doHassMoreInfoOpen(this.cfg.entityId())}"
            title="${this.cfg.getCoverEntity().getFriendlyName()}"
          >
            ${this.cfg.friendlyName()}
            ${this.cfg.passiveMode() ? html`
              <span class="${C.ESC_CLASS_HA_ICON_LOCK}">
                <ha-icon icon="mdi:lock"></ha-icon>
              </span>
            `:''}
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
      if (this.cfg.passiveMode()) {
        xy = this.gridAddHorizontal(xy,new xyPair(C.ICON_SIZE_LOCK,C.ICON_SIZE_LOCK));
      }
    }
    this.setXySize(xy);
  }
}
export class htmlBlockState extends htmlBlock{
  defineHtml(){
    const positionText =this.cfg.computePositionText(this.actualShutterPosition,this.actualTiltPosition);

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
  defineHtml(){
    // dummy code, done by HA
    this.setHtmlString(this.showTopBottomDiv(C.TOP));
  }
  defineSize(){
    let xy = this.sizeTopBottomDiv(C.TOP);
    this.setXySize(xy);
  }
}
export class htmlBlockMiddle extends htmlBlock{

  featurePosition = this.cfg.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION);

  defineHtml(){
    // dummy code, done by HA

    const leftButtonsBlock = new htmlBlockLeftButtons(this.shutter);
    const openCloseSliderBlock = new htmlBlockOpenCloseSlider(this.shutter);
    const centralWindowBlock = new htmlBlockCentralWindow(this.shutter);
    const tiltSectionBlock = new htmlBlockTiltSection(this.shutter);
    const rightButtonsBlock = new htmlBlockRightButtons(this.shutter);

    this.setHtmlString(html`
      <div class="${C.ESC_CLASS_MIDDLE}">
        ${this.cfg.buttonsLeftActive() ? leftButtonsBlock.show() : nothing}
        ${this.cfg.showOpenCloseSliderBlock() && this.featurePosition ? openCloseSliderBlock.show() : nothing}
        ${centralWindowBlock.show()}
        ${this.cfg.showPartialOpenButtons() || this.cfg.canTilt()
          ? html`
            ${(this.cfg.canTilt()) ? tiltSectionBlock.show():''}
            ${this.cfg.showPartialOpenButtons() ? rightButtonsBlock.show():''}
          `
          : nothing //`<div class='blankDiv'></div>`
        }
      </div>
    `);
  }
  defineSize(){
    const leftButtonsBlock = new htmlBlockLeftButtons(this.shutter);
    const openCloseSliderBlock = new htmlBlockOpenCloseSlider(this.shutter);
    const centralWindowBlock = new htmlBlockCentralWindow(this.shutter);
    const tiltSectionBlock = new htmlBlockTiltSection(this.shutter);
    const rightButtonsBlock = new htmlBlockRightButtons(this.shutter);

    let xyLeftButtons = leftButtonsBlock.size();
    let xyOpenCloseSlider = this.cfg.showOpenCloseSliderBlock() && this.featurePosition ? openCloseSliderBlock.size() : new xyPair();
    let xyCentralWindow = centralWindowBlock.size();
    let xyTiltSection = this.cfg.canTilt() ? tiltSectionBlock.size(): new xyPair();
    let xyRightButtons = this.cfg.showPartialOpenButtons() ? rightButtonsBlock.size() : new xyPair();

    let xyRight = this.gridAddBoth(xyTiltSection,xyRightButtons);
    let xy;
    if (this.cfg.buttonGroupInRow()){
      xy = this.gridAddHorizontal(xyLeftButtons,xyOpenCloseSlider);
      xy = this.gridAddHorizontal(xy,xyCentralWindow);
      xy = this.gridAddHorizontal(xy,xyRight);
    }else{
      xy = this.gridAddVertical(xyLeftButtons,xyOpenCloseSlider);
      xy = this.gridAddVertical(xy,xyCentralWindow);
      xy = this.gridAddVertical(xy,xyRight);

    }
    this.setXySize(xy);

  }
}
export class htmlBlockBottom extends htmlBlock{
  defineHtml(){
    // dummy code, done by HA
    this.setHtmlString(this.showTopBottomDiv(C.BOTTOM));
  }
  defineSize(){
    let xy = this.sizeTopBottomDiv(C.BOTTOM);
    this.setXySize(xy);
  }
}
export class htmlBlockLeftButtons extends htmlBlock{
  defineHtml(){
    // dummy code, done by HA

    const buttonUpBlock = new htmlBlockButtonUp(this.shutter);
    const buttonDownBlock = new htmlBlockButtonDown(this.shutter);
    const buttonStopBlock = new htmlBlockButtonStop(this.shutter);
    const buttonPartialBlock = new htmlBlockButtonPartial(this.shutter);
    this.setHtmlString(html`
      ${this.cfg.buttonsLeftActive()
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
    const buttonUpBlock = new htmlBlockButtonUp(this.shutter);
    const buttonStopBlock = new htmlBlockButtonStop(this.shutter);
    const buttonDownBlock = new htmlBlockButtonDown(this.shutter);
    const buttonPartialBlock = new htmlBlockButtonPartial(this.shutter);

    let xyButtonUpBlock = buttonUpBlock.size();
    let xyButtonStopBlock = buttonStopBlock.size();
    let xyButtonDownBlock = buttonDownBlock.size();
    let xyButtonPartialBlock = this.cfg.partialActive() ? buttonPartialBlock.size() : new xyPair();

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
      : ''}
    `;
  }
}
export class htmlBlockButtonUp extends htmlBlockLeftButtons{
  defineHtml(){
    this.setHtmlString(this.showButtonUpDown(C.ESC_FEATURE_OPEN,C.ACTION_SHUTTER_OPEN,C.UP,'mdi:arrow-up'));
  }
  defineSize(){
    let xy = this.cfg.showStandardButtons() ? this.sizeButton() : new xyPair();
    this.setXySize(xy);
  }
}
export class htmlBlockButtonStop extends htmlBlockLeftButtons{
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
      : ''
    }`);
  }
  defineSize(){
    let xy =this.cfg.showStandardButtons() ? this.sizeButton() : new xyPair();
    this.setXySize(xy);
  }

}
export class htmlBlockButtonDown extends htmlBlockLeftButtons{
  defineHtml(){
    this.setHtmlString(this.showButtonUpDown(C.ESC_FEATURE_CLOSE,C.ACTION_SHUTTER_CLOSE,C.DOWN,'mdi:arrow-down'))
  }
  defineSize(){
    let xy =this.cfg.showStandardButtons() ? this.sizeButton() : new xyPair();
    this.setXySize(xy);
  }
}
export class htmlBlockButtonPartial extends htmlBlockLeftButtons{
  defineHtml(){
    this.setHtmlString(html`
      ${this.cfg.partialActive() && this.cfg.showStandardButtons() /* TODO localize texts */
        ? html`
          <ha-icon-button
            label="Partially ${this.cfg.applyInvertOpenCloseUi(C.SHUTTER_STATE_CLOSED)} (${C.SHUTTER_OPEN_PCT- this.cfg.partial()}%)"
            .disabled=${this.cfg.disabledGlobaly()}
            @click="${()=> this.shutter.doOnclick(`${C.ACTION_SHUTTER_SET_POS}`, this.cfg.calcOffset(this.cfg.partial()))}" >
            <ha-icon class="${C.ESC_CLASS_HA_ICON}" icon="mdi:arrow-expand-vertical"></ha-icon>
          </ha-icon-button>
        ` : ''}
    `);
  }
  defineSize(){
    let xy =  this.cfg.showStandardButtons()? this.sizeButton() : new xyPair(0,0) ;
    this.setXySize(xy);
  }
}
export class htmlBlockTiltButtons extends htmlBlock{
  defineHtml(){
    const buttonTiltUpBlock = new htmlBlockButtonTiltUp(this.shutter);
    const tiltPositionBlock = new htmlBlockTiltPosition(this.shutter);
    const buttonTiltDownBlock = new htmlBlockButtonTiltDown(this.shutter);
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
    const buttonTiltUpBlock = new htmlBlockButtonTiltUp(this.shutter);
    const tiltPositionBlock = new htmlBlockTiltPosition(this.shutter);
    const buttonTiltDownBlock = new htmlBlockButtonTiltDown(this.shutter);
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
  defineHtml(){
    this.setHtmlString(html`
      <div class="${C.ESC_CLASS_SLIDER_WRAP}">
        <input type="range" class ="${C.ESC_CLASS_SLIDER_CLASS} openclose" min="0" max="100" value="${this.actualScreenPosition}">
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
export class htmlBlockTiltSection extends htmlBlock{

  tilt_position = this.cfg.isCoverFeatureActive(C.ESC_FEATURE_SET_TILT_POSITION)
  defineHtml(){
    const tiltSliderBlock= new htmlBlockTiltSlider(this.shutter);
    const tiltButtonsBlock = new htmlBlockTiltButtons(this.shutter);
    this.setHtmlString(html`
        ${this.cfg.showTiltButtonBlock() ? tiltButtonsBlock.show() : nothing}
        ${this.cfg.showTiltSliderBlock() && this.tilt_position ? tiltSliderBlock.show() :nothing}
    `);
  }
  defineSize(){
    let xy = new xyPair();
    const tiltSliderBlock= new htmlBlockTiltSlider(this.shutter);
    const tiltButtonsBlock = new htmlBlockTiltButtons(this.shutter);
    let xyTiltSlider = tiltSliderBlock.size();
    let xyTiltButtons = tiltButtonsBlock.size();

    if (this.cfg.buttonGroupInRow()){
      xy = this.cfg.showTiltButtonBlock() ? this.gridAddHorizontal(xy,xyTiltButtons) : xy;
      xy = this.cfg.showTiltSliderBlock() && this.tilt_position ? this.gridAddHorizontal(xy,xyTiltSlider) :xy;
    }else{
      xy = this.cfg.showTiltButtonBlock() ? this.gridAddVertical(xy,xyTiltButtons) : xy;
      xy = this.cfg.showTiltSliderBlock() && this.tilt_position ? this.gridAddVertical(xy,xyTiltSlider) : xy;

    }
    this.setXySize(xy);
  }
}
export class htmlBlockCentralWindow extends htmlBlock{
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
    return this.cfg.partialActive()
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