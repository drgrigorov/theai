/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('screep.register');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    var Cfg = {
        miner: {
            parts: [WORK,WORK,MOVE]
        },
        upgrader: {
            parts: [WORK,WORK,MOVE]
        }
        maintainer: {
            parts: [WORK,CARRY,MOVE,MOVE]
        }
        builder: {
            parts: [WORK,CARRY,MOVE,MOVE]
        }
        carrier: {
            parts: [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
        }
    };
    
    var Pers = {
        Pump0: { role: 'miner', src=0 ],
        Pump1: { role: 'miner', src=1 ],
        Sci0: { role: 'upgrader' },
        Fixit0: { role: 'mainainer' },
        Dozer0: { role: 'builder' },
        Mule0: { role: 'carrier' },
        Mule1: { role :'carrier' }
    };
};


