import {html,nothing} from './lit/lit-core.min.js';
import * as C from './constants.js';
import {
  cfg,
  cardCfg,
  cardCfgNew,
  windowCfgNew,
  coverCfgNew,
  entityCfgNew,
  shutterCfg,
} from './cfg.js';

export class htmlStyleVars{

  constructor(enhancedShutter){
    this.enhancedShutter=enhancedShutter;
    this.cfg =enhancedShutter.cfg;
    this.actualScreenPosition = enhancedShutter.actualScreenPosition;
    this.actualShutterPosition = enhancedShutter.actualShutterPosition;
    this.actualTiltPosition = enhancedShutter.actualTiltPosition;
    //this.positionText =this.cfg.createPositionText(enhancedShutter.actualShutterPosition,this.actualTiltPosition);
    this.escImages= enhancedShutter.escImages;
  }

  defStyleVarsAll(){
    let cfg = this.cfg;

    if (this.cfg instanceof windowCfgNew){
      debugger;
      // cfg = this.cfg.debugger;
    }
    const styleVars= 
     this.defStyleVarsCard(cfg)+
     this.defStyleVarsWindow(cfg)+
     this.defStyleVarsCover(cfg)+
     this.defStyleVarsEntity(cfg);
    return styleVars;
  }
  defStyleVarsCard(cfg){
    const card_vars = ``;
    return card_vars;
  }
  defStyleVarsWindow(cfg){
    let cfg2 = this.cfg;

    const viewImage=this.escImages.getViewImageSrc(cfg.id());
    // solves #103 see other lines with shutterSlatImage
    const shutterSlatImage=this.escImages.getShutterSlatImageSrc(cfg.id());
    const shutterBottomImage=this.escImages.getShutterBottomImageSrc(cfg.id());

    const window_vars = `
      --mdc-icon-button-size: ${cfg.iconButtonSize()}${C.UNITY};
      --ha-icon-button-size: ${cfg.iconButtonSize()}${C.UNITY};
      --mdc-icon-size: ${cfg.iconSize()}${C.UNITY};
      --esc-icon-size-wifi-battery: ${cfg.iconSizeWifiBattery()}${C.UNITY};
      --esc-icon-div-size: ${C.ICON_DIV_SIZE/C.ICON_SIZE*cfg.iconSizeWifiBattery()}${C.UNITY};
      --esc-icons-margins: ${cfg.iconsPosition()==C.TOP
          ?      `${C.ICON_MARGIN_TB}${C.UNITY} ${C.ICON_MARGIN_LR}${C.UNITY} auto ${C.ICON_MARGIN_LR}${C.UNITY}`
          : `auto ${C.ICON_MARGIN_LR}${C.UNITY} ${C.ICON_MARGIN_TB}${C.UNITY}      ${C.ICON_MARGIN_LR}${C.UNITY}`};

      --esc-overflow: ${this.enhancedShutter.getOverflow()};

      --esc-flex-name_opening-flow: ${cfg.inlineHeader() ? 'row' : 'column'} nowrap;
      --esc-flex-flow-middle: ${!cfg.buttonGroupInRow()
        ? 'column'
        : 'row'}${cfg.buttonsContainerReversed()
          ? '-reverse'
          : ''} nowrap;
      --esc-window-height: ${cfg.windowHeightPx()+C.UNITY};
      --esc-window-width1: ${cfg.buttonGroupInRow() ? '100%': this.cfg.windowWidthPx()+C.UNITY};
      --esc-window-width: ${cfg.windowWidthPx()+C.UNITY};
      --esc-window-background-image: ${viewImage.includes('.') ?  `url(${viewImage})` : ''};
      --esc-window-background-color: ${viewImage.includes('.') ? '' : `${viewImage}`};
      --esc-window-rotate: ${cfg.viewImageRotate()};
      --esc-button-rotate: ${cfg.buttonRotate()};

      --esc-slide-background-main-image: ${shutterSlatImage.includes('.') ?  `url(${shutterSlatImage})` : ''};
      --esc-slide-background-edge-image: ${shutterBottomImage.includes('.') ?  `url(${shutterBottomImage})` : ''};

      --esc-slide-background-main-color: ${shutterSlatImage.includes('.') ? '' : `${shutterSlatImage}`};
      --esc-slide-background-edge-color: ${shutterBottomImage.includes('.') ? '' : `${shutterBottomImage}`};


      --esc-top-right-color: ${cfg.signalIconColor()};
      --esc-top-left-color: ${cfg.batteryIconColor()};

      --esc-top-icon-text-line-height: ${cfg.iconScalePercent()};
      --esc-top-icon-text-font-size: ${cfg.iconScalePercent()};
      --esc-text-scale: ${cfg.textScaleFactor()};
      --esc-button-scale: ${cfg.buttonScaleFactor()};

      --esc-picker-top: -${cfg.pickerOverlapPx()+C.UNITY};
      --esc-picker-height: ${cfg.pickerOverlapPx()*2+C.UNITY};

      --esc-buttons-flex-flow:      ${!cfg.buttonGroupInRow() ? 'row-reverse' : 'column'} nowrap;
      --esc-buttons-flex-flow-tilt: ${!cfg.buttonGroupInRow() ? 'row-reverse' : 'column'} nowrap;

    `;
    return window_vars;
  }
  defStyleVarsCover(cfg){
    let cfg2 = this.cfg;

    const cover_vars = `
      ${/* this is a working comment example */ ``}
      --esc-transform-partial: ${this.enhancedShutter.transformPartial()};                                                 ${/* ESC_CLASS_SELECTOR_PARTIAL */ ``}

      --esc-transform-slide:    ${this.enhancedShutter.transformSlide(this.actualScreenPosition)};                         ${/* ESC_CLASS_SELECTOR_SLIDE */ ``}
      --esc-transform-slide_2:  ${this.enhancedShutter.transformSlide(this.actualScreenPosition,true)};                    ${/* ESC_CLASS_SELECTOR_SLIDE_2 */ ``}

      --esc-transform-undo-slats-rotate:  ${this.enhancedShutter.transformUndoSlatsRotate()};                                ${/* ESC_CLASS_SELECTOR_SLIDE_SLATS */ ``}
      --esc-slide-background-slats-size: ${this.enhancedShutter.shutterSlatsSizePercentage()};                               ${/* ESC_CLASS_SELECTOR_SLIDE_SLATS */ ``}
      --esc-slide-slats-height: ${this.enhancedShutter.slatsSlideHeightPx()+C.UNITY};                                        ${/* ESC_CLASS_TILT_SLAT1 / ESC_CLASS_SELECTOR_SLIDE_SLATS */ ``}

      --esc-slat-height: ${this.enhancedShutter.slatHeightPx()+C.UNITY};                                                       ${/* ESC_CLASS_TILT_SLAT2 */ ``}

      --esc-slide-background-main-position: ${this.enhancedShutter.shutterMainBackgroundPosition()};                             ${/* ESC_CLASS_TILT_SLAT3 / ESC_CLASS_SELECTOR_SLIDE_SLATS /  */ ``}
      --esc-tilt-angle-deg: ${this.enhancedShutter.getTiltAngleDeg(this.enhancedShutter.react_TiltPosition)};                    ${/* ESC_CLASS_TILT_SLAT3 */ ``}
      --esc-tilt-slat-height: ${this.enhancedShutter.tiltSlatHeightPx()+C.UNITY};                                                ${/* ESC_CLASS_TILT_SLAT3 */ ``}
      --esc-tilt-slat-width: ${this.enhancedShutter.tiltSlatWidthPx()};                                                          ${/* ESC_CLASS_TILT_SLAT3 */ ``}
      --esc-tilt-slat-origin: ${this.enhancedShutter.tiltSlatOrigin()};                                                          ${/* ESC_CLASS_TILT_SLAT3 */ ``}
      --esc-tilt-slat-background-size: ${this.enhancedShutter.tiltSlatBackgroundSize()};                                         ${/* ESC_CLASS_TILT_SLAT3 */ ``}
      --esc-transform-tilt-slat-rotate:  ${this.enhancedShutter.transformTiltSlatRotate()};                                      ${/* ESC_CLASS_TILT_SLAT3 */ ``}

      --esc-slide-edge-height: ${this.enhancedShutter.shutterBottomSize().y()+C.UNITY};                                      ${/* ESC_CLASS_SELECTOR_SLIDE_EDGE / ESC_CLASS_SELECTOR_SLIDE_EDGE_2 */ ``}
      --esc-slide-background-edge-position: ${this.enhancedShutter.shutterEdgeBackgroundPosition()};                         ${/* ESC_CLASS_SELECTOR_SLIDE_EDGE / ESC_CLASS_SELECTOR_SLIDE_EDGE_2 */ ``}
      --esc-slide-background-edge-size: ${this.enhancedShutter.shutterBottomSizePercentage()};                               ${/* ESC_CLASS_SELECTOR_SLIDE_EDGE / ESC_CLASS_SELECTOR_SLIDE_EDGE_2 */ ``}

      --esc-transform-picker:   ${this.enhancedShutter.transformPicker(this.actualScreenPosition)};                        ${/* ESC_CLASS_SELECTOR_PICKER */ ``}
      --esc-transform-picker_2: ${this.enhancedShutter.transformPicker(this.actualScreenPosition,true)};                   ${/* ESC_CLASS_SELECTOR_PICKER_2 */ ``}

      --esc-tilt-angle-deg-graph: ${this.enhancedShutter.getTiltAngleDegGraph(this.enhancedShutter.react_TiltPosition)};   ${/* ESC_CLASS_TILT_CLASS */ ``}

      --esc-transform-movement: ${this.enhancedShutter.transformMovement()};                                               ${/* ESC_CLASS_MOVEMENT_UP / ESC_CLASS_MOVEMENT_DOWN */ ``}
      --esc-transform-movement_2: ${this.enhancedShutter.transformMovement(true)};                                         ${/* ESC_CLASS_MOVEMENT_UP_2 / ESC_CLASS_MOVEMENT_DOWN_2 */ ``}

      --esc-slider-writing-mode: ${this.enhancedShutter.sliderWritingMode()};                                              ${/* ESC_CLASS_SLIDER_CLASS */ ``}
      --esc-slider-direction: ${this.enhancedShutter.sliderDirection()};                                                   ${/* ESC_CLASS_SLIDER_CLASS */ ``}

    `;
    return cover_vars;
  }
  defStyleVarsEntity(cfg){
    let cfg2 = this.cfg;
    let stateForOverlay = cfg.getCoverEntity().getState() || C.UNAVAILABLE;

    const entity_vars = `
      --esc-movement-overlay-display: ${(stateForOverlay == C.SHUTTER_STATE_OPENING || stateForOverlay == C.SHUTTER_STATE_CLOSING) ? 'block' : C.NONE};
      --esc-movement-overlay-up-display: ${stateForOverlay == cfg.applyInvertForOverlayDisplay(C.SHUTTER_STATE_OPENING) ? 'block' : C.NONE};
      --esc-movement-overlay-down-display: ${stateForOverlay == cfg.applyInvertForOverlayDisplay(C.SHUTTER_STATE_CLOSING) ? 'block' : C.NONE};
    `;
    return entity_vars;
  }

}
