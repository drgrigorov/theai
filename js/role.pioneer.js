/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.pioneer');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
	run: function(creep)
	{
		var state = creep.memory.state;
		if (state == 'collecting' || state == 'init')
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
					let conts = creep.room.find(FIND_STRUCTURES,
						{filter: (str) => { 
							return (str.structureType == STRUCTURE_CONTAINER
								&& str.store.energy > 0 )}});
					if ( conts.lenght > 0 )
					{
						for( let cont in conts )
						{
							let res = creep.withdraw(conts[cont], RESOURCE_ENERGY);
							if( res == ERR_NOT_IN_RANGE ) {
								creep.moveTo(conts[cont],
									{visualizePathStyle: {stroke: '#ffaa00'}});
							}
						}
					}
					else if ( creep.room.memory.emergency )
					{
						var stor = creep.room.storage;
						if ( stor != undefined )
						{
							if ( stor.store.energy > 0 )
							{
								//console.log( stor.store.energy );
								let res = creep.withdraw(stor, RESOURCE_ENERGY);
								if( res == ERR_NOT_IN_RANGE ) {
									creep.moveTo(stor, {visualizePathStyle: {stroke: '#ffaa00'}});
								}
								else if ( res != OK )
								{
									console.log( res );
								}
							}
						}
						else
						{
							creep.memory.state = 'storing';
						}
					}
					else
					{
						//we are not full, but there are no sources available.
						creep.memory.state = 'storing';
					}
				}
			}
			else
			{
				//we are full
				creep.memory.state = 'storing';
			}
		}
		else if (state == 'storing')
		{
			if(creep.carry.energy == 0) {
				creep.memory.state = 'collecting';
			}
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION ||
						structure.structureType == STRUCTURE_SPAWN) &&
						structure.energy < structure.energyCapacity;
				}
			});
			if(targets.length > 0) {
				if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
			else
			{
				//storages are full
				creep.memory.state = 'idle';
			}
		}
		else if (state == 'idle')
		{
			//If it reached idle state than let it do one upgrade cycle
			if(creep.carry.energy < creep.carryCapacity)
			{
				creep.memory.state = 'collecting';
			}
			else
			{
				if ( creep.room.controller.tickToDowngrade < 300 )
				{
					//console.log( creep.room.controller.tickToDowngrade );
					creep.memory.state = 'upgrading';
				}
				else
				{
					var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
					if(targets.length) {
						creep.memory.toBuild = targets[0].id;
						creep.memory.state = 'building';
					}
					else
					{
						creep.memory.state = 'upgrading';
					}
				}
			}
		}
		else if (state == 'building')
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
		/*else if (state == 'supply')
		{
			if(creep.carry.energy == 0)
			{
				creep.memory.state = 'collecting';
				return;
			}
			var towers = creep.room.find( FIND_MY_STRUCTURES, 
				{filter: { structureType: STRUCTURE_TOWER }} );
			if ( towers.length == 0 )
			{
				console.log('not towers in the room');
				creep.memory.state = 'idle';
				return;
			}

			let tAvail = false;
			towers.forEach(function(tower) {
				if (tower.energy < tower.energyCapacity)
				{
					if ( creep.transfer( tower, RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE )
					{
						tAvail = true;
						creep.moveTo(tower, {visualizePathStyle: {stroke: '#ffffff'}});
					}
				}
			});
			if (!tAvail)
			{
				creep.memory.state = 'idle';
			}
		}*/
		else if (state == 'upgrading')
		{
			let res = creep.upgradeController(creep.room.controller);
			if( res == ERR_NOT_IN_RANGE )
			{
				creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
			}
			else if( res == ERR_NOT_ENOUGH_RESOURCES )
			{
				creep.memory.state = 'idle';
			}
		}
		else
		{
			//unknown state
		}
	}
};
