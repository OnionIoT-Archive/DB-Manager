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
	name : String,
	date : Date
});

var sessionsSchema = new Schema({
	id : String,
	date : Date
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
	if(p&&p.condition&&p.update){
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
		if (err) {
			log(err);
			callback(err);
		} else {
			callback(result);
		}
	});
});

rpc.register('DB_CHECK_USER', function(p, callback) {
	callback(false);
});

rpc.register('DB_CREATE_SESSION', function(p, callback) {
	var user = p.user || 'guest';
	var payload = {
		token : 'this-is-a-dummy-session-token',
		expDate : new Date(),
		user : user
	};
	callback(payload);
});

rpc.register('DB_CHECK_SESSION', function(p, callback) {
	callback(true);
});

log("started...");

