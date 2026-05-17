export class xyPair{
  #coordX;
  #coordY;
  constructor(x=0,y=0){
    this.#coordX = x;
    this.#coordY = y;
  }
  x(){
    return this.#coordX;
  }
  y(){
    return this.#coordY;
  }
  switch(){
    const tmp= this.#coordX;
    this.#coordX = this.#coordY;
    this.#coordY = tmp;
  }
  size(){
    return this.x()*this.y();
  }
  rotate90(){
    const tmp= this.#coordX;
    this.#coordX = -this.#coordY;
    this.#coordY = tmp;
  }
  rotate180(){
    this.#coordX = -this.#coordX;
    this.#coordY = -this.#coordY;
  }
  rotate270(){
    const tmp= this.#coordX;
    this.#coordX = this.#coordY;
    this.#coordY = -tmp;
  }
  rotate360(){
  }
  fill(x,y){
    this.#coordX = x;
    this.#coordY = y;
  }
  fill2(xy){
    this.#coordX = xy.x();
    this.#coordY = xy.y();
  }
}