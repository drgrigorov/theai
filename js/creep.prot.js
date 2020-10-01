const Task = require( 'task' );

Creep.prototype.log = function ( message ) {
	console.log( "Creep[" + this.name + "]: " + message );
}

Creep.prototype.setTask = function ( task ) {
	if ( this.memory.task != undefined ) {
		return false;
	}
	if ( task ) {
		this.log( "got the task: " + task.name );
		this.memory.task = task;
		this.log( JSON.stringify( this.memory.task ));
	}
}

Creep.prototype.setState = function ( state ) {
	this.memory.state = state;
}

Creep.prototype.processTask = function () {
	//this.log("[" + this.name + "] processing task.");
	if ( this.memory.task == undefined ) {
		return false;
	}
	//this.log( "task available" );
	var cur = new Task( this.memory.task );
	cur.Execute( this );
}

Creep.prototype.full = function () {
	return (this.store.getFreeCapacity() == 0);
}

Creep.prototype.getFull = function () {
	if ( this.full() )
	{
		this.SetState( "storing" );
		return;
	}
	//this.log( "get energy" );
	var sources = this.room.find(FIND_DROPPED_RESOURCES);
	if (sources.length)
	{
		if(this.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
			this.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
		}
		return;
	}
	let ruins = this.room.find(FIND_RUINS,
			{ filter: function(r) { return r.store[RESOURCE_ENERGY] > 0; }
		});
	if ( ruins.length)
	{
		if(this.withdraw(ruins[0]) == ERR_NOT_IN_RANGE) {
			this.moveTo(ruins[0], {visualizePathStyle: {stroke: '#ffaa00'}});
		}
		return;
	}

		let conts = this.room.find(FIND_STRUCTURES,
			{filter: (str) => { 
				return (str.structureType == STRUCTURE_CONTAINER
					&& str.store.energy > 0 )}});
		if ( conts.lenght > 0 )
		{
			for( let cont in conts )
			{
				let res = this.withdraw(conts[cont], RESOURCE_ENERGY);
				if( res == ERR_NOT_IN_RANGE ) {
					this.moveTo(conts[cont],
						{visualizePathStyle: {stroke: '#ffaa00'}});
				}
			}
			return;
		}
		else// if ( this.room.memory.emergency )
		{
			var stor = this.room.storage;
			if ( stor != undefined )
			{
				if ( stor.store.energy > 0 )
				{
					//this.log( stor.store.energy );
					let res = this.withdraw(stor, RESOURCE_ENERGY);
					if( res == ERR_NOT_IN_RANGE ) {
						this.moveTo(stor, {visualizePathStyle: {stroke: '#ffaa00'}});
					}
					else if ( res != OK )
					{
						this.log( res );
					}
				}
			}
			else
			{
				this.setState( 'storing' );
			}
		}
		//else
		//{
			//we are not full, but there are no sources available.
			//this.setState( 'storing' );
		//}
}

Creep.prototype.Upgrade = function () {
	let res = this.upgradeController(this.room.controller);
	if( res == ERR_NOT_IN_RANGE )
	{
		this.moveTo(this.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
	}
	else if( res == ERR_NOT_ENOUGH_RESOURCES )
	{
		this.setState( 'idle' );
		return true;
	}
	return false;
}

Creep.prototype.FillCapacity = function () {
	this.log( "store the energy" );
	if ( this.memory.state == 'storing' )
	{
		if(this.carry.energy == 0) {
			this.setState('idle');
			return true;
		}
		var targets = this.room.getFillTarget();
		if(targets.length > 0) {
			//this.log( "there is target" );
			if(this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}
		else
		{
			this.log("no targets");	
			this.setState( "idle" );
			return true;
		}
	}
	else
	{
		this.log( "unexpected state: " + this.memory.state );
		this.setState( "storing" );
	}
	return false;
}
