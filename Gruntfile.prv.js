module.exports = function(grunt) {
	var config = require('./.cred.prv.json');
    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
				server: {
                    host: '192.168.8.1',
                    port: 21025,
                    http: true
                },
                email: config.email,
                password: config.password,
                branch: 'default',
				ptr: false
            },
            dist: {
                src: ['js/*.js']
            }
        }
    });
}
