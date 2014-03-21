var rpc = require('./lib/amqp-rpc/amqp_rpc');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var dbUrl = 'mongodb://onion:!<684ygrJ51Vx)3@db.onion.io:27017/onion';

var log = function(msg) {
	process.stdout.write("module::db_manager.js: ");
	console.log(msg);
}
var Schema = mongoose.Schema;

var userSchema = new Schema({
	id : {
		type : String,
		required : false,
		unique : false
	},
	email : {
		type : String,
		required : false,
		unique : false
	},
	fullname : {
		type : String,
		required : false,
		unique : false
	},
	website : {
		type : String,
		required : false,
		unique : false
	},
	company : {
		type : String,
		required : false,
		unique : false
	},
	address : {
		type : String,
		required : false,
		unique : false
	},
	title : {
		type : String,
		required : false,
		unique : false
	},
	industry : {
		type : String,
		required : false,
		unique : false
	},
	phone : {
		type : String,
		required : false,
		unique : false
	},
	subscription : {
		type : Boolean,
		required : false,
		unique : false
	},
	passHash : {
		type : String,
		required : false,
		unique : false
	},
	status : {
		type : String,
		required : false,
		unique : false
	},
	date : {
		type : Date,
		required : false,
		unique : false
	}
});
userSchema.plugin(uniqueValidator);

var devicesSchema = new Schema({
	id : {
		type : String,
		required : false,
		unique : true
	},
	key : {
		type : String,
		required : false,
		unique : true
	},
	lastUpdate : {
		type : Date,
		required : false,
		unique : false
	},
	userId : {
		type : String,
		required : false,
		unique : false
	},
	status : {
		type : String,
		required : false,
		unique : false
	},
	states : {
		type : Array,
		required : false,
		unique : false
	},
	procedures : {
		type : Array,
		required : false,
		unique : false
	},
	meta : {
		name : {
			type : String,
			required : false,
			unique : false
		},
		description : {
			type : String,
			required : false,
			unique : false
		},
		location : {
			type : String,
			required : false,
			unique : false
		},
		deviceType : {
			type : String,
			required : false,
			unique : false
		}
	}
});
devicesSchema.plugin(uniqueValidator);

var procedureSchema = new Schema({
	path : {
		type : String,
		required : false,
		unique : false
	},
	functionId : {
		type : Number,
		required : false,
		unique : false
	},
	verb : {
		type : String,
		required : false,
		unique : false
	},
	deviceId : {
		type : String,
		required : false,
		unique : false
	},
	postParams : [{
		type : String,
		required : false,
		unique : false
	}],
	lastAccess : {
		type : Date,
		required : false,
		unique : false
	}
});
procedureSchema.plugin(uniqueValidator);

var statesSchema = new Schema({
	path : {
		type : String,
		required : false,
		unique : false
	},
	value : {
		type : Schema.Types.Mixed,
		required : false,
		unique : false
	},
	timeStamp : {
		type : Date,
		required : false,
		unique : false
	},
	deviceId : {
		type : String,
		required : false,
		unique : false
	}
});
statesSchema.plugin(uniqueValidator);

var sessionsSchema = new Schema({
	id : {
		type : String,
		required : false,
		unique : false
	},
	date : {
		type : Date,
		required : false,
		unique : false
	},
	token : {
		type : String,
		required : false,
		unique : false
	},
	userId : {
		type : String,
		required : false,
		unique : false
	}
});
sessionsSchema.plugin(uniqueValidator);

var accessHistorySchema = new Schema({
	action : {
		type : String,
		required : false,
		unique : false
	},
	endpoint : {
		type : String,
		required : false,
		unique : false
	},
	timestamp : {
		type : Date,
		required : false,
		unique : false
	},
	deviceId : {
		type : String,
		required : false,
		unique : false
	},
	payload : {
		type : String,
		required : false,
		unique : false
	}
});
accessHistorySchema.plugin(uniqueValidator);

var test = new Schema({
	testName : String,
	testId : String,
	date : Date
});

var Test = mongoose.model('Test', test);
var Users = mongoose.model('Users', userSchema);
var Devices = mongoose.model('Devices', devicesSchema);
var Procedures = mongoose.model('Procedures', procedureSchema);
var States = mongoose.model('States', statesSchema);
var Sessions = mongoose.model('Sessions', sessionsSchema);
var AccessHistory = mongoose.model('AccessHistory', accessHistorySchema);

mongoose.connect(dbUrl);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error2:'));

db.once('open', function callback() {
	var testDoc = new Test({
		testId : ['1', '2', '3'],
		date : new Date()
	});
	testDoc.save(function(err, result, numberAffect) {
		if (err) {
			log(err);
		} else {
			log('Pass Test');
		}
	});
	log('db connection openned');
});
db.once('close', function callback() {
	log('connection close');
});

rpc.register('DB_CHECK_TEST', function(p, callback) {
	var testDoc = new Test({
		testId : ['1', '2', '3'],
		date : new Date()
	});
	testDoc.save(function(err, result, numberAffect) {
		if (err) {
			log(err);
		} else {
			log('Pass Test');
		}
	});
	callback('Pass RPC Test');
});

rpc.register('DB_ADD_USER', function(p, callback) {
	//TODO check if the user exist
	var User = new Users(p);
	User.save(function(err, result, numberAffect) {
		//TODO add check err
		console.log(result);
		callback(result);
	});
});

rpc.register('DB_GET_USER', function(p, callback) {
	console.log(p);
	Users.findOne(p, function(err, result) {
		callback(result);
	});
});

rpc.register('DB_UPDATE_USER', function(p, callback) {
	console.log(p);
	if (p && p.condition && p.update) {
		console.log('update');
		Users.update(p.condition, p.update, function(err, numberAffected, raw) {
			callback(raw);
		});
	}
});

rpc.register('DB_DELETE_USER', function(p, callback) {
	console.log(p);
	Users.remove(p, function(err) {
		if (err) {
			callback(err);
		} else {
			callback(true);
		}
	});
});

rpc.register('DB_ADD_DEVICE', function(p, callback) {
	console.log(p);
	var Device = new Devices(p);
	Device.save(function(err, result, numberAffect) {
		//TODO add check err
		callback(result);
	});
});

rpc.register('DB_GET_DEVICE', function(p, callback) {
	console.log(p);
	if (p && p._id||p.id) {
		Devices.findOne(p, function(err, device) {
			if (device && device.id) {
				Procedures.find({
					deviceId : device.id
				}, function(err, funcs) {
					device.procedures = funcs;
					States.find({
						deviceId : device.id
					}, function(err, states) {
						device.states = states;
						console.log('states');
						console.log(device);
						callback(device);
					});
				});
			} else {
				callback(device);
			}

		});
	} else {
		Devices.find(p, function(err, devices) {
			callback(devices);
		});
	}

});

rpc.register('DB_UPDATE_DEVICE', function(p, callback) {
	console.log(p);
	if (p && p.condition && p.update) {
		Devices.update(p.condition, p.update, function(err, numberAffected, raw) {
			console.log(raw);
			callback(raw);
		});
	}
});

rpc.register('DB_DELETE_DEVICE', function(p, callback) {
	console.log(p);
	Devices.remove(p, function(err) {
		if (err) {
			callback(err);
		} else {
			callback(true);
		}
	});
});

rpc.register('DB_ADD_PROCEDURE', function(p, callback) {
	console.log(p);
	var Procedure = new Procedures(p);
	Procedure.save(function(err, result, numberAffect) {
		callback(result);
		//when update, call the socket server to updte the client
		rpc.call('REALTIME_UPDATE_PROCEDURE',p,function(e){});
	});
});

rpc.register('DB_REMOVE_PROCEDURE', function(p, callback) {
	console.log(p);
	Procedures.remove(p, function(err) {
		if (err) {
			callback(err);
		} else {
			callback(true);
		}
	});
});

rpc.register('DB_GET_PROCEDURE', function(p, callback) {
	console.log(p);
	Procedures.findOne(p, function(err, result) {
		callback(result);
	});
});

rpc.register('DB_UPDATE_PROCEDURE', function(p, callback) {
	console.log(p);
	if (p && p.condition && p.update) {
		console.log('condition meet');
		Procedures.update(p.condition, p.update, function(err, numberAffected, raw) {
			callback(raw);
		});
	}
});

rpc.register('DB_ADD_STATE', function(p, callback) {
	console.log(p);
	States.remove({deviceId:p.deviceId, path:p.path}, function(err) {});
        p['timeStamp'] = new Date()
	var State = new States(p);
	State.save(function(err, result, numberAffect) {
		callback(result);
		rpc.call('REALTIME_UPDATE_STATE',p,function(e){});
	});
});

rpc.register('DB_REMOVE_STATE', function(p, callback) {
	console.log(p);
	States.remove(p, function(err) {
		if (err) {
			callback(err);
		} else {
			callback(true);
		}
	});
});

rpc.register('DB_GET_STATE', function(p, callback) {
	console.log(p);
	States.find(p, function(err, result) {
		callback(result);
	});
});

rpc.register('DB_UPDATE_STATE', function(p, callback) {
	console.log(p);
	if (p && p.condition && p.update) {
		console.log('condition meet');
		States.update(p.condition, p.update, function(err, numberAffected, raw) {
			callback(raw);
		});
	}
});

rpc.register('DB_ADD_SESSION', function(p, callback) {
	console.log(p);
	var Session = new Sessions(p);
	Session.save(function(err, result, numberAffect) {
		callback(result);
	});
});

rpc.register('DB_GET_SESSION', function(p, callback) {
	console.log(p);
	Sessions.findOne(p, function(err, result) {
		console.log(result);
		callback(result);
	});
});

rpc.register('DB_UPDATE_SESSION', function(p, callback) {
	console.log(p);
	if (p && p.condition && p.update) {
		Sessions.update(p.condition, p.update, function(err, numberAffected, raw) {
			callback(raw);
		});
	}
});

rpc.register('DB_REMOVE_SESSION', function(p, callback) {
	console.log(p);
	Sessions.remove(p, function(err) {
		if (err) {
			callback(err);
		} else {
			callback(true);
		}
	});
});

rpc.register('DB_ADD_HISTORY', function(p, callback) {
	console.log(p);
	p.timestamp = new Date();
	var acHistory = new AccessHistory(p);
	acHistory.save(function(err, result, numberAffect) {
		console.log(err);
		console.log('save history');
		callback(result);
		console.log(rpc);
		rpc.call('REALTIME_UPDATE_HISTORY',p,function(e){});
	});
});

rpc.register('DB_GET_HISTORY', function(p, callback) {
	console.log(p);
	AccessHistory.find(p).limit(10).sort('-_id').exec( function(err, result) {
		callback(result);
	});
});

log("started...");

