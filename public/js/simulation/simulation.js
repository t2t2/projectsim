define(function (require) {
	var _ = require('lodash'),
	    Sim = require('sim'),
	    Random = require('random');

	function Simulation(config) {
		Sim.apply(this); // Run parent

		this.config = _.defaults(config, Simulation.defaults);

		/* Creates simulation */
		// Random number generators
		this.random = {
			effort: new Random(this.config.seed),
			events: new Random(this.config.seed),
			tasks: new Random(this.config.seed),
		};

		// Store for user stories
		this.userStories = [];
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
			worker.name = 'Worker '+(n+1);
			this.workers.push(worker);
		}, this);

		// Add random events manager
		this.eventer = this.addEntity(require('simulation/entities/eventer'));

	}

	Simulation.defaults = {
		daysPerSprint: 10,
		duration: 400,
		effortPerTask: 5,
		effortSigma: 1.2,
		hoursInDay: 8,
		randomEventInterval: 7,
		randomEventSigma: 1.3,
		seed: 123456,
		standUpMeetingLength: 15,
		stories: 100,
		tasksPerStory: 10,
		tasksPerStorySigma: 2,
		workers: 5,
		workEffort: 1,
	}

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

	Simulation.prototype.log = function(message, entity) {
		if (!this.logger) return;

		var day = Math.floor(this.simTime);
		var time = this.simTime - day;

		var hours = Math.floor(this.daysToHours(time));
		var mins = Math.floor(this.daysToMins(time - this.hoursToDays(hours)));

		var timeText = "Day "+day+" "+hours+"h"+mins+"m";
		var entityMsg = "";
		if (entity !== undefined) {
			if (entity.name) {
				entityMsg = " [" + entity.name + "]";
			} else {
				entityMsg = " [" + entity.id + "] ";
			}
		}


		this.logger(timeText
				+ entityMsg
				+ "   " 
				+ message);
	};

	/* Runs simulation */ 
	Simulation.prototype.run = function () {
		this.simulate(this.config.duration);
	}

	// Extend from Sim.JS
	Simulation.prototype = _.create(Sim.prototype, Simulation.prototype);

	return Simulation;
});