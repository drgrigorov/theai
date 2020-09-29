/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('screep.register');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    
	prio: [ 'miner', 'pioneer', 'carrier', 'upgrader', 'maintainer', 'builder', 'upgrader' ],

	cfg: [
		{//0
			miner: { cnt: function() { return 1; }, parts: [WORK,WORK,MOVE] }
		},
		{//1
			pioneer: { cnt: function() { return 2; }, parts: [WORK,CARRY,MOVE,MOVE] },
			miner: { cnt: function() { return 1; }, parts: [WORK,WORK,MOVE] }
		},
		{//2
			pioneer: { cnt: function() { return 2; }, parts: [WORK,CARRY,MOVE,MOVE] },
			miner: { cnt: function() { return 1; }, parts: [WORK,WORK,MOVE] }
		},
		{//3
			miner: {
				cnt: function(room) {
					if ( room.memory.safeSrc == undefined )
					{
						room.memory.safeSrc = 1;
					}
					return room.memory.safeSrc;
				},
				parts: [WORK,WORK,WORK,WORK,WORK,MOVE] },

			pioneer: { cnt: function() { return 4; },
				parts: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE] },

			maintainer: { cnt: function() { return 1; },
				parts: [WORK,CARRY,CARRY,MOVE,MOVE,MOVE] }
		},
		{//4
			miner: {
				cnt: function(room) {
					if ( room.memory.safeSrc == undefined )
					{
						room.memory.safeSrc = 1;
					}
					return room.memory.safeSrc;
				},
				parts: [WORK,WORK,WORK,WORK,WORK,MOVE] },

			pioneer: { cnt: function() { return 4; },
				parts: [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE] },

			maintainer: { cnt: function() { return 0; },
				parts: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE] },

			upgrader: { cnt: function() { return 1; },
				parts: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE] },

			carrier: { cnt: function() { return 2; },
				parts: [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE] }
		}
	],

    spawnDecision: function( room, creeps, spawn )
    {
		let stage = room.memory.stage;
		let mcreeps = Memory.creeps;

		var spawn;
		if ( spawn == undefined ) { spawn = Game.getObjectById( room.memory.spawn ); }
		if ( spawn == undefined )
		{
			console.log( "Spawn for room " + room.name + " can not be found [" + room.memory.spawn + "]" );
			return;
		}

		if ( creeps == undefined )
		{
			console.log( "We do not have any creeps" );
		}

		if(spawn.spawning) {
			var spawningCreep = Game.creeps[spawn.spawning.name];
			spawn.room.visual.text(
				spawningCreep.memory.role,
				spawn.pos.x + 1,
				spawn.pos.y,
				{align: 'left', opacity: 0.8});
			//Spawn is currently working. No need to decide anything.
			return;
		}

	    //console.log( '----' );
		if (room.memory.invasion)
		{
			//console.log('Invasion is active. Need to spawn defenders');
			var res = spawn.spawnCreep(
				[TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK],
				'defender' + Game.time,//chose a name automatically
				{memory: {role: 'defender', state: 'init'}});
			//console.log( res );
			return;
		}

	    var cfg = this.cfg[stage];
		var prio = this.prio;
	    for (var rolen = 0; rolen < prio.length; rolen++ )
	    {
			var role = prio[rolen];
			//console.log( rolen + ' ' + role);
			if (cfg[role] == undefined)
			{
				continue;
			}
		    for (var i = 0; i < cfg[role].cnt(room); i++)
		    {
			    var name = room.name + '_' + role + i;
			    //console.log( name );
			    if ( creeps == undefined || !creeps[name] )
			    {
					//console.log( 'Creep ' + name + ' does not exist and should be spawned' );
				    //if ( mcreeps[name] )
				    //{
						//NOTE: there is a bug - deleting memory of currently spawning creeps.
						//NOTE2: code does not reach here now when spawning.
						//NOTE3: even note2 did not fix the issue.
					    //console.log('deleting old ' + name );
					    //delete mcreeps[name];
				    //}
				    var res = spawn.spawnCreep(
					    cfg[role].parts,
					    name,
					    {memory: {role: role, state: 'init', hRoom: room.name}});
					if ( res == ERR_NOT_ENOUGH_ENERGY || res == ERR_BUSY )
					{
						return;
					}
					//else { console.log( 'spawn result: ' + res ); }
			    }
		    }
	    }

		if ( Game.flags['Populate'] != undefined )
		{
			if ( creeps != undefined && creeps['founder'] == undefined )
			{
				var res = spawn.spawnCreep(
					[WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
					'founder',
					{memory: {role: 'founder', state: 'init'}, rName: Game.flags['Populate'].room.name});
				if ( res == ERR_NOT_ENOUGH_ENERGY || res == ERR_BUSY )
				{
					return;
				}
			}
		}
    }
    
};

