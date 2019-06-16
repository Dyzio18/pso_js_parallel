const css = require('./style.scss');


// import {getRosenbrock2D} from './components/rosenbrockFunction.js';
import {getRosenbrock2D} from './components/rosenbrockFunction';
import canvas from './components/canvas';

console.log("Hello PSO!");

const rosenbrockSpace = getRosenbrock2D(1,100);
canvas.setData(rosenbrockSpace);



