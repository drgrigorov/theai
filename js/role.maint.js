/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.maint');
 * mod.thing == 'a thing'; // true
 */

var roleMaintainer = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if (creep.memory.state == undefined)
		{
			creep.memory.state = 'init'
		}
		var state = creep.memory.state;

		if ( state == 'init' || state == 'collecting' )
		{
			if(creep.carry.energy < creep.carryCapacity) {
				var sources = creep.room.find(FIND_DROPPED_RESOURCES);
				if (sources.length)
				{
					if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
					}
				}
				else
				{
					//we are not full, but there are no sources available.
					creep.memory.state = 'query';
				}
			}
			else
			{
				//we are full
				creep.memory.state = 'query';
			}
		}
		else if ( state == 'query' )
		{
			var targets = creep.room.find(FIND_STRUCTURES,{
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_ROAD ||
						structure.structureType == STRUCTURE_CONTAINER) &&
						structure.hits < structure.hitsMax;
				}}
			);
			if(targets.length) {
				if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
				}
				if(creep.carry.energy == 0) {

					creep.memory.state = 'collecting';
				}
			}
			else
			{
				creep.memory.state = 'idle';
			}
		}
		else if ( state == 'idle' )
		{
			//else move away
			creep.moveTo(Game.flags.RestPlace.pos, {visualizePathStyle: {stroke: '#ffffff'}})
			creep.memory.state = 'query';
		}
	}
};

module.exports = roleMaintainer;
