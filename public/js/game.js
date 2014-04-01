// simulator.js - Game simulator
require.config({
	paths: {
		// Easier aliases for vendor code
		'bootstrap': 'vendor/bootstrap',
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
		'bootstrap': ['jquery'],
	}
});

define(function (require) {
	var ui = require('game/ui');

	// Load the scenarios
	ui.scenarios = {
		'default': require('game/scenario/default'),
	};

	// Render the UI
	ui.init($('#container'));
});