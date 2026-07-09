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
    console.log('New haEntity: Entity [', entityId, '] state:', this.#state, 'attributes:', this.#attributes);
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