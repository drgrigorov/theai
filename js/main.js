var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMaintainer = require('role.maint');
var roleMiner = require('role.miner');
var roleMule = require('role.mule');
var rolePioneer = require('role.pioneer');
var roleHarvester = require('role.harvester');
var roleDefender = require('role.defender');

var rmgr = require('room.mgr');

module.exports.loop = function () {

	var roomCreeps = {};
	//Run creeps AI
	for(var name in Game.creeps) {
		var creep = Game.creeps[name];
		if (roomCreeps[creep.room.name] == undefined) { roomCreeps[creep.room.name] = {} };
		roomCreeps[creep.room.name][ creep.name ] =  creep ;
		if(creep.memory.role == 'miner') {
			roleMiner.run(creep);
		}
		if(creep.memory.role == 'carrier') {
			roleMule.run(creep);
		}
		if(creep.memory.role == 'maintainer') {
			roleMaintainer.run(creep);
		}
		if(creep.memory.role == 'harvester') {
			roleHarvester.run(creep);
		}
		if(creep.memory.role == 'pioneer') {
			rolePioneer.run(creep);
		}
		if(creep.memory.role == 'upgrader') {
			roleUpgrader.run(creep);
		}
		if(creep.memory.role == 'defender') {
			roleDefender.run(creep);
		}
	}
	
	//console.log( JSON.stringify( roomCreeps ) );

	//Run room management
	for ( let room in Game.rooms )
	{
		rmgr.run( Game.rooms[room], roomCreeps[room] );
	}
	
}
