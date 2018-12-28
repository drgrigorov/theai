/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.eval');
 * mod.thing == 'a thing'; // true
 */

module.exports = {

	run: function( mySpawn ) {
		var myRoom = mySpawn.room;
		var safeSrc = 0;
		let n = 0;

		var pathArr1 = myRoom.findPath( mySpawn.pos, myRoom.controller.pos,
			{ignoreCreeps: true, igrnoreRoads: true} );

		var lastPos1 = pathArr1[ pathArr1.length - 2 ];//This will be an issue if path is shorter than 2 entries.
		myRoom.visual.circle( lastPos1.x, lastPos1.y, {fill: '#bb0022'} );//, 
		myRoom.createConstructionSite( lastPos1.x, lastPos1.y, STRUCTURE_CONTAINER );
		myRoom.createFlag( lastPos1.x, lastPos1.y, 'upgSlot0' , COLOR_WHITE ); 

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
				myRoom.createConstructionSite( lastPos.x, lastPos.y, STRUCTURE_CONTAINER );
				myRoom.createFlag( lastPos.x, lastPos.y, 'energy' + n++, COLOR_YELLOW ); 
			}
			myRoom.memory.safeSrc = safeSrc;
		}
	}
};
