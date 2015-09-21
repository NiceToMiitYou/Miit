
var realtime = miitoo.resolve(['Primus'], function(primus) {

    // Load all managers
    var managers = miitoo.load({
        dirname:  __dirname + '/managers/',
        filter:  /(.+Manager)\.js$/,
        resolve: function (Manager) {
            return new Manager();
        }
    });

    // register Managers
    miitoo.register('Managers', managers, true);

    // Load all Apps
    var apps = miitoo.load({
        dirname:  __dirname + '/apps/',
        filter:  /(.+App)\.js$/,
        resolve: function (App) {
            return new App();
        }
    });

    // register Applictions
    miitoo.register('Applications', apps, true);

    // Handle primus connections
    primus.on('connection', function(spark) {
        
        miitoo.logger.debug('New connection from team.');

        // Send time on connection
        spark.write({
            event: 'server:time',
            date:  new Date()
        });
    });
});

miitoo.once('after:start', realtime);