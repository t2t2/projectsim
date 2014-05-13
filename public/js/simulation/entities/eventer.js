define(function (require) {
	// Generates random shenanigans that the player must react to
	var _ = require('lodash'),
	    Sim = require('sim'),
	    InputException = require('InputException');

	var eventer =  {
		name: 'Random Event',
		getNextTime: function () {
			// Generate when next randm event should happen
			var when = this.sim.random.events.normal(this.sim.config.randomEventInterval, this.sim.config.randomEventSigma);
			return this.sim.time() + when;
		},
		start: function () {
			this.setTimer(this.getNextTime()).done(this.happening);
		},

		currentEvent: null,
		happening: function () {
			// Choose a random event
			var max = this.sim.config.events.length;
			if(max == 0) return;

			var eventNr = Math.floor(this.sim.random.events.uniform(0, max));

			this.log('Random Event: '+eventNr)

			this.currentEvent = _.clone(this.sim.config.events[eventNr], true);

			throw new InputException('random-event', '', this.currentEvent);	
		},
		doChoice: function (choiceI, ui) {
			if(!this.currentEvent || !this.currentEvent.choices[choiceI]) {
				throw new Exception('Can\'t find the random event');
			}

			if(this.currentEvent.choices[choiceI].do) {
				this.currentEvent.choices[choiceI].do.apply(this, [this.sim, ui]);
			}
			// Queue up next random event
			this.start();
		}
	};

	return eventer;
});