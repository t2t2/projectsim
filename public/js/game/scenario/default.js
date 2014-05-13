define(function (require) {
	var UserStory = require('simulation/objects/userstory'),
	    Task = require('simulation/objects/task');

	return {
		name: 'Default',
		description: 'The default scenario.',
		config: {
			// Days per sprint
			daysPerSprint: 10,

			// Maximum days to run the simulation
			duration: 400,
			
			// Target effort to do per sprint
			//effortPerSprint: 300,
			
			// How much effort each task should take.
			effortPerTask: 5,
			effortSigma: 1.2,
			
			// The amount of hours in a workday
			hoursInDay: 8,
			
			// How often random events happen, in-game time (so most likely days)
			randomEventInterval: 9,
			randomEventSigma: 1.3,
			
			// Random Number Generator seed
			seed: 123456,
			
			// Length of stand-up meeting (minutes)
			standUpMeetingLength: 15,
			
			// User Stories to generate
			stories: 50,
			
			// Tasks to generate per story.
			tasksPerStory: 10,
			tasksPerStorySigma: 2,
			
			// Amount of workers allocated to player
			workers: 5,
			
			// Amount of effort each worker puts by default.
			workEffort: 1,
			workEffortSigma: 0.1,

			// Random Events
			events: [
				{	text: 'One of your workers has fallen ill.',
					choices: [
						{
							text: 'Find a temporary replacement',
							do: function(sim) {
								sim.log('One of the workers has fallen ill. You have decided to find a replacement.');
								var modifier = 0.5;

								var worker = sim.workers[Math.floor(sim.random.events.uniform(0, sim.workers.length))];
								worker.timer.deliver(); // Save current work
								worker.timer.cancel(); // Cancel
								worker.effort *= modifier;
								worker.workOnIt(); // Reschedule with new effort value

								var request = worker.setTimer(sim.random.events.uniform(1, 4)).done(function () {
									this.log('Worker has returned!')

									this.timer.deliver(); // Save current work
									this.timer.cancel(); // Cancel
									this.effort /= modifier;
									this.workOnIt(); // Reschedule with new effort value
								});
							}
						},
						{
							text: 'Oh well (do nothing)',
							do: function(sim) {
								sim.log('One of the workers has fallen ill. You have decided to do nothing.');

								var worker = sim.workers[Math.floor(sim.random.events.uniform(0, sim.workers.length))];
								worker.timer.deliver(); // Save current work
								worker.timer.cancel(); // Cancel
								worker.giveItBack();
								worker.active = false;

								var request = worker.setTimer(sim.random.events.uniform(1, 4)).done(function () {
									this.log('Worker has returned!')

									this.nextTask();
									this.workOnIt(); // Back to work
								});
							}
						},
					]
				},

				{
					text: 'An user story you aren\'t working on yet has been decided to be no longer relevant.',
					choices: [
						{
							text: 'Alright',
							do: function (sim) {
								if(sim.productBacklog.size() > 0) {
									var story = sim.productBacklog.data[Math.floor(sim.random.events.uniform(0, sim.productBacklog.size()))];

									sim.log('User Story "'+story.name+'" has deemed to be no longer relevant and has been removed');
									sim.productBacklog.take(sim.time(), story);

									if(story.$el) {
										story.$el.remove();
									}
								}
							},
						},
					]
				},

				{
					text: 'New requirements have been introduced due to changes in environment. They\'ve been added as an user story',
					choices: [
						{
							text: 'Oh well...',
							do: function (sim, ui) {
								var story = new UserStory('Extra user story');
								// Also generate tasks
								var taskCount = Math.round(sim.random.tasks.normal(sim.config.tasksPerStory, sim.config.tasksPerStorySigma));

								_.times(taskCount, function (n) {
									var effort = Math.round(sim.random.effort.normal(sim.config.effortPerTask, sim.config.effortSigma));

									var task = new Task(story.name+' - Task '+(n + 1), effort);
									story.addTask(task);
								}, this);

								sim.userStories.push(story);
								// Also add to product backlog
								sim.eventer.pushQueue(sim.productBacklog, story);

								ui.updateStoryEl(story);
							}
						}
					]
				}
			], /* events */
		},
	};
});