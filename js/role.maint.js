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
        var src = creep.memory.src;
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('� M harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('� M maintain');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_STRUCTURES,{
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_CONTAINER) &&
                    structure.hits < structure.hitsMax;
                }}
            );
            if(targets.length) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else
            {
                //if nothing broken - fortify walls
                targets = creep.room.find(FIND_STRUCTURES,{
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_WALL &&
                        structure.hits < 10000;
                    }});
                if(targets.length) {
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else
                {
                    //else move away
                    creep.moveTo(Game.flags.RestPlace.pos, {visualizePathStyle: {stroke: '#ffffff'}})
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[src]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[src], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleMaintainer;
