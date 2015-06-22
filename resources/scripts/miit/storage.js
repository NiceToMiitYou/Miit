(function(){
    var MiitStorage = injector.resolve(function() {
        return new DataStore('shared');
    });

    injector.register('miit-storage', MiitStorage);
})();