module.exports = function(grunt) {
	grunt.initConfig({

		clean: {
			// Fresh build
			build: ["build"]
		},

		connect: {
			// Dev server
			serve: {
				options: {
					base: 'public',
					livereload: true,
					open: true,
				},
			},
		},

		copy: {
			build: {
				src: ['public/*.html', 'public/css/**', 'public/js/vendor/require.js'],
				dest: 'build/',
			},
		},

		requirejs: {
			// Compile js files into a single file
			runner: {
				options: {
					baseUrl: 'public/js',
					mainConfigFile: 'public/js/runner.js',
					name: 'runner',
					out: 'build/public/js/runner.js',
				},
			},
			game: {
				options: {
					baseUrl: 'public/js',
					mainConfigFile: 'public/js/game.js',
					name: 'game',
					out: 'build/public/js/game.js',
				},
			},
		},

		watch: {
			// Livereload for dev server
			serve: {
				files: ['public/**'],
				options: {
					livereload: true,
				},
			},
		},
	});

	// Plugins
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');


	// Aliases
	grunt.registerTask('build', ['clean:build', 'copy:build', 'requirejs:runner', 'requirejs:game']);
	
	grunt.registerTask('default', ['build']);
	grunt.registerTask('serve', ['connect:serve', 'watch:serve']);
};