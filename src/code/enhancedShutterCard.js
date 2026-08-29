import * as C from './constants.js';
import {LitElement, html, css, unsafeCSS,nothing } from './lit/lit-core.min.js';
import {
  cfg,
  cardCfg,
  cardCfgNew,
  windowCfgNew,
  coverCfgNew,
  entityCfgNew,
  shutterCfg,
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
import {MessageManager, htmlCard} from './classes.js';

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
    cfg.setHass(hass);
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

      HtmlBlocks.htmlBlock.setImages(this.escImages);
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

  #buildCfgRecursive(levelIndex, rawParentConfig, id) {
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
      const mergedConfig = { ...configItem, [C.CONFIG_ID]: id++ };
      // const mergedConfig = { ...configItem};
      const config = this.#buildConfig(baseConfig, mergedConfig);
      const fullCfg = new Class(config);

      this.flatCfg = { ...this.flatCfg, ...fullCfg.cfg };
      fullCfg.flatCfg = this.flatCfg;

      // 2. Recurse: try to build the next level using THIS raw item as parent.
      const children = this.#buildCfgRecursive(levelIndex + 1, configItem, 0);
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
      this.cardCfg = this.#buildCfgRecursive(0, startConfig, 0)[0];

      this.#includeGroupMembers();

      let breakPoint; //new

    } else {
      // classic config
      let id =0;
      const cardConfig = this.#buildConfig(C.CONFIG_DEFAULT,this.config);
      this.cardCfgTest = this.convertClassicToNewConfig();
      
      this.cardCfg = new cardCfg(cardConfig);

      this.config.entities.map((subConfig) => {

        let baseEntity = subConfig.entity ? new haEntity(this.hass,subConfig.entity) : null;
        let newSubConfig = {
          ...subConfig,
          [C.CONFIG_ID]: id++
        };
        let shutterConfig = this.#buildConfig(cardConfig,newSubConfig);
        let cfg = new shutterCfg(shutterConfig)

        

        // explode a group into members if the config is set to showGroupMembers and the entity is a group.
        if (cfg.showGroupMembers() && baseEntity?.isGroup()){
          let counter =1;
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
            let cfg = new shutterCfg(shutterConfig)
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
  convertClassicToNewConfig(){
    let newConfigCard = {};
    let newConfigWindows = {};
    let newConfigCovers = {};
    let newConfigEntities = {};
    const config = this.config;
    const card = C.CONFIG_DEFAULT_NEW[C.CARD_CONFIG];
    const windows = C.CONFIG_DEFAULT_NEW[C.WINDOWS_CONFIG];
    const covers = C.CONFIG_DEFAULT_NEW[C.COVERS_CONFIG];
    const entities = C.CONFIG_DEFAULT_NEW[C.ENTITIES_CONFIG];
    //debugger;
    for (const [key, value] of Object.entries(card)) {
      console.log(`${key}: ${value}`);
      newConfigCard[key] = config[key] ? config[key] : value;
    }
    for (const [key, value] of Object.entries(windows)) {
      console.log(`${key}: ${value}`);
      newConfigWindows[key] = config[key] ? config[key] : value;
    }
    for (const [key, value] of Object.entries(covers)) {
      console.log(`${key}: ${value}`);
      newConfigCovers[key] = config[key] ? config[key] : value;
    }
    for (const [key, value] of Object.entries(entities)) {
      console.log(`${key}: ${value}`);
      newConfigEntities[key] = config[key] ? config[key] : value;
    }
    //debugger;
    // if (key in card) {}   
    return newConfigCard;

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
      //console.log(`Card shouldUpdate, Property [${propName}] changed. oldValue: ${oldValue} newValue: ${this[propName]}, title: ${this.cardCfg?.title()}`);
      switch (propName){
        case ("initializeReady"):
          if (this.initializeReady){
            doUpdate =true;
          }
          break;
        case 'hass':
          /* On hass update, check if there is a cover change */
          if (this.newConfig){
            // new
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
                  if (cfgEntity.entityId()) {
                    //debugger;
                    doUpdate = this.checkShutterState(cfgEntity,doUpdate);
                    doUpdate = this.checkSubEntityStates(cfgEntity,doUpdate);
                    if (doUpdate){
                      break outer; // break out of the labeled outer: loop
                    }
                  }
                }
              }
            }
          }else{
            // old
            this.shutterCfgs.forEach(cfg =>{
              if (cfg.entityId()) {
                // get previous state
                doUpdate = this.checkShutterState(cfg,doUpdate);
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
    //console.log(`Card shouldUpdate End,doUpdate: ${doUpdate}, title: ${this.cardCfg?.title()}`);
    return doUpdate;
  }
  // TODO: double code in EnhancedShutterCardNew and EnhancedShutterWindow, should be refactored to one function  (in cfg.js ?)
  checkShutterState(cfg,doUpdate)
  {
    const coverEntityId = cfg.entityId();
    const currentShutterEntity =cfg.getCoverEntity();
    //console.log(`checkShutterState form Card: this.react_ShutterPosition: ${this.react_ShutterPosition}, cfg.friendlyName(): ${cfg.friendlyName()}`);
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
  // TODO: double code in EnhancedShutterCardNew and EnhancedShutterWindow, should be refactored to one function  (in cfg.js ?)
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
    const action='test???';
    // this.config is the original config from the user, this.cardCfg is the processed config with defaults and ids.
    const cardBlock = new HtmlBlocks.htmlBlockCard(this,this.config,action);
    return cardBlock.show();  
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

        let shutterSeparateBlock= new HtmlBlocks.htmlBlockShutterSeparate(this,this.cardCfg);
        let sizeSeparate = shutterSeparateBlock.size();
        let cardTitle = new HtmlBlocks.htmlBlockCardTitle(this,this.cardCfg);
        let sizeTitle = cardTitle.size();


        if (this.newConfig){
          // newConfig
          //debugger;
          const card = this.cardCfg;
          let separate=false;
          for (const window of card.cfg.windows) {
            let cfg = window.cfg.covers[0].cfg.entities[0]; // TODO: too simple here ..I think ...
            let block = {
              cfg: cfg, // TODO: too simple here .....??
              //cfg: window,
              escImages: this.escImages};

            let windowBlock = new HtmlBlocks.htmlBlockWindow(block,cfg,C.UNKNOWN);
            //for (const cover of window.cfg.covers) {
            //  for (const entity of cover.cfg.entities) {
            //    debugger;
            //  }
            //}
            if (separate){
              if (this.cardCfg.stacked() == C.VERTICAL){
                sizeCard = windowBlock.gridAddVertical(sizeCard,sizeSeparate);
              }else{
                sizeCard = windowBlock.gridAddHorizontal(sizeCard,sizeSeparate);
              }
            }else{
              sizeCard = windowBlock.gridAddVertical(sizeCard,sizeTitle);
            }
            let size = windowBlock.size();
            if (this.cardCfg.stacked() == C.VERTICAL){
              sizeCard = windowBlock.gridAddVertical(sizeCard,size);
            }else{
              sizeCard = windowBlock.gridAddHorizontal(sizeCard,size);
            }
            separate=true;
          }
        }else{
          // oldConfig
          let separate=false;
          this.shutterCfgs.forEach(cfg =>{

            let block = {cfg: cfg,escImages: this.escImages};
            console_log(`${cfg.friendlyName()} HtmLblock for Size`);
            let windowBlock = new HtmlBlocks.htmlBlockWindow(block,cfg,C.UNKNOWN);

            if (separate){
              if (this.cardCfg.stacked() == C.VERTICAL){
                sizeCard = windowBlock.gridAddVertical(sizeCard,sizeSeparate);
              }else{
                sizeCard = windowBlock.gridAddHorizontal(sizeCard,sizeSeparate);
              }
            }else{
              sizeCard = windowBlock.gridAddVertical(sizeCard,sizeTitle);
            }

            let size = windowBlock.size();
            if (this.cardCfg.stacked() == C.VERTICAL){
              sizeCard = windowBlock.gridAddVertical(sizeCard,size);
            }else{
              sizeCard = windowBlock.gridAddHorizontal(sizeCard,size);
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
