define(function (require) {
	var $ = require('jquery'),
	    _ = require('lodash'),
	    Mustache = require('mustache'),
	    Simulation = require('simulation/simulation'),
	    InputException = require('InputException');

	// jquery plugins
	require('jquery.serializeJSON');
	require('bootstrap');

	var ui = {
		scenarios: [],
		scenario: null,
		sim: null,

		planningMeeting: false,

		init: function ($body) {
			var layoutTpl = require('text!../../templates/game/layout.html');

			// Render layout
			$body.replaceWith(Mustache.render(layoutTpl, {
				scenarios: _.map(ui.scenarios, function (value, key) {
					return _.merge({key: key}, value);
				}),
			}));

			// Show intro modal
			$('#modal-intro').modal({
				// Don't allow manually closing
				backdrop: 'static',
				keyboard: false,
			});

			// Bind scenario selection events
			$('#scenario-list [data-scenario]').click(function () {
				$(this).addClass('list-group-item-success');
				$('#modal-intro').modal('hide');

				ui.chooseScenario(ui.scenarios[$(this).data('scenario')]);
			});
		},
		log: function (text, classes) {
			var $logContainer = $('#log-panel');
			$logContainer.append($('<li>').text(text).addClass('list-group-item').addClass(classes));
			$logContainer.scrollTop($logContainer.prop('scrollHeight'));
		},
		error: function (exception) {
			this.log(exception, 'list-group-item-danger');
		},
		run: function () {
			// Run simulation while handling the UI functions.
			try {
				ui.sim.run();
			} catch(e) {
				if(e instanceof InputException) {
					// All good. Handle it properly.
					if(e.type == 'sprint-planning') {
						ui.onPlanningMeeting();
					} else if(e.type == 'standup-meeting') {
						ui.onStandupMeeting();
					} else if(e.type == 'sprint-review') {
						ui.onSprintReview(e.data);
					}
				} else {
					// Wherps :(
					ui.error(e);
				}
			}
		},

		chooseScenario: function (scenario) {
			ui.scenario = scenario;

			// Initialise the simulation
			ui.sim = new Simulation(ui.scenario.config);
			ui.sim.setLogger(ui.log);

			// Run long enough to have the stories seeded.
			try {
				ui.sim.run();
			} catch(e) {
				if(e instanceof InputException) {
					// All good.
				} else {
					// Wherps :(
					ui.error(e);
				}
			}

			// render interface
			var interfaceTpl = require('text!../../templates/game/interface.html');
			var container = $('#container').html(Mustache.render(interfaceTpl));

			// Render user stories
			var storyContainer = container.find('#user-stories-list');
			var storyTpl = require('text!../../templates/game/story.html');
			_.each(ui.sim.userStories, function (story) {
				// Create a dummy element as a placeholder
				var storyEl = $('<div>');
				storyContainer.append(storyEl);
				story.$el = storyEl;

				// Render real thing
				ui.updateStoryEl(story);
			});

			// Render workers
			var workerContainer = container.find('#workers-list');
			var workerTpl = require('text!../../templates/game/worker.html');
			_.each(ui.sim.workers, function (worker) {
				var workerEl = $(Mustache.render(workerTpl, worker)).data('worker', worker);
				workerContainer.append(workerEl);
				worker.$el = workerEl;
			});

			// Bind events

			// Go on as normal
			ui.onPlanningMeeting();
		},

		updateStoryEl: function (story) {
			var storyTpl = require('text!../../templates/game/story.html');

			var className = 'panel-default';
			if(story.completed) {
				className = 'panel-success';
			} else {
				if(story.chosen) {
					className = 'panel-warning';
				}
			}

			var storyEl = $(Mustache.render(storyTpl, {
				story: story,
				planningMeeting: ui.planningMeeting,
				className: className,
				tasks: _.map(story.tasks, function (task) {
					return {
						task: task,
						percentage: task.effort / story.estimatedEffort * 100,
					};
				}),
			})).data('story', story);
			story.$el.replaceWith(storyEl);
			story.$el = storyEl;

			// Rebind onChange event if in planning meeting

			if(ui.planningMeeting) {
				story.$el.find('.do-in-sprint').on('change', {story: story}, ui.changeStoryIncludance)
			}
		},

		changeStoryIncludance: function (event) {
			var story = event.data.story;
			var chosen = story.chosen = this.checked;
			ui.updateStoryEl(story);
			ui.updateSprintStatus();
		},
		updateSprintStatus: function () {
			// Recalculate current estimated man-hour cost.
			var chosen = _.filter(ui.sim.userStories, function (story) { return story.chosen && !story.completed; });
			$('#current-sprint-effort').text(_.reduce(chosen, function (sum, story) {
				return sum + story.estimatedEffort;
			}, 0));
		},
		updateWorkersStatus: function(worker) {
			if(!worker) {
				_.forEach(ui.sim.workers, ui.updateWorkersStatus);
				return;
			}

			var status;
			// If in planning meeting
			if(ui.sim.manager.day == 0) {
				status = 'In Planning Meeting';
			} else if(ui.sim.manager.day > ui.sim.config.daysPerSprint) { // sprint review
				status = 'In Sprint Review Meeting'
			} else {
				if(worker.workingOn) {
					status = 'Working on '+worker.workingOn.name;
				} else {
					status = 'Not working on anything'
				}
			}


			worker.$el.find('.status').text(status);
		},

		onPlanningMeeting: function () {
			this.log('Sprint '+ui.sim.manager.sprint+' - Planning Meeting');
			ui.planningMeeting = true;

			// Update status panel
			var statusTpl = require('text!../../templates/game/status/planning.html');
			$('#status-panel').html(Mustache.render(statusTpl, {
				sprintNr: ui.sim.manager.sprint,
				sprintLen: ui.sim.config.daysPerSprint,
				estWorkerOutput: ui.sim.config.daysPerSprint * ui.sim.workers.length * ui.sim.config.hoursInDay,
			}));

			// bind events: change user story state
			_.each(ui.sim.userStories, function (story) {
				ui.updateStoryEl(story);
			});

			// bind events: start sprint
			$('#done-planning-button').click(function () {
				// Disable the button
				$(this).attr('disabled', 'disabled');
				ui.planningMeeting = false;

				// Disable changing user story states.
				_.each(ui.sim.userStories, function (story) {
					ui.updateStoryEl(story);
				});

				// Start sprint
				ui.startSprint();
			});

			ui.updateSprintStatus();
			ui.updateWorkersStatus();
		},
		startSprint: function () {
			// Add stories to sprint backlog
			var chosen = _.filter(ui.sim.userStories, function (story) { return story.chosen && !story.completed; });

			_.forEach(chosen, function (story) {
				ui.sim.manager.addToBacklog(story);
			});

			// Run simulation in a sec.
			setTimeout(ui.run, 1000);
		},

		// Update to match standup meetings
		onStandupMeeting: function () {
			// Update status panel
			var statusTpl = require('text!../../templates/game/status/standup.html');
			$('#status-panel').html(Mustache.render(statusTpl, {
				sprintNr: ui.sim.manager.sprint,
				day: ui.sim.manager.day,
			}));
			// Update worker's statuses
			ui.updateWorkersStatus();
			// And stories in backlog (highly unlikely others were changeds)
			_.each(ui.sim.sprintBacklog.data, function (story) {
				ui.updateStoryEl(story);
			});

			// Run simulation in a sec.
			setTimeout(ui.run, 1000);
		},

		// Show Sprint Review
		onSprintReview: function(data) {
			// Hide user stories
			$('#user-stories-panel').hide();

			// Add sprint review panel
			var reviewTpl = require('text!../../templates/game/review.html');

			var $el = $(Mustache.render(reviewTpl, {
				sprintNr: ui.sim.manager.sprint,
				sprintData: data
			}));
			$('#user-stories-panel').after($el);

			// Next sprint button
			$('#next-sprint-button').click(function () {
				$el.remove();
				$('#user-stories-panel').show();
				ui.run();
			});

			ui.updateWorkersStatus();
		},
	};
	return ui;
});