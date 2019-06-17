// import HeatmapJS from '../../node_modules/heatmap.js/build/heatmap'


class canvas {
    constructor() {
      this._type = 'singletonCanvas';
      this._ctx = document.querySelector("#canvas").getContext("2d");
      this._h = this._ctx.canvas.height;
      this._w = this._ctx.canvas.width;
    }
  
    setData(arr2d) {
        const SIZE = arr2d.length;
        const imgData = this._ctx.getImageData(0, 0, this._w, this._h)
        let data = imgData.data;
        data.fill(0)
        
        const tempArr  = new Array(SIZE*SIZE);
        for(let i = 0; i < SIZE; i++) {
            for(let j = 0; j < SIZE; j++) {
                tempArr[i*SIZE+j] = this.valueToRGBA(arr2d[i][j])
            }
        }

        const tempArrFlat = tempArr.flat();
        for(let i = 0; i < data.length; i++){
            data[i] = tempArrFlat[i];
        }

        console.log(`function call: canvas.setData()`)
        this._ctx.putImageData(imgData,0,0)
    }

    valueToRGBA(spaceValue){
        let val =  255 - Math.round(Math.log2(spaceValue))*8;
        const rgbaArr = [val,val,val,255];
        return rgbaArr;
    }

    getData(){
        return this._ctx.getImageData(0,0,this._w,this._h)
    }

    drawParticle(x,y){
        this._ctx.fillStyle = 'red';
        this._ctx.fillRect(x,y,1,1); 
    }
  
    static staticMethod() {
      return 'staticMethod';
    }
  
    get type() {
      return this._type;
    }
  
    set type(value) {
      this._type = value;
    }
}
  



export default new canvas()