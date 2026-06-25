import * as C from './constants.js';
//import {EscImages} from './escImages.js';
import {LitElement, html, css, unsafeCSS } from './lit/lit-core.min.js';

import {
  boundary,
  findElementInBody,
  findElement,
  console_log,
  getDebug,
  resizeDebugger
} from './functions.js';

import * as HtmlBlocks from './htmlBlocks.js';
import {EscImages} from './escImages.js';
import {xyPair} from './xyPair.js';


export class EnhancedShutterCardNew extends LitElement{
  //reactive properties
  constructor() {
    super(); //  mandetory by Lit-element

    //this.isShutterConfigLoaded = false;
    this.initializeReady = false;

    this.shutterCfgs = [];
    this.screenOrientation= C.LANDSCAPE ;
    //this.escImagesLoaded = false;
    this.gridPixelWidth = C.HA_GRID_PX_WIDTH;

    this.gridPixelHeight = C.HA_GRID_PX_HEIGHT;
    this.gridPixelGap = C.HA_GRID_PX_GAP;
    this.gridContainer = null;
    this.isResizeInProgress = false;
    this.isSubEntitiesChecked = false;
    this.initializeStarted = false;
    this.messageManager= new MessageManager();
  }
  static properties = {
    // reactive variables from Home Assistant Card
    hass: {type: Object},
    config: {type: Object},
    // local reactive variables

    initializeReady: {type: Boolean, state: true},
    shutterCfgs: {type: Array, state: true},
    screenOrientation: {type: Object, state: true},
    gridPixelWidth: {type: Number, state: true},
  };

  set hass(hass) {

    const oldHass = this._hass;
    this._hass = hass;
    if (!this.initializeStarted) {
      this.initializeStarted = true;
      this.cardInitialize(); // run once
    }
    this.requestUpdate('hass', oldHass);
  }
  get hass() {
    return this._hass;
  }
  async cardInitialize() {
    // ✅ Safe to use hass here, runs exactly once
    try {
      this.#defAllShutterConfig();
      //this.isShutterConfigLoaded = this.#defAllShutterConfig();
      this.escImages = new EscImages(this.shutterCfgs);

      await this.resolveSubEntities();
      await this.escImages.processImages();
    } catch (err) {
      console.warn('ESC: Error during initialization:', err);
    } finally {
      this.initializeReady = true;
        console_log('initialize Is Ready');

      if (this.isConnected) {
        // HA will re-call these methods on your card in response of this event:
        // getGridOptions()   ← recalculates layout
        // getCardSize()      ← recalculates legacy size (if defined)
        console_log('Force getGridOptions()');
        this.dispatchEvent(new CustomEvent('card-updated', { bubbles: true }));
      }
    }
  }
  #defAllShutterConfig()
  {
    //const coversConfig;


    let id =0;

    if (this.config.windows  || this.config.covers)
    {
      // New config with tree

      const cardConfigNew = this.#buildConfigNew(C.CONFIG_DEFAULT_NEW.card,this.config);
      this.cardCfg = new cardCfgNew(cardConfigNew);

      let config;
      if (this.config.windows){
        config= this.config.windows;
        config.map((subConfig) => {
          let newSubConfig = {...subConfig,  [C.CONFIG_ID]: id++};
          let shutterConfig = this.#buildConfigNew(C.CONFIG_DEFAULT_NEW.windows,newSubConfig);
          let cfgWindow = new windowCfgNew(this.hass,shutterConfig);
          let test=1;
          if (subConfig.covers){
            let config2= subConfig.covers;
            config2.map((subConfig) => {
              let newSubConfig = {...subConfig,  [C.CONFIG_ID]: id++};
              let shutterConfig = this.#buildConfigNew(C.CONFIG_DEFAULT_NEW.covers,newSubConfig);
              let cfgCover = new coverCfgNew(this.hass,shutterConfig);
              let test=1;
              if (subConfig.entities){
                let config3= subConfig.entities;
                config3.map((subConfig) => {
                  let newSubConfig = {...subConfig,  [C.CONFIG_ID]: id++};
                  let shutterConfig = this.#buildConfigNew(C.CONFIG_DEFAULT_NEW.entities,newSubConfig);
                  let cfgEntity = new entityCfgNew(this.hass,shutterConfig);
                let test=1;
                });
              }
            });
          }

        });
      }else if (this.config.covers){
        config= this.config.covers;
        config.map((subConfig) => {
          let newSubConfig = {...subConfig,  [C.CONFIG_ID]: id++};
          let shutterConfig = this.#buildConfigNew(C.CONFIG_DEFAULT_NEW.covers,newSubConfig);
          let cfg = new shutterCfgNew(this.hass,shutterConfig)
        });

      }else if (this.config.entities){
        config= this.config.entities;
        config.map((subConfig) => {
          let newSubConfig = {...subConfig,  [C.CONFIG_ID]: id++};
          let shutterConfig = this.#buildConfigNew(C.CONFIG_DEFAULT_NEW.entities,newSubConfig);
          let cfg = new entityCfgNew(this.hass,shutterConfig)
        });

      }else{
        config=null;
      }

    } else {
      // classic config
      const cardConfig = this.#buildConfig(C.CONFIG_DEFAULT,this.config);
      const windowsConfig =1;
      this.cardCfg = new cardCfg(cardConfig);

      this.config.entities.map((subConfig) => {

        let baseEntity = subConfig.entity ? new haEntity(this.hass,subConfig.entity) : null;
        let counter =1;
        if (baseEntity?.isGroup() && cfg.showGroupMembers()){
          // get the entityId's from the group
          const groupEntityIds = baseEntity.getAttributes().entity_id || [];
          // get the full entities from the id's
          const entitiesInGroup = groupEntityIds.filter(entityId => this.hass.states[entityId]);
          entitiesInGroup.forEach(entityId => {
            //let newSubConfig = {...subConfig, [C.CONFIG_ENTITY_ID]: entityId, [C.CONFIG_GROUP]: subConfig.entity, [C.CONFIG_ID]: id++};
            let newSubConfig = {...subConfig, entity: entityId, [C.CONFIG_GROUP]: subConfig.entity, [C.CONFIG_ID]: id++};
            let shutterConfig = this.#buildConfig(cardConfig,newSubConfig);
            // when a name is defined, check for '@'and fill in the countnumber.
            if (shutterConfig.name) {
              shutterConfig.name = shutterConfig.name.replace("@", counter++);
            }
            let cfg = new shutterCfg(this.hass,shutterConfig)
            this.shutterCfgs.push(cfg);
          });
        }else{
          let newSubConfig = {...subConfig,  [C.CONFIG_ID]: id++};
          let shutterConfig = this.#buildConfig(cardConfig,newSubConfig);
          let cfg = new shutterCfg(this.hass,shutterConfig)
          this.shutterCfgs.push(cfg);
        }
      });
    }
    return true;
  }

  #buildConfig(configBase,configSub)
  {
    const idMessage = configSub.id === undefined ? 'General' : configSub.id;

    if (typeof configSub !== 'object' || configSub === null){
      configSub={[C.CONFIG_ENTITY_ID]: configSub};
    }
    let unknownKeys = this.getUniqueKeysFromObjects(configSub,configBase);
    // handle unknown keywords
    if (unknownKeys.length > 0){
      unknownKeys.forEach((key) =>
      {
        this.messageManager.addMessage(
          `Unknown keyword: [${key}], check your input!`,
          C.HA_ALERT_WARNING,
          idMessage
        );
      });
    };
    // handle PRESET TYPE
    //
    let shutterPreset = (configSub[C.CONFIG_SHUTTER_PRESET] || '').toLowerCase();
    let configPreset = { ...(C.ESC_PRESET[shutterPreset] || {}) };

    let newConfigSub = { ...configSub };

    // check deprecated and removed
    // TODO: combine:
    Object.keys(C.DEPRECATED).forEach(key => {
      if (newConfigSub[key] != null) {
        let oldKey = C.DEPRECATED[key];
        this.messageManager.addMessage(
          `Deprecated: [${key}], use '${oldKey.new}'!`,
          C.HA_ALERT_WARNING,
          idMessage
        );
        this.replaceKey(newConfigSub, key,oldKey);
      }
    });

    Object.keys(C.REMOVED).forEach(key => {
      if (newConfigSub[key] != null) {
        let oldKey = C.REMOVED[key];
        this.messageManager.addMessage(
          `Removed: [${key}], use '${oldKey.new}'!`,
          C.HA_ALERT_ERROR,
          idMessage
        );
        this.replaceKey(newConfigSub, key,oldKey);
      }
    });

    let config = { ...configBase, ...configPreset, ...newConfigSub};

    return config;
  }
  #buildConfigNew(configBase,configSub)
  {
    const idMessage = configSub.id === undefined ? 'General' : configSub.id;

    if (typeof configSub !== 'object' || configSub === null){
      configSub={[C.CONFIG_ENTITY_ID]: configSub};
    }
    let unknownKeys = this.getUniqueKeysFromObjects(configSub,configBase);
    // handle unknown keywords
    if (unknownKeys.length > 0){
      unknownKeys.forEach((key) =>
      {
        this.messageManager.addMessage(
          `buildConfigNew: Unknown keyword: [${key}], check your input!`,
          C.HA_ALERT_WARNING,
          idMessage
        );
      });
    };
    // handle PRESET TYPE
    //
    let shutterPreset = (configSub[C.CONFIG_SHUTTER_PRESET] || '').toLowerCase();
    let configPreset = { ...(C.ESC_PRESET[shutterPreset] || {}) };

    // replace deprecated and removed input  settings

    let newConfigSub = { ...configSub };

    // check deprecated
    // TODO: combine:
    Object.keys(C.DEPRECATED).forEach(key => {
      if (newConfigSub[key] != null) {
        let oldKey = C.DEPRECATED[key];
        this.messageManager.addMessage(
          `Deprecated: [${key}], use '${oldKey.new}'!`,
          C.HA_ALERT_WARNING,
          idMessage
        );
        this.replaceKey(newConfigSub, key,oldKey);
      }
    });

    // check removed
    // TODO: combine:
    Object.keys(C.REMOVED).forEach(key => {
      if (newConfigSub[key] != null) {
        let oldKey = C.REMOVED[key];
        this.messageManager.addMessage(
          `Removed: [${key}], use '${oldKey.new}'!`,
          C.HA_ALERT_ERROR,
          idMessage
        );
        this.replaceKey(newConfigSub, key,oldKey);
      }
    });

    let config = { ...configBase, ...configPreset, ...newConfigSub};

    return config;
  }
  replaceKey(newConfigSub, key,oldKey){
        if (oldKey.value){
          // correct value with function
          newConfigSub[oldKey.new] = oldKey.value(newConfigSub[key]);
        }else{
          // take same value
          newConfigSub[oldKey.new] = newConfigSub[key];
        }
        delete newConfigSub[key];
  }
  getUniqueKeysFromObjects(obj1, obj2) {
    // Get all keys from both objects
    const keysObj1 = Object.keys(obj1);
    const keysObj2 = Object.keys(obj2);

    // Check if obj1 has keys not in obj2
    const uniqueKeysInObj1 = keysObj1.filter(key => !keysObj2.includes(key));

    return uniqueKeysInObj1;
  }
  getCardFlexDirection(){
    return this.cardCfg.stacked() == C.VERTICAL ? 'column' : 'row';
  }
  getCoverEntities(){
    let keys = this.shutterCfgs.map(cfg=>cfg.entityId());
    return keys;
  }

/*
* OVERRIDE FUNCTIONS LIT ELEMENT
*/
  shouldUpdate(changedProperties) {
    let doUpdate =false;

    changedProperties.forEach((oldValue, propName) => {
      // console.log(`Card shouldUpdate, Property [${propName}] changed. oldValue: ${oldValue} newValue: ${this[propName]}`);
      switch (propName){
        case ("initializeReady"):
          if (this.initializeReady){
            doUpdate =true;
          }
          break;
        case 'hass':
        /* On hass update, check if there is a cover change */
          this.shutterCfgs.forEach(cfg =>{
            const coverEntityId = cfg.entityId();
            const currentShutterEntity =cfg.getCoverEntity();
            if (currentShutterEntity) {
              const liveCoverEntity = new haEntity(this.hass,coverEntityId);
              let shutterStateOld= cfg.getCoverState();
              let shutterStateNew= cfg.getCoverState(liveCoverEntity);

              if (shutterStateNew != shutterStateOld){
                doUpdate =true;
                cfg.updateCoverEntity(liveCoverEntity);
              }

              for (let type of C.DEVICES_CLASSES_SUB_ENTITIES) {
                const subEntity = cfg.subEntity[type];
                const currentEntity = subEntity?.entity;
                if (currentEntity) {
                  const entityId = subEntity?.entityId;
                  const liveEntity = new haEntity(this.hass,entityId);
                  if (liveEntity && liveEntity.getState() !== currentEntity.getState() ){
                    doUpdate =true;
                    subEntity.update(liveEntity);
                  }
                }
              }
            }
          });

          break;
        default:
          /* On any other property change, do the update */
          if (oldValue !== undefined) doUpdate = true;
      }
    });
    return doUpdate;
  }
  willUpdate(changedProperties){
    super.willUpdate(changedProperties);
  }
  update(changedProperties){
    super.update(changedProperties);
    /*
    changedProperties.forEach((oldValue, propName) => {
      console_log(`Card Update, Property ${propName} changed. oldValue: ${oldValue}; new: ${this[propName]}`);
    });
    /**/
  }
  render()
  {
    if (!this.config || !this.hass || !this.initializeReady){
      return html`
       <ha-card>
          Waiting for Card to initialize...
       </ha-card>
      `;
    }
    let showMessages = this.messageManager.countMessages() && this.inEditor();
    let htmlParts = new htmlCard(this);
    let shutterSeparateBlock= new HtmlBlocks.htmlBlockShutterSeparate(this.cardCfg);

    let htmlout = html`
        ${showMessages ? html`${this.messageManager.displayGroupMessages('GridSize')} ` : ''}
        ${showMessages ? html`${this.messageManager.displayGroupMessages('General')} ` : ''}
        <ha-card .header=${this.config.title}>
          <div
            class="${C.ESC_CLASS_SHUTTERS}"
            style = "${htmlParts.defStyleVarsCard()}"
          >
            ${this.shutterCfgs.map(cfg => {
                // update the live states and attributes
                return html`
                  <div class="${C.ESC_CLASS_SHUTTER_FLEX}">
                    <enhanced-shutter
                      .react_ShutterState=${cfg.getCoverState()}
                      .react_BatteryState=${cfg.getState(cfg.getBatteryEntity())}
                      .react_SignalState=${cfg.getState(cfg.getSignalEntity())}
                      .react_ScreenOrientation=${this.screenOrientation}
                      .react_InitializeReady=${this.initializeReady}

                      .hass=${this.hass}
                      .cfg=${cfg}
                      .escImages=${this.escImages}
                    >
                    </enhanced-shutter>
                    ${showMessages ? html`${this.messageManager.displayGroupMessages( cfg.id())} ` : ''}
                  </div>
                  ${shutterSeparateBlock.show()}
                `;
              }
            )}
          </div>
        </ha-card>
      `;
    return htmlout;
  }
  firstUpdated() {
  }
  updated(changedProperties) {
    super.updated(changedProperties);
  }
  getGrid(){
      this.getGridOptions('internal from getGrid()');
  }
  defGridContainer(){
      let el = this;
      while (el) {
        //const tagName = el.tagName || '(unknown)';
        //const id = el.id || '(no id)';
        //const classList = el.classList?.value || '(no class)';

        if (
            el.classList?.contains('container')) {
          break;
        }

        el = el.parentElement || el.getRootNode()?.host;
      }
      this.gridContainer = el;

      return el;
  }
  connectedCallback() {
    super.connectedCallback();

    //this.defGridContainer();
    //this.getGridOptionsInternal();
    /* get element of hui-view to detect resizing */
    C.Globals.huiView = findElementInBody(C.HA_HUI_VIEW);

    this.startResizeObserver();
  }
  startResizeObserver() {
    const onResize = (entries) => {
      /* Things todo when resize is detected */
      if (getDebug()) resizeDebugger(entries,this.cardCfg.title());
      if (!this.isResizeInProgress) {
        entries.forEach(entry => {
          this.checkOrientation(entry); // check orientation on huiView resize
        });
      }
      if (this.initializeReady && this.config && this.config.entities){
        console_log('Call getGrid');
        this.getGrid();
      }
    }
    this.resizeObserver = new ResizeObserver(onResize);
    this.resizeObserver.observe(C.Globals.huiView);
  }


  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
  }

  checkOrientation(element) {
    // Check the orientation based on the window and div visibility

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
    C.Globals.screenOrientation = {value: visibleWidth*1.4 > visibleHeight ? C.LANDSCAPE : C.PORTRAIT};
    this.screenOrientation = C.Globals.screenOrientation.value;

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


  static get styles() {
    const CSS = `
      .${C.ESC_CLASS_SHUTTERS} {
        display: flex;
        flex-direction: var(--esc-card-flex-direction);
        overflow-x: auto;
        overflow-y: hidden;
        padding: ${C.CARD_PADDING}${C.UNITY};
      }
      .${C.ESC_CLASS_SHUTTER_FLEX} {
        margin: 0 auto;
      }
      .${C.ESC_CLASS_SHUTTER_SEPARATE}-${C.VERTICAL}:not(:last-child) {
        box-sizing: border-box;
        border: ${C.SEPARATE_BORDER_WIDTH}px solid var(--divider-color);

        width: ${C.SEPARATE_LENGHT}${C.UNITY};
        margin-top: ${C.SEPARATE_MARGIN_TB}${C.UNITY};
        margin-left: auto;
        margin-right: auto;
        margin-bottom: ${C.SEPARATE_MARGIN_TB}${C.UNITY};
      }
      .${C.ESC_CLASS_SHUTTER_SEPARATE}-${C.HORIZONTAL}:not(:last-child) {
        box-sizing: border-box;
        border: ${C.SEPARATE_BORDER_WIDTH}px solid var(--divider-color);

        height: ${C.SEPARATE_LENGHT}${C.UNITY};
        margin-top: auto;
        margin-left: ${C.SEPARATE_MARGIN_LR}${C.UNITY};
        margin-right:${C.SEPARATE_MARGIN_LR}${C.UNITY};
        margin-bottom: auto;
      }
    `;
    return css`${unsafeCSS(CSS)}`;
  }
  async getDeviceEntities(entityIds) {
    let deviceEntities = null;
    try {
      const registry = await this.hass.callWS({ type: C.ENTITY_REGISTRY_LIST });
      const deviceIds = [
        ...new Set(
          registry
            .filter(e => entityIds.includes(e.entity_id))
            .map(e => e.device_id)
            .filter(Boolean)
        ),
      ];
      deviceEntities = registry.filter(e => deviceIds.includes(e.device_id));
    } catch (e) {
      console.warn("device-group-card: entity registry lookup failed", e);

    }
    return deviceEntities;
  }

  async resolveSubEntities() {

    const entityIds = this.getCoverEntities();
    // helper
    const hasDeviceClass = (entry, targetClass) =>
      this.hass.states[entry.entity_id]?.attributes?.device_class === targetClass;

    for (const cfg of this.shutterCfgs) {
      const entityId = cfg.entityId();
      let siblings =null;

      for (const type of C.DEVICES_CLASSES_SUB_ENTITIES) {
        const subEntity = cfg.subEntity[type];
        if (subEntity.entityId === C.AUTO){
          if (!this.deviceEntities) {
            this.deviceEntities = await this.getDeviceEntities(entityIds);
          }
          if (!siblings){
            const primary = this.deviceEntities.find(e => e.entity_id === entityId);
            // siblings: all entities of the device of the primary entity
            siblings = this.deviceEntities.filter(
              e => e.device_id === primary?.device_id && e.entity_id !== entityId
            );
          }
          const subId = siblings.find(e => hasDeviceClass(e, type))?.entity_id ?? null;
          subEntity.set(subId);

        }
     }
   }
   return true;
  }
/*
* OVERRIDE FUNCTIONS HA CARD
*/
  setConfig(config)
  {
    if (!config.entities && !config.covers && !config.windows) {
      throw new Error('ESC: You need to define entities, windows or covers in the config.');
    }
    this.config = config;
  }
  getCardSize() {
    console_log('getCardSize called, number of entities:', this.config.entities.length);
    return this.config.entities.length + 1;
  }

  //Section layout : we compute the size of the card. (experimental)


  getGridOptions(text="from External"){
    /*
      This is called **early and synchronously** by HA — before `setConfig()` and definitely before `hass`:

      getGridOptions()   ← HA calls this first, no hass, no config
      setConfig(config)  ← config arrives
      set hass(hass)     ← hass arrives
    */
    let options = this.getGridOptionsInternal(text);
    return options;
  }

  getGridOptionsInternal(text){

    //const debug=0;
    if (!this.gridContainer){
      this.defGridContainer();
    }
    let options={};
    let tempCardName="";

    let sizeCard = new xyPair();

    console_log(`getGridOptionsInternal: ${text}; cols  & rows:`,this.nbCols,this.nbRows,this.gridPixelHeight,this.gridPixelWidth,this.previousGridWidth);


    if (this.initializeReady &&
        this.gridContainer &&
        this.config &&
        this.config.entities
      ){
      this.previousGridWidth = this.gridPixelWidth;
      const style = getComputedStyle(this.gridContainer);
      const columns = style.getPropertyValue('grid-template-columns');
      this.gridPixelWidth = (parseFloat(columns.split(/\s+/)[0]));

      if (!this.nbCols || !this.nbRows || this.previousGridWidth !== this.gridPixelWidth){

        let shutterSeparateBlock= new HtmlBlocks.htmlBlockShutterSeparate(this.cardCfg);
        let sizeSeparate = shutterSeparateBlock.size();
        let cardTitleSize = new HtmlBlocks.htmlBlockCardTitle(this.cardCfg);
        let sizeTitle = cardTitleSize.size();

        let separate=false;
        this.shutterCfgs.forEach(cfg =>{

          let block = {cfg: cfg,escImages: this.escImages};
          console_log(`${cfg.friendlyName()} HtmLblock for Size`);
          let shutterBlock = new HtmlBlocks.htmlBlockShutter(block);

          if (separate){
            if (this.cardCfg.stacked() == C.VERTICAL){
              sizeCard = shutterBlock.gridAddVertical(sizeCard,sizeSeparate);
            }else{
              sizeCard = shutterBlock.gridAddHorizontal(sizeCard,sizeSeparate);
            }
          }else{
            sizeCard = shutterBlock.gridAddVertical(sizeCard,sizeTitle);
          }

          if (this.cardCfg.stacked() == C.VERTICAL){
            sizeCard = shutterBlock.gridAddVertical(sizeCard,shutterBlock.size());
          }else{
            sizeCard = shutterBlock.gridAddHorizontal(sizeCard,shutterBlock.size());
          }
          separate=true;

        });
        sizeCard = cardTitleSize.gridAddBoth(sizeCard,new xyPair(2*C.CARD_PADDING,2*C.CARD_PADDING)); // padding Card


        this.nbRows= Math.ceil((sizeCard.y()+this.gridPixelGap)/(this.gridPixelHeight+this.gridPixelGap));
        this.nbCols= Math.ceil((sizeCard.x()+this.gridPixelGap)/(this.gridPixelWidth+this.gridPixelGap));

        let message = `GridSize: rows: ${this.nbRows}, columns: ${this.nbCols}`;
        console_log('Message 2:', message);
        this.messageManager.addMessage(message, C.HA_ALERT_SUCCESS, 'GridSize');

        console_log('Calc rows and cols',this.nbRows,this.nbCols);
      }else{
        console_log('No recalc rows and cols');
      }
// version v1.6.1b0: (temporary) removed due to issue #168
/*
      const divCard= this.closestElement('div.card');

      if (divCard){

        divCard.style.setProperty('--row-size',this.nbRows);
        divCard.style.setProperty('--column-size',this.nbCols);
      }else{
        console.warn(`Could not find div.card to set CSS variables. Cardname: '${tempCardName}'`);
      }
*/

      /*
      * Calculate the number of rows and columns
      * Use sizes from calculated cardSize and HA grid sizes
      */
      //console.log('=====>Size Card: ', sizeCard);
      let min_rows= this.nbRows;
      let min_cols = this.nbCols;

      if (this.inEditor()) {
        min_rows = 4;
        min_cols = 4;
      }

      options = {
        rows: this.nbRows,
        columns: this.nbCols,
        min_rows: min_rows,
        min_columns: min_cols,
        // max_rows: 6,
        // max_columns: 28,
      };
    }else{
        console_log('ShutterCard  .. no content yet ??.. No (new) nbRows and nbCols calculated');
    }
    console_log('options: ',options);
    return options;
  }
  inEditor(){
    return this.closestElement('hui-dialog-edit-card') !== null;
  }
  // ############################################################################################################
  static getStubConfig(hass, unusedEntities, allEntities) {
    //Search for a cover entity unused first then in all entities.
    let entityId = unusedEntities.find((eid) => eid.split(".")[0] === "cover" );
    if (!entityId) {
      entityId = allEntities.find((eid) => eid.split(".")[0] === "cover");
    }
    //let entity = hass.states[entityId];
    return {
      "entities": [{
        "entity": entityId,
        "name": "My First Enhanced Shutter Card",
        "top_offset_pct": 13,
        "button_up_hide_states": [
          C.SHUTTER_STATE_OPEN,
          C.SHUTTER_STATE_OPENING,
          C.SHUTTER_STATE_CLOSING
        ],
        "button_stop_hide_states": [
          C.SHUTTER_STATE_OPEN,
          C.SHUTTER_STATE_CLOSED,
          C.SHUTTER_STATE_PARTIAL_OPEN
        ],
        "button_down_hide_states": [
          C.SHUTTER_STATE_CLOSED,
          C.SHUTTER_STATE_OPENING,
          C.SHUTTER_STATE_CLOSING
        ]
      }]
    };
  }
}


export class EnhancedShutter extends LitElement
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
    react_ShutterState: {type: String},        // for detecting state of shutter (open close etc)
    react_BatteryState: {type: String},        // for detecting battery state change
    react_SignalState: {type: String},         // for detecting signal state change
    react_ScreenOrientation: {type: Object},   // for change in screen orientation  by resize window or rotate device
    react_InitializeReady: {type: Boolean},

    // local reactive variables
    react_ShutterPosition: {state: true},      // for dragging shutter onscreen
    react_TiltPosition: {state: true},         // for dragging tilt-shutter onscreen
    react_ResizeDivShutterSelector: {state: true,type: Boolean}, // for detecting resize of shutter div by responsive design
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
    // console.log('  Cover shouldUpdate Start: ',this.cfg.friendlyName());
    changedProperties.forEach((oldValue, propName) => { // eslint-disable-line no-unused-vars
        // console.log(`  Cover shouldUpdate, Property [${propName}] changed. oldValue: ${oldValue} newValue: ${this[propName]}`);
    });
    let doUpdate =(this.react_InitializeReady) ? true : false;
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
    /**/
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
      // position from screen-dragging shown
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
    const shutterBlock = new HtmlBlocks.htmlBlockShutter(this);

    return shutterBlock.show(this);

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
    const shutterPosition = this.getShutterPosFromScreenPos(screenPosition);
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
    return shutterPosition;
  }

  getScreenPosFromPickPoint(event){
    const pickPoint = this.getPoint(event);
    let delta = new xyPair(pickPoint.coord.x() - this.basePickPoint.coord.x() ,
                           pickPoint.coord.y() - this.basePickPoint.coord.y());
    let delta_local = this.cfg.rotateBackOrtho(delta);

    let newScreenPosition =
      Math.round(boundary(
        this.basePickPoint.shutterScreenPos+delta_local.y(),
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
    this.react_ShutterPosition = this.getShutterOnScreenPosition(event);
    const tiltPosition = this.cfg.currentDeviceTiltPosition();
    this.positionText = this.cfg.computePositionText(this.react_ShutterPosition,tiltPosition);
    //console.log('mouseMoveOpenClosePicker:',this.react_ShutterPosition,tiltPosition,this.positionText);
  };
  mouseMoveTiltSlider = (event) => { // mouseMoveTilt
    this.action='user-drag-tilt';
    this.react_TiltPosition = this.getTiltOnScreenPosition(event);
    const shutterPosition = this.cfg.currentDevicePosition();
    this.positionText = this.cfg.computePositionText(shutterPosition,this.react_TiltPosition);
    //console.log('mouseMoveTiltSlider:',shutterPosition,this.react_TiltPosition,this.positionText);
  }
  mouseMoveOpenCloseSlider = (event) => { // mouseMoveTilt
    this.action='user-drag-slider';
    this.react_ShutterPosition = this.getOpenCloseOnScreenPosition(event); // TODO
    const tiltPosition = this.cfg.currentDeviceTiltPosition();
    this.positionText = this.cfg.computePositionText(this.react_ShutterPosition,tiltPosition);
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
    this.react_ShutterPosition = this.getShutterOnScreenPosition(event);
    this.sendOpenClose(this.react_ShutterPosition);
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



class cfg{
  cfg={};
  coverEntity=null;
  localize={};
  subEntity={};
  _group=null;
  _id=null;
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
    windowHeightPx:    C.CONFIG_HEIGHT_PX,  // will never be calles from fillCfg();
    windowWidthPx:     C.CONFIG_WIDTH_PX,

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
  group(){
    return this[C.CONFIG_GROUP];
  }
  id(){
    return this[C.CONFIG_ID];
  }

  partial(value = null){
    let partial = this.getCfg(C.CONFIG_PARTIAL_CLOSE_PCT,value);
    if (partial == C.SHUTTER_OPEN_PCT ||  partial == C.SHUTTER_CLOSED_PCT) partial = 0;
    partial = this.invertPosition(partial);
    // only when cover can set position
    return this.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION) ? partial : 0;
  }
  offset(value = null){
    let offset = this.getCfg(C.CONFIG_OFFSET_IS_CLOSED_PCT,value);
    if (offset == C.SHUTTER_OPEN_PCT ||  offset == C.SHUTTER_CLOSED_PCT) offset = 0;
    offset = this.invertPosition(offset);
    // only when cover can set position
    return this.isCoverFeatureActive(C.ESC_FEATURE_SET_POSITION) ? offset : 0;
  }
  partialActive(){
    return this.partial() !=C.SHUTTER_OPEN_PCT && this.partial() != C.SHUTTER_CLOSED_PCT;
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

  buttonsLeftActive(){
    if (this.showStandardButtons() || this.partialActive())
      return true;
    else
      return false;
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
  computePositionText(position,tiltPosition){
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

//    this.stacked(escConfig[C.CONFIG_STACKED]);
//    this.title(escConfig[C.CONFIG_TITLE]);

    Object.preventExtensions(this);
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

    this[C.CONFIG_GROUP]=escConfig[C.CONFIG_GROUP];
    this[C.CONFIG_ID]=escConfig[C.CONFIG_ID];

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

    this.partial(boundary(escConfig[C.CONFIG_PARTIAL_CLOSE_PCT]));
    this.offset(boundary(escConfig[C.CONFIG_OFFSET_IS_CLOSED_PCT]));

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
export class htmlCard{
  constructor(enhancedShutterCard){
    this.enhancedShutterCard=enhancedShutterCard;
  }
  defStyleVarsCard(){
    return `
      --esc-card-flex-direction: ${this.enhancedShutterCard.getCardFlexDirection()};
    `;
  }
}

export class haEntity{
  #state;
  #attributes;
  //#lastChanged;
  //#lastUpdated;
  // #context;
  #entityId;
  constructor(hass,entityId)
  {
    let entityInfo = hass.states[entityId];
    if (typeof entityInfo !== "undefined") {
      this.#state = entityInfo.state;
      this.#attributes = entityInfo.attributes;
      //this.#lastChanged = entityInfo.last_changed;
      //this.#lastUpdated =  entityInfo.last_updated;
      //this.#context =  entityInfo.context;
      this.#entityId = entityInfo.entity_id;
    }else{
      console.warn('haEntity: Entity [', entityId, '] not found');
      this.#state = C.UNAVAILABLE;
      this.#attributes = C.UNAVAILABLE;
      this.#entityId = entityId || C.UNAVAILABLE;
      //this.#lastChanged = C.UNAVAILABLE;
      //this.#lastUpdated = C.UNAVAILABLE;
      //this.#context = C.UNAVAILABLE;
    }
  };

  getState(){
    return this.#state || C.UNAVAILABLE;
  }
  getAttributes(){
    return this.#attributes || C.UNAVAILABLE;
  }
  getEntityId(){
    return this.#entityId || C.UNAVAILABLE;
  }
  getCurrentPosition(){
    return this.getAttributes()?.current_position ?? null;
  }
  getCurrentTiltPosition(){
    return this.getAttributes()?.current_tilt_position ?? null;
  }
  getFriendlyName(){
    return this.getAttributes()?.friendly_name ?? C.UNAVAILABLE;
  }
  getSupportedFeatures(){
    return this.getAttributes()?.supported_features ?? null;
  }
  getUnitOfMeasurement(){
    return this.getAttributes()?.unit_of_measurement ?? C.UNAVAILABLE;
  }
  isGroup(){
    return this.getAttributes()?.entity_id !== undefined;
  }
}
export class MessageManager {
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
export class Message {
  constructor(text, severity = C.HA_ALERT_INFO, subject = 'General') {
    this.text = text;
    this.severity = severity;
    this.subject = subject;
  }
}
export class haSubEntity{

  constructor(hass,type,entityId=false){
    this.hass= hass;
    this.type=type;
    this.entityId = entityId;
    //this.entity = this.set(entityId);
    this.set(entityId);
  }
  set(entityId){
    if (entityId && entityId !==C.AUTO){
      this.entity = new haEntity(this.hass,entityId);
      this.entityId=entityId;
    }
  }
  get(){
    return this.entity
  }
  update(haEntity){
    this.entity=haEntity;
  }
}
