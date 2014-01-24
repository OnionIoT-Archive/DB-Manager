var rpc = require('./lib/amqp-rpc/amqp_rpc');
var mongoose = require('mongoose');

var dbUrl = 'mongodb://onion:!<684ygrJ51Vx)3@db.onion.io:27017/onion';

var log = function(msg) {
	process.stdout.write("module::db_manager.js: ");
	console.log(msg);
}
var Schema = mongoose.Schema;

var userSchema = new Schema({
	id : String,
	email : String,
	passHash : String,
	status : String,
	devices : Array,
	date : Date
});

var devicesSchema = new Schema({
	id : String,
	key:String,
	endpoint:Object,
	name : String,
	date : Date,
	userId:String
});

var sessionsSchema = new Schema({
	id : String,
	date : Date,
	token:String,
	userId:String
});

var test = new Schema({
	testName : String,
	testId : String,
	date : Date
});

var Test = mongoose.model('Test', test);
var Users = mongoose.model('Users', userSchema);
var Devices = mongoose.model('Devices', devicesSchema);
var Sessions = mongoose.model('Sessions', sessionsSchema);

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
		callback(result);
	});
});

rpc.register('DB_GET_USER', function(p, callback) {
	Users.findOne(p, function(err, result) {
		callback(result);
	});
});

rpc.register('DB_UPDATE_USER', function(p, callback) {
	if(p&&p.condition&&p.update){
		Users.update(p.condition, p.update,function(err, numberAffected, raw){
			callback(raw);
		});	
	}
});

rpc.register('DB_DELETE_USER', function(p, callback) {
	Users.remove(p, function(err) {
		if(err){
			callback(err);
		}else{
			callback(true);
		}
	});
});

rpc.register('DB_ADD_DEVICE', function(p, callback) {
	var Device = new Devices(p);
	Device.save(function(err, result, numberAffect) {
		//TODO add check err
		callback(result);
	});
});

rpc.register('DB_GET_DEVICE', function(p, callback) {
	Devices.find(p, function(err, result) {
		callback(result);
	});
});

rpc.register('DB_UPDATE_DEVICE', function(p, callback) {
	console.log(p.condition);
	if(p&&p.condition&&p.update){
		console.log('condition meet');
		Devices.update(p.condition, p.update,function(err, numberAffected, raw){
			callback(raw);
		});	
	}
});

rpc.register('DB_DELETE_DEVICE', function(p, callback) {
	Devices.remove(p, function(err) {
		if(err){
			callback(err);
		}else{
			callback(true);
		}
	});
});

rpc.register('DB_ADD_SESSION', function(p, callback) {
	var Session = new Sessions(p);
	Session.save(function(err, result, numberAffect) {
		callback(result);
	});
});

rpc.register('DB_GET_SESSION', function(p, callback) {
	Sessions.findOne(p, function(err, result) {
		console.log(result);
		callback(result);
	});
});

rpc.register('DB_UPDATE_SESSION', function(p, callback) {
	if(p&&p.condition&&p.update){
		Sessions.update(p.condition, p.update,function(err, numberAffected, raw){
			callback(raw);
		});	
	}
});

rpc.register('DB_DELETE_SESSION', function(p, callback) {
	Sessions.remove(p, function(err) {
		if(err){
			callback(err);
		}else{
			callback(true);
		}
	});
});

log("started...");

