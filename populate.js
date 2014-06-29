var schedule = require('node-schedule'),
	logger = require('./lib/logger'),
  	Populate = require('./lib/cache/populate'),
  	populate = new Populate();

var rule =  new schedule.RecurrenceRule();

rule.minute = new schedule.Range(0,59,1);

schedule.scheduleJob(rule, function(){
	
	populate.run(function(err) {
		if (err) logger.error('Redis Population error', err);
		if (!err) logger.info('Redis Population complete');
	});
});