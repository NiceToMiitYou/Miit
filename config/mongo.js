
var config = {
    uri: 'mongodb://miit.database/Miit',
    options:  {
        poolSize: 5,
        socketOptions: {
            noDelay: true,
            connectTimeoutMS: 0,
            socketTimeoutMS: 0
        }
    }
};

miitoo.register('MongoConfig', config, true);