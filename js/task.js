class Task {
	constructor( task ) {
		if ( task.state == undefined )
		{
			this.state = "new"
		}
		else
		{
			this.state = task.state;
		}
		this.name = task.name;
	}

	log( message ) {
		console.log( "Task[" + this.name + "]: " + message );
	}

	SetState( state ) {
		this.log( "Setting state to: " + state );
		this.creep.memory.task.state = state;
	}

	Destroy() {
		this.log( "Task is completed" );
		//this.creep.room.taskCompleted( this.name );
		delete this.creep.memory.task;
	}
}

class FillCapacity extends Task {
	constructor( task ) {
		super( task );
	}

	Execute( cr ) {
		this.creep = cr;
		//this.log( "capacity task" );
		//this.log( this.state );
		if ( this.state == "new" ) {
			//if creep empty go to get source
			if ( ! cr.full() )
			{
				cr.getFull();
			}
			else
			{
				this.SetState( "store" );
			}
		}
		else if ( this.state == "store" )
		{
			this.log( "Execute store part" );
			if ( cr.FillCapacity() )
			{
				this.Destroy();
			}
		}
	}
}

class Upgrade extends Task {
	constructor( task ) {
		super( task );
	}
	Execute( cr ) {
		this.creep = cr;
		if ( this.state == "new" ) {
			//if creep empty go to get source
			if ( ! cr.full() )
			{
				cr.getFull();
			}
			else
			{
				this.SetState( "store" );
			}
		}
		else if ( this.state == "store" )
		{
			if ( cr.Upgrade() )
			{
				this.Destroy();
			}
		}
	}
}

class Harvest extends Task {
	constructor( task ) {
		super( task );
	}
	Execute( cr ) {
		this.creep = cr;
		if ( this.state == "new" ) {
			//if creep empty go to get source
			if ( ! cr.full() )
			{
				cr.Harvest();
			}
			else
			{
				this.Destroy();
			}
		}
	}
}

var createTask = function( task )
{
	if ( task.name == 'fillCap' ) { return new FillCapacity( task ); }
	if ( task.name == 'upgrade' ) { return new Upgrade( task ); }
	if ( task.name == 'harvest' ) { return new Harvest( task ); }
	return undefined;
}

module.exports = createTask;

