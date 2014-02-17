define(function (require) {
	// Keeps track of project phases
	var _ = require('lodash'),
	    Sim = require('sim'),
	    UserStory = require('simulation/objects/userstory'),
	    Task = require('simulation/objects/task');

	return {
		name: 'Manager',
		start: function () {
			this.setTimer(0).done(this.generateUserStories);
			this.setTimer(1).done(this.nextSprint);
		},
		sprint: 0,
		day: 0,

		generateUserStories: function () {
			this.log('Generating '+this.sim.config.stories+' user stories');

			// Generate config.stories user stories
			_.times(this.sim.config.stories, function (n) {
				var story = new UserStory('Story '+n);
				// Also generate tasks
				_.times(this.sim.config.tasksPerStory, function (n) {
					var task = new Task('Task '+n, this.sim.config.effortPerTask);
					story.addTask(task);
				}, this);

				this.pushQueue(this.sim.productBacklog, story);
			}, this);
		},

		nextSprint: function () {
			this.sprint++;
			this.day = 0;
			this.log('Sprint '+this.sprint+' - Planning Meeting');
			// Choose stories to add to sprint backlog
			var totalEffort = 0;
			while(!this.sim.productBacklog.empty()) {
				var nextStory = this.sim.productBacklog.top();
				if(totalEffort + nextStory.estimatedEffort > this.sim.config.effortPerSprint) {
					break; // Bust our limit
				}
				nextStory = this.shiftQueue(this.sim.productBacklog);

				this.log('Adding '+nextStory.name+' to sprint backlog');
				this.pushQueue(this.sim.sprintBacklog, nextStory);

				// And add it's incomplete tasks to sprint tasks
				_(nextStory.tasks).filter({completed: false}).forEach(function (task) {
					this.pushQueue(this.sim.sprintTasks, task);
				}, this);

				totalEffort += nextStory.estimatedEffort;
			}

			this.setTimer(1 + this.sim.minsToDays(1)).done(this.nextDay);
		},

		nextDay: function () {
			// Note: This is fired 1 min into the day so the workers have had chance to commit their work
			this.day++;
			if(this.day <= this.sim.config.daysPerSprint) {
				this.standUpMeeting();
			} else {
				// End of iteration
				this.sprintReview();
			}
		},

		standUpMeeting: function () {
			this.log('Sprint '+this.sprint+' - Day '+this.day+' - Stand-Up Meeting');

			// Ask team to choose next tasks / report what they're working on.
			this.sim.events.meeting.fire();

			// standUpMeetingLength mins later...
			this.setTimer(this.sim.minsToDays(this.sim.config.standUpMeetingLength - 1))
			    .done(this.getToWork);
		},

		sprintReview: function () {
			this.log('Sprint '+this.sprint+' - Sprint Review');
			// Generate some stats and group stories by complete status
			var totalStories = this.sim.sprintBacklog.size();
			var storiesByStatus = _.groupBy(this.sim.sprintBacklog.data, 'completed');
			
			this.log('Total User Stories: '+totalStories);
			this.log('User Stories completed: '+_.size(storiesByStatus[true]));
			this.log('User Stories incomplete: '+_.size(storiesByStatus[false]));

			while(!this.sim.sprintBacklog.empty()) {
				var story = this.shiftQueue(this.sim.sprintBacklog);
				if(story.completed) {
					// Push complete stories into complete list
					this.pushQueue(this.sim.completed, story);
				} else {
					// Push incomplete stories back into product backlog, at the front.
					this.unshiftQueue(this.sim.productBacklog, story);
				}
			}

			// Check if the product backlog is empty
			if(!this.sim.productBacklog.empty()) {
				// Tomorrow: planning meeting for next sprint
				this.setTimer(this.sim.toNextDay()).done(this.nextSprint);
			}

		},

		getToWork: function () {
			// Tell them to get to work
			this.sim.events.work.fire();
			// Calculate time to next day (don't forget the +1 minute)
			this.setTimer(this.sim.toNextDay() + this.sim.minsToDays(1)).done(this.nextDay);
		},

	}

});