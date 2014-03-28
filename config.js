var dev_config = {
	dbUrl:"mongodb://onion:!<684ygrJ51Vx)3@192.241.191.6:27017/onion",
	mqServerUrl:"amqp://onionCore:p@192.241.191.6"
};
var pro_config = {
	dbUrl:"mongodb://onion:!<684ygrJ51Vx)3@db.onion.io:27017/onion",
	mqServerUrl:"amqp://onionCore:p@mq.onion.io"
};
var init = function(){
	if(process.env.DB_ENV == 'development'){
		return dev_config;
	}else if(process.env.DB_ENV == 'production'){
		return pro_config
	}else{
		console.log('please specify the mode using:');
		console.log('DB_ENV="development" node db_manager.js');
		console.log('DB_ENV="production" node db_manager.js');
		process.exit();
	}
}

module.exports = {
	init: init
};
