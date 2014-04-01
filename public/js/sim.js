define(function (require) {
	// Extends sim with extra hooks
	var Sim = require('vendor/sim');

	/* Add bindings for Queue */
	var oldAddEntity = Sim.prototype.addEntity;
	Sim.prototype.addEntity = function (proto) {
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
			takeFromQueue: function (queue, value) {
				return queue.take(this.sim.time(), value);
			},
		});
		return oldAddEntity.apply(this, [proto]);
	};

	/* Add taking arbitary queue items. Of course this makes it no longer a queue. */
	Sim.Queue.prototype.take = function (timestamp, value) {
		var index = this.data.indexOf(value);

		if(index > -1) {
			var value = this.data.splice(index, 1)[0];
			var enqueuedAt = this.timestamp.splice(index, 1)[0];

			this.stats.leave(enqueuedAt, timestamp);
			return value;	
		} else {
			return null;
		}
	};

	return Sim;
});