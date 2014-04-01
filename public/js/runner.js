// simulator.js - For testing the simulation model.
require.config({
	paths: {
		// Easier aliases for vendor code
		'jquery': 'vendor/jquery-2.1.0',
		'jquery.serializeJSON': 'vendor/jquery.serializeJSON',
		'lodash': 'vendor/lodash',
		'mustache': 'vendor/mustache',
		'random': 'vendor/random-0.26-debug',
		'vendor/sim': 'vendor/sim-0.26-debug',
		'text': 'vendor/text',
	},
	shim: {
		'random': {
			exports: 'Random',
		},
		'vendor/sim': {
			exports: 'Sim',
		},
		'jquery.serializeJSON': ['jquery'],
	}
});

define(function (require) {
	var $ = require('jquery'),
	    Mustache = require('mustache'),
	    Simulation = require('simulation/simulation');

	// jquery plugins
	require('jquery.serializeJSON');

	// Set up layout
	$('#container').html(Mustache.render(
		require('text!../templates/simulator/layout.html'),
		{
			defaults: Simulation.defaults,
		}
	));

	// Run simulation on submit
	$('#simulation-config').submit(function () {
		// Reset current simulation
		$('#output').empty();

		// Create a new simulation and run it
		var simulation = new Simulation($('#simulation-config').serializeJSON());

		simulation.setLogger(function (text) {
			$('#output').append($('<li>').text(text));
		});

		var start = _.now();
		simulation.run();
		var end = _.now();
		simulation.log('Done in '+(end - start)/1000+'s');

		if(console && _.isFunction(console.log)) {
			simulation.log('Logging simulation into browser console...')
			console.log(simulation);
		}

		return false;
	});

});