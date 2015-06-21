
var realtime = miitoo.resolve(['Primus'], function(primus) {

    // Load all Apps
    var apps = miitoo.load({
        dirname:  __dirname + '/apps',
        resolve: function (App) {
            return new App();
        }
    });

    // register Applictions
    miitoo.register('Applications', apps, true);

    // Load all managers
    var managers = miitoo.load({
        dirname:  __dirname + '/managers',
        resolve: function (Manager) {
            return new Manager();
        }
    });

    // register Managers
    miitoo.register('Managers', managers, true);

    // Handle primus connections
    primus.on('connection', function(spark) {
        
        miitoo.logger.debug('New connection from team.');
    });
});

miitoo.once('after:start', realtime);