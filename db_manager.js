var rpc = require('./lib/amqp-rpc/amqp_rpc');
var mongoose = require('mongoose');

var dbUrl = 'mongodb://onion:!<684ygrJ51Vx)3@db.onion.io:27017/onion';

var log = function(msg){
    process.stdout.write("module::db_manager.js: ");
    console.log (msg);
}

var Schema = mongoose.Schema;

var userSchema = new Schema({
    id:  String,
    email: String,
    passHash:   String,
    status: String,
    devices: [String]
});

var User = mongoose.model('User', userSchema);

rpc.register('DB_ADD_USER', function(p, callback){
    var email = p.email;
    var id = p.userId || email;
    var passHash = p.passHash;


    mongoose.connect(dbUrl);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
        log('db connection openned');
        //mongoose.disconnect();
        //var newUser = new User({ 
        //    id: id, 
        //    email: email, 
        //    passHash: passHash, 
        //    status: 'active',
        //});
/*
        newUser.save(function (err) {
            if (err) // ...
            console.log('meow');
        });
        */

        //callback(newUser);
        callback();

    });

});

rpc.register('DB_CHECK_USER', function(p, callback){
    callback(false);
});

rpc.register('DB_CREATE_SESSION', function(p, callback){
    var user = p.user || 'guest';
    var payload = {
        token: 'this-is-a-dummy-session-token',
    expDate: new Date(),
    user: user
    };

    callback(payload);
});

rpc.register('DB_CHECK_SESSION', function(p, callback){
    callback(true);
});

log ("started...");

