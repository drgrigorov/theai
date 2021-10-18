var roleMiner = require('role.miner');
var rolePeon = require('role.peon');

require( 'room.prot' );
require( 'creep.prot' );
const Task = require( 'task' );

var rmgr = require('room.mgr');
var claim = require('room.claim');
var Reval = require('room.eval');

module.exports.loop = function () {

	if( Memory.me == undefined ) { Memory.me = 'Kreten'; }
	if ( Memory.reval == undefined ) { Memory.reval = { "enabled": false, "drawUpg": false, "drawSrc": false, "drawCost": false }; }

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
		if(creep.memory.role == 'miner') { roleMiner.run(creep); }
		if(creep.memory.role == 'peon') { rolePeon.run(creep); }
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
		if ( Memory.reval.enabled )
		{
			Reval.drawPlan( myRooms[room] );
		}
	}
}
