/** pso.js
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
 * https://medium.com/techtrument/multithreading-javascript-46156179cf9a 
 */

 

	// Returns a random number in [min, max)


	// Particle class
	var Particle = function (manager, id) 
	{
		// Unique ID
		this.id = id;
		
		// Initialize the particle with random position components bounded by the given dimensions
		this.position = [];
		this.fitness = 0;
		
		this.bestParticleId = 0;
		this.bestPosition = [];
		this.bestFitness = 0;

		for (var i = 0; i < manager.dimensions.length; i++) {
			this.position.push( Math.round(this.randomPosition(manager.dimensions[i].max)));
			this.bestPosition.push( Math.round(this.position[i] ));
		}
        
		this.computeFitness(manager);
        // console.log(this.position);
		
		// Initialize the velocity components
		this.velocity = [];
		for (var i = 0; i < manager.dimensions.length; i++) {
			var d = manager.dimensions[i].max;			
			this.velocity.push( this.randomPosition(d) );
        }
        
    };
    
    Particle.prototype.randomPosition = (max) =>  Math.floor(Math.random() * max);

	
	Particle.prototype.computeFitness = function (manager) {
        
        let x = this.position[0] > 0 ? Math.round(this.position[0]) : 0;
        let y = this.position[1] > 0 ? Math.round(this.position[1]) : 0;
       
        this.fitness = manager.fitnessFunction[x,y];

		if (this.fitness < this.bestFitness) {
			for (var i = 0; i < this.position.length; i++) {
				this.bestPosition[i] = this.position[i];
			}
			this.bestFitness = this.fitness;
		}
	}
	
	Particle.prototype.iterate = function (manager) {
		// Get the social best
		var socialBestPosition = manager.getSocialBest(this);
		
		// Update the position
		for (var i = 0; i < manager.dimensions.length; i++) 
		{	
			var vMomentum = manager.inertiaWeight * this.velocity[i];			
			
			var d1 = this.bestPosition[i] - this.position[i];
			var vCognitive = manager.cognitiveWeight * this.randomPosition(100) * d1;

			var d2 = socialBestPosition[i] - this.position[i];
			var vSocial = manager.socialWeight * this.randomPosition(100) * d2;

			this.velocity[i] = Math.round(vMomentum + vCognitive + vSocial);
            this.position[i] = this.position[i] + this.velocity[i];
            
            
		}
        this.position = manager.particleRangeExtreme(this.position[0], this.position[1]);
      // console.log(this.position)
	}


// Manager class
// Maintains a list of particles
class Manager {
    constructor(fitnessFunctionInput, numParticles) {
        // this.dimensions = [ {min: -1, max: 1}, {min: -1, max: 1} ];
        this.dimensions = fitnessFunctionInput.dimensions;
        this.fitnessFunction = fitnessFunctionInput.data;
        
        // Number of iterations that have been computed
        this.iterationNum = 0;
        
        // If linear scaling is enabled, then 'inertiaWeight' will change
        this.enableInertiaWeightScaling = true;
        // y = mx + b
        // m = (y_end - y_start) / (range-0) + y_start
        this.setInertiaScaling(true, 0.7, 0.7, 1);
        
        this.inertiaWeightStart = 0.7;
        this.inertiaWeightEnd = 0.7;
        this.inertiaWeightIterationRange = 1;
        console.assert(this.inertiaWeightIterationRange > 0);
        this.inertiaWeightSlope = (this.inertiaWeightEnd - this.inertiaWeightStart) / this.inertiaWeightIterationRange;
        
        this.inertiaWeight = this.inertiaWeightStart;
        this.cognitiveWeight = 0.01;
        this.socialWeight = 0.1;


        this.extreme = null;

        // List of particles taking part in the estimation
        this.particles = [];
        for (var i = 0; i < numParticles; i++) {
            this.addParticle();
        }
        
        this.updateGlobalBest();
        
        // By default uses global best
        // This number must be even-valued
        this.numNeighbors = this.particles.length;
        
        this.topology = "ring";

    }
    

	setInertiaScaling = function (enable, start, finish, range) {
		this.enableInertiaWeightScaling = true;
		this.inertiaWeightStart = start;
		this.inertiaWeightEnd = finish;
		this.inertiaWeightIterationRange = range;
		this.inertiaWEight = this.inertiaWeightStart;
		this.inertiaWeightSlope = (this.inertiaWeightEnd - this.inertiaWeightStart) / (this.inertiaWeightIterationRange);
	}
	
	addParticle = function() {
		var uniqueId = this.particles.length;
		var p = new Particle(this, uniqueId);
		this.particles.push(p);
	}
	

	// Adds a particle the set of particles taking
	// // part in the estimation
	// addParticle = function() {
	// 	var uniqueId = this.particles.length;
	// 	var p = new Particle(this, uniqueId);
	// 	this.particles.push(p);
	// }
	
	// This is the main function that is called
	// to simulate an iteration of the simulation
	iterate = function() {
		this.numCollisions = 0;
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].iterate(this);
			this.particles[i].computeFitness(this);
		}
		
		// This should only be for the fully connected topology
		// this.updateSocialBest()
		this.updateGlobalBest();
		
		this.updateInertiaWeight();
		//console.log("inertiaWeight = " + this.inertiaWeight);
        
        

		this.iterationNum++;
	}
	
	updateGlobalBest = function() {
		// Find the best
		// Assign initial values with the first particle
		this.bestParticleId = 0;
		this.bestPosition = this.particles[0].bestPosition;
		this.bestFitness = this.particles[0].bestFitness;
		for (var i = 1; i < this.particles.length; i++) {
			if (this.particles[i].bestFitness < this.bestFitness) {
				this.bestParticleId = i;
				this.bestFitness = this.particles[i].bestFitness;
				this.bestPosition = this.particles[i].bestPosition;
			}
		}
    }
    
    particleRangeExtreme = function(xVal,yVal){

        let minX = 100;
        let maxX = 0;
        let minY = 100;
        let maxY = 0;

        for(let i = 0; i < this.particles.length; i++){
            let elem = this.particles[i];
             
            if(minX < elem.position[0]) { 
                minX = elem.position[0]
             };
            if(maxX > elem.position[0]) { 
                maxX = elem.position[0] 
            };
            if(minY < elem.position[1]) { 
                minY = elem.position[1]
             };
            if(maxY > elem.position[1]) { 
                maxY = elem.position[1]
             };
        }

        // function normalize(val, max=100, min=0) { return ((val - min) / (max - min))*255; }

        let xCoord = Math.round(((xVal - minX) / (maxX - minX))* this.dimensions[0].max)
        let yCoord = Math.round(((yVal - minY) / (maxY - minY))* this.dimensions[0].max)

        if(xCoord < 0){
            xCoord = 0
        }
        if(yCoord < 0){
            yCoord = 0
        }


        let coord = [xCoord,yCoord]
        return coord;
        
    }

	getSocialBest = function(particle) {
		switch (this.topology) {
			case "ring":
				return this.getSocialBest_Ring(particle);
				break;
			case "fully connected":
				return this.getSocialBest_FullyConnected(particle);
				break;
			default:
				console.assert("Unknown topology");
		}
	}
	
	// Ring topology
	getSocialBest_Ring = function(particle) 
	{
		// Returns a valid index into an array.
		// Wraps around values outside the valid range.
		// e.g. -1 is mapped to the array length - 1
		function fix(id, arrayLength) {
			if (id < 0) {
				// id is negative, so add it instead of subtracting
				return (arrayLength+id);
			}
			if (id >= arrayLength) {
				return (id - arrayLength);
			}
			return id;
		}
		
		// Number of neighbors
		var k = this.numNeighbors;
		console.assert(k%2 == 0); // must be even
		var kh = k / 2; // half of the neighbors per left/right side
		// console.assert(this.particles.length >= k+1);
		
		// Create a list of particle ids for the current particles neighbors
		// (wrap around the index if too low or too high)
		var neighborIds = [];
		for (var i = 0; i < k+1; i++) {
			var uid = particle.id - kh + i;
			var fid = fix (uid, this.particles.length);
			neighborIds.push ( fid );
		}
				
		// find the best fitness among the neighbors
		var lbFitness = this.particles[ neighborIds[0] ].bestFitness;
		var lbId = 0;
		for (var i = 1; i < neighborIds.length; i++) {
			if (this.particles[ neighborIds[i] ].bestFitness < lbFitness) {
				lbId = neighborIds[i];

				lbFitness = this.particles[ lbId ].bestFitness;
			}
		}
		
		// return the local best position
		return this.particles[lbId].bestPosition;
	}
	
	// Star (Global best)
	getSocialBest_FullyConnected = function(particle) {
		return this.bestPosition;
	}
	
	collisionCallback = function () {
		this.numCollisions++;
	}
	
	// Compute inertia. This is based on equation 4.1 from:
    // http://www.hindawi.com/journals/ddns/2010/462145/
	updateInertiaWeight = function () {
		if (this.enableInertiaWeightScaling == false) {
			return;
		}
		
		if (this.iterationNum > this.inertiaWeightIterationRange) {
			this.inertiaWeight = this.inertiaWeightEnd;
			return;
		}
        
        this.inertiaWeight = this.inertiaWeightSlope * (this.iterationNum) + this.inertiaWeightStart;
	}
	
};


// const PSO = Manager();

export default Manager;