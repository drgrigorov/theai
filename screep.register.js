/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('screep.register');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    
    check: function( creeps, mcreeps )
    {
    },
    
    cfg: {
        miner: {
            cnt: 1, parts: [WORK,WORK,MOVE], pfix: 'Pump'
        },
        upgrader: {
            cnt: 0, parts: [WORK,WORK,MOVE], pfix: 'Sci'
        },
        maintainer: {
            cnt: 0, parts: [WORK,CARRY,MOVE,MOVE], pfix: 'Fixit'
        },
        builder: {
            cnt: 0, parts: [WORK,CARRY,MOVE,MOVE], pfix: 'Dozer'
        },
        carrier: {
            cnt: 2, parts: [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], pfix: 'Mule'
        }
    },
    
    pers: {
        Pump0: { role: 'miner', src: 0 },
        Pump1: { role: 'miner', src: 1 },
        Sci0: { role: 'upgrader' },
        Fixit0: { role: 'mainainer' },
        Dozer0: { role: 'builder' },
        Mule0: { role: 'carrier' },
        Mule1: { role :'carrier' }
    }
};


