var rpc = require('../lib/amqp-rpc/amqp_rpc');


rpc.call('DB_CHECK_USER', {user: 'guest', pass: 'guest'}, function(result){
    console.log(result);
});

var newUser = {
    userId: 'guest',
    email: 'guest@onion.io',
    passHash: '####'
};
rpc.call('DB_ADD_USER', newUser, function(result){
    console.log(result);
});

/*
rpc.call('DB_CREATE_SESSION', {user: 'guest'}, function(result){
    console.log(result);
});
*/
