/**
 * https://en.wikipedia.org/wiki/Rosenbrock_function 
 * f(x,y) = (a-x)^2 + b(y-x^2)^2
 * 
 * samples:
 * https://bl.ocks.org/EmilienDupont/f97a3902f4f3a98f350500a3a00371db 
 */


function rosenbrockValue(a,b,x,y){
    return Math.pow(a-x,2) + b*Math.pow(y-x*x,2)
}

function getRosenbrock2D(a,b, size) {
    const SPACE_SIZE = 100
    const arr = []
    // let spaceMax = 0;

    for(let x = 0; x < SPACE_SIZE; x++){
        arr[x] = new Float32Array(SPACE_SIZE)    
        for(let y = 0; y < SPACE_SIZE; y++){ 
            arr[x][y] = rosenbrockValue(a,b,x,y)
            // if(arr[x][y] > spaceMax){
            //     spaceMax = arr[x][y];
            // }
        }    
    }
    
    const spaceObject = {
        data: arr,
        dimensions: [ {min: 0, max: SPACE_SIZE}, {min: 0, max: SPACE_SIZE} ]
    }
    
    
    console.log(`function call: getRosenbrock2D(${spaceObject})`)
    return spaceObject;

}



export {getRosenbrock2D}