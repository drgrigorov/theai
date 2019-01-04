
module.exports = {
	claim: function()
	{
		//TODO: fix the organisation of this method!
		let croomName = Game.flags['Claim'].pos.roomName;

		clRoom = Game.rooms[croomName];
		if (clRoom != undefined &&
			clRoom.controller.owner.username == Memory.me )
		{
			console.log( "Claim room is owned by me" );
			let myPos = Game.flags['Claim'].pos;
			//Create spawn at claim flag
			if ( clRoom.find( STRUCTURE_SPAWN ).length == 0 )
			{
				let res = clRoom.createConstructionSite( myPos.x, myPos.y, STRUCTURE_SPAWN, clRoom.name + '_Spawn1' );
				if ( res == OK )
				{
					//Remove claim flag
					Game.flags['Claim'].remove();
					//Set populate flag
					clRoom.createFlag( myPos, 'Populate' );
				}
				else if ( res == ERR_INVALID_ARGS )
				{
					console.log( "Invalid location: " + JSON.stringify( myPos ) );
				}
				else
				{
					console.log( "Cannot create spawn. Reason: " + res );
				}
			}

			return;
		}

		console.log("Lets claim " + croomName );
		//console.log( JSON.stringify( Game.flags['Claim'] ) );
		//console.log( JSON.stringify( croom ) );
		let scout = Game.creeps['scout'];
		let claimer = Game.creeps['claimer'];

		let tmpDist = 0;
		var stRoom = undefined;
		for ( let room in Game.rooms )
		{
			let dist = Game.map.getRoomLinearDistance( room, croomName );
			console.log( "Dist between " + room + " and " + croomName + " is " + dist + "." );
			//we need around 900 energy to spawn a scout
			if ( Game.rooms[room].energyCapacityAvailable >= 900 )
			{
				if (!tmpDist || tmpDist > dist )
				{
					tmpDist = dist;
					stRoom = Game.rooms[room];
				}
			}
		}
		var mySpawn = Game.getObjectById( stRoom.memory.spawn );

		if ( scout == undefined )
		{
			//spawn the scout
			if ( stRoom != undefined )
			{
				console.log( 'Room ' + stRoom.name + ' will spawn the scout' );
				if ( mySpawn != undefined )
				{
					console.log( JSON.stringify( mySpawn ) );
					if ( mySpawn.spawning == null )
					{
						let res = mySpawn.spawnCreep(
							[TOUGH,TOUGH,TOUGH,TOUGH,
								MOVE,MOVE,MOVE,MOVE,MOVE,
								ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,
								MOVE,MOVE],
							'scout',
							{memory: {role: 'scout', state: 'init', goRoom: croomName }});
						//console.log( res );
					}
					else
					{
						console.log( 'Room ' + stRoom.name + ' is currently spawning' );
					}
				}
			}
			else
			{
				console.log( 'No room can spawn a scout' );
			}
		}
		else
		{
			if ( scout.spawning )
			{
				console.log( "Scout spawning" );
			}
			else
			{
				console.log( "Scout available" );
				//console.log( JSON.stringify( scout ) );
				//roleScout.run( scout );
			}
		}

		if ( Memory.claimRoomClean == true )
		{
			console.log( "Claim room is clean" );
			if ( claimer == undefined )
			{
				if ( mySpawn.spawning == null )
				{
					var res = mySpawn.spawnCreep(
						[ MOVE,MOVE,MOVE,MOVE,CLAIM ],
						'claimer',
						{memory: {role: 'claimer', state: 'init', goRoom: croomName }});
					//console.log( res );
				}
				else
				{
					console.log( 'Room ' + stRoom.name + ' is currently spawning' );
				}
			}
			else
			{
				if ( claimer.spawning )
				{
					console.log( "Claimer spawning" );
				}
				else
				{
					console.log( "Claimer available" );
					//roleClaimer.run( claimer );
				}
			}
		}
	}
};
