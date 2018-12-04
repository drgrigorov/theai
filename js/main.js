var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMaintainer = require('role.maint');
var roleMiner = require('role.miner');
var roleMule = require('role.mule');

var reg = require('screep.register');


module.exports.loop = function () {

    reg.check(Game.creeps, Memory.creeps);

    var hsNum = 0, muNum = 0, upNum = 0, buNum = 0, mnNum = 0, sTotNum = 0;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
            hsNum++;
        }
        if(creep.memory.role == 'carrier') {
            roleMule.run(creep);
            muNum++;
        }
        if(creep.memory.role == 'maintainer') {
            roleMaintainer.run(creep);
            mnNum++;
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            upNum++;
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
            buNum++;
        }
        sTotNum++;
    }
    //console.log("Hs:", hsNum, " Up:", upNum, " Bu:", buNum);

    var mySpawn = Game.spawns['Spawn1'];
    if(hsNum < reg.cfg.miner.cnt) {
        var newName = 'Pump0';
        mySpawn.spawnCreep(
            reg.cfg.miner.parts,
            'Pump0',
            {memory: {role: reg.pers.Pump0.role, src: reg.pers.Pump0.src}} );
    }
    if(muNum < reg.cfg.carrier.cnt) {
        var newName = 'Mule0';
        console.log('Need to spawn carrier')
        mySpawn.spawnCreep(
            reg.cfg.carrier.parts,
            'Mule1',
            {memory: {role: reg.pers.Mule0.role}} );
    }

    if(mnNum < 0) {
        var newName = 'Maint' + Memory.nextSrc;
        //console.log('Spawning new harvester: ' + newName);
        if (mySpawn.spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'maintainer', src: Memory.nextSrc % 2}}))
        {
            Memory.nextSrc++;
        }
    }

    if(upNum < 0) {
        var newName = 'Upgrader' + Memory.nextSrc;
        //console.log('Spawning new harvester: ' + newName);
        if (mySpawn.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'upgrader', src: Memory.nextSrc % 2}}))
        {
            Memory.nextSrc++;
        }
    }

    if(buNum < 0) {
        var newName = 'Builder' + Memory.nextSrc;
        if (mySpawn.spawnCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'builder', src: Memory.nextSrc % 2}}))
        {
             Memory.nextSrc++;
        }
    }

    if(mySpawn.spawning) {
        var spawningCreep = Game.creeps[Game.spawns['QStart'].spawning.name];
        mySpawn.room.visual.text(
            '�️' + spawningCreep.memory.role,
            Game.spawns['QStart'].pos.x + 1,
            Game.spawns['QStart'].pos.y,
            {align: 'left', opacity: 0.8});
    }


}
