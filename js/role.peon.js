
module.exports = {
	run: function(creep)
	{
		var state = creep.memory.state;
		if ( state == undefined || state == 'init' || state == 'idle' )
		{
			ntask = creep.room.getAndReserveTask(); 
			//console.log( JSON.stringify( ntask ) );
			creep.setTask( ntask );
		}
		creep.processTask();
	}
};
