(function(){
    var MiitNewsLetterRequest = injector.resolve(
        ['miit-utils'],
        function(MiitUtils) {
            return {
                newsletter: function(email, cb) {

                    // Register the user
                    MiitUtils.ajax.send('/newsletter', {
                        'email':  email
                    }, cb);
                },

                registration: function(email, team, cb) {

                    // Register the user
                    MiitUtils.ajax.send('/register', {
                        'email': email,
                        'name':  team
                    }, cb);
                }
            };
        }
    );

    injector.register('miit-home-request', MiitNewsLetterRequest);
})();