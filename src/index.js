const css = require('./style.scss');


// import {getRosenbrock2D} from './components/rosenbrockFunction.js';
import {getRosenbrock2D} from './components/rosenbrockFunction';
import canvas from './components/canvas';
import Manager from './components/pso';

console.log("Hello PSO!");

const rosenbrockSpace = getRosenbrock2D(10,100,100);
canvas.setData(rosenbrockSpace.data);
console.log(rosenbrockSpace.data);


const pso = new Manager(rosenbrockSpace,20)


console.log(pso)

let timesRun = 0;

let searchFlag = true;

while(searchFlag){

    timesRun++
    iteration();

    if(timesRun == 20){
        searchFlag = false;
        console.log(pso)

    }
}







// pso.particles.forEach( (particle) => {
//     console.log(particle.position);
// })

function iteration(){
 //   canvas.setData(rosenbrockSpace.data);
    pso.iterate()
    // pso.particles.forEach( (particle) => {
    //     canvas.drawParticle(particle.position[0],particle.position[1])
    // })
}

// window.pso = PSO;

// let numParticles = 20;
// let manager = PSO;
// window.manager = manager;