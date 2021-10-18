
module.exports = {
	drawUpgradeSpots: function( myRoom, mySpawn ) {
		let cpos = myRoom.controller.pos;
		let spots = [];
		for ( let x = cpos.x - 1; x <= cpos.x + 1; x++ )
		{
			for ( let y = cpos.y - 1; y <= cpos.y + 1; y++ )
			{
				if (x != cpos.x || y != cpos.y )
				{
					let ter = myRoom.lookForAt( LOOK_TERRAIN, x, y );
					if ( ter != 'wall' )
					{
						myRoom.visual.circle( x, y, {fill: '#00bb22'} );//,
						let dist = Math.abs( (mySpawn.pos.y - y) + (mySpawn.pos.x - x) );
						//myRoom.visual.text( dist, x, y, {color: '#ffffff'} );//,
						spots.push( {x: x, y: y, dist: dist } );
						//spots.y = y;
						//spots.dist = dist;
					}
				}
			}
		}

		let numUpgr = 5 - myRoom.memory.safeSrc;
		//console.log(_.VERSION);
		//console.log( JSON.stringify( spots ) );
		spots = _.sortByOrder(spots, ['dist'], ['asc'], _.values );
		//console.log( JSON.stringify( spots ) );
		numUpgr = (numUpgr<spots.length)?numUpgr:spots.length;
		for ( let i = 0; i < numUpgr; i++ )
		{
			//myRoom.visual.text( i, spots[i].x, spots[i].y, {color: '#ffffff'} );//,
			if ( myRoom.memory.u == undefined )
			{
				myRoom.memory.u = [];
			}
			myRoom.memory.u[i] = { x: spots[i].x, y: spots[i].y };
		}
	},

	drawSrcSlots( myRoom, mySpawn ) {

		var safeSrc = 0;
		let n = 0;

		var pathArr1 = myRoom.findPath( mySpawn.pos, myRoom.controller.pos,
			{ignoreCreeps: true, igrnoreRoads: true} );

		var lastPos1 = pathArr1[ pathArr1.length - 2 ];//This will be an issue if path is shorter than 2 entries.
		//myRoom.visual.circle( lastPos1.x, lastPos1.y, {fill: '#bb0022'} );//,
		//myRoom.createConstructionSite( lastPos1.x, lastPos1.y, STRUCTURE_CONTAINER );

		var sources = myRoom.find( FIND_SOURCES );

		for ( let srcn in sources )
		{
			let src = sources[srcn];
			//, {filter: function(obj) { return obj. } }) )
			let range = 4;
			//console.log( 'structures around ' + src.id + ':' );
			let structs = myRoom.lookForAtArea( LOOK_STRUCTURES,
				src.pos.y - range,
				src.pos.x - range,
				src.pos.y + range,
				src.pos.x + range,
				true );

			let safe = true;
			for ( let str in structs )
			{
				var struct = structs[str];
				//console.log( JSON.stringify(struct) + ',' );
				if (struct.structure.structureType == 'keeperLair')
				{
					myRoom.visual.rect( src.pos.x - range, src.pos.y - range, range*2, range*2,
						{ stroke: '#ff4444', lineStyle: 'dotted', fill: '#664444' } );
					//console.log( 'There is source keeper around resource[' + src.id + ']' );
					safe = false;
				}
			}
			if ( safe )
			{
				safeSrc++;
				var pathArr = myRoom.findPath( mySpawn.pos, src.pos,
					{ignoreCreeps: true, igrnoreRoads: true} );

				pathArr.forEach(function(path) {
					//console.log('x: ' + path.x + ' y: ' + path.y);
					myRoom.visual.circle( path.x, path.y );//,
					//{ stroke: '#ff4444', lineStyle: 'dotted', fill: '#ffffff' } );
				});
				var lastPos = pathArr[ pathArr.length - 2 ];//This will be an issue if path is shorter than 2 entries.
				myRoom.visual.circle( lastPos.x, lastPos.y, {fill: '#bb0022'} );//,
				//myRoom.createConstructionSite( lastPos.x, lastPos.y, STRUCTURE_CONTAINER );
			}
			myRoom.memory.safeSrc = safeSrc;
		}
		var stExt = { fill: '#3344ff' };
		myRoom.visual.circle( mySpawn.pos.x - 1, mySpawn.pos.y - 1, stExt );
		let range = 8;

		var stRangeBad = { stroke: '#ff4444', lineStyle: 'dotted', fill: '#664444' };
		var stRangeGood = { stroke: '#44ff44', lineStyle: 'dotted', fill: '#446644' };

		myRoom.visual.rect( mySpawn.pos.x - range, mySpawn.pos.y - range, range*2, range*2,	stRangeGood );

	},

	drawCost: function( myRoom, mySpawn ) {
        const roomName = myRoom.name;
	    const terrain = new Room.Terrain(roomName);
        const matrix = new PathFinder.CostMatrix;
        const visual = new RoomVisual(roomName);

        var getRegCost = function( cntr, range, ter )
        {
            if (cntr.y < range || cntr.x < range || cntr.y > (50 - range) || cntr.x > (50 - range) )
            {
                return range*range; //max cost
            }
            var cost = 0;
            for(let y = cntr.y - range; y < cntr.y + range; y++) {
            for(let x = cntr.x - range; x < cntr.x + range; x++) {
                if ( ter.get(x,y) == TERRAIN_MASK_WALL ) { cost = cost + 1 };
            }}
            return cost;
        }

        var h2d = function (d) {return  ("00"+(Number(  Math.round(d)).toString(16))).slice(-2).toUpperCase()}

        // Fill CostMatrix with default terrain costs for future analysis:
        for(let y = 0; y < 50; y++) {
        for(let x = 0; x < 50; x++) {
            const weight = getRegCost( {x,y}, 8, terrain );
            //matrix.set(x, y, weight);
            var clr = '#' + h2d(Math.min(4 * weight,255)) + h2d(255 - Math.min(4*weight,255)) + '99';
            if ( weight < 30 ) {
				if (!(mySpawn.pos.x === x && mySpawn.pos.y === y)) {
					//console.log( clr );
					visual.text(weight, x, y, {backgroundColor: clr });
				}
				else
				{
					visual.text(weight, x, y );
				}
            }
        }}
	},

	drawPlan: function( myRoom ) {
		var rSpawns = myRoom.find( FIND_MY_STRUCTURES,{filter: { structureType: STRUCTURE_SPAWN }});
		if (rSpawns.length === 0)
		{
		    return;
		}

		var mySpawn = rSpawns[0];

		if ( Memory.reval.drawUpg )
		{
			this.drawUpgradeSpots( myRoom, mySpawn );
		}

		if ( Memory.reval.drawSrc )
		{
			this.drawSrcSlots( myRoom, mySpawn );
		}

		if ( Memory.reval.drawCost )
		{
			this.drawCost( myRoom, mySpawn );
		}
	}
};
