var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMaintainer = require('role.maint');
var roleMiner = require('role.miner');
var roleMule = require('role.mule');
var rolePioneer = require('role.pioneer');
var roleHarvester = require('role.harvester');
var roleDefender = require('role.defender');
var roleScout = require('role.scout');
var roleClaimer = require('role.claimer');
var roleFounder = require('role.founder');

var rmgr = require('room.mgr');
var claim = require('room.claim');

module.exports.loop = function () {

	if( Memory.me == undefined ) { Memory.me = 'Kreten'; }

	var roomCreeps = {};
	//Run creeps AI
	for(var name in Game.creeps) {
		var creep = Game.creeps[name];
		if ( creep.spawning )
		{
			continue;
		}

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
		if(creep.memory.role == 'scout') {
			roleScout.run(creep);
		}
		if(creep.memory.role == 'claimer') {
			roleClaimer.run(creep);
		}
		if(creep.memory.role == 'founder') {
			roleFounder.run(creep);
		}
	}

	if ( Game.flags['Claim'] != undefined )
	{
		claim.claim();
	}
	
	//console.log( JSON.stringify( roomCreeps ) );

	//Run room management
	var myRooms = _.filter(Game.rooms,
		function(room) {
			return room.controller != undefined &&
				room.controller.owner != undefined &&
				room.controller.owner.username == Memory.me; } );
	for ( let room in myRooms )
	{
		//console.log( room );
		//console.log( myRooms[room] );
		rmgr.run( myRooms[room], roomCreeps[myRooms[room].name] );
	}
	
}
