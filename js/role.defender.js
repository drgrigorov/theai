/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.defender');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
	run: function(creep)
	{
		var enCreep = creep.room.find( FIND_HOSTILE_CREEPS );
		//this is probably stupid as the order of the return result is not known
		for( let en in enCreep )
		{
			var res = creep.attack( enCreep[en] );
			if ( res == ERR_NOT_IN_RANGE )
			{
				creep.moveTo(enCreep[en],
					{visualizePathStyle: {stroke: '#ffffff'}});
			}
			return;
		}
	}
};
