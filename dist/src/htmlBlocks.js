import {LitElement, html, css, unsafeCSS } from '../lit/lit-core.min.js';
import * as C from './constants.js';
import {
  xyPair,
  htmlShutter,
  getTextSize
} from './classes.js';


export class htmlBlock{

  constructor(shutter){
    //this.enhancedShutter=enhancedShutter;
    this.cfg=shutter.cfg;
    this.escImages= shutter.escImages ?? {};
    this.block = {cfg: this.cfg,escImages: this.escImages};

  }
  show(shutter){
    return '';
  }
  size(){
    return new xyPair(-1,-1);
  }
  showTopBottomDiv(shutter,position){
    const batteryIconBlock = new htmlBlockBatteryIcon(shutter);
    const signalIconBlock = new htmlBlockSignalIcon(shutter);
    const nameAndStateBlock = new htmlBlockNameAndState(shutter);

    return html`
        <div class="${C.ESC_CLASS_TOP_BOTTOM}">
          ${position == this.cfg.iconsPosition() ? batteryIconBlock.show(shutter) : ''}
          ${nameAndStateBlock.show(shutter,position)}
          ${position == this.cfg.iconsPosition() ? signalIconBlock.show(shutter) : ''}
        </div>
    `;
  }
  displaySize(xy){
    //console.log (this.constructor.name,xy.x(),xy.y());
  }
  sizeTopBottomDiv(position){
    const batteryIconBlock = new htmlBlockBatteryIcon(this.block);
    const signalIconBlock = new htmlBlockSignalIcon(this.block);
    const nameAndStateBlock = new htmlBlockNameAndState(this.block);

    let xyBattery = this.cfg.iconsPosition() === position ? batteryIconBlock.size() : new xyPair();
    let xySignal = this.cfg.iconsPosition() === position ? signalIconBlock.size() : new xyPair();
    let xyNameAndState = nameAndStateBlock.size(position);

    let xy = this.gridAddHorizontal(xyBattery,xyNameAndState);
    xy = this.gridAddHorizontal(xy,xySignal);
    //xy = this.gridAddVertical(xy,new xyPair(0,16)); // padding
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
    let xy = new xyPair();
    if (this.cfg.getIconsActive()) xy= new xyPair(C.ICON_DIV_SIZE,C.ICON_DIV_SIZE+4); // +4 from browser info (to be improved)
    return xy;
  }

}
export class htmlBlockShutter extends htmlBlock{


  show(shutter){
    const entityId = this.cfg.entityId();
    const htmlParts = new htmlShutter(shutter);

    const topDivBlock = new htmlBlockTopDiv(shutter);
    const middleDivBlock = new htmlBlockMiddleDiv(shutter);
    const bottomDivBlock = new htmlBlockBottomDiv(shutter);

    return html`
      <div
        class=${C.ESC_CLASS_SHUTTER}
        data-shutter="${entityId}"
        style = "${htmlParts.defStyleVarsShutter()}"
      >
        ${topDivBlock.show(shutter)}
        ${middleDivBlock.show(shutter)}
        ${bottomDivBlock.show(shutter)}
      </div>
    `;

  }
  size(){
    const topDivBlock = new htmlBlockTopDiv(this.block);
    const middleDivBlock = new htmlBlockMiddleDiv(this.block);
    const bottomDivBlock = new htmlBlockBottomDiv(this.block);

    let xyTopDiv = topDivBlock.size();
    let xyMiddleDiv = middleDivBlock.size();
    let xyBottomDiv =bottomDivBlock.size();

    let xy = this.gridAddVertical(xyTopDiv,xyMiddleDiv);
    xy = this.gridAddVertical(xy,xyBottomDiv)
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockCardTitle extends htmlBlock{
  constructor(cfg){
    //this.enhancedShutter=enhancedShutter;
    let block = {cfg: cfg};
    super(block);
  }
  show(){
    // dummy code, done by HA
    return html``;
  }
  size(){

    let xy;
    //let title2 = "TestTitle";
    let title = this.cfg.title();
    if (title){
      const haCardTitleFontHeight= 24;
      const haTitleHeightPx = 76;
      const haTitleFont = 'Roboto, Noto, sans-serif';
      const titleSize= getTextSize(title,haTitleFont,haCardTitleFontHeight);
      xy = new xyPair(titleSize.width,haTitleHeightPx);
    }
    else{
      xy = new xyPair();
    }
    this.displaySize(xy);
    return xy;
  }

}


export class htmlBlockShutterSeperate extends htmlBlock{
  constructor(cfg){
    //this.enhancedShutter=enhancedShutter;
    let block = {cfg: cfg};
    super(block);
  }
  show(){
    return html`
      <div class="${C.ESC_CLASS_SHUTTER_SEPARATE}-${this.cfg.stacked()}"></div>
    `;
  }
  size(){
    let xy;

    if (this.cfg.stacked()===C.VERTICAL){
      xy = new xyPair(100,4);
    }else{
      xy = new xyPair(20,100);
    }
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockBatteryIcon extends htmlBlock{

  show(shutter){
    return html`
        ${this.cfg.getIconsActive() ? html`
          ${this.cfg.getBatteryEntity() ? html`
            <div class="${ESC_CLASS_ICON_LEFT}">
              <ha-icon
                icon=${this.cfg.batteryLevelIcon()}
                class="${C.ESC_CLASS_HA_ICON}"
              >
              </ha-icon>
              <div class="${ESC_CLASS_TOP_ICON_TEXT}">
                ${this.cfg.batteryLevelText()}
              </div>
            </div>
            ` : html`
            <div class="${ESC_CLASS_ICON_LEFT}">
              <ha-icon
                icon="mdi:blank"
                class="${C.ESC_CLASS_HA_ICON}"
              >
              </ha-icon>
            </div>`
          }
          ` : ''
        }
    `;

  }
  size(){
    let xy= this.sizeIcon();
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockSignalIcon extends htmlBlock{

  show(shutter){
    return html`
      ${this.cfg.getIconsActive() ? html`
        ${this.cfg.getSignalEntity() ? html`
          <div class="${ESC_CLASS_ICON_RIGHT}">
            <ha-icon
              icon=${this.cfg.signalLevelIcon()}
              class="${C.ESC_CLASS_HA_ICON}"
            >
            </ha-icon>
            <div class="${ESC_CLASS_TOP_ICON_TEXT}">
              ${this.cfg.signalLevelText()}
            </div>
          </div>
          ` : html`
          <div class="${ESC_CLASS_ICON_RIGHT}">
            <ha-icon
              icon="mdi:blank"
              class="${C.ESC_CLASS_HA_ICON}"
            >
            </ha-icon>
          </div>`
        }
        ` : ''
      }
    `;
  }
  size(){
    let xy = this.sizeIcon();
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockNameAndState extends htmlBlock{

  show(shutter,position=C.TOP){
    const escClassName = position == C.TOP ? C.ESC_CLASS_TOP : C.ESC_CLASS_BOTTOM;
    const stateBlock= new htmlBlockState(shutter);
    const nameBlock = new htmlBlockName(shutter);
    return html`
      <div class = "${escClassName}">
        ${this.cfg.namePosition() === position ? nameBlock.show(shutter) : ''}
        ${this.cfg.openingPosition() === position ? stateBlock.show(shutter) : ''}
      </div>
    `;
  }
  size(position=C.TOP){
    const haTitleFont = 'Roboto, Noto, sans-serif';
    const shutterTitleHeight = C.FONT_SIZE_LABEL * this.cfg.textScaleFactor();
    const stateBlock= new htmlBlockState(this.block);
    const nameBlock = new htmlBlockName(this.block);

    let spaceSize = getTextSize('\u00A0', haTitleFont, shutterTitleHeight, '400');
    let xySpace =new xyPair(spaceSize.width,spaceSize.height);

    let xyName = this.cfg.openingPosition() === position ? nameBlock.size() : new xyPair();
    let xyState = this.cfg.namePosition() === position ? stateBlock.size() : new xyPair();
    let xy;
    if (this.cfg.inlineHeader()){
       xy = this.gridAddHorizontal(xyName,xyState);
       xy = xy.size() ? this.gridAddHorizontal(xy,xySpace) : xy;  // add space if name or state is present)
    }else{
       xy = this.gridAddVertical(xyName,xyState);
    }
    xy = this.gridAddVertical(xy,new xyPair(0,16)); // padding = 16
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockName extends htmlBlock{
  show(shutter){
    return html`
      ${this.cfg.showName()
        ? html`
          <div class="${C.ESC_CLASS_LABEL} ${this.cfg.disabledGlobaly() ? `${ESC_CLASS_LABEL_DISABLED}` : ''}"
            @click="${() => shutter.doHassMoreInfoOpen(this.cfg.entityId())}"
          >
            ${this.cfg.friendlyName()}
            ${this.cfg.passiveMode() ? html`
              <span class="${C.ESC_CLASS_HA_ICON_LOCK}">
                <ha-icon icon="mdi:lock"></ha-icon>
              </span>
            `:''}
          </div>
          `
        :
          ''
      }

    `;
  }
  size(){
    let xy= new xyPair();
    const haTitleFont = 'Roboto, Noto, sans-serif';
    const shutterTitleHeight = C.FONT_SIZE_LABEL * this.cfg.textScaleFactor();

    if (this.cfg.showName()){
      let titleSize = getTextSize(this.cfg.friendlyName(),haTitleFont,shutterTitleHeight,'400');
      let x1 = titleSize.width;
      let y1 = C.LINE_HEIGHT_LABEL * this.cfg.textScaleFactor();
      xy = new xyPair(x1,y1);
    }
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockState extends htmlBlock{
  show(shutter){
    const actualTiltPosition = shutter.actualTiltPosition;
    const positionText =this.cfg.computePositionText(shutter.actualShutterPosition,actualTiltPosition);

    return html`
      ${this.cfg.showOpening()
        ?  html`
          <div class="${C.ESC_CLASS_POSITION} ${this.cfg.disabledGlobaly() ? `${C.ESC_CLASS_LABEL_DISABLED}` : ''}">
            <span style="white-space: pre-line;">${positionText}</span>
          </div>
      `:
        ''
     }
    `;
  }
  size(){
    let x=0;
    let y=0;
    let xy= new xyPair();
    const haTitleFont = 'Roboto, Noto, sans-serif';
    /*
    * Size shutter-opening row
    */
    if (this.cfg.showOpening()) {
      let devPosition =this.cfg.currentDevicePosition();
      let tiltPosition = this.cfg.currentDeviceTiltPosition();
      let pctSize = getTextSize(this.cfg.computePositionText(devPosition,tiltPosition),haTitleFont,C.FONT_SIZE_POSITION * this.cfg.textScaleFactor());
      let x1 = pctSize.width + 2*C.MARGIN_POSITION;  // including margin;
      let y1 = C.LINE_HEIGHT_POSITION * this.cfg.textScaleFactor() + 2*C.MARGIN_POSITION;  // including margin
      x += x1 + 5 * 2; // hor. padding
      y += y1; // vert. padding already with margin ??
      xy = new xyPair(x,y);
    }
    this.displaySize(xy);
    return xy;
  }

}
export class htmlBlockTopDiv extends htmlBlock{
  show(shutter){
    return this.showTopBottomDiv(shutter,C.TOP);
  }
  size(){
    let xy = this.sizeTopBottomDiv(C.TOP);
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockMiddleDiv extends htmlBlock{

  position = this.cfg.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION);

  show(shutter){

    const leftButtonsBlock = new htmlBlockLeftButtons(shutter);
    const openCloseSliderBlock = new htmlBlockOpenCloseSlider(shutter);
    const centralWindowBlock = new htmlBlockCentralWindow(shutter);
    const tiltSectionBlock = new htmlBlockTiltSection(shutter);
    const rightButtonsBlock = new htmlBlockRightButtons(shutter);

    return html`
      <div class="${C.ESC_CLASS_MIDDLE}">
        ${leftButtonsBlock.show(shutter)}
        ${this.cfg.showOpenCloseSliderBlock() && this.position ? openCloseSliderBlock.show(shutter) : html``}
        ${centralWindowBlock.show(shutter)}
        ${this.cfg.showPartialOpenButtons() || this.cfg.canTilt()
          ? html`
            ${(this.cfg.canTilt()) ? tiltSectionBlock.show(shutter):''}
            ${this.cfg.showPartialOpenButtons() ? rightButtonsBlock.show(shutter):''}
          `
          : html`` //`<div class='blankDiv'></div>`
        }
      </div>
    `;
  }
  size(){
    const leftButtonsBlock = new htmlBlockLeftButtons(this.block);
    const openCloseSliderBlock = new htmlBlockOpenCloseSlider(this.block);
    const centralWindowBlock = new htmlBlockCentralWindow(this.block);
    const tiltSectionBlock = new htmlBlockTiltSection(this.block);
    const rightButtonsBlock = new htmlBlockRightButtons(this.block);

    let xyLeftButtons = leftButtonsBlock.size();
    let xyOpenCloseSlider = this.cfg.showOpenCloseSliderBlock() && this.position ? openCloseSliderBlock.size() : new xyPair();
    let xyCentralWindow = centralWindowBlock.size();
    let xyTiltSection = this.cfg.canTilt() ? tiltSectionBlock.size(): new xyPair();
    let xyRightButtons = this.cfg.showPartialOpenButtons() ? rightButtonsBlock.size() : new xyPair();

    let xyRight = this.gridAddBoth(xyTiltSection,xyRightButtons);
    //if (!xyRight.size()) { // class blankDiv
    //  let xySize = this.cfg.iconSize()*1.5;
    //  xyRight = new xyPair(xySize,xySize);
    //}
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
    this.displaySize(xy);

    return xy;
  }
}
export class htmlBlockBottomDiv extends htmlBlock{
  show(shutter){
    return this.showTopBottomDiv(shutter,C.BOTTOM);
  }
  size(){
    let xy = this.sizeTopBottomDiv(C.BOTTOM);
    this.displaySize(xy);
    return xy;
  }
}

export class htmlBlockLeftButtons extends htmlBlock{
  show(shutter){
    const buttonUpBlock = new htmlBlockButtonUp(shutter);
    const buttonDownBlock = new htmlBlockButtonDown(shutter);
    const buttonStopBlock = new htmlBlockButtonStop(shutter);
    const buttonPartialBlock = new htmlBlockButtonPartial(shutter);
    return html`
      ${this.cfg.buttonsLeftActive()
      ? html`
        <div class="${C.ESC_CLASS_BUTTONS}">
          ${buttonUpBlock.show(shutter)}
          ${buttonStopBlock.show(shutter)}
          ${buttonDownBlock.show(shutter)}
          ${buttonPartialBlock.show(shutter)}
        </div>
        ` : html`
        <div class='blankDiv'></div>
      `}
    `;
  }
  size(){
    const buttonUpBlock = new htmlBlockButtonUp(this.block);
    const buttonDownBlock = new htmlBlockButtonDown(this.block);
    const buttonStopBlock = new htmlBlockButtonStop(this.block);
    const buttonPartialBlock = new htmlBlockButtonPartial(this.block);

    let xyButtonUpBlock = buttonUpBlock.size();
    let xyButtonDownBlock = buttonDownBlock.size();
    let xyButtonStopBlock = buttonStopBlock.size();
    let xyButtonPartialBlock = buttonPartialBlock.size();

    let xy = this.gridAddVertical(xyButtonUpBlock,xyButtonDownBlock);
    xy = this.gridAddVertical(xy,xyButtonStopBlock);
    xy = this.gridAddVertical(xy,xyButtonPartialBlock);

    if (!this.cfg.buttonGroupInRow()) xy.switch();

    this.displaySize(xy);
    return xy;
  }
  showButtonUpDown(shutter,feature,action,upDown,icon){

    return html`
      ${this.cfg.showStandardButtons() &&
        !this.cfg.buttonOpenCloseHideStates(upDown).includes(this.cfg.positionToState()) &&
         this.cfg.isCoverFeatureActive(feature)
      ? html`
        <ha-icon-button
          label="${this.cfg.getLocalize(C.LOCALIZE_TEXT[this.cfg.applyInvertForShowButtonUpDownLabel(action)])}"
          .disabled=${this.cfg.disabledGlobaly() || this.cfg.coverButtonDisabled(upDown)}
          @click=${()=> shutter.doOnclick(`${this.cfg.applyInvertForShowButtonUpDownClick(action,true)}`)} >
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

  show(shutter){
        return this.showButtonUpDown(shutter,C.ESC_FEATURE_OPEN,C.ACTION_SHUTTER_OPEN,C.UP,'mdi:arrow-up');
  }
  size(){
    let xy = this.cfg.showStandardButtons() ? this.sizeButton() : new xyPair();
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockButtonStop extends htmlBlockLeftButtons{
  show(shutter){
    const action = C.ACTION_SHUTTER_STOP;
    const feature = C.ESC_FEATURE_STOP;
    const icon = "mdi:stop"

    return html`
      ${this.cfg.showStandardButtons() &&
        !this.cfg.buttonStopHideStates().includes(this.cfg.positionToState()) &&
         this.cfg.isCoverFeatureActive(feature)
      ? html`
        <ha-icon-button
          label="${this.cfg.getLocalize(C.LOCALIZE_TEXT[action])}"
          .disabled=${this.cfg.disabledGlobaly()}
          @click=${()=> shutter.doOnclick(`${action}`)} >
          <ha-icon
            class="${C.ESC_CLASS_HA_ICON}"
            icon="${icon}">
          </ha-icon>
        </ha-icon-button>
      `
      : ''
    }`;
  }
  size(){
    let xy =this.cfg.showStandardButtons() ? this.sizeButton() : new xyPair();
    this.displaySize(xy);
    return xy;
  }

}
export class htmlBlockButtonDown extends htmlBlockLeftButtons{
  show(shutter){
    return this.showButtonUpDown(shutter,C.ESC_FEATURE_CLOSE,C.ACTION_SHUTTER_CLOSE,C.DOWN,'mdi:arrow-down');
  }
  size(){
    let xy =this.cfg.showStandardButtons() ? this.sizeButton() : new xyPair();
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockButtonPartial extends htmlBlockLeftButtons{
  show(shutter){
    return html`
      ${this.cfg.partialActive() && this.cfg.showStandardButtons() /* TODO localize texts */
        ? html`
          <ha-icon-button
            label="Partially ${this.cfg.applyInvertOpenClose(C.SHUTTER_STATE_CLOSED)} (${C.SHUTTER_OPEN_PCT- this.cfg.partial()}%)"
            .disabled=${this.cfg.disabledGlobaly()}
            @click="${()=> shutter.doOnclick(`${C.ACTION_SHUTTER_SET_POS}`, this.cfg.calcOffset(this.cfg.partial()))}" >
            <ha-icon class="${C.ESC_CLASS_HA_ICON}" icon="mdi:arrow-expand-vertical"></ha-icon>
          </ha-icon-button>
        ` : ''}
    `;
  }
  size(){
    let xy = this.cfg.partialActive() && this.cfg.showStandardButtons()?  this.sizeButton() : new xyPair(0,0) ;
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockTiltButtons extends htmlBlock{
  show(shutter){
    const buttonTiltUpBlock = new htmlBlockButtonTiltUp(shutter);
    const tiltPositionBlock = new htmlBlockTiltPosition(shutter);
    const buttonTiltDownBlock = new htmlBlockButtonTiltDown(shutter);
    return html`
      <div class="${C.ESC_CLASS_TILT_BUTTONS}">
        ${buttonTiltUpBlock.show(shutter)}
        ${tiltPositionBlock.show(shutter)}
        ${buttonTiltDownBlock.show(shutter)}
      </div>
    `;
  }
  showButtonTilt(shutter,action,icon){
    return html`
          <ha-icon-button
            label="${this.cfg.getLocalize(C.LOCALIZE_TEXT[action])}"
            .disabled=${this.cfg.disabledGlobaly()}
            @click="${()=> shutter.doOnclick(`${action}`)}">
            <ha-icon class="${C.ESC_CLASS_HA_ICON_TILT}" icon="${icon}"></ha-icon>
          </ha-icon-button>
    `;
  }
  size(){
    const buttonTiltUpBlock = new htmlBlockButtonTiltUp(this.block);
    const tiltPositionBlock = new htmlBlockTiltPosition(this.block);
    const buttonTiltDownBlock = new htmlBlockButtonTiltDown(this.block);

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
    this.displaySize(xy);
    return xy;
  }

}
export class htmlBlockButtonTiltDown extends htmlBlockTiltButtons{
  show(shutter){
    const icon = this.cfg.buttonGroupInRow() ? "mdi:arrow-bottom-right":"mdi:arrow-bottom-left" ;
    return this.showButtonTilt(shutter,C.ACTION_SHUTTER_CLOSE_TILT,icon);

  }
  size(){
    let xy = this.sizeButton();
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockButtonTiltUp extends htmlBlockTiltButtons{
  show(shutter){
    const icon = this.cfg.buttonGroupInRow() ? "mdi:arrow-top-right":"mdi:arrow-bottom-right" ;
    return this.showButtonTilt(shutter,C.ACTION_SHUTTER_OPEN_TILT,icon);
  }
  size(){
    let xy = this.sizeButton();
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockTiltPosition extends htmlBlockTiltButtons{
  show(shutter){
    return html`
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
    `;
  }
  size(){
    // question on box-sizing: border-box: can't see difference ..??
    let size = C.ICON_SIZE* this.cfg.buttonScaleFactor();
    let xy = new xyPair(size,3*size);
    if (!this.cfg.buttonGroupInRow()) xy.switch();
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockTiltSlider extends htmlBlock{
  show(shutter){
    return html`
      <div class="${C.ESC_CLASS_SLIDER_WRAP}">
        <input type="range" class ="${C.ESC_CLASS_SLIDER_CLASS} tilt" min="0" max="100" value="${this.actualTiltPosition}">
      </div>
    `;
  }
  size(){
    /**
     * questions about size due to browswer definitions of <input> html
     */
    let width= 20; //default of chrome WATCH OUT POSSIBLE WRONG FOR ROTATING
    let height = 129; // default
    let zoom = this.cfg.buttonScaleFactor();

    let xy = new xyPair(zoom*width,zoom*height);
    if (!this.cfg.buttonGroupInRow()) xy.switch();
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockOpenCloseSlider extends htmlBlock{
  show(shutter){
    return html`
      <div class="${C.ESC_CLASS_SLIDER_WRAP}">
        <input type="range" class ="${C.ESC_CLASS_SLIDER_CLASS} openclose" min="0" max="100" value="${this.actualScreenPosition}">
      </div>
    `;
  }
  size(){
    /**
     * questions about size due to browswer definitions of <input> html
     */
    let width= 20; //default of chrome WATCH OUT POSSIBLE WRONG FOR ROTATING
    let height = 129; // default
    let zoom = this.cfg.buttonScaleFactor();

    let xy = new xyPair(zoom*width,zoom*height);
    if (!this.cfg.buttonGroupInRow()) xy.switch();
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockTiltSection extends htmlBlock{

  tilt_position = this.cfg.isCoverFeatureActive(C.ESC_FEATURE_SET_TILT_POSITION)

  show(shutter){
    const tiltSliderBlock= new htmlBlockTiltSlider(shutter);
    const tiltButtonsBlock = new htmlBlockTiltButtons(shutter);
    return html`
        ${this.cfg.showTiltButtonBlock() ? tiltButtonsBlock.show(shutter) : html``}
        ${this.cfg.showTiltSliderBlock() && this.tilt_position ? tiltSliderBlock.show(shutter) :html``}
    `;
  }
  size(){
    let xy = new xyPair();
    const tiltSliderBlock= new htmlBlockTiltSlider(this.block);
    const tiltButtonsBlock = new htmlBlockTiltButtons(this.block);
    let xyTiltSlider = tiltSliderBlock.size();
    let xyTiltButtons = tiltButtonsBlock.size();

    if (this.cfg.buttonGroupInRow()){
      xy = this.cfg.showTiltButtonBlock() ? this.gridAddHorizontal(xy,xyTiltButtons) : xy;
      xy = this.cfg.showTiltSliderBlock() && this.tilt_position ? this.gridAddHorizontal(xy,xyTiltSlider) :xy;
    }else{
      xy = this.cfg.showTiltButtonBlock() ? this.gridAddVertical(xy,xyTiltButtons) : xy;
      xy = this.cfg.showTiltSliderBlock() && this.tilt_position ? this.gridAddVertical(xy,xyTiltSlider) : xy;

    }
    this.displaySize(xy);
    return xy;
  }
}
export class htmlBlockCentralWindow extends htmlBlock{
  show(shutter){
    return html`
      ${this.cfg.showWindow()
      ? html`
        <div class="${C.ESC_CLASS_SELECTOR}">
          <div class="${C.ESC_CLASS_SELECTOR_PICTURE}">
            ${this.escImages.getWindowImageSrc(this.cfg.id()) ? html`<img src= "${this.escImages.getWindowImageSrc(this.cfg.id())}">` : ''}

            ${this.showSlide(shutter)}
            ${this.cfg.partialActive()
              ? html`<div class="${C.ESC_CLASS_SELECTOR_PARTIAL}"></div>`
              : ''}
            <div class="${C.ESC_CLASS_MOVEMENT_OVERLAY}">
              <ha-icon class="${C.ESC_CLASS_MOVEMENT_UP}" icon="mdi:arrow-up">
              </ha-icon>
              <ha-icon class="${C.ESC_CLASS_MOVEMENT_DOWN}" icon="mdi:arrow-down">
              </ha-icon>
            </div>
          </div>
          ${this.cfg.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION)
            ? html`<div class="${C.ESC_CLASS_SELECTOR_PICKER}"></div>`
            : ''}
        </div>
      `: html``}
    `;
  }
  size(){
    let xy = new xyPair();
    if (this.cfg.showWindow()){
      let x = this.cfg.windowWidthPx() + 2 * C.SELECTOR_MARGIN;
      let y = this.cfg.windowHeightPx() + 2 * C.SELECTOR_MARGIN;
      xy.fill(x,y);
    }
    this.displaySize(xy);
    return xy;
  }
  showSlide(shutter){
     return html`
        <div class="${C.ESC_CLASS_SELECTOR_SLIDE}">
          ${this.showSlideSlats(shutter)}
          <div class="${C.ESC_CLASS_SELECTOR_SLIDE_EDGE}"></div>
        </div>
      `;
  }
  showSlideSlats(shutter){
    // Only Tilt when SHowTilt and there is a size
    const output = this.cfg.canTilt() && shutter.canShowTilt()
     ? html`
        ${this.showSlatsTilt(shutter)}
      `
     : html`
        ${this.showSlats(shutter)}
      `;
    return output;
  }
  showSlatsTilt(shutter){

    const sizeSlide = shutter.windowSizeMovingDirectionPx();
    const sizeSlat = shutter.slatSizeMovingDirectionPx() ;

    //const sizeSlat = new xyPair(100,51);
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
  showSlats(shutter){

    return html`
        <div class="${C.ESC_CLASS_SELECTOR_SLIDE_SLATS}">
        </div>
      `;
  }
}
export class htmlBlockRightButtons extends htmlBlock{
  show(shutter){
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
      0: `Fully ${this.cfg.applyInvertOpenClose(SHUTTER_STATE_OPEN)}`,
      1: `Partially ${this.cfg.applyInvertOpenClose(SHUTTER_STATE_CLOSED)} ( ${this.cfg.invertPosition(pct[1])}% )`,
      2: `Partially ${this.cfg.applyInvertOpenClose(SHUTTER_STATE_CLOSED)} ( ${this.cfg.invertPosition(pct[2])}% )`,
      3: `Partially ${this.cfg.applyInvertOpenClose(SHUTTER_STATE_CLOSED)} ( ${this.cfg.invertPosition(pct[3])}% )`,
      4: `Partially ${this.cfg.applyInvertOpenClose(SHUTTER_STATE_CLOSED)} ( ${this.cfg.invertPosition(pct[4])}% )`,
      5: `Fully ${this.cfg.applyInvertOpenClose(SHUTTER_STATE_CLOSED)}`,
    };

    const disabled = {
      0: this.cfg.disabledGlobaly() || this.cfg.coverButtonUpDisabled(), // up
      1: this.cfg.disabledGlobaly(), // middle
      2: this.cfg.disabledGlobaly() || this.cfg.coverButtonDownDisabled(), // down
    };
    const click = Object.fromEntries(
      [0, 1, 2, 3, 4, 5].map(j => [j, () => this.enhancedShutter.doOnclick(`${C.ACTION_SHUTTER_SET_POS}`, this.cfg.calcOffset(pct[j]))])
    );

    return html`
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
    `;
  }
  size(){

    const haButtonSize = this.cfg.iconButtonSize();

    let xy = new xyPair(haButtonSize*2,haButtonSize*3);
    if (!this.cfg.buttonGroupInRow()){
      xy.switch();
    }
    this.displaySize(xy);
    return xy;
  }
}