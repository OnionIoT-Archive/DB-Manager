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
	id : { type: String, required: false, unique: false },
	email : { type: String, required: false, unique: false },
	passHash : { type: String, required: false, unique: false },
	status : { type: String, required: false, unique: false },
	devices : { type: Array, required: false, unique: false },
	date : { type: Date, required: false, unique: false }
});
userSchema.plugin(uniqueValidator);

var devicesSchema = new Schema({
	id : { type: String, required: false, unique: false },
	key:{ type: String, required: false, unique: false },
	lastUpdate : { type: Date, required: false, unique: false },
	userId:{ type: String, required: false, unique: false },
	status:{ type: String, required: false, unique: false },
	meta:{
		name:{ type: String, required: false, unique: false },
		description:{ type: String, required: false, unique: false },
		location:{ type: String, required: false, unique: false },
		deviceType:{ type: String, required: false, unique: false }
	}
});
devicesSchema.plugin(uniqueValidator);
var sessionsSchema = new Schema({
	id : { type: String, required: false, unique: false },
	date : { type: Date, required: false, unique: false },
	token:{ type: String, required: false, unique: false },
	userId:{ type: String, required: false, unique: false }
});
sessionsSchema.plugin(uniqueValidator);

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
	if(p&&p.condition&&p.update){
		Users.update(p.condition, p.update,function(err, numberAffected, raw){
			callback(raw);
		});	
	}
});

rpc.register('DB_DELETE_USER', function(p, callback) {
	console.log(p);
	Users.remove(p, function(err) {
		if(err){
			callback(err);
		}else{
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
	if(p&&p._id){
		Devices.findOne(p, function(err, result) {
		callback(result);
	});
	}else{
		Devices.find(p, function(err, result) {
		callback(result);
	});
	}
	
});

rpc.register('DB_UPDATE_DEVICE', function(p, callback) {
	console.log(p);
	if(p&&p.condition&&p.update){
		console.log('condition meet');
		Devices.update(p.condition, p.update,function(err, numberAffected, raw){
			callback(raw);
		});	
	}
});

rpc.register('DB_DELETE_DEVICE', function(p, callback) {
	console.log(p);
	Devices.remove(p, function(err) {
		if(err){
			callback(err);
		}else{
			callback(true);
		}
	});
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
	if(p&&p.condition&&p.update){
		Sessions.update(p.condition, p.update,function(err, numberAffected, raw){
			callback(raw);
		});	
	}
});

rpc.register('DB_REMOVE_SESSION', function(p, callback) {
	console.log(p);
	Sessions.remove(p, function(err) {
		if(err){
			callback(err);
		}else{
			callback(true);
		}
	});
});

log("started...");

