

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
				creep.memory.state = 'claim';
			}
			else
			{
				console.log( 'Travelling to room ' + rName );
				creep.moveTo( Game.flags[ 'Claim' ], {visualizePathStyle: {stroke: '#ffaa00'}} );
			}
		}
		else if ( state == 'claim' )
		{
			var toClaim = creep.room.controller;
			if ( toClaim != undefined )
			{
				let res = creep.claimController( toClaim );

				if ( res == ERR_NOT_IN_RANGE )
				{
					creep.moveTo(toClaim,
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
