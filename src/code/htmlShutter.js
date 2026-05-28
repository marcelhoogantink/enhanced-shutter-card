import * as C from './constants.js';

export class htmlShutter{

  constructor(enhancedShutter){
    this.enhancedShutter=enhancedShutter;
    this.cfg =enhancedShutter.cfg;
    this.actualScreenPosition = enhancedShutter.actualScreenPosition;
    this.actualTiltPosition = enhancedShutter.actualTiltPosition;
    this.actualShutterPosition = enhancedShutter.actualShutterPosition;
    this.positionText =this.cfg.computePositionText(enhancedShutter.actualShutterPosition,this.actualTiltPosition);
    this.escImages= enhancedShutter.escImages;
  }

  defStyleVarsShutter(){
    let stateForOverlay = this.cfg.getCoverEntity().getState() || C.UNAVAILABLE;
    const viewImage=this.escImages.getViewImageSrc(this.cfg.id());

    // solves #103 see other lines with shutterSlatImage
    const shutterSlatImage=this.escImages.getShutterSlatImageSrc(this.cfg.id());
    const shutterBottomImage=this.escImages.getShutterBottomImageSrc(this.cfg.id());

    return `
      --mdc-icon-button-size: ${this.cfg.iconButtonSize()}${C.UNITY};
      --ha-icon-button-size: ${this.cfg.iconButtonSize()}${C.UNITY};
      --mdc-icon-size: ${this.cfg.iconSize()}${C.UNITY};
      --esc-icon-size-wifi-battery: ${this.cfg.iconSizeWifiBattery()}${C.UNITY};
      --esc-icon-div-size: ${C.ICON_DIV_SIZE/C.ICON_SIZE*this.cfg.iconSizeWifiBattery()}${C.UNITY};
      --esc-icons-margins: ${this.cfg.iconsPosition()==C.TOP
          ?      `${C.ICON_MARGIN_TB}${C.UNITY} ${C.ICON_MARGIN_LR}${C.UNITY} auto ${C.ICON_MARGIN_LR}${C.UNITY}`
          : `auto ${C.ICON_MARGIN_LR}${C.UNITY} ${C.ICON_MARGIN_TB}${C.UNITY}      ${C.ICON_MARGIN_LR}${C.UNITY}`};

      --esc-overflow: ${this.enhancedShutter.getOverflow()};

      --esc-flex-name_opening-flow: ${this.cfg.inlineHeader() ? 'row' : 'column'} nowrap;
      --esc-flex-flow-middle: ${!this.cfg.buttonGroupInRow() ? 'column': 'row'}${this.cfg.buttonsContainerReversed() ? '-reverse' : ''} nowrap;
      --esc-window-height: ${this.cfg.windowHeightPx()+C.UNITY};
      --esc-window-width1: ${this.cfg.buttonGroupInRow() ? '100%': this.cfg.windowWidthPx()+C.UNITY};
      --esc-window-width: ${this.cfg.windowWidthPx()+C.UNITY};
      --esc-window-background-image: ${viewImage.includes('.') ?  `url(${viewImage})` : ''};
      --esc-window-background-color: ${viewImage.includes('.') ? '' : `${viewImage}`};
      --esc-window-rotate: ${this.cfg.viewImageRotate()};
      --esc-button-rotate: ${this.cfg.buttonRotate()};

      --esc-tilt-angle-deg: ${this.enhancedShutter.getTiltAngleDeg(this.enhancedShutter.react_TiltPosition)};
      --esc-tilt-angle-deg-graph: ${this.enhancedShutter.getTiltAngleDegGraph(this.enhancedShutter.react_TiltPosition)};

      --esc-transform-undo-slats-rotate:  ${this.enhancedShutter.transformUndoSlatsRotate()};
      --esc-transform-tilt-slat-rotate:  ${this.enhancedShutter.transformTiltSlatRotate()};
      --esc-transform-movement: ${this.enhancedShutter.transformMovement()};
      --esc-transform-movement_2: ${this.enhancedShutter.transformMovement(true)};

      --esc-picker-top: -${this.cfg.pickerOverlapPx()+C.UNITY};
      --esc-picker-height: ${this.cfg.pickerOverlapPx()*2+C.UNITY};

      --esc-transform-picker:   ${this.enhancedShutter.transformPicker(this.actualScreenPosition)};
      --esc-transform-picker_2: ${this.enhancedShutter.transformPicker(this.actualScreenPosition,true)};
      --esc-transform-slide:    ${this.enhancedShutter.transformSlide(this.actualScreenPosition)};
      --esc-transform-slide_2:  ${this.enhancedShutter.transformSlide(this.actualScreenPosition,true)};

      --esc-slat-height: ${this.enhancedShutter.slatHeightPx()+C.UNITY};

      --esc-tilt-slat-height: ${this.enhancedShutter.tiltSlatHeightPx()+C.UNITY};
      --esc-tilt-slat-width: ${this.enhancedShutter.tiltSlatWidthPx()};
      --esc-tilt-slat-origin: ${this.enhancedShutter.tiltSlatOrigin()};
      --esc-slider-writing-mode: ${this.enhancedShutter.sliderWritingMode()};
      --esc-slider-direction: ${this.enhancedShutter.sliderDirection()};
      --esc-tilt-icon-rotate: ${(this.enhancedShutter.tiltIconRotate3())};

      --esc-slide-slats-height: ${this.enhancedShutter.slatsSlideHeightPx()+C.UNITY};
      --esc-slide-edge-height: ${this.enhancedShutter.shutterBottomSize().y()+C.UNITY};

      --esc-transform-partial: ${this.enhancedShutter.transformPartial()};

      --esc-buttons-flex-flow:      ${!this.cfg.buttonGroupInRow() ? 'row-reverse' : 'column'} nowrap;
      --esc-buttons-flex-flow-tilt: ${!this.cfg.buttonGroupInRow() ? 'row-reverse' : 'column'} nowrap;

      --esc-movement-overlay-display: ${(stateForOverlay == C.SHUTTER_STATE_OPENING || stateForOverlay == C.SHUTTER_STATE_CLOSING) ? 'block' : C.NONE};
      --esc-movement-overlay-up-display: ${stateForOverlay == this.cfg.applyInvertForOverlayDisplay(C.SHUTTER_STATE_OPENING) ? 'block' : C.NONE};
      --esc-movement-overlay-down-display: ${stateForOverlay == this.cfg.applyInvertForOverlayDisplay(C.SHUTTER_STATE_CLOSING) ? 'block' : C.NONE};

      --esc-slide-background-main-image: ${shutterSlatImage.includes('.') ?  `url(${shutterSlatImage})` : ''};
      --esc-slide-background-edge-image: ${shutterBottomImage.includes('.') ?  `url(${shutterBottomImage})` : ''};

      --esc-slide-background-main-color: ${shutterSlatImage.includes('.') ? '' : `${shutterSlatImage}`};
      --esc-slide-background-edge-color: ${shutterBottomImage.includes('.') ? '' : `${shutterBottomImage}`};

      --esc-slide-background-slat-size: ${this.enhancedShutter.shutterSlatSizePercentage()};
      --esc-slide-background-slats-size: ${this.enhancedShutter.shutterSlatsSizePercentage()};
      --esc-tilt-slat-background-size: ${this.enhancedShutter.tiltSlatBackgroundSize()};

      --esc-slide-background-edge-size: ${this.enhancedShutter.shutterBottomSizePercentage()};

      --esc-slide-background-main-position: ${this.enhancedShutter.shutterMainBackgroundPosition()};
      --esc-slide-background-edge-position: ${this.enhancedShutter.shutterEdgeBackgroundPosition()};

      --esc-top-right-color: ${this.cfg.signalIconColor()};
      --esc-top-left-color: ${this.cfg.batteryIconColor()};

      --esc-top-icon-text-line-height: ${this.cfg.iconScalePercent()};
      --esc-top-icon-text-font-size: ${this.cfg.iconScalePercent()};
      --esc-text-scale: ${this.cfg.textScaleFactor()};
      --esc-button-scale: ${this.cfg.buttonScaleFactor()};

    `;
  }
}
