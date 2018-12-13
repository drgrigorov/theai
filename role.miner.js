/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.miner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
		if (creep.memory.src == undefined)
		{
			creep.memory.src = creep.name.slice(-1);
		}
        var src = creep.memory.src;
        //console.log('Miner role (src:' + src + ')' );
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[src]) == ERR_NOT_IN_RANGE) {
            creep.say('deploying');
            creep.moveTo(sources[src], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};
