module.exports = function(grunt) {
	var config = require('./.cred.json');
    grunt.loadNpmTasks('grunt-screeps');
	var branch = grunt.option('branch') || config.branch;

    grunt.initConfig({
        screeps: {
            options: {
                email: config.email,
                password: config.password,
                branch: branch,
                ptr: config.ptr
            },
            dist: {
                src: ['js/*.js']
            }
        }
    });
}
