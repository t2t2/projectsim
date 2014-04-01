define(function (require) {
	var _ = require('lodash');

	function UserStory (name) {
		this.name = name;
		this.tasks = [];
		this.estimatedEffort = 0;
		this.completed = false;
		this.chosen = false;
	}

	UserStory.prototype.addTask = function(task) {
		task.story = this;

		this.tasks.push(task);
		this.estimatedEffort += task.effort;
	};

	UserStory.prototype.doneTask = function(task) {
		// If all tasks are done mark story as done
		var allDone = _.reduce(this.tasks, function (state, task) {
			return state && task.completed;
		}, true, this);
		
		if(allDone) {
			this.completed = true;
		}
	};

	return UserStory;
});