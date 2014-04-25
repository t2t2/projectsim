define(function (require) {
	var _ = require('lodash');

	return {
		start: function () {
			this.waitEvent(this.sim.events.meeting).done(this.inMeeting);
			this.waitEvent(this.sim.events.work).done(this.getToWork);
		},


		workingOn: null,
		nextTask: function () {
			// Find next task that can be worked on
			var nextTask = this.shiftQueue(this.sim.sprintTasks);
			if(nextTask) {
				this.workingOn = nextTask;
				nextTask.assigned = this;
			}
		},
		clearTask: function () {
			// Clear current task
			if(this.workingOn) {
				this.workingOn.assigned = null;
				this.workingOn = null;
			}
		},


		inMeeting: function () {
			// Rewait for the event
			this.waitEvent(this.sim.events.meeting).done(this.inMeeting);
			// Find next task to work on
			if(!this.workingOn) {
				this.nextTask();
			}
			// Tell the rest of the team about it
			if(this.workingOn) {
				this.log('Working on '+this.workingOn.name);
			} else {
				this.log('Not working on anything');
			}
		},

		getToWork: function () {
			// Rewait for the event
			this.waitEvent(this.sim.events.work).done(this.getToWork);

			this.workOnIt();
		},
		timer: null,
		workOnIt: function () {
			if(!this.workingOn) return;
			// Calculate how much left to work on.
			var effortToDo = this.workingOn.effort - this.workingOn.doneEffort;
			var timeToDo = this.sim.hoursToDays(effortToDo / this.sim.config.workEffort)
			var timeLeftToday = Math.ceil(this.time()) - this.time();
			// How much to do today:
			var workTime = Math.min(timeToDo, timeLeftToday);

			this.timer = this.setTimer(workTime).done(this.deliverOnIt).setData(this.time());
		},
		deliverOnIt: function () {
			var since = this.callbackData;

			var workTime = this.time() - since;
			var workEffort = this.sim.daysToHours(workTime) * this.sim.config.workEffort;

			this.workingOn.workOn(workEffort);

			// If done get next task
			if(this.workingOn.completed) {
				this.log('Completed task '+this.workingOn.name);
				this.clearTask();
				this.nextTask();
			}

			// Check if there's time left to do more
			if(Math.ceil(this.time()) > this.time()) {
				this.workOnIt();
			}
		},
	};
});