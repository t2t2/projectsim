define(function (require) {
	var _ = require('lodash'),
	    Sim = require('sim'),
	    Random = require('random');

	function Simulation(config) {
		Sim.apply(this); // Run parent

		this.config = _.defaults(_.mapValues(config, parseFloat), Simulation.defaults);

		/* Creates simulation */
		// Random number generator
		this.random = new Random(this.config.seed);

		// Store for user stories
		this.productBacklog = new Sim.Queue("User Stories");
		this.completed = new Sim.Queue("Completed Stories");
		this.sprintBacklog = new Sim.Queue("Sprint Backlog");
		this.sprintTasks = new Sim.Queue("Sprint Tasks");

		// Events for syncronisation
		this.events = {
			meeting: new Sim.Event('Sprint Planning Meeting'),
			work: new Sim.Event('Work'),
		};

		// Add manager
		this.manager = this.addEntity(require('simulation/entities/manager'));

		// Add workers
		this.workers = [];
		_.times(this.config.workers, function (n) {
			var worker = this.addEntity(require('simulation/entities/worker'));
			worker.name = 'Worker '+n;
		}, this);
	}

	Simulation.defaults = {
		daysPerSprint: 10,
		duration: 400,
		effortPerSprint: 550,
		effortPerTask: 6,
		hoursInDay: 8,
		seed: Math.floor(Math.random() * 1000000),
		standUpMeetingLength: 15,
		stories: 100,
		tasksPerStory: 10,
		workers: 5,
		workEffort: 2,
	}

	/* Add bindings for Queue */
	Simulation.prototype.addEntity = function (proto) {
		proto = _.defaults(proto, {
			// Add queue functions so the time is updated properly
			pushQueue: function (queue, value) {
				return queue.push(value, this.sim.time());
			},
			unshiftQueue: function (queue, value) {
				return queue.unshift(value, this.sim.time());
			},
			shiftQueue: function (queue) {
				return queue.shift(this.sim.time());
			},
			popQueue: function (queue) {
				return queue.pop(this.sim.time());
			},
		});
		return Sim.prototype.addEntity.apply(this, [proto]);
	};

	// Utility functions for calculating mins/hours to days
	Simulation.prototype.daysToHours = function(days) {
		return days * this.config.hoursInDay;
	};
	Simulation.prototype.daysToMins = function(days) {
		return this.daysToHours(days) * 60;
	};
	Simulation.prototype.hoursToDays = function(hours) {
		return hours / this.config.hoursInDay;
	};
	Simulation.prototype.minsToDays = function(mins) {
		return this.hoursToDays(mins / 60);
	};

	Simulation.prototype.toNextDay = function() {
		return Math.ceil(this.time()) - this.time();
	};

	// Less intrusive logger that lets logger decide what to do with the formatting
/*	Simulation.prototype.log = function (message, entity) {
		if(!this.logger) return;

	}
*/
	/* Runs simulation */ 
	Simulation.prototype.run = function () {
		this.log('Running simulation with options: '+JSON.stringify(this.config));
		
		this.simulate(this.config.duration);
	}


	// Extend from Sim.JS
	Simulation.prototype = _.create(Sim.prototype, Simulation.prototype);

	return Simulation;
});