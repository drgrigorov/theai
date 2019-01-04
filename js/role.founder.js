
module.exports = {
	run: function( creep )
	{
		let state = creep.memory.state;
		if ( state == 'init' || state == undefined )
		{
			creep.memory.state = 'travel';
		}
		else if ( state == 'travel' )
		{
			if ( creep.memory.rName == undefined ) { creep.memory.rName = Game.flags['Populate'].room.name; }
			let rName = creep.memory.rName;
			//we reached the room and we are not standing on an exit tile.
			if ( creep.room.name == rName && creep.pos.findInRange( FIND_EXIT, 0 ).length == 0 )
			{
				console.log( 'Reached room ' + rName );
				creep.memory.state = 'mining';
			}
			else
			{
				console.log( 'Travelling to room ' + rName );
				creep.moveTo( Game.flags[ 'Populate' ], {visualizePathStyle: {stroke: '#ffaa00'}} );
			}
		}
		else if ( state == 'mining' )
		{
			//collect resources until full
			if(creep.carry.energy < creep.carryCapacity)
			{
				var sources = creep.room.find(FIND_SOURCES);
				if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			}
			else
			{
				var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
				if(targets.length) {
					creep.memory.toBuild = targets[0].id;
					creep.memory.state = 'building';
				}
				else
				{
					creep.memory.state = 'idle';
				}
			}
		}
		else if ( state == 'building' )
		{
			var target = Game.getObjectById( creep.memory.toBuild );
			if (!target)
			{
				creep.memory.toBuild = null;
				creep.memory.state = 'idle';
				return;
			}
			let res = creep.build(target);
			if(res == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
			}
			else if ( res == ERR_NOT_ENOUGH_RESOURCES )
			{
				creep.memory.state = 'idle';
			}
			else if ( res != OK )
			{
				console.log('Creep can not build ' + creep.memory.toBuild +
					' reason: ' + res );
				creep.memory.state = 'idle';
			}
		}
		else if ( state == 'idle' )
		{
			if(creep.carry.energy < creep.carryCapacity)
			{
				creep.memory.state = 'mining';
			}
		}
		else
		{
			console.log('scout: unknown state - ' + state );
		}
	}
};
