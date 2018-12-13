/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.tower');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
	run: function(tower) {
		if (tower == undefined)
		{
			return;
		}
		if(tower.energy == 0)
		{
			return;
		}

		var enCreep = tower.room.find( FIND_HOSTILE_CREEPS );
		for( let en in enCreep )
		{
			tower.attack( enCreep[en] );
			return;
		}

		var targets = tower.room.find(FIND_STRUCTURES,{
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_ROAD ||
					structure.structureType == STRUCTURE_CONTAINER) &&
					structure.hits < structure.hitsMax;
			}});
		//console.log( JSON.stringify( targets ) );

		for (let target in targets)
		{
			let ret = tower.repair(targets[target]);
			if ( ret != OK )
			{
				//console.log('Failed to repair target id: ' + targets[target].id );
				//console.log('reason: ' + ret );
			}
		}
		var walls = tower.room.find(FIND_STRUCTURES,{
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_WALL &&
					structure.hits < 11000)
			}});
		//console.log( JSON.stringify( targets ) );

		for (let target in walls)
		{
			let ret = tower.repair(walls[target]);
			if ( ret != OK )
			{
				//console.log('Failed to repair target id: ' + targets[target].id );
				//console.log('reason: ' + ret );
			}
		}
	}
};
