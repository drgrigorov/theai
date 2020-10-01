Room.prototype.log = function ( message ) {
	console.log( "Room[" + this.name + "]: " + message );
}

Room.prototype.isFullEnergy = function () {
	return this.energyCapacityAvailable == this.energyAvailable;
}

Room.prototype.capacityPct = function () {
	return 100*( this.energyAvailable/this.energyCapacityAvailable );
}

Room.prototype.hasSites = function () {
	return false;
}

Room.prototype.hasIdlingCreeps = function () {
	//this.log( Memory.creeps );
	//let iCreeps = _.find(Memory.creeps, function( cr ) { return cr.state === 'idle' } );// && cr.hRoom === this.name } );
	var rName = this.name;
	//let iCreeps = _.find(Memory.creeps, function( cr ) { return cr.hRoom === rName } );
	let iCreeps = _.find(Memory.creeps, function( cr ) { return (cr.state === 'idle' || cr.state === 'init') && cr.hRoom === rName } );
	//this.log( iCreeps );
	//this.log( JSON.stringify( iCreeps ) );
	//this.log((iCreeps != undefined && iCreeps.length > 0));
	return (iCreeps != undefined);
}

Room.prototype.getFillTarget = function () {
	var targets = this.find(FIND_STRUCTURES, {
		filter: (structure) => {
			return (structure.structureType == STRUCTURE_EXTENSION ||
				structure.structureType == STRUCTURE_SPAWN &&
				structure.energy < structure.energyCapacity);
		}
	});
	//this.log(JSON.stringify(targets));
	return targets;
}

Room.prototype.InitQueues = function () {
	//this.log( "init queues" );
	//initialize the queues with arrays of arrays/objects respectively
	//each array index is one priority
	//delete this.memory.tasks;
	if ( this.memory.tasks == undefined ) { this.memory.tasks = [[],[],[],[],[]]; }
	//if ( this.memory.utasks == undefined ) { this.memory.utasks = [{},{},{},{},{}]; }
	if ( this.memory.queuesize == undefined ) { this.memory.queuesize = 10; }
}

Room.prototype.enqueueTask = function ( task ) {
	//this.log( "enqueue task" );
	this.InitQueues();
	//this.log( JSON.stringify(task) );
	let prio = task.priority;
	if ( ! (prio in [...Array(5).keys()]) )
	{
		this.log( "Unsupported priority [" + prio + "]" );
		return;
	}
	if (this.memory.tasks[prio].length >= this.memory.queuesize)
	{
		this.log( "Queue with priority [" + prio + "] is full" );
		return;
	}
	this.memory.tasks[prio].push( task );
}

//Room.prototype.taskCompleted = function ( name, prio ) {
//	if ( ! (prio in [0:4]) )
//	{
//		this.log( "Unsupported priority [" + prio + "]" );
//		return;
//	}
//	//if ( this.memory.utasks == undefined ) { this.memory.utasks = {}; return; }
//	delete this.memory.utasks[prio][name];
//}

Room.prototype.getAndReserveTask = function () {
	this.InitQueues();
	for (let q in [...Array(5).keys()]) {
		if ( this.memory.tasks[q].length > 0 )
		{
			var ret = this.memory.tasks[q].shift();
			return ret;
		}
	}

		//var sut = _.filter(this.memory.utasks[q], function( x ) {return x.reserved == false;}),
		//if (sut.length != 0) {
		//	var ret = sut[0];
		//	ret.reserved = true;
		//	return ret;
		//}
	//var sut = _.sortBy(
	//	_.filter(this.memory.utasks, function( x ) {return x.reserved == false;}),
	//			function( n ) { return n.priority } );
	//if (sut.length != 0) {
	//	var ret = sut[0];
	//	ret.reserved = true;
	//	return ret;
	//}

	//var st = _.sortBy(
	//	this.memory.tasks,
	//	function( n ) { return n.priority } );

	//if (st.length != 0) {
	//	var ret = st[0];

	//	return ret;
	//}

	return undefined;
}
