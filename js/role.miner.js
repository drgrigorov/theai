module.exports = {
    /** @param {Creep} creep **/
    run: function(creep)
	{
		var state = creep.memory.state;
		if ( state == undefined || state == 'init' )
		{
			if ( creep.memory.hRoom == creep.room.name )
			{
				creep.memory.state = 'collecting';
				delete creep.memory.hRoom;
			}
			else
			{
				creep.memory.state = 'travel';
			}
		}
		else if ( state == 'travel' )
		{
			let rName = creep.memory.hRoom;
			var goRoom = Game.rooms[rName];
			if ( goRoom == undefined )
			{
				console.log( 'Home room ' + rName + ' is not found. Changing to local' );
				creep.memory.state = 'collecting';
				delete creep.memory.hRoom;
			}
			else
			{
				var rCtrl = goRoom.controller;
				if ( rCtrl == undefined )
				{
					console.log( 'Home room ' + rName + ' controller is not found. Changing to local' );
					creep.memory.state = 'collecting';
					delete creep.memory.hRoom;
					return;
				}
				
				//we reached the room and we are not standing on an exit tile.
				if ( creep.room.name == rName && creep.pos.findInRange( FIND_EXIT, 0 ).length == 0 )
				{
					console.log( 'Reached room ' + rName );
					creep.memory.state = 'collecting';
					delete creep.memory.hRoom;
				}
				else
				{
					console.log( 'Travelling to room ' + rName );
					creep.moveTo( rCtrl, {visualizePathStyle: {stroke: '#ffaa00'}} );
				}
			}
		}
		else if ( state == 'collecting' )
		{
			if (creep.memory.src == undefined)
			{
				var index = creep.name.slice(-1);
				var sources = creep.room.find(FIND_SOURCES);
				creep.memory.src = sources[index].id;
			}
			var src = creep.memory.src;
			var toMine = Game.getObjectById( src );
			//console.log('Miner role (src:' + src + ')' );
			if(creep.harvest( toMine ) == ERR_NOT_IN_RANGE) {
				creep.say('deploy ' + src);
				creep.moveTo( toMine, {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		}
    }
};
