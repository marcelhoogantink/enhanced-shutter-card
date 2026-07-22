import * as C from './constants.js';
import {LitElement, html, css, unsafeCSS,nothing } from './lit/lit-core.min.js';
import {
  cardCfg,
  cardCfgNew,
  windowCfgNew,
  coverCfgNew,
  entityCfgNew,
  shutterCfg,
  cfgNew,
} from './cfg.js';

import {
  boundary,
  findElementInBody,
  findElement,
  console_log,
  getDebug,
  resizeDebugger,
} from './functions.js';

import * as HtmlBlocks from './htmlBlocks.js';
import {EscImages} from './escImages.js';
import {xyPair} from './xyPair.js';
import {haEntity} from './haEntity.js';


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
      if (this.config.windows  || this.config.covers)
      {
        this.newConfig= true;
      }else{
        this.newConfig= false;
      }
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
      this.escImages = new EscImages(this);

      await this.resolveSubEntities();
      await this.escImages.processImages();
    } catch (err) {
      console.warn('ESC: Error during initialization:', err);
      debugger;
    } finally {
      this.initializeReady = true;
        console_log(`getGridOptions initialize Is Ready (${this.cardCfg?.title()}), Force?`);

      if (this.isConnected) {
        // HA will re-call these methods on your card in response of this event:
        // getGridOptions()   ← recalculates layout
        // getCardSize()      ← recalculates legacy size (if defined)
        console_log(`Force getGridOptions(); Title: ${this.config.title} `);
        this.dispatchEvent(new CustomEvent('card-updated', { bubbles: true }));
      }
    }
  }
  // ===================================

  #buildLevel(levelIndex, rawParentConfig, id) {
    /**
     * One entry per nesting level.
     * key   = the property name under which raw items live, and under which
     *         the built result gets attached to its parent's full config.
     * Class = the wrapper class used to turn a merged config into a "full" config.
     */

    const LEVELS = [
      { key: C.CARD_CONFIG,        Class: cardCfgNew    },
      { key: C.WINDOWS_CONFIG,     Class: windowCfgNew  },
      { key: C.COVERS_CONFIG,      Class: coverCfgNew   },
      { key: C.ENTITIES_CONFIG,    Class: entityCfgNew  },
    ];
    if (levelIndex >= LEVELS.length) return undefined;

    const { key, Class } = LEVELS[levelIndex];
    const baseConfig = C.CONFIG_DEFAULT_NEW[key];
    // rawItems is the array of the different card/windows/covers/entities at this level, as defined in the raw config.
    const configItems = rawParentConfig[key];

    if (!configItems) return undefined;

    if (Class == C.ENTITIES_CONFIG){
      debugger;
    }

    const flatCfgBackup = structuredClone(this.flatCfg);

    const cfg = configItems.map((configItem) => {
      // 1. Merge this raw item with its defaults and a fresh id.
      //const mergedConfig = { ...rawItem};
      const mergedConfig = { ...configItem, [C.CONFIG_ID]: id++ };
      const config = this.#buildConfig(baseConfig, mergedConfig);
      const fullCfg = new Class(this.hass, config);

      this.flatCfg = { ...this.flatCfg, ...fullCfg.cfg };
      fullCfg.flatCfg = this.flatCfg;

      // 2. Recurse: try to build the next level using THIS raw item as parent.
      const children = this.#buildLevel(levelIndex + 1, configItem, 0);
      if (children) {
        const childKey = LEVELS[levelIndex + 1]?.key;
        fullCfg.cfg[childKey] = children;
      }
      return fullCfg;
    });
    this.flatCfg = structuredClone(flatCfgBackup);
    return cfg;
  }
// ===================================
  #defAllShutterConfig()
  {

    if (this.newConfig)
    {
          // New config with tree
      // startConfig is for starting the recursive #buildLevel() with a correct initial value:
      //  The only-one CardConfig in an array[0],

      const startConfig = { [C.CARD_CONFIG]: [this.config] };
      this.cardCfg = this.#buildLevel(0, startConfig, 0)[0];

      this.#includeGroupMembers();

      let breakPoint; //new

    } else {
      // classic config
      let id =0;
      const cardConfig = this.#buildConfig(C.CONFIG_DEFAULT,this.config);
      const windowsConfig =1;
      this.cardCfg = new cardCfg(this.hass,cardConfig);

      this.config.entities.map((subConfig) => {

        let baseEntity = subConfig.entity ? new haEntity(this.hass,subConfig.entity) : null;
        let newSubConfig = {
          ...subConfig,
          [C.CONFIG_ID]: id++
        };
        let shutterConfig = this.#buildConfig(cardConfig,newSubConfig);
        let cfg = new shutterCfg(this.hass,shutterConfig)
        let counter =1;
        if (cfg.showGroupMembers() && baseEntity?.isGroup())
        {
          // get the entityId's from the group
          const groupEntityIds = baseEntity.getAttributes().entity_id || [];
          // filter (for security) the entity id's that exists
          const entitiesInGroup = groupEntityIds.filter(entityId => this.hass.states[entityId]);
          entitiesInGroup.forEach(entityId => {
            let newSubConfig = {
              ...subConfig,
              [C.CONFIG_ENTITY_ID]: entityId,
              [C.CONFIG_GROUP]: subConfig.entity,
              [C.CONFIG_ID]: id++
            };
            let shutterConfig = this.#buildConfig(cardConfig,newSubConfig);
            // when a name is defined, check for '@'and fill in the countnumber.
            if (shutterConfig.name) {
              shutterConfig.name = shutterConfig.name.replace("@", counter++);
            }
            let cfg = new shutterCfg(this.hass,shutterConfig)
            cfg.flatCfg = cfg.cfg;
            this.shutterCfgs.push(cfg);
          });
        }else{
          cfg.flatCfg = cfg.cfg;
          this.shutterCfgs.push(cfg);
        }
      });

      let test = this.shutterCfgs;
      let breakPoint; //old
    }
    return true;
  }

  #includeGroupMembers(){
    //debugger;
    if (this.cardCfg instanceof cardCfgNew){
      //debugger;
      let newWindows = [];
      for (const _window of this.cardCfg.cfg.windows) {

        if ( _window.showGroupMembers()){ // TODO: should also be defined through the parents...
          let covers = _window?.cfg?.covers;

          if (covers.length<=1){
            let entities = covers[0]?.cfg?.entities;
            if (entities.length<=1){

              let entityId = entities[0]?.entityId();
              let baseEntity = entityId ?  new haEntity(this.hass,entityId) : null;
              //debugger;
              if (baseEntity?.isGroup()){
                const groupEntityIds = baseEntity.getAttributes().entity_id || [];
                const entityIdsInGroup = groupEntityIds.filter(entityId => this.hass.states[entityId]);
                //all OK insert .....

                for (const memberEntityId of entityIdsInGroup) {
                  //let newWindow = Object.create(
                  //  Object.getPrototypeOf(window),
                  //  Object.getOwnPropertyDescriptors(window)
                  //);
                  //let newWindow = this.#selectiveClonestructuredClone(_window,['cfg','faltCfg',]);
                  let newWindow = this.#recursiveSelectiveClone(_window, (key) => key === 'xxxx');

                  //debugger;
                  const newEntity = newWindow.cfg.covers[0].cfg.entities[0];
                  newEntity.entityId(memberEntityId);
                  newEntity.setCoverEntity(this.hass,memberEntityId);
                  newEntity.friendlyName(newEntity.getCoverEntity()?.getFriendlyName() || C.UNKNOWN);

                  newWindows.push(newWindow);

                }
              }else{
                newWindows.push(_window);
                debugger; // is not a group ...
              }
            }else{
              newWindows.push(_window);
              debugger; // too many entities, should be just one.
            }
          }else{
            newWindows.push(_window);
            debugger; // too many covers, should be just one.
          }
        }else{
          newWindows.push(_window);
          //debugger; // no Group-Member-config needed
        }
      }
      //debugger;
      this.cardCfg.cfg.windows= newWindows;
    }else{
      debugger;
    }
  }
  //========================================
  #recursiveSelectiveClone(obj, shouldLink) {
    if (obj === null || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map(item => this.#recursiveSelectiveClone(item, shouldLink));
    }

    // preserve prototype (and therefore its methods, like cfg.prototype)
    const result = Object.create(Object.getPrototypeOf(obj));

    // only own enumerable properties — not inherited prototype methods
    for (const key of Object.keys(obj)) {
      const value = obj[key];

      if (shouldLink(key, value, obj)) {
        result[key] = value;
      } else if (value !== null && typeof value === 'object') {
        result[key] = this.#recursiveSelectiveClone(value, shouldLink);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  //=========================================


  #buildConfig(configBase,configSub)
  {
    const idMessage = configSub.id === undefined ? 'General' : configSub.id;
    this.#checkUnknownKeys(configBase,configSub, idMessage);
    // handle PRESET TYPE
    //
    let shutterPreset = (configSub[C.CONFIG_SHUTTER_PRESET] || '').toLowerCase();
    let configPreset = { ...(C.ESC_PRESET[shutterPreset] || {}) };

    let newConfigSub = { ...configSub };

    this.#replaceKeys(newConfigSub, C.DEPRECATED, C.HA_ALERT_WARNING, idMessage);
    this.#replaceKeys(newConfigSub, C.REMOVED, C.HA_ALERT_ERROR, idMessage);

    let config = { ...configBase, ...configPreset, ...newConfigSub};

    return config;
  }

  #checkUnknownKeys(configBase,configSub, idMessage)
  {
    if (typeof configSub !== 'object' || configSub === null){
      configSub={[C.CONFIG_ENTITY_ID]: configSub};
    }
    let unknownKeys = this.#getUniqueKeysFromObjects(configSub,configBase);
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

  }
  #replaceKeys(newConfigSub, keys, alertType, idMessage)
  {
    Object.keys(keys).forEach(key => {
      if (newConfigSub[key] != null) {
        let oldKey = keys[key];
        this.messageManager.addMessage(
          `Deprecated: [${key}], use '${oldKey.new}'!`,
          alertType,
          idMessage
        );
        this.#replaceKey(newConfigSub, key,oldKey);
      }
    });
  }
  #replaceKey(newConfigSub, key,oldKey) {
    if (oldKey.value){
      // correct value with function
      newConfigSub[oldKey.new] = oldKey.value(newConfigSub[key]);
    }else{
      // take same value
      newConfigSub[oldKey.new] = newConfigSub[key];
    }
    delete newConfigSub[key];
  }
  #getUniqueKeysFromObjects(obj1, obj2) {
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
    let allKeys =[];
    if (this.newConfig){
      // TODO newConfig
      //debugger;
      const card = this.cardCfg;
      for (const window of card.cfg.windows) {
        for (const cover of window.cfg.covers) {
            //debugger;
            const keys = cover.cfg.entities.map(cfg=>cfg.entityId());
            allKeys = [...keys, ...allKeys];
        }
      }
    }else{
      allKeys = this.shutterCfgs.map(cfg=>cfg.entityId());
    }
    return allKeys;
  }

/*
* OVERRIDE FUNCTIONS LIT ELEMENT
*/
  shouldUpdate(changedProperties) {
    let doUpdate =false;

    changedProperties.forEach((oldValue, propName) => {
      console_log(`Card shouldUpdate, Property [${propName}] changed. oldValue: ${oldValue} newValue: ${this[propName]}, title: ${this.cardCfg?.title()}`);
      switch (propName){
        case ("initializeReady"):
          if (this.initializeReady){
            doUpdate =true;
          }
          break;
        case 'hass':
          /* On hass update, check if there is a cover change */
          if (this.newConfig){
            const card = this.cardCfg;

            outer: // label for break outer, see below:
            for (const cfgWindow of card.cfg.windows) {
              if (cfgWindow.entityId()) {
                debugger;
              }
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
          }else{
            this.shutterCfgs.forEach(cfg =>{
              if (cfg.entityId()) {
                // get previous state
                doUpdate = this.checkShutterState(cfg);
                doUpdate = this.checkSubEntityStates(cfg,doUpdate);
              }
            });
          }
          break;
        default:
          /* On any other property change, do the update */
          if (oldValue !== undefined) doUpdate = true;
      }
    });
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
    this.showMessages = this.messageManager.countMessages() && this.inEditor();
    this.shutterSeparateBlock= new HtmlBlocks.htmlBlockShutterSeparate(this.cardCfg);
    let htmlParts = new htmlCard(this);
    let htmlout;

    htmlout = html`
      ${this.showMessages ? html`${this.messageManager.displayGroupMessages('GridSize')} ` : ''}
      ${this.showMessages ? html`${this.messageManager.displayGroupMessages('General')} ` : ''}
      <ha-card .header=${this.config.title}>
        <div
          class="${C.ESC_CLASS_SHUTTERS}"
          style = "${htmlParts.defStyleVarsCard()}"
        >
          ${this.newConfig
              ? this.htmlOutNew()
              : this.htmlOutOld()}
        </div>
      </ha-card>
    `;
  return htmlout;
  }
  htmlOutNew(){

      const htmlOut = html`
          ${this.buildRender()}
        `;
    return htmlOut;
  }
  htmlOutOld(){
      const htmlOut = html`
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
                    ${this.showMessages ? html`${this.messageManager.displayGroupMessages( cfg.id())} ` : ''}
                  </div>
                  ${this.shutterSeparateBlock.show()}
                `;
              }
            )}`;
    return htmlOut;
  }

  buildRender() {
    const htmlOut = html`${this.#buildLevel2(this.cardCfg,0, 0)}`;
    return htmlOut;
  }

  static #LEVELS = [
      { childKey: C.WINDOWS_CONFIG,     func: "cardHtml"  },
      { childKey: C.COVERS_CONFIG,      func: "windowHtml"  },
      { childKey: C.ENTITIES_CONFIG,    func: "coverHtml"   },
      { childKey: "",                   func: "entityHtml"  },
    ];
  #buildLevel2(config, index, depth) {

    if (depth >= EnhancedShutterCardNew.#LEVELS.length) return nothing;

    const {childKey,func} = EnhancedShutterCardNew.#LEVELS[depth];
    const cfg=config.cfg;


    const children = childKey && Array.isArray(cfg[childKey])
      ? cfg[childKey].map((childCfg, i) => this.#buildLevel2(childCfg, i, depth + 1))
      : nothing;

    return this[func](index, config,children);
  }
  cardHtml(index,flatObj,children){
    //return nothing;
    return html`<u>Card: (${children}) card</u>`;
  }
  windowHtml(index,flatObj,children){
    //return nothing;
    const cfg=flatObj;
    return html`
      <div class="${C.ESC_CLASS_SHUTTER_FLEX}">
        <enhanced-shutter
          .react_ShutterState=null
          .react_BatteryState=null
          .react_SignalState=null
          .react_ScreenOrientation=${this.screenOrientation}
          .react_InitializeReady=${this.initializeReady}

          .hass=${this.hass}
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
  coverHtml(index,flatObj,children){
    //return nothing;
    return html`<li><u>Cover (${children}) cover</u><br></li>`;
  }
  entityHtml(index,flatObj,children){
    const cfg=flatObj;
    return html`<li><u>Entity (${children}) entity</u><br></li>`;

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
        ${this.showMessages ? html`${this.messageManager.displayGroupMessages( cfg.id())} ` : ''}
      </div>
      ${this.shutterSeparateBlock.show()}
    `;
    // return html`<li><u>Entity (${index})</u><br></li>`;
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
  /**
   * Fetches the entity registry and returns all entities that belong to the same device as the provided entity IDs.
   */
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

    // helper
    /**
     *  Checks if the given entry has the specified device class.
     * @param {*} entry
     * @param {*} targetClass
     * @returns
     */
    const hasDeviceClass = (entry, targetClass) =>
      this.hass.states[entry.entity_id]?.attributes?.device_class === targetClass;



    if (this.newConfig){
      // newConfig
      //debugger;
      const entityIds = this.getCoverEntities();
      const card = this.cardCfg;

      outer: // label for break outer, see below:
      for (const window of card.cfg.windows) {
        for (const cover of window.cfg.covers) {
          for (const entity of cover.cfg.entities) {
            //debugger;
            // do something
            const entityId = entity.entityId();
            let siblings =null;

            for (const type of C.DEVICES_CLASSES_SUB_ENTITIES) {
              const subEntity = entity.subEntity[type];
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
        }
      }
    }else{
      // oldConfig
      const entityIds = this.getCoverEntities();


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
        (this.config.entities || this.config.covers || this.config.windows)
      ){
      this.previousGridWidth = this.gridPixelWidth;
      const style = getComputedStyle(this.gridContainer);
      const columns = style.getPropertyValue('grid-template-columns');
      this.gridPixelWidth = (parseFloat(columns.split(/\s+/)[0]));

      if (!this.nbCols || !this.nbRows || this.previousGridWidth !== this.gridPixelWidth){

        let shutterSeparateBlock= new HtmlBlocks.htmlBlockShutterSeparate(this.cardCfg);
        let sizeSeparate = shutterSeparateBlock.size();
        let cardTitle = new HtmlBlocks.htmlBlockCardTitle(this.cardCfg);
        let sizeTitle = cardTitle.size();


        if (this.newConfig){
          // newConfig
          //debugger;
          const card = this.cardCfg;
          let separate=false;
          for (const window of card.cfg.windows) {
            let block = {
              cfg: window.cfg.covers[0].cfg.entities[0], // TODO: toosimple here .....
              //cfg: window,
              escImages: this.escImages};

            let shutterBlock = new HtmlBlocks.htmlBlockShutter(block);
            //for (const cover of window.cfg.covers) {
            //  for (const entity of cover.cfg.entities) {
            //    debugger;
            //  }
            //}
            if (separate){
              if (this.cardCfg.stacked() == C.VERTICAL){
                sizeCard = shutterBlock.gridAddVertical(sizeCard,sizeSeparate);
              }else{
                sizeCard = shutterBlock.gridAddHorizontal(sizeCard,sizeSeparate);
              }
            }else{
              sizeCard = shutterBlock.gridAddVertical(sizeCard,sizeTitle);
            }
            let size = shutterBlock.size();
            if (this.cardCfg.stacked() == C.VERTICAL){
              sizeCard = shutterBlock.gridAddVertical(sizeCard,size);
            }else{
              sizeCard = shutterBlock.gridAddHorizontal(sizeCard,size);
            }
            separate=true;
          }
        }else{
          // oldConfig
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

            let size = shutterBlock.size();
            if (this.cardCfg.stacked() == C.VERTICAL){
              sizeCard = shutterBlock.gridAddVertical(sizeCard,size);
            }else{
              sizeCard = shutterBlock.gridAddHorizontal(sizeCard,size);
            }
            separate=true;

          });

        }

        sizeCard = cardTitle.gridAddBoth(sizeCard,new xyPair(2*C.CARD_PADDING,2*C.CARD_PADDING)); // padding of the Card


        this.nbRows= Math.ceil((sizeCard.y()+this.gridPixelGap)/(this.gridPixelHeight+this.gridPixelGap));
        this.nbCols= Math.ceil((sizeCard.x()+this.gridPixelGap)/(this.gridPixelWidth+this.gridPixelGap));

        console_log(`GridSize: sizeCard:`,sizeCard,` pixelGap: ${this.gridPixelGap} PixelHeight: ${this.gridPixelHeight} PixelWidth: ${this.gridPixelWidth}`);

        let message = `GridSize: rows: ${this.nbRows}, columns: ${this.nbCols}`;
        console_log('Message 2:', message);
        this.messageManager.addMessage(message, C.HA_ALERT_SUCCESS, 'GridSize');

        console_log('getGridOptionsInternal Calc rows and cols',this.nbRows,this.nbCols);
      }else{
        console_log('getGridOptionsInternalNo recalc rows and cols');
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

    debugger;
    // TODO: here some  loops for cover / shutter are needed ( for the --esc vars)

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



export class htmlCard{
  constructor(enhancedShutterCard){
    this.enhancedShutterCard=enhancedShutterCard;
  }
  defStyleVarsCard(){
    const card_vars = `
      --esc-card-flex-direction: ${this.enhancedShutterCard.getCardFlexDirection()};
    `;
    return card_vars;
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
//    }
      //debugger;
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
