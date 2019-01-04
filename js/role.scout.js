
module.exports = {
	run: function( creep )
	{
		let state = creep.memory.state;
		if ( state == 'init' || state == undefined )
		{
			creep.memory.state = 'travel';
			Memory.claimRoomClean = false;
		}
		else if ( state == 'travel' )
		{
			let rName = creep.memory.goRoom;
			//we reached the room and we are not standing on an exit tile.
			if ( creep.room.name == rName && creep.pos.findInRange( FIND_EXIT, 0 ).length == 0 )
			{
				console.log( 'Reached room ' + rName );
				creep.memory.state = 'seek';
			}
			else
			{
				console.log( 'Travelling to room ' + rName );
				creep.moveTo( Game.flags[ 'Claim' ], {visualizePathStyle: {stroke: '#ffaa00'}} );
			}
		}
		else if ( state == 'seek' )
		{
			//first check for hostile creeps
			var hCreeps = creep.room.find( FIND_HOSTILE_CREEPS );
			if ( hCreeps.length )
			{
				creep.memory.kill = hCreeps[0].id;
				creep.memory.state = 'fight';
				return;
			}
			//hostile structures
			var hStruct = creep.room.find( FIND_HOSTILE_STRUCTURES );
			if ( hStruct.length )
			{
				creep.memory.destroy = hStruct[0].id;
				creep.memory.state = 'destroy';
				return;
			}

			//structures which are not ours
			hStruct = creep.room.find( FIND_STRUCTURES,
				{filter: function(o) { return (o.owner != undefined && o.owner.username != Memory.me ); } } );
			if ( hStruct.length )
			{
				creep.memory.destroy = hStruct[0].id;
				creep.memory.state = 'destroy';
				return;
			}

			//NOTE: Construction sites are not attacked, but according to docs should move on top of them. Not a concern currently.
			//hStruct = creep.room.find( FIND_CONSTRUCTION_SITES,
				//{filter: function(o) { return (o.owner != undefined && o.owner.username != Memory.me ); } } );
			//if ( hStruct.length )
			//{
				//creep.memory.destroy = hStruct[0].id;
				//creep.memory.state = 'destroy';
				//return;
			//}

			console.log( "Room is clean" );
			Memory.claimRoomClean = true;
		}
		else if ( state == 'fight' )
		{
			var eCreep = Game.getObjectById( creep.memory.kill );
			console.log( "Fighting " + eCreep.name );
		}
		else if ( state == 'destroy' )
		{
			var eStruct = Game.getObjectById( creep.memory.destroy );
			if ( eStruct == undefined )
			{
				creep.memory.state = 'seek';
			}
			else
			{
				console.log( "Destroying " + eStruct.id + " owner " + eStruct.owner.username );
				var res = creep.attack( eStruct );
				if ( res == ERR_NOT_IN_RANGE )
				{
					creep.moveTo(eStruct,
						{visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
		}
		else
		{
			console.log('scout: unknown state - ' + state );
		}
	}
};
