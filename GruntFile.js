module.exports = function (grunt) {

	var libFiles = [
		"src/utils.js",
		"src/Class.js",
		"src/Singleton.js",
		"src/Interface.js",
		"src/Observable.js",
		"src/IIterator.js",
		"src/Iterator.js",
		"src/List.js",
		"src/ListOf.js",
		"src/Listenable.js",
		"src/Scheduler.js",
		"src/Sync.js"
	];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
    	
    	namespace: 'py',
    	
    	'jshint': {
    	    options: {
    	       smarttabs: true
    	    },
			all: libFiles
    	},
    	
    	'jasmine': {
    	    test: {
    	       src: ['src/namespace.js', libFiles],
    	       options: {
    	           specs: 'tests/spec/*.js'
    	       }   
    	    }
    	},
    	
    	'clean': {
    		dist: ['dist'],
    		doc: ['doc']
    	},
    	
    	'concat': {
    		web: {
    			src: ['src/nswrap/nsscriptdetect.js', libFiles, 'src/nswrap/nsscriptdetectend.js'],
    			dest: 'dist/patternity.js'
    		}
    	},
    	
    	'uglify': {
    		dist: {
    			files: {
    				'dist/patternity.min.js': ['dist/patternity.js']
    			}
    		},
    		options: {
    			report: 'gzip'
    		}
    	},
    	
    	'jsdoc' : {
	        dist : {
	            src: ['src/namespace.js', libFiles], 
	            options: {
	                destination: 'jsdoc'
	            }
	        }
	    }
    	
    });
    
    grunt.registerTask('compile',  ['jshint', 'jasmine:test', 'clean:dist', 'concat:web', 'uglify']);
    grunt.registerTask('default',['compile', 'clean:doc' , 'jsdoc']);
    grunt.registerTask('customNS', 'Create Lib with custom namespace', function(arg){
    
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-combine');
};
