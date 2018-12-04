var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMaintainer = require('role.maint');


module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var hsNum = 0, upNum = 0, buNum = 0, mnNum = 0, sTotNum = 0;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
            hsNum++;
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

    if(hsNum < 2) {
        var newName = 'Harvester' + Memory.nextSrc;
        //console.log('Spawning new harvester: ' + newName);
        if (Game.spawns['QStart'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName,
            {memory: {role: 'harvester', src: Memory.nextSrc % 2}}))
        {
            Memory.nextSrc++;
        }
    }
    
    if(mnNum < 1) {
        var newName = 'Maint' + Memory.nextSrc;
        //console.log('Spawning new harvester: ' + newName);
        if (Game.spawns['QStart'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'maintainer', src: Memory.nextSrc % 2}}))
        {
            Memory.nextSrc++;
        }
    }
    
    if(upNum < 1) {
        var newName = 'Upgrader' + Memory.nextSrc;
        //console.log('Spawning new harvester: ' + newName);
        if (Game.spawns['QStart'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'upgrader', src: Memory.nextSrc % 2}}))
        {
            Memory.nextSrc++;
        }
    }
    
    if(buNum < 1) {
        var newName = 'Builder' + Memory.nextSrc;
        if (Game.spawns['QStart'].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'builder', src: Memory.nextSrc % 2}}))
        {
             Memory.nextSrc++;
        }
    }

    if(Game.spawns['QStart'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['QStart'].spawning.name];
        Game.spawns['QStart'].room.visual.text(
            '�️' + spawningCreep.memory.role,
            Game.spawns['QStart'].pos.x + 1,
            Game.spawns['QStart'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    
}
