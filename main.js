var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMaintainer = require('role.maint');
var roleMiner = require('role.miner');
var roleMule = require('role.mule');
var rolePioneer = require('role.pioneer');
var roleHarvester = require('role.harvester');
var roleTower = require('role.tower');
var roleDefender = require('role.defender');

var reg = require('screep.register');
var Reval = require('room.eval');


module.exports.loop = function () {

	var mySpawn = Game.spawns['QStart'];
	var myRoom = mySpawn.room;
	var sources = myRoom.find(FIND_SOURCES);

	if ( Game.time % 1000 )
	{
		//There is obviously a bug here
		//probably spawn status should also be checked as a minimum

		//for(var name in Memory.creeps) {
		//	if(!Game.creeps[name]) {
		//		delete Memory.creeps[name];
				//console.log('Clearing non-existing creep memory:' + name);
		//	}
		//}
	}

	if ( Memory.stage == undefined )
	{
		Memory.stage = 0;
	}
	let RoomStage = Memory.stage;

	let hostiles = myRoom.find( FIND_HOSTILE_CREEPS ).length;
	if (hostiles)
	{ 
		if (myRoom.memory.invasion == false)
		{
			console.log( 'invastion starts' );
			Game.notify( 'invasion' );
			myRoom.memory.invasion = true;
		}
	}
	else
	{
		if (myRoom.memory.invasion)
		{
			Game.notify( 'invasion ends' );
			console.log( 'invastion ends' );
			myRoom.memory.invasion = false;
		}
	}

	//merge this code with the role distribution maybe
	let rmCreepNum = myRoom.find( FIND_MY_CREEPS ).length;
	if ( rmCreepNum == 0 )
	{
		console.log('activating emergency mode');
		myRoom.memory.emergency = true;
	}

	if ( myRoom.memory.emergency )
	{
		Memory.stage = 1;
		//console.log( 'emergency - room state 1' );
		//console.log( myRoom.energyAvailable );
		//console.log( myRoom.energyCapacityAvailable );
		//console.log( rmCreepNum );
		if( rmCreepNum >= 3 &&
			( myRoom.energyAvailable == myRoom.energyCapacityAvailable ) &&
			hostiles == false )
		{
			console.log('Discontinuing emergency state');
			myRoom.memory.emergency = false;
		}
	}
	else
	{
		if ( RoomStage == 1 )
		{
			if ( myRoom.controller.level >= 2 )
			{
				//Place the construction sites for extentions and change stage
				var x = mySpawn.pos.x - 1;
				var y = mySpawn.pos.y - 2;
				myRoom.createConstructionSite( x, y, STRUCTURE_EXTENSION );
				myRoom.createConstructionSite( x + 1, y, STRUCTURE_EXTENSION );
				myRoom.createConstructionSite( x + 2, y, STRUCTURE_EXTENSION );

				myRoom.createConstructionSite( x + 1, y + 4, STRUCTURE_EXTENSION );
				myRoom.createConstructionSite( x + 2, y + 4, STRUCTURE_EXTENSION );

				Memory.stage = 2;
			}
		}
		else if( RoomStage == 2 )
		{
			if ( myRoom.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION)
				}}).length >= 5 )
			{
				//If we have 5 extentions advance the room stage
				var x = mySpawn.pos.x - 1;
				var y = mySpawn.pos.y - 1;
				for ( let i = 0; i < 3; i++ )
				{
					for ( let j = 0; j < 3; j++ )
					{
						myRoom.createConstructionSite( x + i, y + j, STRUCTURE_ROAD );
					}
				}
				Reval.run( mySpawn, sources );
				Memory.stage = 3;
			}
		}
		else if( RoomStage == 3 )
		{
			if ( myRoom.controller.level >= 3 )
			{
				Memory.stage = 4;
			}
		}
	}

	reg.spawnDecision( mySpawn, Game.creeps, Memory.creeps, RoomStage );

	
	let towers = myRoom.find(FIND_MY_STRUCTURES,{
		filter: (structure) => {
			return (structure.structureType == STRUCTURE_TOWER)
		}});
	for ( let tower in towers )
	{
		roleTower.run( towers[tower] );
	}

	for(var name in Game.creeps) {
		var creep = Game.creeps[name];
		if(creep.memory.role == 'miner') {
			roleMiner.run(creep);
			if (RoomStage == 0)
			{
				Memory.stage = 1;
			}
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

	if(mySpawn.spawning) {
		var spawningCreep = Game.creeps[mySpawn.spawning.name];
		mySpawn.room.visual.text(
			spawningCreep.memory.role,
			mySpawn.pos.x + 1,
			mySpawn.pos.y,
			{align: 'left', opacity: 0.8});
	}

}
