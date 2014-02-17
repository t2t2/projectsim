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

		replace: {
			// Replace require.js tag with compiled
			build: {
				src: ['public/*.html'],
				dest: 'build/public/',
/*				replacements: [{
					from: /<script data-main=\"(.*)\" src=\"js\/vendor\/require.js\"><\/script>/,
					to: '<script src="$1"></script>',
				}]
*/			},
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
	grunt.loadNpmTasks('grunt-text-replace');


	// Aliases
	grunt.registerTask('build', ['clean:build', 'copy:build', 'requirejs:runner']);
	
	grunt.registerTask('default', ['build']);
	grunt.registerTask('serve', ['connect:serve', 'watch:serve']);
};