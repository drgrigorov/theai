/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */

var roleUpgrader = {

    /** @param {Creep} creep **/
	run: function(creep) {
		var state = creep.memory.state;
		if (state == 'init')
		{
			if (creep.memory.slot == undefined)
			{
				creep.memory.slot = creep.name.slice(-1);
				//creep.memory.slot = 0;
			}
			var dest = Game.flags['upgSlot' + creep.memory.slot];
			var strAtFlag = creep.room.lookForAt( LOOK_STRUCTURES, dest );
			for ( let struct in strAtFlag )
			{
				if (strAtFlag[struct].structureType == STRUCTURE_CONTAINER)
				{
					creep.memory.cont = strAtFlag[struct].id;
				}
			//	console.log( JSON.stringify( strAtFlag[struct] ) );
			}
			if ( creep.memory.cont == undefined )
			{
				console.log( 'container not found at flag [' + dest.name + ']' );
				return;
			}
			creep.memory.state = 'deploy';
		}
		else if( state == 'deploy' )
		{
			var dest = Game.flags['upgSlot' + creep.memory.slot];
			if (creep.pos.isEqualTo( dest.pos) )
			{
				//Once reached change to energy_wait
				creep.memory.state = 'draw';
				creep.say('draw');
			}
			else
			{
				//Move to the room controller
				creep.moveTo(dest, {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}
		else if( state == 'draw' )
		{
			if ( creep.carry.energy < creep.carryCapacity )
			{
				var cont = Game.getObjectById( creep.memory.cont );
				let res = creep.withdraw( cont, RESOURCE_ENERGY );
			}
			else
			{
				creep.memory.state = 'upgrade';
				creep.say('upgrade');
			}
		}
		else if( state == 'upgrade' )
		{
			//keep upgrading until energy is over
			if( creep.upgradeController(creep.room.controller) == ERR_NOT_ENOUGH_RESOURCES)
			{
				//once over change to energy_request
				creep.memory.state = 'draw';
				creep.say('draw');
			}
		}
		else
		{
			//unknown state
		}
	}
};

module.exports = roleUpgrader;
