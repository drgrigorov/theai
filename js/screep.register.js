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

    spawnDecision: function( spawn, creeps, mcreeps, stage )
    {
	    //console.log( '----' );
		if (spawn.room.memory.invasion)
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
	    for (var rolen in Object.keys(prio))
	    {
			var role = prio[rolen];
			//console.log( rolen + ' ' + role);
			if (cfg[role] == undefined)
			{
				continue;
			}
		    for (var i = 0; i < cfg[role].cnt(spawn.room); i++)
		    {
			    var name = role + i;
			    //console.log( name );
			    if ( creeps == undefined || !creeps[name] )
			    {
					console.log( 'Creep ' + name + ' does not exist and should be spawned' );
				    if ( mcreeps[name] )
				    {
					    //console.log('deleting old ' + name );
					    delete mcreeps[name];
				    }
				    var res = spawn.spawnCreep(
					    cfg[role].parts,
					    name,
					    {memory: {role: role, state: 'init'}});
					if ( res == ERR_NOT_ENOUGH_ENERGY || res == ERR_BUSY )
					{
						return;
					}
					//else { console.log( 'spawn result: ' + res ); }
			    }
		    }
	    }
    }
    
};

