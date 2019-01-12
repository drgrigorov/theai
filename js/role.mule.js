/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.mule');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
  run: function(creep) {
	var state = creep.memory.state;
	  if (state == 'init')
	  {
		  if (creep.memory.slot == undefined)
		  {
			  creep.memory.slot = 0;
		  }
		  //var dest = Game.flags['upgSlot' + creep.memory.slot];
		  var dest = creep.room.memory.u[creep.memory.slot];
		  var strAtFlag = creep.room.lookForAt( LOOK_STRUCTURES, dest.x, dest.y );
		  for ( let struct in strAtFlag )
		  {
			  if (strAtFlag[struct].structureType == STRUCTURE_CONTAINER)
			  {
				  creep.memory.cont = strAtFlag[struct].id;
			  }
		  }
		  if ( creep.memory.cont == undefined )
		  {
			  console.log( 'container not found at coord ' +
				  creep.room.name + ' [' + dest.x + ',' + dest.y + ']' );
			  return;
		  }

		  creep.memory.state = 'collecting';
	  }
	  else if (state == 'collecting')
	  {
		  if(creep.carry.energy < creep.carryCapacity) {
			  var sources = creep.room.find(FIND_DROPPED_RESOURCES);
			  if (sources.length)
			  {
				  if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
					  creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
				  }
			  }
			  else
			  {
				  //we are not full, but there are no sources available.
				  creep.memory.state = 'idle';
			  }
		  }
		  else
		  {
			  //we are full
			  creep.memory.state = 'storing';
		  }
	  }
	  else if (state == 'storing')
	  {
		  if(creep.carry.energy == 0) {
			  creep.memory.state = 'collecting';
		  }
		  var targets = creep.room.find(FIND_STRUCTURES, {
			  filter: (structure) => {
				  return (structure.structureType == STRUCTURE_EXTENSION ||
					  structure.structureType == STRUCTURE_SPAWN) &&
					  structure.energy < structure.energyCapacity;
			  }
		  });
		  if(targets.length > 0) {
			  if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				  creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
			  }
		  }
		  else
		  {
			  //storages are full
			  creep.memory.state = 'distribute';
		  }
	  }
	  else if (state == 'distribute')
	  {
		  if(creep.carry.energy == 0)
		  {
			  creep.memory.state = 'collecting';
		  }
		  var cont = Game.getObjectById( creep.memory.cont );
		  if ( cont.store.energy < cont.storeCapacity )
		  {
			  if ( creep.transfer( cont, RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE )
			  {
				  creep.moveTo(cont, {visualizePathStyle: {stroke: '#ffffff'}});
			  }
		  }
		  else
		  {
			  creep.memory.state = 'supply';
		  }
	  }
	  else if (state == 'supply')
	  {
		  if(creep.carry.energy == 0)
		  {
			  creep.memory.state = 'collecting';
			  return;
		  }
		  var towers = creep.room.find( FIND_MY_STRUCTURES, 
			  {filter: { structureType: STRUCTURE_TOWER }} );
		  if ( towers.length == 0 )
		  {
			  console.log('no towers in the room');
			  creep.memory.state = 'buffering';
			  return;
		  }

		  let tAvail = false;
		  towers.forEach(function(tower) {
			  if (tower.energy < tower.energyCapacity)
			  {
				  if ( creep.transfer( tower, RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE )
				  {
					  tAvail = true;
					  creep.moveTo(tower, {visualizePathStyle: {stroke: '#ffffff'}});
				  }
			  }
		  });
		  if (!tAvail)
		  {
			  creep.memory.state = 'buffering';
		  }
	  }
	  else if (state == 'buffering')
	  {
		  if(creep.carry.energy == 0)
		  {
			  creep.memory.state = 'collecting';
			  return;
		  }
		  stor = creep.room.storage;
		  if ( stor && (stor.store.energy < 200000) )
		  {
			  if ( creep.transfer( stor, RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE )
			  {
				  creep.moveTo(stor, {visualizePathStyle: {stroke: '#ffffff'}});
			  }
		  }
		  else
		  {
			  creep.memory.state = 'idle';
		  }
	  }
	  else if (state == 'idle')
	  {
		  if(creep.carry.energy < creep.carryCapacity)
		  {
			  creep.memory.state = 'collecting';
		  }
		  else if ( creep.room.find( FIND_MY_STRUCTURES, 
			  { filter: (structure) => { 
				  return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity); }} ).length )
		  {
		      creep.memory.state = 'supply';
		  }
		  else
		  {
		      creep.memory.state = 'buffering';
		  }
		  creep.moveTo(Game.flags.RestPlace.pos, {visualizePathStyle: {stroke: '#ffffff'}})
	  }
	  else
	  {
		  //unknown state
	  }
  }
};
