var roleTower = require('role.tower');
var reg = require('creep.register');
var Reval = require('room.eval');

module.exports = {

	run: function( room, rCreeps )
	{
		//console.log( "Processing room " + room.name );
		if ( room.memory.spawn == undefined )
		{
			let spawns = room.find( FIND_MY_SPAWNS );
			//Just put one spawn as room spawn.
			if ( spawns.length != 0 )
			{
				//console.log( "We have spawns in room " + room.name );
				room.memory.spawn = spawns[0].id;
			}
			else
			{
				//Not much to do without spawn
				//console.log( "No spawn found in room " + room.name );
				//console.log( "Room " + room.name + " donor is " + room.memory.donor );
				if ( room.memory.donor != undefined )
				{
					let myDonorRoom = Game.rooms[room.memory.donor];
					if ( myDonorRoom != undefined )
					{
						let myDonorSpawn = Game.getObjectById( myDonorRoom.memory.spawn );
						if ( myDonorSpawn != undefined )
						{
							reg.spawnDecision( room, rCreeps, myDonorSpawn );
						}
						else
						{
							console.log( "Donor spawn could not be found" );
						}
					}
					else
					{
						console.log( "Donor room could not be found" );
					}
				}
				return;
			}
		}

		let mySpawn = Game.getObjectById( room.memory.spawn );
		let mrCreeps = Memory.creeps;

		//Reval.run( mySpawn );

		if ( room.memory.stage == undefined )
		{
			room.memory.stage = 0;
		}
		let RoomStage = room.memory.stage;

		let hostiles = room.find( FIND_HOSTILE_CREEPS,
			{ filter: function(o) { return o.owner.username != "Source Keeper"; } } ).length;
		
		if (hostiles)
		{ 
			if (room.memory.invasion == false)
			{
				console.log( 'invastion starts' );
			//	Game.notify( 'invasion' );
				room.memory.invasion = true;
			}
		}
		else
		{
			if (room.memory.invasion)
			{
				//Game.notify( 'invasion ends' );
				console.log( 'invastion ends' );
				room.memory.invasion = false;
			}
		}

		//merge this code with the role distribution maybe
		let rmCreepNum = room.find( FIND_MY_CREEPS ).length;
		if ( rmCreepNum <= 1 && room.memory.emergency != true )
		{
			console.log('activating emergency mode');
			room.memory.emergency = true;
		}

		if ( room.memory.emergency )
		{
			room.memory.stage = 1;
			if( rmCreepNum >= 3 &&
				( room.energyAvailable == room.energyCapacityAvailable ) &&
				hostiles == false )
			{
				console.log('Discontinuing emergency state');
				room.memory.emergency = false;
			}
		}
		else
		{

			if ( RoomStage == 1 )
			{
				if ( room.controller.level >= 2 )
				{
					//Place the construction sites for extentions and change stage
					var x = mySpawn.pos.x - 1;
					var y = mySpawn.pos.y - 2;
					room.createConstructionSite( x, y, STRUCTURE_EXTENSION );
					room.createConstructionSite( x + 1, y, STRUCTURE_EXTENSION );
					room.createConstructionSite( x + 2, y, STRUCTURE_EXTENSION );

					room.createConstructionSite( x + 1, y + 4, STRUCTURE_EXTENSION );
					room.createConstructionSite( x + 2, y + 4, STRUCTURE_EXTENSION );

					room.memory.stage = 2;
				}
			}
			else if( RoomStage == 2 )
			{
				if ( room.memory.donor != undefined )
				{
					//room does need a "donor" any more
					room.memory.donor = undefined;

					//remove the populate flag if present in the room
					if (Game.flags['Populate'] != undefined &&
						Game.flags['Populate'].pos.roomName == room.name) 
					{
						Game.flags['Populate'].remove;
					}
				}

				if ( room.find(FIND_STRUCTURES, {
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
							room.createConstructionSite( x + i, y + j, STRUCTURE_ROAD );
						}
					}
					Reval.run( mySpawn );
					room.memory.stage = 3;
				}
			}
			else if( RoomStage == 3 )
			{
				if ( room.controller.level >= 3 )
				{

					//room.memory.stage = 4;
				}
			}
			else if ( RoomStage == 4 )
			{
					//Reval.run( mySpawn );
			}
		}

		//Decide what to spawn in this room
		reg.spawnDecision( room, rCreeps );// mySpawn, rCreeps, mrCreeps, RoomStage );
		
		//Run tower AI
		let towers = room.find(FIND_MY_STRUCTURES,{
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_TOWER)
			}});
		for ( let tower in towers )
		{
			roleTower.run( towers[tower] );
		}
		
	}
}
