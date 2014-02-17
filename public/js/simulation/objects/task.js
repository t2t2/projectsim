define(function (require) {
	var _ = require('lodash');

	function Task (name, effort) {
		this.name = name;
		this.effort = effort;
		this.doneEffort = 0;
		this.story = null;
		this.assigned = null;
		this.completed = false;
	}

	Task.prototype.workOn = function(effort) {
		this.doneEffort += effort;
		if(this.doneEffort >= this.effort) {
			this.completed = true;
			this.story.doneTask(this);
		}
	};

	return Task;

});