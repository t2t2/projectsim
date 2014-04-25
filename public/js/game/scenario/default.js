define(function (require) {
	return {
		name: 'Default',
		description: 'The default scenario.',
		config: {
			// Days per sprint
			daysPerSprint: 10,

			// Maximum days to run the iteration
			duration: 400,
			
			// Target effort to do per sprint
			//effortPerSprint: 300,
			
			// How much effort each task should take.
			effortPerTask: 5,
			effortSigma: 1.2,
			
			// The amount of hours in a workday
			hoursInDay: 8,
			
			// How often random events happen, in-game time (so most likely days)
			randomEventInterval: 7,
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

			// Random Events
			events: [
				{	text: "Random Event 1",
					choices: [
						{
							text: "This choice currently does nothing",
							do: function(sim) {
								sim.log('You\'ve chosen the first thing');
							}
						},
						{
							text: "This choice also currently does nothing",
							do: function(sim) {
								sim.log('You\'ve chosen the second thing');
							}
						},
					]
				},
			],
		},
	};
});